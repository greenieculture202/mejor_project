import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthApiService } from '../../../services/auth.api';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <div class="page-header">
        <div class="header-text">
          <h1>Settings</h1>
          <p>Manage your account security and preferences.</p>
        </div>
      </div>
      
      <div class="settings-card">
        <h3>Change Password</h3>
        <p class="subtitle">Update your password to secure your account. You will need to log in again after changing.</p>

        <div class="form-group">
          <label>Current Password</label>
          <div class="input-wrapper">
            <input [type]="showCurrentPass ? 'text' : 'password'" [(ngModel)]="currentPassword" placeholder="Enter current password">
            <button type="button" class="toggle-btn" (click)="showCurrentPass = !showCurrentPass" [title]="showCurrentPass ? 'Hide password' : 'Show password'">
              <span *ngIf="!showCurrentPass">👁️</span>
              <span *ngIf="showCurrentPass">🙈</span>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>New Password</label>
          <div class="input-wrapper">
            <input [type]="showNewPass ? 'text' : 'password'" [(ngModel)]="newPassword" placeholder="Enter new password">
            <button type="button" class="toggle-btn" (click)="showNewPass = !showNewPass" [title]="showNewPass ? 'Hide password' : 'Show password'">
              <span *ngIf="!showNewPass">👁️</span>
              <span *ngIf="showNewPass">🙈</span>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Confirm New Password</label>
          <div class="input-wrapper">
            <input [type]="showConfirmPass ? 'text' : 'password'" [(ngModel)]="confirmPassword" placeholder="Confirm new password">
            <button type="button" class="toggle-btn" (click)="showConfirmPass = !showConfirmPass" [title]="showConfirmPass ? 'Hide password' : 'Show password'">
              <span *ngIf="!showConfirmPass">👁️</span>
              <span *ngIf="showConfirmPass">🙈</span>
            </button>
          </div>
        </div>

        <div class="error-msg" *ngIf="errorMsg">
          <span>{{ errorMsg }}</span>
        </div>
        <div class="success-msg" *ngIf="successMsg">
          <span>{{ successMsg }}</span>
        </div>

        <button class="btn-primary" style="width:100%; justify-content:center; margin-top:20px;" (click)="updatePassword()" [disabled]="isLoading">
          <span *ngIf="!isLoading">Update Password</span>
          <span *ngIf="isLoading" class="loader"></span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Shared Admin Styles */
    @import '../admin-shared.css';

    .settings-card { 
      background: white; 
      padding: 40px; 
      border-radius: 20px; 
      box-shadow: 0 10px 40px rgba(0,0,0,0.05); 
      border: 1px solid #f1f5f9; 
      max-width: 600px;
      margin: 0 auto;
    }

    h3 { font-size: 1.5rem; color: #1e293b; margin: 0 0 8px; font-weight: 700; }
    .subtitle { color: #64748b; font-size: 0.95rem; margin-bottom: 30px; line-height: 1.5; }

    .form-group { margin-bottom: 24px; }
    label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 0.9rem; }
    
    .input-wrapper { position: relative; display: flex; align-items: center; }
    
    input { 
      width: 100%; padding: 12px 16px; padding-right: 50px; 
      border: 1px solid #e2e8f0; border-radius: 10px; font-size: 1rem; 
      background: #f8fafc; color: #334155;
      transition: all 0.2s;
    }
    input:focus { border-color: #10b981; outline: none; background: white; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }

    .toggle-btn { 
      position: absolute; right: 12px; background: none; border: none; 
      font-size: 1.2rem; cursor: pointer; opacity: 0.6; transition: opacity 0.2s;
      padding: 4px;
    }
    .toggle-btn:hover { opacity: 1; }

    .error-msg { color: #ef4444; margin-bottom: 20px; font-size: 0.95rem; background: #fef2f2; padding: 12px; border-radius: 8px; border: 1px solid #fee2e2; }
    .success-msg { color: #10b981; margin-bottom: 20px; font-size: 0.95rem; background: #ecfdf5; padding: 12px; border-radius: 8px; border: 1px solid #d1fae5; }

    .loader {
      width: 20px; height: 20px; border: 2px solid #fff; border-bottom-color: transparent; border-radius: 50%; display: inline-block; box-sizing: border-box; animation: rotation 1s linear infinite;
    }
    @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class AdminSettingsComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPass = false;
  showNewPass = false;
  showConfirmPass = false;

  isLoading = false;
  errorMsg = '';
  successMsg = '';

  constructor(private auth: AuthApiService, private router: Router) { }

  updatePassword() {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMsg = 'Please fill in all fields';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'New passwords do not match';
      return;
    }

    if (this.newPassword.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters';
      return;
    }

    this.isLoading = true;

    this.auth.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.successMsg = 'Password updated successfully! Logging out...';
          setTimeout(() => {
            this.auth.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMsg = 'Failed to update password. Please check your current password.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMsg = 'An error occurred. Please try again.';
      }
    });
  }
}
