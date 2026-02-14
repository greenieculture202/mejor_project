import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../../services/admin.api';
import { PlantsApiService } from '../../services/plants.api';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="admin-root">
    <aside class="admin-side">
      <h2 class="brand">🌱 Admin Panel</h2>
      <nav>
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Dashboard</a>
        <a routerLink="/admin/plants" routerLinkActive="active">Manage Plants</a>
        <a routerLink="/admin/users" routerLinkActive="active">Manage Users</a>
        <a routerLink="/admin/orders" routerLinkActive="active">Manage Orders</a>
        <a routerLink="/admin/blog" routerLinkActive="active">Manage Blogs</a>
        <a routerLink="/admin/settings" routerLinkActive="active">Settings</a>
      </nav>
    </aside>

    <main class="admin-main">
      <div class="dash-header">
        <h1>Dashboard Overview</h1>
        <p>Comprehensive system health and user activity.</p>
      </div>

      <div class="cards">
        <div class="card">
          <div class="card-icon">🌲</div>
          <div class="card-info">
            <div class="card-title">Total Plants</div>
            <div class="card-value">{{ totalPlants }}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-icon">👥</div>
          <div class="card-info">
            <div class="card-title">Unique Users</div>
            <div class="card-value">{{ totalUsers }}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-icon">⚡</div>
          <div class="card-info">
            <div class="card-title">Recent Visits</div>
            <div class="card-value">{{ totalVisits }}</div>
          </div>
        </div>
        <div class="card">
          <div class="card-icon">💰</div>
          <div class="card-info">
            <div class="card-title">Total Sales</div>
            <div class="card-value">{{ revenue }}</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <section class="recent-list">
          <div class="section-header">
            <h3>👥 Recently Joined Users</h3>
            <button routerLink="/admin/users" class="view-all">Manage All</button>
          </div>
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of recentUsers">
                <td><strong>{{ u.name }}</strong></td>
                <td>{{ u.email }}</td>
                <td><span class="badge" [class.admin]="u.role === 'admin'">{{ u.role }}</span></td>
              </tr>
              <tr *ngIf="recentUsers.length === 0">
                <td colspan="3" class="empty-msg">No users found.</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section class="recent-list">
          <div class="section-header">
            <h3>🕒 Visitor Log</h3>
            <span class="total-tag">{{ totalVisits }} active</span>
          </div>
          <table>
            <thead>
              <tr><th>Identity</th><th>Last Scene</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of recentVisitors">
                <td>
                  <div class="v-cell">
                    <strong>{{ v.name }}</strong>
                    <small>{{ v.email }}</small>
                  </div>
                </td>
                <td>{{ v.lastVisit | date:'shortTime' }}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

    </main>
  </div>
  `,
  styles: [`
    .admin-root { display: flex; height: 100vh; background: #f0f4f1; font-family: 'Inter', system-ui, sans-serif; }
    
    .admin-side { width: 260px; background: #123b2b; color: white; padding: 30px 20px; display: flex; flex-direction: column; }
    .admin-side .brand { font-size: 1.5rem; margin-bottom: 40px; color: #78c291; text-align: center; }
    .admin-side nav a { 
      display: block; padding: 12px 20px; color: #a8d5ba; text-decoration: none; border-radius: 12px; margin-bottom: 8px;
      transition: all 0.2s; font-weight: 500;
    }
    .admin-side nav a:hover { background: rgba(255,255,255,0.05); color: white; }
    .admin-side nav a.active { background: #1f6b48; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }

    .admin-main { flex: 1; padding: 40px; overflow-y: auto; }
    .dash-header { margin-bottom: 35px; }
    .dash-header h1 { font-size: 2.2rem; color: #1a3a2a; margin: 0; }
    .dash-header p { color: #5a7a6a; margin-top: 5px; }

    .cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
    .card { 
      background: white; padding: 25px; border-radius: 20px; display: flex; align-items: center; gap: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.04); transition: transform 0.3s;
    }
    .card:hover { transform: translateY(-5px); }
    .card-icon { font-size: 2.5rem; }
    .card-title { font-size: 0.9rem; color: #6b8c7b; font-weight: 600; text-transform: uppercase; }
    .card-value { font-size: 1.8rem; font-weight: 800; color: #1a3a2a; margin-top: 5px; }

    .dashboard-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 30px; }
    .recent-list { background: white; border-radius: 24px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .view-all { background: #f0f7f2; color: #1f6b48; border: none; padding: 8px 16px; border-radius: 10px; font-weight: 600; cursor: pointer; }
    
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px; color: #8fa69a; font-size: 0.8rem; text-transform: uppercase; border-bottom: 1px solid #f0f4f1; }
    td { padding: 15px 12px; font-size: 0.95rem; border-bottom: 1px solid #f7faf8; }
    
    .badge.admin { background: #fff3e0; color: #f57c00; }
    .v-cell { display: flex; flex-direction: column; }
    .v-cell small { color: #8fa69a; font-size: 0.75rem; }
    .total-tag { background: #123b2b; color: white; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; }
    .empty-msg { text-align: center; padding: 20px; color: #999; }
  `]
})
export class AdminComponent implements OnInit {
  totalPlants = 0;
  totalUsers = 0;
  totalVisits = 0;
  revenue = '₹46,311';
  recentPlants: any[] = [];
  recentVisitors: any[] = [];
  recentUsers: any[] = [];

  constructor(private plantsApi: PlantsApiService, private adminApi: AdminApiService) { }

  ngOnInit(): void {
    this.loadStats();
  }

  private token(): string | null { try { return localStorage.getItem('greenie.token'); } catch { return null; } }

  loadStats() {
    const t = this.token();

    this.plantsApi.list().subscribe({ next: (p) => { this.totalPlants = p.length; this.recentPlants = p.slice(0, 5); } });

    if (t) {
      this.adminApi.listUsers(t).subscribe({
        next: (u: any) => {
          let localUsers = [];
          try {
            const raw = localStorage.getItem('greenie.users');
            localUsers = raw ? JSON.parse(raw) : [];
          } catch (e) { }

          const merged = [...u];
          localUsers.forEach((lu: any) => {
            if (!merged.find(su => su.email === lu.email)) merged.push(lu);
          });

          // Sort by creation date (Newest first)
          merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          this.totalUsers = merged.length;
          this.recentUsers = merged.slice(0, 5);

        }
      });

      this.adminApi.listVisitors(t).subscribe({
        next: (v) => {
          this.totalVisits = v.length;
          this.recentVisitors = v.slice(0, 5);
        }
      });
    }
  }
}

