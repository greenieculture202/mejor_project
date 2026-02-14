import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FaqService, FaqItem } from '../../../services/faq.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-wrapper">
      <div class="page-header">
        <div class="header-text">
          <h1>Manage FAQs</h1>
          <p>Create and edit frequently asked questions.</p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" (click)="openAddForm()">
            <span>+</span> New FAQ
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let faq of faqs$ | async">
              <td class="question-col">
                <strong>{{ faq.question }}</strong>
                <div class="answer-preview">{{ faq.answer }}</div>
              </td>
              <td><span style="background:#f1f5f9; color:#475569; padding:4px 10px; border-radius:6px; font-size:0.8rem; font-weight:600;">{{ faq.category }}</span></td>
              <td>{{ faq.updatedAt }}</td>
              <td>
                <div style="display:flex; gap:8px;">
                  <button class="btn-icon btn-edit" (click)="editFaq(faq)" title="Edit">✏️</button>
                  <button class="btn-icon btn-delete" (click)="deleteFaq(faq.id)" title="Delete">🗑️</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="(faqs$ | async)?.length === 0">
              <td colspan="4" style="text-align:center; padding: 40px; color: #94a3b8; font-style: italic;">No FAQs found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal-overlay" *ngIf="showForm">
        <div class="modal-content">
          <div class="modal-header">
            <h2>{{ editingId ? 'Edit FAQ' : 'Create New FAQ' }}</h2>
            <button (click)="closeForm()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#94a3b8;">✕</button>
          </div>

          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label>Question</label>
              <input type="text" [(ngModel)]="currentFaq.question" name="question" required placeholder="e.g., How do you ship?">
            </div>
            
            <div class="form-group">
              <label>Category</label>
              <select [(ngModel)]="currentFaq.category" name="category">
                <option value="General">General</option>
                <option value="Shipping">Shipping</option>
                <option value="Returns">Returns</option>
                <option value="Care">Care</option>
                <option value="Payment">Payment</option>
              </select>
            </div>

            <div class="form-group">
              <label>Answer</label>
              <textarea [(ngModel)]="currentFaq.answer" name="answer" required rows="5" placeholder="Enter the detailed answer..."></textarea>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn-save">{{ editingId ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Shared Admin Styles */
    @import '../admin-shared.css';

    .question-col { width: 40%; }
    .question-col strong { display: block; margin-bottom: 4px; color: #334155; }
    .answer-preview {
      font-size: 0.85rem;
      color: #64748b;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Modal Form Specifics */
    .form-group { margin-bottom: 20px; }
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
export class AdminFaqComponent implements OnInit {
  faqs$!: Observable<FaqItem[]>;
  showForm = false;
  editingId: number | null = null;

  currentFaq: Partial<FaqItem> = {
    question: '',
    answer: '',
    category: 'General'
  };

  constructor(private faqService: FaqService) { }

  ngOnInit() {
    this.faqs$ = this.faqService.getFaqs();
  }

  openAddForm() {
    this.resetForm();
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.resetForm();
  }

  onSubmit() {
    if (this.currentFaq.question && this.currentFaq.answer) {
      if (this.editingId) {
        this.faqService.updateFaq(this.editingId, this.currentFaq);
      } else {
        this.faqService.addFaq(this.currentFaq);
      }
      this.closeForm();
    }
  }

  editFaq(faq: FaqItem) {
    this.editingId = faq.id;
    this.currentFaq = { ...faq };
    this.showForm = true;
  }

  deleteFaq(id: number) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this.faqService.deleteFaq(id);
    }
  }

  resetForm() {
    this.editingId = null;
    this.currentFaq = { question: '', answer: '', category: 'General' };
  }
}
