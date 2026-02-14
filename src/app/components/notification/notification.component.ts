import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Toast } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-wrapper">
      <!-- Centered Modal Section -->
      <div class="notification-overlay" *ngIf="hasModals(toasts$ | async)">
        <ng-container *ngFor="let t of toasts$ | async">
          <div *ngIf="t.style === 'modal'" 
               class="alert-modal" 
               [class]="t.type"
               (click)="remove(t.id)">
            <div class="alert-content">
              <div class="icon-box" [class]="t.type">
                <span *ngIf="t.type === 'success'">✓</span>
                <span *ngIf="t.type === 'error'">✕</span>
                <span *ngIf="t.type === 'info'">!</span>
              </div>
              <h3>{{ t.type === 'error' ? 'Oops!' : 'Great!' }}</h3>
              <p class="message">{{ t.message }}</p>
              <button class="alert-btn">Got it</button>
            </div>
          </div>
        </ng-container>
      </div>

      <!-- Side Toast Section -->
      <div class="toast-container">
        <ng-container *ngFor="let t of toasts$ | async">
          <div *ngIf="t.style === 'toast'" 
               class="toast" 
               [class]="t.type"
               (click)="remove(t.id)">
            <div class="icon-circle" [class]="t.type">
              <span *ngIf="t.type === 'success'">✓</span>
              <span *ngIf="t.type === 'error'">✕</span>
              <span *ngIf="t.type === 'info'">i</span>
            </div>
            <span class="toast-message">{{ t.message }}</span>
          </div>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    /* Centered Modal Styles */
    .notification-overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease;
    }
    .alert-modal {
      background: white;
      width: 100%; max-width: 400px;
      padding: 40px; border-radius: 24px;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .icon-box {
      width: 70px; height: 70px; border-radius: 50%;
      margin: 0 auto 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 32px; font-weight: bold; color: white;
    }
    .icon-box.success { background: #123b2b; }
    .icon-box.error { background: #e53e3e; }
    .alert-modal h3 { font-size: 1.8rem; margin: 0 0 10px; color: #2d3748; }
    .message { font-size: 1.1rem; color: #4a5568; margin-bottom: 25px; }
    .alert-btn { background: #123b2b; color: white; border: none; padding: 12px 30px; border-radius: 12px; font-weight: 700; cursor: pointer; }

    /* Side Toast Styles */
    .toast-container {
      position: fixed;
      top: 20px; right: 20px;
      z-index: 10001;
      display: flex; flex-direction: column; gap: 12px;
    }
    .toast {
      background: white;
      min-width: 280px; padding: 14px 20px;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      display: flex; align-items: center; gap: 12px;
      cursor: pointer;
      animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border-left: 5px solid #123b2b;
    }
    .toast.error { border-left-color: #e53e3e; }
    .icon-circle {
      width: 24px; height: 24px; border-radius: 50%;
      background: #123b2b; color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: bold; flex-shrink: 0;
    }
    .icon-circle.error { background: #e53e3e; }
    .toast-message { font-weight: 600; color: #333; font-size: 0.95rem; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  `]
})
export class NotificationComponent {
  toasts$;

  constructor(private notificationService: NotificationService) {
    this.toasts$ = this.notificationService.toasts$;
  }

  hasModals(toasts: any[] | null): boolean {
    return !!toasts && toasts.some(t => t.style === 'modal');
  }

  remove(id: number) {
    this.notificationService.remove(id);
  }
}
