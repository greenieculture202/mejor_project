import { Injectable } from '@angular/core';
import { ApiBase } from './api.base';
import { Observable } from 'rxjs';

export interface CartItem {
  _id?: string;
  plant: any;
  qty: number;
}

export interface Cart {
  user: string;
  items: CartItem[];
}

@Injectable({ providedIn: 'root' })
export class CartApiService {
  constructor(private api: ApiBase) {}

  getCart(token: string): Observable<Cart> {
    return this.api.get<Cart>('cart', token);
  }

  add(token: string, plantId: string, qty = 1): Observable<Cart> {
    return this.api.post<Cart>('cart', { plantId, qty }, token);
  }

  remove(token: string, plantId: string): Observable<Cart> {
    return this.api.delete<Cart>(`cart/${plantId}`, token);
  }
}
