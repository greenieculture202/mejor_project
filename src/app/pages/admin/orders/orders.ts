import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../../services/admin.api';
import { NotificationService } from '../../../services/notification.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'], // fixed typo: styleUrl -> styleUrls
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  constructor(
    private adminApi: AdminApiService,
    private notif: NotificationService
  ) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    const token = localStorage.getItem('greenie.token') || '';

    // Load from LocalStorage (Demo Mode or Fallback)
    let localOrders: any[] = [];
    try {
      const raw = localStorage.getItem('greenie.orders');
      if (raw) localOrders = JSON.parse(raw);
    } catch (e) { }

    if (!token) {
      // Just show local orders if no token (though admin guard should prevent this)
      this.orders = localOrders;
      this.isLoading = false;
      return;
    }

    this.adminApi.listOrders(token).subscribe({
      next: (data) => {
        // Merge API data with local data if needed, or just prefer API
        // For this hybrid mode, we will combine them (deduping by ID)
        const combined = [...localOrders, ...data];
        const unique = Array.from(new Map(combined.map(item => [item._id, item])).values());

        this.orders = unique.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.warn('Failed to load API orders, showing local orders only', err);
        this.orders = localOrders;
        this.isLoading = false;
      }
    });
  }

  updateStatus(order: any, newStatus: string) {
    if (confirm(`Change status to ${newStatus}?`)) {
      // Check if it's a local order
      if (order._id.startsWith('LOC-')) {
        this.updateLocalOrderStatus(order._id, newStatus);
        order.status = newStatus;
        this.notif.show('Local order status updated', 'success');
        return;
      }

      const token = localStorage.getItem('greenie.token') || '';
      this.adminApi.updateOrderStatus(token, order._id, newStatus).subscribe({
        next: (updatedOrder) => {
          order.status = updatedOrder.status;
          this.notif.show('Order status updated', 'success');
        },
        error: (err) => {
          console.error(err);
          this.notif.show('Failed to update status', 'error');
        }
      });
    }
  }

  updateLocalOrderStatus(id: string, status: string) {
    try {
      const raw = localStorage.getItem('greenie.orders');
      if (raw) {
        let orders = JSON.parse(raw);
        const index = orders.findIndex((o: any) => o._id === id);
        if (index !== -1) {
          orders[index].status = status;
          localStorage.setItem('greenie.orders', JSON.stringify(orders));
        }
      }
    } catch (e) {
      console.error('Error updating local order status', e);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Processing': return 'status-processing';
      case 'Shipped': return 'status-shipped';
      case 'Delivered': return 'status-delivered';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }
}
