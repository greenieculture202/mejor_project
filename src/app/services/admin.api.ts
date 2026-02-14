import { Injectable } from '@angular/core';
import { ApiBase } from './api.base';
import { Observable } from 'rxjs';

export interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  constructor(private api: ApiBase) { }

  listUsers(token: string): Observable<UserSummary[]> {
    return this.api.get<UserSummary[]>('admin/users', token);
  }

  listVisitors(token: string): Observable<any[]> {
    return this.api.get<any[]>('admin/visitors', token);
  }

  logVisit(data: any): Observable<any> {
    return this.api.post('admin/log-visit', data);
  }

  deleteUser(token: string, id: string): Observable<any> {
    return this.api.delete(`admin/users/${id}`, token);
  }

  toggleUserBlock(token: string, id: string): Observable<any> {
    return this.api.post(`admin/users/${id}/toggle-block`, {}, token);
  }

  toggleBlockByEmail(token: string, email: string): Observable<any> {
    return this.api.post(`admin/users/block-by-email`, { email }, token);
  }

  addPlant(token: string, data: any): Observable<any> {
    return this.api.post('admin/plants', data, token);
  }

  updatePlant(token: string, id: string, data: any): Observable<any> {
    return this.api.put(`admin/plants/${id}`, data, token); // ApiBase needs put method?
  }

  deletePlant(token: string, id: string): Observable<any> {
    return this.api.delete(`admin/plants/${id}`, token);
  }

  addCareTip(token: string, data: any): Observable<any> {
    return this.api.post('admin/care-tips', data, token);
  }

  updateCareTip(token: string, id: string, data: any): Observable<any> {
    return this.api.put(`admin/care-tips/${id}`, data, token);
  }

  deleteCareTip(token: string, id: string): Observable<any> {
    return this.api.delete(`admin/care-tips/${id}`, token);
  }

  // Orders
  listOrders(token: string): Observable<any[]> {
    return this.api.get<any[]>('admin/orders', token);
  }

  updateOrderStatus(token: string, id: string, status: string): Observable<any> {
    return this.api.put(`admin/orders/${id}/status`, { status }, token);
  }
}

