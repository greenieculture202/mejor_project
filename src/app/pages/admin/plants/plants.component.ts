import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin.api';
import { PlantsApiService } from '../../../services/plants.api';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-plants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <div class="page-header">
        <div class="header-text">
          <h1>Manage Plants</h1>
          <p>Add, edit, or remove plants from your inventory.</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <input type="text" [(ngModel)]="searchTerm" placeholder="Search plants..." (input)="applyFilters()" class="search-input">
            <select [(ngModel)]="filterCategory" (change)="applyFilters()" class="search-select">
              <option value="">All Categories</option>
              <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
            </select>
          </div>
          <button class="btn-primary" (click)="openModal()">
            <span>+</span> Add Plant
          </button>
        </div>
      </div>

      <!-- Plant List -->
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredPlants">
              <td><img [src]="p.image" class="thumb" [alt]="p.name"></td>
              <td><strong>{{ p.name }}</strong></td>
              <td><span style="background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:6px; font-size:0.8rem; font-weight:600;">{{ p.category }}</span></td>
              <td><span class="price-tag">₹{{ p.price }}</span></td>
              <td>
                <span class="price-tag">₹{{ p.discountPrice }}</span>
                <span class="price-discount" *ngIf="p.price > p.discountPrice">({{ Math.round((p.price - p.discountPrice)/p.price * 100) }}% OFF)</span>
              </td>
              <td>
                <div style="display:flex; gap:8px;">
                  <button class="btn-icon btn-edit" (click)="editPlant(p)" title="Edit">✏️</button>
                  <button class="btn-icon btn-delete" (click)="deletePlant(p._id)" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="filteredPlants.length === 0">
              <td colspan="6" style="text-align:center; padding: 40px; color: #94a3b8; font-style: italic;">No plants found matching your criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ isEditing ? 'Edit Plant' : 'Add New Plant' }}</h2>
            <button (click)="closeModal()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#94a3b8;">✕</button>
          </div>
          
          <form (ngSubmit)="savePlant()">
            <div class="form-row">
              <div class="form-group half">
                <label>Plant Name</label>
                <input [(ngModel)]="plantForm.name" name="name" required placeholder="e.g. Snake Plant">
              </div>
              <div class="form-group half">
                <label>Price (₹)</label>
                <input type="number" [(ngModel)]="plantForm.price" name="price" required placeholder="0.00">
              </div>
            </div>

            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="plantForm.category" name="category">
                <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
              </select>
            </div>

            <div class="form-group">
              <label>Image URL</label>
              <input [(ngModel)]="plantForm.image" name="image" placeholder="https://example.com/image.jpg">
              <small style="color:#94a3b8; margin-top:4px; display:block;">Paste a direct link to an image.</small>
            </div>

            <div class="form-group">
              <label>Description</label>
              <textarea [(ngModel)]="plantForm.description" name="description" rows="3" placeholder="Describe the plant..."></textarea>
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
          <h3 style="color: #d9534f; margin:0 0 10px;">Duplicate Plant</h3>
          <p style="font-size: 1rem; color:#64748b; margin-bottom: 24px; line-height:1.5;">This plant already exists in your inventory.<br>Would you like to edit it instead?</p>
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

    .thumb { width: 48px; height: 48px; object - fit: cover; border - radius: 8px; box - shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
    
    .price - tag { font - weight: 700; color: #059669; }
    .price - discount { text - decoration: line - through; color: #94a3b8; font - size: 0.85rem; margin - left: 6px; }

    /* Modal Form Specifics */
    .form - row { display: flex; gap: 20px; margin - bottom: 20px; }
    .form - group { margin - bottom: 20px; }
    .form - group.half { flex: 1; margin - bottom: 0; }
    
    .form - group label { display: block; margin - bottom: 8px; font - weight: 600; color: #334155; font - size: 0.9rem; }
    .form - group input, .form - group select, .form - group textarea {
  width: 100 %; padding: 12px; border: 1px solid #e2e8f0; border - radius: 10px;
  font - size: 0.95rem; background: #f8fafc; color: #334155;
  transition: all 0.2s;
}
    .form - group input: focus, .form - group select: focus, .form - group textarea:focus {
  border - color: #10b981; background: white; outline: none; box - shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
    
    .modal - actions { display: flex; justify - content: flex - end; gap: 12px; margin - top: 32px; }
    .btn - cancel { background: #f1f5f9; color: #475569; border: none; padding: 10px 24px; border - radius: 30px; cursor: pointer; font - weight: 600; transition: all 0.2s; }
    .btn - cancel:hover { background: #e2e8f0; color: #1e293b; }
    .btn - save { background: #059669; color: white; border: none; padding: 10px 24px; border - radius: 30px; cursor: pointer; font - weight: 600; box - shadow: 0 4px 12px rgba(5, 150, 105, 0.25); transition: all 0.2s; }
    .btn - save:hover { background: #047857; transform: translateY(-1px); box - shadow: 0 8px 16px rgba(5, 150, 105, 0.35); }
`]
})
export class AdminPlantsComponent implements OnInit {
  plants: any[] = [];
  filteredPlants: any[] = [];
  showModal = false;
  isEditing = false;
  showDuplicateModal = false;
  duplicatePlant: any = null;
  categories = ['Indoor Plant', 'Outdoor Plant', 'Flowering Plant', 'Trending Plant'];
  searchTerm = '';
  filterCategory = '';

  plantForm: any = { name: '', category: '', price: 0, description: '', image: '' };
  Math = Math;

  constructor(
    private plantsApi: PlantsApiService,
    private adminApi: AdminApiService,
    private notify: NotificationService
  ) { }

  ngOnInit() {
    this.loadPlants();
  }

  loadPlants() {
    this.plantsApi.list().subscribe(data => {
      this.plants = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    this.filteredPlants = this.plants.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.filterCategory ? p.category === this.filterCategory : true;
      return matchesSearch && matchesCategory;
    });
  }

  openModal() {
    this.showModal = true;
    this.isEditing = false;
    this.plantForm = { name: '', category: 'Indoor Plant', price: 0, description: '', image: 'https://images.unsplash.com/photo-1596501046102-17a41280d965?auto=format&fit=crop&w=800&q=80' };
  }

  editPlant(plant: any) {
    this.isEditing = true;
    this.plantForm = { ...plant };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  private token(): string | null { try { return localStorage.getItem('greenie.token'); } catch { return null; } }

  savePlant() {
    const token = this.token();
    if (!token) { alert('Not logged in or not admin!'); return; }

    // Check for duplicates
    if (!this.isEditing) {
      const newName = this.plantForm.name?.trim().toLowerCase();
      const cat = this.plantForm.category;
      const existing = this.plants.find(p => p.name?.trim().toLowerCase() === newName && p.category === cat);
      if (existing) {
        this.duplicatePlant = existing;
        this.showDuplicateModal = true;
        return;
      }
    }

    const payload = { ...this.plantForm };
    // Backend will handle discountPrice calculation based on price
    delete payload.discountPrice; // Remove if exists to let backend re-calc if price changed

    if (this.isEditing) {
      const id = this.plantForm._id;
      const updateData = { ...payload };
      delete updateData._id; // Ensure _id is not in the update payload body

      this.adminApi.updatePlant(token, id, updateData).subscribe({
        next: () => {
          this.loadPlants();
          this.closeModal();
          this.notify.show('Plant updated successfully!', 'success');
        },
        error: (err) => {
          console.error(err);
          this.notify.show('Error updating plant', 'error');
        }
      });
    } else {
      this.adminApi.addPlant(token, payload).subscribe({
        next: () => {
          this.loadPlants();
          this.closeModal();
          this.notify.show('Plant inserted successfully!', 'success');
        },
        error: (err) => {
          console.error(err);
          this.notify.show('Error adding plant', 'error');
        }
      });
    }
  }

  deletePlant(id: string) {
    if (!confirm('Are you sure you want to delete this plant?')) return;
    const token = this.token();
    if (!token) { alert('Not logged in!'); return; }

    this.adminApi.deletePlant(token, id).subscribe({
      next: () => {
        this.loadPlants();
        this.notify.show('Plant deleted successfully!', 'success');
      },
      error: () => this.notify.show('Error deleting plant', 'error')
    });
  }

  confirmEditDuplicate() {
    this.showDuplicateModal = false;
    this.editPlant(this.duplicatePlant);
  }

  closeDuplicateModal() {
    this.showDuplicateModal = false;
    this.duplicatePlant = null;
  }
}
