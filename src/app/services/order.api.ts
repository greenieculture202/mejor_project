import { Injectable } from '@angular/core';
import { ApiBase } from './api.base';
import { Observable } from 'rxjs';

export interface OrderItem {
    plant: string; // ID
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface Order {
    _id?: string;
    user?: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    shippingAddress: any;
    paymentMethod: string;
    createdAt?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderApiService {
    constructor(private api: ApiBase) { }

    createOrder(order: any, token: string): Observable<Order> {
        return this.api.post<Order>('orders', order, token);
    }

    getMyOrders(token: string): Observable<Order[]> {
        return this.api.get<Order[]>('orders/my-orders', token);
    }

    getOrderById(id: string, token: string): Observable<Order> {
        return this.api.get<Order>(`orders/${id}`, token);
    }
}
