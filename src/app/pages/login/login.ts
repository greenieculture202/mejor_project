import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth.api';
import { CartService } from '../../services/cart.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  showPassword = false;

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private cartService: CartService,
    private notify: NotificationService
  ) { }

  submit() {
    if (!this.email.trim() || !this.password.trim()) {
      this.notify.show('Please enter email and password', 'error', 'modal');
      return;
    }
    // Try backend login first; fallback to localStorage if backend fails
    this.authApi.login(this.email.trim(), this.password)
      .subscribe({
        next: (res) => {
          localStorage.setItem('greenie.token', res.token);
          this.authApi.setCurrentUser(res.user);
          this.cartService.load(); // Load user specific cart
          this.notify.show('Welcome back, ' + res.user.name + '!', 'success', 'modal');

          if (res.user.role === 'admin') this.router.navigate(['/admin']).catch(() => { });
          else this.router.navigate(['/']).catch(() => { });
        },
        error: (err) => {
          // If backend says specifically BLOCKED (403), stop here
          if (err.status === 403) {
            this.notify.show(err.error?.error || 'Your account is blocked.', 'error', 'modal');
            return;
          }

          // Fallback to localStorage auth for other errors (like 404 or server down)
          const key = 'greenie.users';

          let users: Array<any> = [];
          try { const raw = localStorage.getItem(key); users = raw ? JSON.parse(raw) : []; } catch (e) { users = []; }
          const found = users.find((u: any) => u.email === this.email);
          if (!found) {
            this.notify.show('No registered user with this email. Please register first.', 'error', 'modal');
            return;
          }
          if (found.password !== this.password) {
            this.notify.show('Incorrect password', 'error', 'modal');
            return;
          }

          if (found.isBlocked) {
            this.notify.show('Your account has been blocked by the admin.', 'error', 'modal');
            return;
          }


          const userObj = {
            email: found.email,
            role: found.role,
            name: found.name,
            phone: found.phone || '',
            address: found.address || ''
          };
          if (found.role === 'admin') {
            localStorage.setItem('greenie.token', 'dummy-token-' + Date.now());
          }
          this.authApi.setCurrentUser(userObj);
          this.cartService.load(); // Load user specific cart
          this.notify.show('Logged in successfully!', 'success', 'modal');


          if (found.role === 'admin') this.router.navigate(['/admin']).catch(() => { }); else this.router.navigate(['/']).catch(() => { });
        }
      });
  }

  cancel() {
    this.router.navigate(['/']).catch(() => { });
  }
}
