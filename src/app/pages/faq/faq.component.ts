import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqService, FaqItem } from '../../services/faq.service';
import { ReviewService, Review } from '../../services/review.service';
import { Observable, combineLatest, map, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="faq-section">
      <div class="faq-container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        
        <div class="faq-layout" *ngIf="vm$ | async as vm">
          <!-- Sidebar: Categories -->
          <aside class="faq-sidebar">
            <h3 class="sidebar-title">Help Topics</h3>
            <ul class="category-list">
              <li *ngFor="let cat of vm.categories" 
                  [class.active]="cat === vm.selectedCategory"
                  (click)="selectCategory(cat)">
                {{ cat }}
              </li>
            </ul>
            
            <div class="sidebar-contact">
              <p>Can't find your answer?</p>
              <button class="contact-btn">Contact Support</button>
            </div>
          </aside>

          <!-- Main Content: Accordion -->
          <div class="faq-content">
            <h3 class="category-title">{{ vm.selectedCategory }}</h3>
            
            <div class="accordion">
              <div *ngFor="let faq of vm.filteredFaqs; let i = index" 
                   class="accordion-item" 
                   [class.active]="activeQuestionId === faq.id">
                
                <button class="accordion-header" (click)="toggleQuestion(faq.id)">
                  <span class="question-text">{{ faq.question }}</span>
                  <span class="icon">{{ activeQuestionId === faq.id ? '−' : '+' }}</span>
                </button>
                
                <div class="accordion-body" 
                     [style.max-height]="activeQuestionId === faq.id ? '500px' : '0'">
                  <div class="answer-content">
                    {{ faq.answer }}
                  </div>
                </div>
              </div>

              <div *ngIf="vm.filteredFaqs.length === 0" class="no-data">
                No questions found in this category.
              </div>
            </div>
          </div>
        </div>
        
        <!-- REVIEWS SECTION -->
        <div id="reviews" class="reviews-section" *ngIf="vm$ | async as vm">
            <h2 class="section-title" style="margin-top: 80px;">Customer Reviews</h2>
            <div class="reviews-grid">
                <div class="review-card" *ngFor="let review of vm.reviews | slice:0:visibleReviews">
                    <div class="review-header">
                        <span class="user-name">{{ review.user }}</span>
                        <span class="review-date">{{ review.date | date }}</span>
                    </div>
                    <div class="star-display">
                        <span *ngFor="let s of [1,2,3,4,5]" [class.filled]="s <= review.rating">★</span>
                    </div>
                    <p class="review-text">{{ review.comment }}</p>
                </div>
            </div>
            
            <div *ngIf="vm.reviews.length > visibleReviews" class="view-more-container">
                <button (click)="showMoreReviews()" class="view-more-btn">View More Reviews</button>
            </div>

             <div *ngIf="vm.reviews.length === 0" class="no-reviews">
                No reviews yet. Be the first to order and review!
            </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    .faq-section {
      background-color: transparent;
      padding: 60px 0;
      font-family: 'Inter', sans-serif;
      border-top: 1px solid #f0f0f0;
    }

    .faq-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 2.5rem;
      color: #123b2b;
      text-align: center;
      margin-bottom: 50px;
      font-weight: 700;
    }

    .faq-layout {
      display: flex;
      gap: 40px;
      min-height: 500px;
    }

    /* Sidebar Styles */
    .faq-sidebar {
      flex: 0 0 280px;
      background: #f8f9fa;
      padding: 0;
      border-radius: 8px;
    }

    .sidebar-title {
      font-size: 1.1rem;
      font-weight: 600;
      padding: 20px 25px;
      margin: 0;
      border-bottom: 1px solid #eee;
      color: #333;
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .category-list li {
      padding: 15px 25px;
      cursor: pointer;
      color: #555;
      font-weight: 500;
      border-left: 4px solid transparent;
      transition: all 0.2s;
      border-bottom: 1px solid #eee;
    }

    .category-list li:hover {
      background-color: #f0f0f0;
      color: #123b2b;
    }

    .category-list li.active {
      background-color: #fff;
      color: #123b2b;
      font-weight: 700;
      border-left-color: #4CAF50;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .sidebar-contact {
      padding: 25px;
      text-align: center;
      margin-top: 20px;
    }

    .sidebar-contact p {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 10px;
    }

    .contact-btn {
      width: 100%;
      padding: 10px;
      border: 1px solid #123b2b;
      background: transparent;
      color: #123b2b;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .contact-btn:hover {
      background: #123b2b;
      color: #fff;
    }

    /* Content Styles */
    .faq-content {
      flex: 1;
    }

    .category-title {
      font-size: 1.8rem;
      color: #333;
      margin: 0 0 25px 0;
      font-weight: 600;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 10px;
    }

    .accordion {
      border-top: 1px solid #e0e0e0;
    }

    .accordion-item {
      border-bottom: 1px solid #e0e0e0;
    }

    .accordion-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 10px;
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: background 0.2s;
    }

    .accordion-header:hover {
      background-color: #fcfcfc;
    }

    .question-text {
      font-size: 1.05rem;
      color: #333;
      font-weight: 500;
    }
    
    .accordion-item.active .question-text {
      color: #4CAF50;
      font-weight: 600;
    }

    .icon {
      font-size: 1.5rem;
      color: #888;
      font-weight: 300;
      margin-left: 15px;
    }

    .accordion-item.active .icon {
      color: #4CAF50;
    }

    .accordion-body {
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease-in-out;
    }

    .answer-content {
      padding: 0 10px 25px 10px;
      color: #555;
      line-height: 1.6;
    }
    
    .no-data {
      padding: 20px;
      color: #777;
      font-style: italic;
    }

    /* Reviews Styles */
    .reviews-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 30px;
    }

    .review-card {
        background: #f9f9f9;
        padding: 25px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
        transition: transform 0.2s;
    }

    .review-card:hover {
        transform: translateY(-5px);
    }

    .review-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        align-items: center;
    }

    .user-name {
        font-weight: 700;
        color: #123b2b;
    }

    .review-date {
        font-size: 0.8rem;
        color: #888;
    }

    .star-display {
        color: #ddd;
        margin-bottom: 15px;
    }

    .star-display .filled {
        color: #ffb400;
    }

    .review-text {
        color: #555;
        line-height: 1.5;
        font-style: italic;
    }

    .no-reviews {
        text-align: center;
        padding: 40px;
        color: #888;
        font-size: 1.1rem;
    }

    .view-more-container {
        text-align: center;
        margin-top: 40px;
    }

    .view-more-btn {
        background-color: transparent;
        border: 2px solid #123b2b;
        color: #123b2b;
        padding: 12px 30px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 5px;
    }

    .view-more-btn:hover {
        background-color: #123b2b;
        color: white;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .faq-layout {
        flex-direction: column;
      }
      .faq-sidebar {
        flex: none;
        width: 100%;
      }
      .category-list {
        display: flex;
        overflow-x: auto;
        border-bottom: 1px solid #ddd;
      }
      .category-list li {
        white-space: nowrap;
        border-left: none;
        border-bottom: 3px solid transparent;
        padding: 10px 15px;
      }
      .category-list li.active {
        border-left: none;
        border-bottom-color: #4CAF50;
        background: none;
        box-shadow: none;
      }
    }
  `]
})
export class FaqComponent implements OnInit {
  selectedCategory$ = new BehaviorSubject<string>('General');
  activeQuestionId: number | null = null;

  vm$: Observable<{ categories: string[], selectedCategory: string, filteredFaqs: FaqItem[], reviews: Review[] }> | undefined;

  constructor(
    private faqService: FaqService,
    private reviewService: ReviewService
  ) { }

  ngOnInit() {
    this.vm$ = combineLatest([
      this.faqService.getFaqs(),
      this.selectedCategory$,
      this.reviewService.getReviews()
    ]).pipe(
      map(([faqs, selectedCategory, reviews]) => {
        // Extract unique categories
        const categories = [...new Set(faqs.map(f => f.category || 'General'))].sort();

        // Use selected category if valid, otherwise default to the first one
        const activeCategory = categories.includes(selectedCategory)
          ? selectedCategory
          : (categories.length > 0 ? categories[0] : 'General');

        // Filter FAQs
        const filteredFaqs = faqs.filter(f => (f.category || 'General') === activeCategory);

        return {
          categories,
          selectedCategory: activeCategory,
          filteredFaqs,
          reviews
        };
      })
    );
  }

  selectCategory(category: string) {
    this.selectedCategory$.next(category);
    this.activeQuestionId = null; // Close open questions
  }

  toggleQuestion(id: number) {
    this.activeQuestionId = this.activeQuestionId === id ? null : id;
  }

  // Review Pagination
  visibleReviews = 6;

  showMoreReviews() {
    this.visibleReviews += 6;
  }
}
