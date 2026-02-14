import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CartService } from './services/cart.service';
import { SearchService } from './services/search.service';
import { AuthApiService } from './services/auth.api';
import { TypesComponent } from './pages/types/types';
import { CareComponent } from './pages/care/care.component';
import { NotificationComponent } from './components/notification/notification.component';
import { BlogComponent } from './pages/blog/blog.component';
import { FaqComponent } from './pages/faq/faq.component';
import { AdminApiService } from './services/admin.api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, TypesComponent, CareComponent, BlogComponent, FaqComponent, NotificationComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {

  siteName = 'Greenie Culture';
  tagline = 'Planting trees... to keep the Earth healthy.';
  showLoginModal = false;
  currentSlideIndex = 0;
  currentYear = new Date().getFullYear();

  slideshowImages = [
    'assets/bg1.jpg',
    'assets/bg2.avif',
    'assets/bg3.jpg',
    'assets/bg4.jpg'
  ];

  private slideInterval: any;
  // search state
  searchQuery = '';
  // login / cart state
  isLoggedIn = false;
  userName = '';
  cartCount = 0;
  isAuthRoute = false;
  isAdminRoute = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService,
    private searchService: SearchService,
    private authApi: AuthApiService,
    private adminApi: AdminApiService
  ) {
    this.cartService.cartCount$.subscribe((c) => (this.cartCount = c));

    // Reactively update login state
    this.authApi.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user ? (user.name || user.email.split('@')[0]) : '';

      // Check if user has explicitly dismissed the modal
      const isDismissed = localStorage.getItem('greenie.hideLoginPopup') === '1';
      this.showLoginModal = !this.isLoggedIn && !this.isAuthRoute && !this.isAdminRoute && !isDismissed;

      this.logActivity(); // Track identity change
      this.cdr.detectChanges();
    });
  }

  navItems = [
    { label: 'Types', action: 'types' },
    { label: 'Plant Care', action: 'care-tips' },
    { label: 'Occasions', action: 'occasions' },
    { label: 'Blog', action: 'blog' },
    { label: 'FAQs', action: 'faq' }
  ];

  ngOnInit() {
    this.startSlideshow();
    this.logActivity();
    this.verifyUserStatus();

    // track current route so /login can render as a standalone page
    try {
      const url = this.router.url || '';
      this.handleRouteCheck(url);
    } catch (e) {
      this.isAuthRoute = false;
      this.isAdminRoute = false;
    }
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.handleRouteCheck(ev.urlAfterRedirects || '');
        this.verifyUserStatus();
      }
    });
  }

  verifyUserStatus() {
    if (!this.isLoggedIn) return;

    this.authApi.checkStatus().subscribe({
      next: (res) => {
        if (res.isBlocked) {
          alert('Your account has been blocked by the admin.');
          this.logout();
        }
      },
      error: (err) => {
        // If 403, user is blocked
        if (err.status === 403) {
          alert('Access Denied: Your account is blocked.');
          this.logout();
        }
      }
    });
  }

  logActivity() {
    const user = this.authApi.getCurrentUser();
    this.adminApi.logVisit({
      email: user?.email || 'Guest',
      name: user?.name || 'Anonymous'
    }).subscribe({
      error: () => { /* silent fail */ }
    });
  }

  handleRouteCheck(url: string) {
    this.isAuthRoute = url.startsWith('/login') || url.startsWith('/register') || url.startsWith('/cart') || url.startsWith('/order') || url.startsWith('/my-orders');
    this.isAdminRoute = url.startsWith('/admin');

    // Update modal visibility when route changes
    if (this.isAuthRoute || this.isAdminRoute) {
      this.showLoginModal = false;
    } else {
      const isDismissed = localStorage.getItem('greenie.hideLoginPopup') === '1';
      this.showLoginModal = !this.isLoggedIn && !isDismissed;
    }
  }

  logout() {
    this.authApi.logout();
    this.cartService.clear();
    this.router.navigate(['/']);
  }


  myOrders() {
    this.router.navigate(['/my-orders']);
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideshow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }

    this.slideInterval = setInterval(() => {
      this.currentSlideIndex =
        (this.currentSlideIndex + 1) % this.slideshowImages.length;
      this.cdr.detectChanges();
    }, 2000);
  }

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
    // Persist dismissal
    localStorage.setItem('greenie.hideLoginPopup', '1');
  }

  handleLogin() {
    console.log('Login clicked');
    this.isLoggedIn = true;
    try {
      localStorage.setItem('greenie.loggedIn', '1');
    } catch (e) {
      /* ignore storage errors */
    }
    this.cartService.load(); // Load user-specific cart
    this.closeLoginModal();
  }

  openLoginPage() {
    this.closeLoginModal();
    // Navigate to login page. If logged in, the login page might redirect, or we can stay there to allow logout.
    this.router.navigate(['/login']).catch(() => this.openLoginModal());
  }

  handleNavClick(item: any) {
    if (item.action === 'login') {
      // navigate to dedicated login page
      this.router.navigate(['/login']).catch(() => this.openLoginModal());
      return;
    }

    if (item.action === 'cart') {
      // navigate to /cart if you have a cart route; otherwise log
      this.router.navigate(['/cart']).catch(() => console.log('Cart clicked'));
      return;
    }

    if (item.action === 'types') {
      this.scrollTo('types-section');
      return;
    }

    if (item.action === 'care-tips') {
      this.scrollTo('care-tips-section');
      return;
    }

    if (item.action === 'occasions') {
      this.scrollTo('occasion-section');
      return;
    }

    if (item.action === 'blog') {
      this.scrollTo('blog-section');
      return;
    }

    if (item.action === 'faq') {
      this.scrollTo('faq-section');
      return;
    }
  }

  openCart() {
    this.router.navigate(['/cart']);
  }

  onSearchInput(value: string) {
    this.searchQuery = value;
    this.searchService.setQuery(value);
  }

  submitSearch() {
    const q = (this.searchQuery || '').trim();
    this.searchService.setQuery(q);

    // scroll to types section
    const element = document.getElementById('types-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  addToCart() {
    // fallback add when no item provided from page
    this.cartService.add(Date.now());
    console.log('Added to cart via navbar button. Count:', this.cartCount);
  }

  scrollTo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
