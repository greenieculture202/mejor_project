import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin.api';
import { CareTipsApiService, CareTip } from '../../../services/care-tips.api';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-care-tips',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <div class="page-header">
        <div class="header-text">
          <h1>Manage Care Tips</h1>
          <p>Create and manage plant care guides and tips.</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <input type="text" [(ngModel)]="searchTerm" placeholder="Search tips..." (input)="applyFilters()" class="search-input">
            <select [(ngModel)]="filterCategory" (change)="applyFilters()" class="search-select">
              <option value="">All Categories</option>
              <option *ngFor="let c of categories" [value]="c">{{c}}</option>
            </select>
          </div>
          <button class="btn-primary" (click)="openModal()">
            <span>+</span> Add Tip
          </button>
        </div>
      </div>

      <!-- Tips List -->
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Price</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of filteredTips">
              <td><img [src]="t.image" class="thumb" [alt]="t.title"></td>
              <td><strong>{{ t.title }}</strong></td>
              <td><span style="background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:6px; font-size:0.8rem; font-weight:600;">{{ t.category }}</span></td>
              <td><span class="price-tag">₹{{ t.price || 0 }}</span></td>
              <td class="desc-cell" style="max-width:300px; color:#64748b;">{{ t.description }}</td>
              <td>
                <div style="display:flex; gap:8px;">
                  <button class="btn-icon btn-edit" (click)="editTip(t)" title="Edit">✏️</button>
                  <button class="btn-icon btn-delete" (click)="deleteTip(t._id)" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredTips.length === 0">
              <td colspan="6" style="text-align:center; padding: 40px; color: #94a3b8; font-style: italic;">No care tips found matching your criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Edit Tip' : 'Add New Tip' }}</h2>
            <button (click)="closeModal()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#94a3b8;">✕</button>
          </div>
          
          <form (ngSubmit)="saveTip()">
            <div class="form-row">
              <div class="form-group half">
                <label>Title</label>
                <input [(ngModel)]="tipForm.title" name="title" required placeholder="Tip Title">
              </div>
              <div class="form-group half">
                <label>Category</label>
                <select [(ngModel)]="tipForm.category" name="category">
                  <option *ngFor="let c of categories" [value]="c">{{c}}</option>
                </select>
              </div>
            </div>
            
            <div class="form-group">
              <label>Image URL</label>
              <input [(ngModel)]="tipForm.image" name="image" placeholder="https://example.com/image.jpg">
              <small style="color:#94a3b8; margin-top:4px; display:block;">Paste an image URL here</small>
            </div>

            <div class="form-row">
               <div class="form-group half">
                  <label>Price (₹)</label>
                  <input type="number" [(ngModel)]="tipForm.price" name="price" placeholder="0">
               </div>
               <div class="form-group half">
                  <label>Details (Long Description)</label>
                  <input [(ngModel)]="tipForm.details" name="details" placeholder="Detailed info for modal">
               </div>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="tipForm.description" name="description" rows="4" placeholder="Short description of the tip..."></textarea>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-save">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Duplicate Warning Modal -->
      <div class="modal-overlay" *ngIf="showDuplicateModal" style="z-index: 1100;">
        <div class="modal-content" style="width: 400px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 10px;">⚠️</div>
          <h3 style="color: #d9534f; margin:0 0 10px;">Duplicate Care Tip</h3>
          <p style="font-size: 1rem; color:#64748b; margin-bottom: 24px; line-height:1.5;">This care tip already exists.<br>Do you want to edit it instead?</p>
          <div style="display: flex; justify-content: center; gap: 12px;">
             <button class="btn-primary" style="background:#f59e0b;" (click)="confirmEditDuplicate()">Edit Existing</button>
             <button class="btn-cancel" (click)="closeDuplicateModal()">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Shared Admin Styles */
    @import '../admin-shared.css';

    .thumb { width: 48px; height: 48px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .price-tag { font-weight: 700; color: #059669; }
    .desc-cell { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    /* Modal Form Specifics */
    .form-row { display: flex; gap: 20px; margin-bottom: 20px; }
    .form-group { margin-bottom: 20px; }
    .form-group.half { flex: 1; margin-bottom: 0; }
    
    .form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #334155; font-size: 0.9rem; }
    .form-group input, .form-group select, .form-group textarea { 
      width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; 
      font-size: 0.95rem; background: #f8fafc; color: #334155;
      transition: all 0.2s;
    }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { 
      border-color: #10b981; background: white; outline: none; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); 
    }
    
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }
    .btn-cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 24px; border-radius: 30px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
    .btn-cancel:hover { background: #e2e8f0; color: #1e293b; }
    .btn-save { background: #059669; color: white; border: none; padding: 10px 24px; border-radius: 30px; cursor: pointer; font-weight: 600; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.25); transition: all 0.2s; }
    .btn-save:hover { background: #047857; transform: translateY(-1px); box-shadow: 0 8px 16px rgba(5, 150, 105, 0.35); }
  `]
})
export class AdminCareTipsComponent implements OnInit {
  tips: CareTip[] = [];
  filteredTips: CareTip[] = [];
  showModal = false;
  isEditing = false;
  showDuplicateModal = false;
  duplicateTip: any = null;
  categories = ['Pots', 'Tools', 'Fertilizers', 'Watering', 'Lighting', 'Humidity', 'Stands', 'Pest Control'];
  searchTerm = '';
  filterCategory = '';

  tipForm: any = { title: '', category: '', description: '', image: '', price: 0, details: '' };

  constructor(
    private careApi: CareTipsApiService,
    private adminApi: AdminApiService,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    this.loadTips();
  }

  loadTips() {
    this.careApi.list().subscribe(data => {
      this.tips = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredTips = this.tips.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.filterCategory ? t.category === this.filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  openModal() {
    this.showModal = true;
    this.isEditing = false;
    this.tipForm = { title: '', category: 'Watering', description: '', image: 'https://images.unsplash.com/photo-1614736394334-1c64eb372a8c?auto=format&fit=crop&w=800&q=80' };
  }

  editTip(tip: any) {
    this.isEditing = true;
    this.tipForm = { ...tip };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  private token(): string | null { try { return localStorage.getItem('greenie.token'); } catch { return null; } }

  saveTip() {
    const token = this.token();
    if (!token) { alert('Not logged in or not admin!'); return; }

    const payload = { ...this.tipForm };

    // Check for duplicates
    if (!this.isEditing) {
      const newTitle = this.tipForm.title?.trim().toLowerCase();
      const cat = this.tipForm.category;
      const existing = this.tips.find(t => t.title?.trim().toLowerCase() === newTitle && t.category === cat);
      if (existing) {
        this.duplicateTip = existing;
        this.showDuplicateModal = true;
        return;
      }
    }

    if (this.isEditing) {
      const id = this.tipForm._id;
      const updateData = { ...payload };
      delete updateData._id;

      this.adminApi.updateCareTip(token, id, updateData).subscribe({
        next: () => {
          this.loadTips();
          this.closeModal();
          this.notify.show('Tip updated successfully!', 'success');
        },
        error: (err) => {
          console.error(err);
          this.notify.show('Error updating tip', 'error');
        }
      });
    } else {
      this.adminApi.addCareTip(token, payload).subscribe({
        next: () => {
          this.loadTips();
          this.closeModal();
          this.notify.show('Tip inserted successfully!', 'success');
        },
        error: (err) => {
          console.error(err);
          this.notify.show('Error adding tip', 'error');
        }
      });
    }
  }

  deleteTip(id: string | undefined) {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this tip?')) return;
    const token = this.token();
    if (!token) { alert('Not logged in!'); return; }

    this.adminApi.deleteCareTip(token, id).subscribe({
      next: () => {
        this.loadTips();
        this.notify.show('Tip deleted successfully!', 'success');
      },
      error: () => this.notify.show('Error deleting tip', 'error')
    });
  }

  confirmEditDuplicate() {
    this.showDuplicateModal = false;
    this.editTip(this.duplicateTip);
  }

  closeDuplicateModal() {
    this.showDuplicateModal = false;
    this.duplicateTip = null;
  }
}
