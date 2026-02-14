import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
    style: 'toast' | 'modal';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toastsSubject.asObservable();
    private counter = 0;

    show(message: string, type: 'success' | 'error' | 'info' = 'success', style: 'toast' | 'modal' = 'toast') {
        const id = this.counter++;
        const current = this.toastsSubject.value;
        this.toastsSubject.next([...current, { message, type, id, style }]);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    remove(id: number) {
        const current = this.toastsSubject.value;
        this.toastsSubject.next(current.filter(t => t.id !== id));
    }
}
