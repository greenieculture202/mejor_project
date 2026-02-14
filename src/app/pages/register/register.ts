import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthApiService } from '../../services/auth.api';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  phone = '';
  address = '';
  password = '';
  confirm = '';
  role: 'user' | 'admin' = 'user';

  constructor(
    private router: Router,
    private authApi: AuthApiService,
    private notify: NotificationService
  ) { }

  submit() {
    if (!this.name.trim() || !this.email.trim() || !this.phone.trim() || !this.address.trim() || !this.password) {
      this.notify.show('Please fill all fields', 'error', 'modal');
      return;
    }
    if (this.password !== this.confirm) {
      this.notify.show('Passwords do not match', 'error', 'modal');
      return;
    }
    // Try backend register first. If it fails, fall back to localStorage.
    this.authApi.register(this.name.trim(), this.email.trim(), this.password, this.phone.trim(), this.address.trim(), this.role)
      .subscribe({
        next: (res) => {
          this.notify.show('Registration successful! Please login.', 'success', 'modal');
          this.router.navigate(['/login']).catch(() => { });
        },
        error: () => {
          // fallback: save to localStorage like before
          const key = 'greenie.users';
          let users: Array<any> = [];
          try {
            const raw = localStorage.getItem(key);
            users = raw ? JSON.parse(raw) : [];
          } catch (e) {
            users = [];
          }
          const existing = users.find((u: any) => u.email === this.email);
          if (existing) {
            if (existing.isBlocked) {
              this.notify.show('This email is blocked. Registration is not allowed.', 'error', 'modal');
            } else {
              this.notify.show('User already registered with this email', 'error', 'modal');
            }
            return;
          }

          users.push({
            name: this.name,
            email: this.email,
            phone: this.phone,
            address: this.address,
            password: this.password,
            role: this.role,
            createdAt: new Date().toISOString()
          });

          try {
            localStorage.setItem(key, JSON.stringify(users));
            this.notify.show('Registration successful (Local)! Please login.', 'success', 'modal');
          } catch (e) { }
          this.router.navigate(['/login']).catch(() => { });
        }
      });
  }


  cancel() {
    this.router.navigate(['/']).catch(() => { });
  }
}
