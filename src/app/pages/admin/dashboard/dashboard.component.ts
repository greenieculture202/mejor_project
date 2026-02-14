import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminApiService } from '../../../services/admin.api';
import { PlantsApiService } from '../../../services/plants.api';
import { AuthApiService, User } from '../../../services/auth.api';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-wrapper fade-in">
      <div class="dash-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p class="subtitle">Welcome back! Here is what’s happening with your store.</p>
        </div>
        <div class="user-controls" *ngIf="user$ | async as user">
          <span class="admin-name">Welcome, {{ user.name }}</span>
          <button (click)="logout()" class="logout-btn" title="Logout">
            Log Out<span>&#x23FB;</span>
          </button>
        </div>
      </div>

      <div class="cards">
        <div class="card stat-card">
          <div class="card-icon plant-icon">🌱</div>
          <div class="card-info">
            <div class="card-title">Total Plants</div>
            <div class="card-value">{{ totalPlants }}</div>
            <div class="card-sub">In inventory</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-icon order-icon">📦</div>
          <div class="card-info">
            <div class="card-title">Total Orders</div>
            <div class="card-value">{{ totalOrders }}</div>
            <div class="card-sub">Pending: {{ pendingOrders }}</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-icon user-icon">👥</div>
          <div class="card-info">
            <div class="card-title">Total Users</div>
            <div class="card-value">{{ totalUsers }}</div>
            <div class="card-sub">Registered customers</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="card-icon revenue-icon">💰</div>
          <div class="card-info">
            <div class="card-title">Revenue</div>
            <div class="card-value">{{ revenue }}</div>
          </div>
        </div>
      </div>

      <div class="recent" *ngIf="recentPlants.length > 0">
        <div class="section-header">
          <h3>Recently Added Plants</h3>
          <button class="view-all-btn" (click)="viewAllPlants()">View All</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>Plant Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let plant of recentPlants">
                <td>
                  <div class="p-name">{{ plant.name }}</div>
                </td>
                <td><span class="p-cat">{{ plant.category }}</span></td>
                <td class="p-price">₹{{ plant.price }}</td>
                <td><span style="color: #2e7d32; font-weight: 600;">In Stock</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

    .dashboard-wrapper {
      padding: 24px;
      min-height: 100vh;
      background-color: #ecfdf5;
      background-image: 
        radial-gradient(at 0% 0%, rgba(52, 211, 153, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
      font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
    }
    .fade-in { animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1); }
    
    .dash-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
    .dash-header h1 { 
      margin: 0 0 4px; 
      font-size: 1.8rem; 
      color: #064e3b;
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .subtitle { margin: 0; color: #047857; font-size: 0.95rem; font-weight: 400; opacity: 0.8; }
    
    .user-controls { 
      display: flex; align-items: center; gap: 12px; 
      background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px);
      padding: 8px 16px; border-radius: 30px; 
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03); border: 1px solid rgba(255,255,255,0.6); 
    }
    .admin-name { font-weight: 700; color: #065f46; font-size: 0.85rem; }
    .logout-btn { 
      background: #fee2e2; color: #991b1b; border: none; padding: 6px 14px; 
      border-radius: 20px; cursor: pointer; font-weight: 700; display: flex; align-items: center; gap: 6px; 
      transition: all 0.2s; font-size: 0.75rem; 
    }
    .logout-btn:hover { background: #ef4444; color: white; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }

    .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }
    .card.stat-card { 
      background: rgba(255, 255, 255, 0.95); 
      backdrop-filter: blur(10px);
      padding: 20px; 
      border-radius: 16px; 
      box-shadow: 0 4px 15px -3px rgba(0,0,0,0.05); 
      border: 1px solid rgba(255,255,255,0.8); 
      display: flex; align-items: center; gap: 16px; 
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative; overflow: hidden;
    }
    .card.stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06); }
    
    .card-icon { 
      width: 48px; height: 48px; border-radius: 12px; 
      display: flex; align-items: center; justify-content: center; 
      font-size: 1.5rem; flex-shrink: 0;
    }
    .plant-icon { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; }
    .order-icon { background: linear-gradient(135deg, #ffedd5, #fed7aa); color: #c2410c; }
    .user-icon { background: linear-gradient(135deg, #dbeafe, #bfdbfe); color: #1e40af; }
    .revenue-icon { background: linear-gradient(135deg, #fce7f3, #fbcfe8); color: #be185d; }

    .card-info { flex: 1; display: flex; flex-direction: column; }
    .card-title { font-weight: 700; color: #64748b; font-size: 0.75rem; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .card-value { font-size: 1.6rem; font-weight: 800; color: #0f172a; line-height: 1; margin-bottom: 2px; letter-spacing: -0.5px; }
    .card-sub { font-size: 0.8rem; color: #94a3b8; font-weight: 500; }

    .recent { 
      background: white; border-radius: 16px; padding: 24px; 
      box-shadow: 0 10px 30px -5px rgba(0,0,0,0.04); 
      border: 1px solid #f1f5f9; 
    }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .recent h3 { font-size: 1.25rem; margin: 0; color: #1e293b; font-weight: 700; letter-spacing: -0.01em; }
    .view-all-btn { 
      background: #f1f5f9; border: none; color: #334155; font-weight: 600; 
      cursor: pointer; font-size: 0.8rem; padding: 8px 16px; border-radius: 20px; 
      transition: all 0.2s; 
    }
    .view-all-btn:hover { background: #e2e8f0; color: #0f172a; }

    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: separate; border-spacing: 0; }
    th { 
      text-align: left; padding: 12px 16px; color: #64748b; font-weight: 700; 
      border-bottom: 2px solid #e2e8f0; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; 
    }
    td { padding: 12px 16px; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    
    .p-name { font-weight: 700; color: #1e293b; font-size: 0.9rem; }
    .p-cat { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: 1px solid #e2e8f0; }
    .p-price { font-weight: 700; color: #15803d; font-size: 0.9rem; }
    
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `]
})
export class AdminDashboardComponent implements OnInit {
  totalPlants = 0;
  totalOrders = 0;
  pendingOrders = 0;
  totalUsers = 0;
  revenue = '₹0.00';
  recentPlants: any[] = [];

  user$: Observable<User | null>;

  constructor(
    private plantsApi: PlantsApiService,
    private adminApi: AdminApiService,
    private auth: AuthApiService,
    private router: Router
  ) {
    this.user$ = this.auth.currentUser$;
  }

  ngOnInit(): void {
    this.loadStats();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private token(): string | null { try { return localStorage.getItem('greenie.token'); } catch { return null; } }

  loadStats() {
    // plants
    this.plantsApi.list().subscribe({
      next: (p) => {
        this.totalPlants = p.length;
        // Show last 5 plants (assuming append-only/chronological order) reversed -> newest first
        this.recentPlants = p.slice(-5).reverse();
      },
      error: () => { }
    });
    // users
    const t = this.token();
    if (t) {
      this.adminApi.listUsers(t).subscribe({
        next: (u: any) => { this.totalUsers = u.length; },
        error: () => { }
      });
    }
    // orders/revenue placeholders
    this.totalOrders = 10;
    this.pendingOrders = 2;
    this.revenue = '₹46311.64';
  }
  viewAllPlants() {
    this.router.navigate(['/admin/plants']);
  }
}
