import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PlantsApiService, Plant } from '../../services/plants.api';
import { CareTipsApiService } from '../../services/care-tips.api';
import { forkJoin, map, take, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container">
      <header class="cart-header">
        <h1>Your Shopping Cart</h1>
        <button class="back-link" routerLink="/">← Continue Shopping</button>
      </header>

      <div *ngIf="isLoading" class="loading">Loading your cart...</div>

      <div *ngIf="!isLoading && cartItems.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items yet.</p>
        <button class="shop-btn" routerLink="/">Browse Plants</button>
      </div>

      <div *ngIf="!isLoading && cartItems.length > 0" class="cart-content">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cartItems">
            <img [src]="item.product.image || 'assets/bg1.jpg'" [alt]="item.product.name" class="item-img">
            <div class="item-info">
              <h3>{{ item.product.name }}</h3>
              <p class="category">{{ item.product.category }}</p>
              <p class="price" *ngIf="item.product.price !== undefined">₹{{ item.product.discountPrice }} <span class="original">₹{{ item.product.price }}</span></p>
               <p class="price" *ngIf="item.product.price === undefined">Free</p>
            </div>
            <div class="item-actions">
              <div class="qty-control">
                <button (click)="decreaseQty(item.product._id)">-</button>
                <span>{{ item.qty }}</span>
                <button (click)="increaseQty(item.product._id)">+</button>
              </div>
              <button class="remove-btn" (click)="removeItem(item.product._id)">Remove</button>
            </div>
            <div class="item-total">
              ₹{{ (item.product.discountPrice || 0) * item.qty }}
            </div>
          </div>
        </div>

        <aside class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>₹{{ subtotal }}</span>
          </div>
          <div class="summary-row">
             <span>Delivery</span>
             <span class="free">FREE</span>
          </div>
          <hr>
           <div class="summary-row total">
             <span>Total</span>
             <span>₹{{ subtotal }}</span>
           </div>
           <button class="checkout-btn" (click)="checkout()">Proceed to Checkout</button>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .cart-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; font-family: 'Inter', sans-serif; }
    .cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .cart-header h1 { color: #123b2b; margin: 0; }
    .back-link { background: none; border: none; color: #1f6b48; font-weight: 600; cursor: pointer; font-size: 1rem; }

    .loading, .empty-cart { text-align: center; padding: 60px 0; background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .empty-icon { font-size: 4rem; margin-bottom: 20px; }
    .shop-btn { background: #123b2b; color: white; border: none; padding: 12px 30px; border-radius: 8px; font-size: 1.1rem; cursor: pointer; margin-top: 20px; }

    .cart-content { display: grid; grid-template-columns: 1fr 350px; gap: 40px; }
    .cart-items { display: flex; flex-direction: column; gap: 20px; }
    .cart-item { display: flex; align-items: center; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
    .item-img { width: 100px; height: 100px; object-fit: cover; border-radius: 8px; margin-right: 20px; }
    .item-info { flex: 1; }
    .item-info h3 { margin: 0 0 5px; color: #123b2b; }
    .category { color: #666; font-size: 0.9rem; margin-bottom: 8px; }
    .price { font-weight: 700; color: #123b2b; font-size: 1.1rem; }
    .original { text-decoration: line-through; color: #999; font-size: 0.9rem; font-weight: 400; margin-left: 8px; }

    .item-actions { display: flex; flex-direction: column; align-items: center; gap: 10px; margin: 0 40px; }
    .qty-control { display: flex; align-items: center; background: #f0f7f2; border-radius: 6px; padding: 5px; }
    .qty-control button { background: white; border: 1px solid #ddd; width: 28px; height: 28px; border-radius: 4px; cursor: pointer; font-weight: bold; }
    .qty-control span { margin: 0 15px; font-weight: 600; min-width: 20px; text-align: center; }
    .remove-btn { background: none; border: none; color: #d9534f; cursor: pointer; font-size: 0.85rem; }

    .item-total { font-weight: 700; font-size: 1.2rem; color: #123b2b; min-width: 100px; text-align: right; }

    .cart-summary { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); height: fit-content; position: sticky; top: 20px; }
    .cart-summary h2 { margin: 0 0 25px; color: #123b2b; font-size: 1.4rem; }
    .summary-row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 1.05rem; }
    .summary-row.total { margin-top: 15px; font-weight: 700; font-size: 1.3rem; color: #123b2b; }
    .free { color: #2d6b45; font-weight: 700; }
    hr { border: 0; border-top: 1px solid #eee; margin: 15px 0; }
    .checkout-btn { width: 100%; background: #123b2b; color: white; border: none; padding: 15px; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; margin-top: 25px; transition: background 0.2s; }
    .checkout-btn:hover { background: #1a4a2e; }

    @media (max-width: 900px) {
      .cart-content { grid-template-columns: 1fr; }
      .cart-item { flex-wrap: wrap; }
      .item-total { width: 100%; text-align: right; margin-top: 15px; }
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  isLoading = true;
  subtotal = 0;

  constructor(
    private cartService: CartService,
    private plantsApi: PlantsApiService,
    private careApi: CareTipsApiService,
    private router: Router
  ) { }

  ngOnInit() {
    this.cartService.items$.subscribe(items => {
      this.loadItemDetails(items);
    });
  }

  loadItemDetails(items: any[]) {
    if (items.length === 0) {
      this.cartItems = [];
      this.subtotal = 0;
      this.isLoading = false;
      return;
    }

    // Parallel fetch of all possible products with error handling for each
    forkJoin({
      plants: this.plantsApi.list().pipe(
        take(1),
        catchError(err => {
          console.warn('Error loading plants', err);
          return of([]);
        })
      ),
      careTips: this.careApi.list().pipe(
        take(1),
        catchError(err => {
          console.warn('Error loading care tips', err);
          return of([]);
        })
      )
    }).subscribe({
      next: ({ plants, careTips }) => {
        this.cartItems = items.map(ci => {
          const idStr = ci.id.toString();

          // Try to find in plants first
          let product = plants.find((p: any) => p._id === idStr);

          // If not found, try care tips
          if (!product) {
            const tip = careTips.find((c: any) => c._id === idStr);
            if (tip) {
              // Normalize care tip to look like a product
              product = {
                _id: tip._id,
                name: tip.title,
                category: tip.category, // e.g. 'Watering'
                description: tip.description, // Added description property
                image: tip.image,
                price: 0,
                discountPrice: 0
              };
            }
          }

          // Fallback
          if (!product) {
            product = { name: 'Unknown Item', category: 'Unknown', description: '', price: 0, discountPrice: 0, image: '', _id: ci.id };
          }

          return { ...ci, product };
        });
        this.calculateTotal();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load cart data', err);
        this.isLoading = false;
      }
    });
  }

  calculateTotal() {
    this.subtotal = this.cartItems.reduce((acc, item) => {
      return acc + ((item.product.discountPrice || 0) * item.qty);
    }, 0);
  }

  increaseQty(id: any) {
    this.cartService.add(id);
  }

  decreaseQty(id: any) {
    this.cartService.remove(id);
  }

  removeItem(id: any) {
    this.cartService.delete(id);
  }

  checkout() {
    if (!localStorage.getItem('greenie.loggedIn')) {
      alert('Please login to complete your purchase!');
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate(['/order']);
  }
}
