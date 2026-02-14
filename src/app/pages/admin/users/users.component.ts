import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService, UserSummary } from '../../../services/admin.api';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="users-wrapper fade-in">
      <div class="page-header">
        <div class="header-text">
          <h1>Platform Access</h1>
          <p>Manage administrators, regular users, and monitor visitor activity.</p>
        </div>
        <button (click)="loadUsers(); loadVisitors()" class="btn-refresh" title="Refresh Data">
          <span>🔄 Refresh Data</span>
        </button>
      </div>

      <!-- System Status Bar -->
      <div class="status-bar">
        <div class="status-item">
          <span class="status-label">Database</span>
          <span class="status-val">{{ getServerCount() }} records <span class="badge" [class.success]="serverStatus==='Success'" [class.error]="serverStatus==='Error'">{{ serverStatus }}</span></span>
        </div>
        <div class="status-item">
          <span class="status-label">Local Storage</span>
          <span class="status-val">{{ getLocalCount() }} records</span>
        </div>
        <div class="status-item">
          <span class="status-label">Auth Status</span>
          <span class="status-val">
            <span *ngIf="hasToken()" class="status-ok">✔ Connected</span>
            <span *ngIf="!hasToken()" class="status-err">❌ Guest Mode</span>
          </span>
        </div>
      </div>

      <!-- Admin Section -->
      <div class="section-card">
        <div class="card-header">
          <div class="header-title">
            <h3>🛡️ System Administrators</h3>
            <span class="pill admin">{{ getAdmins().length }} Active</span>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Admin Profile</th>
                <th>Email Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of getAdmins()">
                <td>
                  <div class="user-profile">
                    <div class="avatar admin-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
                    <div class="info">
                      <span class="name">{{ user.name }}</span>
                      <span *ngIf="user.isLocal" class="tag local">Local</span>
                    </div>
                  </div>
                </td>
                <td>{{ user.email }}</td>
                <td><span class="badge active">Active</span></td>
                <td>
                  <button (click)="deleteUser(user)" class="btn-icon delete" title="Delete User">
                    🗑️
                  </button>
                </td>
              </tr>
              <tr *ngIf="getAdmins().length === 0">
                <td colspan="4" class="empty-state">No administrators found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Users Section -->
      <div class="section-card">
        <div class="card-header">
          <div class="header-title">
            <h3>👤 Registered Users</h3>
            <span class="pill user">{{ getNormalUsers().length }} Customers</span>
          </div>
          <div class="search-actions">
            <input type="email" [(ngModel)]="searchEmail" placeholder="Search / Block by Email..." class="search-input">
            <button (click)="toggleBlockByEmail()" class="btn-lock">🔒 Lock/Unlock</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>User Identity</th>
                <th>Contact Details</th>
                <th>Account Status</th>
                <th>Management</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of getNormalUsers()" [class.row-blocked]="user.isBlocked">
                <td>
                  <div class="user-profile">
                    <div class="avatar user-avatar">{{ user.name.charAt(0).toUpperCase() }}</div>
                    <div class="info">
                      <span class="name">{{ user.name }}</span>
                      <span class="sub-text">{{ user.email }}</span>
                      <span *ngIf="user.isLocal" class="tag local">Local</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="contact-info">
                    <span class="phone" *ngIf="user.phone">📞 {{ user.phone }}</span>
                    <span class="address" *ngIf="user.address">{{ user.address }}</span>
                    <span class="no-data" *ngIf="!user.phone && !user.address">No details provided</span>
                  </div>
                </td>
                <td>
                  <span class="badge" [class.blocked]="user.isBlocked" [class.active]="!user.isBlocked">
                    {{ user.isBlocked ? 'Blocked' : 'Active' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button 
                      (click)="toggleBlock(user)" 
                      class="btn-sm" 
                      [class.btn-block]="!user.isBlocked"
                      [class.btn-restore]="user.isBlocked">
                      {{ user.isBlocked ? 'Restore' : 'Block' }}
                    </button>
                    <button (click)="deleteUser(user)" class="btn-icon delete" title="Delete User">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="getNormalUsers().length === 0">
                <td colspan="4" class="empty-state">No registered users found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Visitors Section -->
      <div class="section-card visitor-card">
        <div class="card-header">
          <div class="header-title">
            <h3>🕒 Recent Visitors</h3>
            <span class="pill visitor">{{ visitors.length }} Sessions</span>
          </div>
          <p class="card-subtitle">Tracking last 100 website visits</p>
        </div>

        <div class="table-responsive">
          <table class="modern-table">
            <thead>
              <tr>
                <th>Visitor Identity</th>
                <th>Last Seen</th>
                <th>Network Info</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let v of visitors">
                <td>
                  <div class="user-profile">
                     <div class="avatar visitor-avatar">?</div>
                     <div class="info">
                       <span class="name">{{ v.name || 'Anonymous' }}</span>
                       <span class="sub-text">{{ v.email || 'No email' }}</span>
                     </div>
                  </div>
                </td>
                <td class="time-cell">{{ v.lastVisit | date:'medium' }}</td>
                <td>
                  <div class="tech-info">
                    <span class="ip">{{ v.ip }}</span>
                    <span class="ua" title="{{v.userAgent}}">{{ v.userAgent }}</span>
                  </div>
                </td>
              </tr>
              <tr *ngIf="visitors.length === 0">
                <td colspan="3" class="empty-state">No activity recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

    .users-wrapper {
      padding: 40px;
      min-height: 100vh;
      background-color: #ecfdf5; /* Richer mint background */
      background-image: 
        radial-gradient(at 0% 0%, rgba(52, 211, 153, 0.15) 0px, transparent 50%),
        radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.1) 0px, transparent 50%);
      font-family: 'Outfit', 'Segoe UI', system-ui, sans-serif;
    }
    .fade-in { animation: fadeIn 0.8s ease-out; }
    
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .header-text h1 { 
      font-size: 2.5rem; 
      color: #064e3b;
      margin: 0 0 8px; 
      font-weight: 800; 
      letter-spacing: -0.02em;
    }
    .header-text p { color: #047857; margin: 0; font-size: 1.1rem; opacity: 0.8; }
    
    .btn-refresh { 
      background: white; border: 1px solid #6ee7b7; padding: 12px 24px; 
      border-radius: 30px; cursor: pointer; color: #065f46; font-weight: 600; 
      box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1); 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex; align-items: center; gap: 8px;
    }
    .btn-refresh:hover { 
      background: #065f46; color: white; transform: translateY(-2px); 
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25); 
    }

    .status-bar { 
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-radius: 20px; 
      padding: 24px 32px; 
      display: flex; gap: 60px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.03); 
      margin-bottom: 40px; 
      border: 1px solid rgba(255,255,255,0.6);
    }
    .status-item { display: flex; flex-direction: column; gap: 6px; }
    .status-label { font-size: 0.8rem; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 0.5px; }
    .status-val { font-size: 1.25rem; color: #1e293b; font-weight: 700; display: flex; align-items: center; gap: 10px; }
    .status-ok { color: #059669; background: #d1fae5; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; }
    .status-err { color: #dc2626; background: #fee2e2; padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; }

    /* Sections */
    .section-card { 
      background: white; 
      border-radius: 24px; 
      box-shadow: 0 20px 40px -5px rgba(0,0,0,0.06); 
      margin-bottom: 40px; 
      overflow: hidden; 
      border: 1px solid #f1f5f9; 
    }
    .card-header { 
      padding: 24px 32px; 
      background: #ffffff;
      border-bottom: 1px solid #f1f5f9; 
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; 
    }
    .header-title { display: flex; align-items: center; gap: 16px; }
    .section-card h3 { margin: 0; font-size: 1.35rem; color: #0f172a; font-weight: 700; }
    .card-subtitle { width: 100%; color: #64748b; font-size: 0.95rem; margin: 4px 0 0; }

    .pill { padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; }
    .pill.admin { background: #fff7ed; color: #c2410c; border: 1px solid #ffedd5; }
    .pill.user { background: #eff6ff; color: #1d4ed8; border: 1px solid #dbeafe; }
    .pill.visitor { background: #f0fdf4; color: #15803d; border: 1px solid #dcfce7; }

    .search-actions { display: flex; gap: 12px; align-items: center; }
    .search-input { 
      padding: 12px 24px; border-radius: 30px; border: 2px solid #e2e8f0; 
      font-size: 0.95rem; width: 300px; transition: all 0.2s; background: #f8fafc;
    }
    .search-input:focus { border-color: #10b981; background: white; outline: none; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1); }
    .btn-lock { 
      background: #0f172a; color: white; border: none; padding: 12px 24px; 
      border-radius: 30px; cursor: pointer; font-size: 0.9rem; font-weight: 600; 
      transition: all 0.2s;
    }
    .btn-lock:hover { background: #000; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25); }

    /* Modern Table */
    .table-responsive { overflow-x: auto; }
    .modern-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .modern-table th { 
      background: #f8fafc; padding: 20px 32px; text-align: left; 
      color: #475569; font-weight: 700; font-size: 0.8rem; 
      text-transform: uppercase; border-bottom: 2px solid #e2e8f0; letter-spacing: 0.05em;
    }
    .modern-table td { padding: 24px 32px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; transition: background 0.2s; }
    .modern-table tr:hover td { background: #f0fdf4; }
    .modern-table tr:last-child td { border-bottom: none; }

    /* Profiles */
    .user-profile { display: flex; align-items: center; gap: 16px; }
    .avatar { 
      width: 48px; height: 48px; border-radius: 14px; 
      display: flex; align-items: center; justify-content: center; 
      font-weight: 700; font-size: 1.2rem; color: white; flex-shrink: 0; 
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .admin-avatar { background: linear-gradient(135deg, #f97316, #ea580c); }
    .user-avatar { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .visitor-avatar { background: #cbd5e1; color: #64748b; }
    
    .info { display: flex; flex-direction: column; gap: 4px; }
    .info .name { font-weight: 700; color: #0f172a; font-size: 1rem; }
    .info .sub-text { color: #64748b; font-size: 0.9rem; }
    .tag.local { font-size: 0.7rem; background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 6px; display: inline-block; width: fit-content; border: 1px solid #e2e8f0; font-weight: 600; }

    .contact-info { display: flex; flex-direction: column; gap: 4px; font-size: 0.95rem; color: #334155; }
    .no-data { color: #cbd5e1; font-style: italic; font-size: 0.85rem; }
    
    /* Status Badge */
    .badge { padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; }
    .badge.active { background: #dcfce7; color: #166534; }
    .badge.blocked { background: #fee2e2; color: #991b1b; }
    .badge.success { background: #dcfce7; color: #166534; }
    .badge.error { background: #fee2e2; color: #991b1b; }
    
    .row-blocked td { background: #fef2f2 !important; opacity: 0.8; }
    
    .actions { display: flex; align-items: center; gap: 12px; }
    .btn-sm { padding: 8px 16px; border-radius: 10px; border: none; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-block { background: #fee2e2; color: #991b1b; }
    .btn-block:hover { background: #ef4444; color: white; transform: translateY(-1px); }
    .btn-restore { background: #dcfce7; color: #166534; }
    .btn-restore:hover { background: #22c55e; color: white; transform: translateY(-1px); }
    
    .btn-icon.delete { 
      background: white; border: 1px solid #fee2e2; font-size: 1.2rem; cursor: pointer; 
      padding: 10px; border-radius: 10px; transition: all 0.2s; color: #ef4444; 
    }
    .btn-icon.delete:hover { background: #ef4444; color: white; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25); }

    .tech-info { display: flex; flex-direction: column; gap: 2px; font-size: 0.85rem; }
    .tech-info .ip { font-family: monospace; color: #475569; background: #e2e8f0; padding: 2px 8px; border-radius: 6px; width: fit-content; font-weight: 600; }
    .tech-info .ua { color: #94a3b8; max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    
    .time-cell { color: #475569; font-size: 0.95rem; font-family: monospace; font-weight: 500; }
    .empty-state { text-align: center; padding: 80px; color: #cbd5e1; font-style: italic; font-size: 1.1rem; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  visitors: any[] = [];
  searchEmail = '';

  serverStatus: 'Pending' | 'Success' | 'Error' = 'Pending';

  constructor(private adminApi: AdminApiService) { }

  ngOnInit() {
    this.loadUsers();
    this.loadVisitors();
  }

  getServerCount(): number {
    return this.users.filter(u => !u.isLocal).length;
  }

  getLocalCount(): number {
    const raw = localStorage.getItem('greenie.users');
    try {
      return raw ? JSON.parse(raw).length : 0;
    } catch { return 0; }
  }

  hasToken(): boolean {
    return !!localStorage.getItem('greenie.token');
  }

  getAdmins() {
    return this.users.filter(u => u.role === 'admin');
  }

  getNormalUsers() {
    return this.users.filter(u => u.role !== 'admin');
  }

  loadVisitors() {
    const token = localStorage.getItem('greenie.token');
    if (!token) return;
    this.adminApi.listVisitors(token).subscribe({
      next: (res) => this.visitors = Array.isArray(res) ? res : [],
      error: (err) => {
        console.error('Error loading visitors', err);
        this.visitors = [];
      }
    });
  }

  loadUsers() {
    const token = localStorage.getItem('greenie.token');
    this.serverStatus = 'Pending';

    // 1. Get Local Users (from greenie.users)
    let localUsers: any[] = [];
    try {
      const raw = localStorage.getItem('greenie.users');
      localUsers = raw ? JSON.parse(raw) : [];
      localUsers = localUsers.map(u => ({
        ...u,
        _id: u._id || `local-${u.email}`,
        isLocal: true,
        createdAt: u.createdAt || new Date().toISOString()
      }));
    } catch (e) {
      console.error('Local Users Parse Error', e);
    }

    if (!token) {
      this.users = localUsers;
      this.serverStatus = 'Error'; // No token implies no server data
      return;
    }

    // 2. Get Server Users
    this.adminApi.listUsers(token).subscribe({
      next: (res) => {
        this.serverStatus = 'Success';
        const serverUsers = Array.isArray(res) ? res : [];
        console.log(`Server returned ${serverUsers.length} users`);

        const merged = [...serverUsers];
        localUsers.forEach(lu => {
          if (!merged.find(su => su.email === lu.email)) {
            merged.push(lu);
          }
        });

        // Robust Sort by creation date (Newest first)
        merged.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();
          return dateB - dateA;
        });

        this.users = merged;
        console.log(`Total merged users: ${this.users.length}`);
      },
      error: (err) => {
        console.error('Error loading server users', err);
        this.serverStatus = 'Error';
        this.users = localUsers;
      }
    });
  }

  toggleBlock(user: any) {
    const token = localStorage.getItem('greenie.token');
    const action = user.isBlocked ? 'unblock' : 'block';

    if (confirm(`Are you sure you want to ${action} ${user.name}?`)) {
      if (user.isLocal || !token || user._id.startsWith('local-')) {
        this.toggleLocalBlock(user);
      } else {
        this.adminApi.toggleUserBlock(token, user._id).subscribe({
          next: (res) => {
            user.isBlocked = res.isBlocked;
            this.syncBlockToLocal(user.email, res.isBlocked);
          },
          error: (err) => {
            if (err.status === 404) this.toggleLocalBlock(user);
            else alert(err.error?.error || 'Operation failed');
          }
        });
      }
    }
  }

  private toggleLocalBlock(user: any) {
    try {
      const raw = localStorage.getItem('greenie.users');
      let localUsers = raw ? JSON.parse(raw) : [];
      const index = localUsers.findIndex((u: any) => u.email === user.email);
      if (index !== -1) {
        localUsers[index].isBlocked = !localUsers[index].isBlocked;
        localStorage.setItem('greenie.users', JSON.stringify(localUsers));
        user.isBlocked = localUsers[index].isBlocked;
      }
    } catch (e) { }
  }

  private syncBlockToLocal(email: string, isBlocked: boolean) {
    try {
      const raw = localStorage.getItem('greenie.users');
      if (!raw) return;
      let localUsers = JSON.parse(raw);
      const index = localUsers.findIndex((u: any) => u.email === email);
      if (index !== -1) {
        localUsers[index].isBlocked = isBlocked;
        localStorage.setItem('greenie.users', JSON.stringify(localUsers));
      }
    } catch (e) { }
  }

  toggleBlockByEmail() {
    const token = localStorage.getItem('greenie.token');
    if (!this.searchEmail.trim()) {
      alert('Enter email first');
      return;
    }

    const email = this.searchEmail.trim();
    if (confirm(`Toggle block for ${email}?`)) {
      const localRaw = localStorage.getItem('greenie.users');
      let localUsers = localRaw ? JSON.parse(localRaw) : [];
      const foundLocal = localUsers.find((u: any) => u.email === email);

      if (foundLocal) {
        this.toggleLocalBlock(foundLocal);
        this.loadUsers();
        this.searchEmail = '';
      } else if (token) {
        this.adminApi.toggleBlockByEmail(token, email).subscribe({
          next: () => {
            this.loadUsers();
            this.searchEmail = '';
          },
          error: (err) => alert(err.error?.error || 'Failed')
        });
      }
    }
  }

  deleteUser(user: any) {
    const token = localStorage.getItem('greenie.token');
    if (confirm(`Are you sure you want to PERMANENTLY delete user ${user.name}? This cannot be undone.`)) {
      if (user.isLocal || !token || user._id.startsWith('local-')) {
        this.deleteLocalUser(user.email);
        this.loadUsers();
      } else {
        this.adminApi.deleteUser(token, user._id).subscribe({
          next: () => {
            alert('User deleted successfully from database.');
            this.loadUsers();
          },
          error: (err) => alert(err.error?.error || 'Failed to delete user.')
        });
      }
    }
  }

  private deleteLocalUser(email: string) {
    try {
      const raw = localStorage.getItem('greenie.users');
      if (!raw) return;
      let users = JSON.parse(raw);
      users = users.filter((u: any) => u.email !== email);
      localStorage.setItem('greenie.users', JSON.stringify(users));
      alert('Local record removed.');
    } catch (e) { }
  }
}
