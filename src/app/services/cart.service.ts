import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface CartEntry {
  id: any;
  qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  // Use any key to support both number (legacy) and string (MongoDB _id) IDs
  private items = new Map<any, CartEntry>();
  private itemsSubject = new BehaviorSubject<CartEntry[]>([]);
  readonly items$ = this.itemsSubject.asObservable();
  private count$ = new BehaviorSubject<number>(0);
  readonly cartCount$ = this.count$.asObservable();

  constructor() {
    this.load();
    // Listen for storage events to sync across tabs
    window.addEventListener('storage', (event) => {
      if (event.key === 'greenie.cart') {
        this.load();
      }
    });
  }

  add(id: any) {
    const existing = this.items.get(id);
    if (existing) {
      existing.qty++;
    } else {
      this.items.set(id, { id, qty: 1 });
    }
    this.save();
    this.updateCount();
  }

  remove(id: any) {
    const existing = this.items.get(id);
    if (!existing) return;
    if (existing.qty > 1) {
      existing.qty--;
    } else {
      this.items.delete(id);
    }
    this.save();
    this.updateCount();
  }

  delete(id: any) {
    if (this.items.has(id)) {
      this.items.delete(id);
      this.save();
      this.updateCount();
    }
  }

  quantity(id: any) {
    return this.items.get(id)?.qty ?? 0;
  }

  getItems(): CartEntry[] {
    return Array.from(this.items.values());
  }

  clear() {
    this.items.clear();
    this.save();
    this.updateCount();
  }

  private updateCount() {
    let total = 0;
    const entries: CartEntry[] = [];
    this.items.forEach((v) => {
      total += v.qty;
      entries.push(v);
    });
    this.count$.next(total);
    this.itemsSubject.next(entries);
  }

  private getStorageKey(): string {
    try {
      // Check if logged in first
      if (!localStorage.getItem('greenie.loggedIn')) {
        return 'greenie.cart.guest';
      }
      const rawUser = localStorage.getItem('greenie.currentUser');
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user && user.email) {
          return `greenie.cart.${user.email}`;
        }
      }
    } catch (e) { }
    return 'greenie.cart.guest';
  }

  private save() {
    const entries = Array.from(this.items.values());
    const key = this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(entries));
  }

  // Make load public so we can call it on login
  load() {
    try {
      const key = this.getStorageKey();
      const raw = localStorage.getItem(key);
      this.items.clear(); // Always clear first
      if (raw) {
        const entries: CartEntry[] = JSON.parse(raw);
        entries.forEach(e => this.items.set(e.id, e));
      }
      this.updateCount();
    } catch (e) {
      console.error('Failed to load cart', e);
    }
  }
}
