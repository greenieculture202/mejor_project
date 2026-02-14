import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        <a routerLink="/admin/care-tips" routerLinkActive="active">Manage Care Tips</a>
        <a routerLink="/admin/users" routerLinkActive="active">Manage Users</a>
        <a routerLink="/admin/orders" routerLinkActive="active">Manage Orders</a>
        <a routerLink="/admin/blog" routerLinkActive="active">Manage Blogs</a>
        <a routerLink="/admin/faq" routerLinkActive="active">Manage FAQs</a>
        <a routerLink="/admin/settings" routerLinkActive="active">Settings</a>
      </nav>
    </aside>

    <main class="admin-main">
      <router-outlet></router-outlet>
    </main>
  </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');

    .admin-root { display: flex; height: 100vh; font-family: 'Outfit', sans-serif; overflow: hidden; }
    
    .admin-side { 
      width: 260px; 
      background: linear-gradient(180deg, #064e3b 0%, #065f46 100%);
      color: white; 
      padding: 24px; 
      display: flex; 
      flex-direction: column; 
      box-shadow: 4px 0 24px rgba(0,0,0,0.05);
      z-index: 10;
    }
    
    .admin-side .brand { 
      margin: 0 0 32px; 
      font-size: 1.5rem; 
      font-weight: 700; 
      letter-spacing: -0.02em; 
      display: flex; 
      align-items: center; 
      gap: 10px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .admin-side nav { flex: 1; display: flex; flex-direction: column; gap: 4px; overflow-y: auto; }
    
    .admin-side nav a { 
      display: block; 
      padding: 12px 16px; 
      border-radius: 12px; 
      color: #a7f3d0; 
      text-decoration: none; 
      font-size: 0.95rem; 
      font-weight: 500; 
      transition: all 0.2s ease; 
      letter-spacing: 0.3px;
    }
    
    .admin-side nav a:hover { 
      background: rgba(255, 255, 255, 0.08); 
      color: white; 
      transform: translateX(4px); 
    }
    
    .admin-side nav a.active { 
      background: rgba(255, 255, 255, 0.15); 
      color: white; 
      font-weight: 600; 
      border-left: 4px solid #34d399; /* Mint accent */
      border-radius: 4px 12px 12px 4px; /* Squared left for border */
      box-shadow: none;
    }
    
    .admin-main { 
      flex: 1; 
      padding: 0; 
      background: #f8fafc; 
      overflow: auto; 
      position: relative; 
    }
  `]
})
export class AdminComponent { }
