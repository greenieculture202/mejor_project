import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Review {
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string; // ISO string
    orderId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ReviewService {
    private reviewsKey = 'greenie.reviews';
    private MOCK_DATA: Review[] = [
        {
            id: '1',
            user: 'Sarah Jenkins',
            rating: 5,
            comment: 'Absolutely love the plant care tips! My Monstera has never looked better.',
            date: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        {
            id: '2',
            user: 'Mike Ross',
            rating: 4,
            comment: 'Great selection of pots. The ceramic one I bought is high quality.',
            date: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        {
            id: '3',
            user: 'Priya Sharma',
            rating: 5,
            comment: 'The organic fertilizer is magic. Saw new leaves within a week!',
            date: new Date(Date.now() - 86400000 * 10).toISOString()
        }
    ];

    private reviewsSubject = new BehaviorSubject<Review[]>(this.MOCK_DATA);

    constructor() {
        this.loadReviews();
    }

    private loadReviews() {
        try {
            const stored = localStorage.getItem(this.reviewsKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.length > 0) {
                    this.reviewsSubject.next(parsed);
                } else {
                    // If stored is empty array, revert to mock data
                    this.saveReviews(this.MOCK_DATA);
                }
            } else {
                // No storage, ensure mock data is saved
                this.saveReviews(this.MOCK_DATA);
            }
        } catch (e) {
            console.error('Failed to load reviews', e);
        }
    }

    getReviews(): Observable<Review[]> {
        return this.reviewsSubject.asObservable();
    }

    addReview(review: Review) {
        const current = this.reviewsSubject.value;
        const newReviews = [review, ...current];
        this.saveReviews(newReviews);
    }

    private saveReviews(reviews: Review[]) {
        localStorage.setItem(this.reviewsKey, JSON.stringify(reviews));
        this.reviewsSubject.next(reviews);
    }
}
