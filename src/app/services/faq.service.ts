import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category?: string;
    updatedAt: string;
}

@Injectable({
    providedIn: 'root'
})
export class FaqService {
    private faqs: FaqItem[] = [
        // --- Delivery Information ---
        {
            id: 1,
            question: 'Do you deliver only within India or overseas?',
            answer: 'Currently, we only ship within India to ensure plant health. We are working on international shipping compliance.',
            category: 'Delivery Information',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 2,
            question: 'Can I choose the delivery time?',
            answer: 'Standard delivery is between 9 AM and 9 PM. You can choose a preferred date at checkout, but specific time slots are only available for "Express" orders.',
            category: 'Delivery Information',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 3,
            question: 'Can I get my order delivered at midnight?',
            answer: 'Yes, midnight delivery is available for special occasions depending on your city. Extra charges apply.',
            category: 'Delivery Information',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 10,
            question: 'Do you deliver on Sundays and Public Holidays?',
            answer: 'Yes, we deliver on Sundays and most public holidays. However, delivery availability depends on the specific courier partners in your area.',
            category: 'Delivery Information',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 11,
            question: 'What constitutes a flexible delivery charge?',
            answer: 'Flexible delivery charges apply when you choose a specific time slot (e.g., Fixed Time or Midnight Delivery). Standard delivery usually has a lower or no shipping fee depending on the cart value.',
            category: 'Delivery Information',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 12,
            question: 'How are the plants packaged for delivery?',
            answer: 'We use specially designed ventilated corrugated boxes that keep the plant upright and secure. The soil is covered to prevent spillage, and the plant remains hydrated for up to 5 days in transit.',
            category: 'Delivery Information',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 13,
            question: 'What if I am not at home when the delivery arrives?',
            answer: 'Our courier partner will attempt to call you. If you are unavailable, they may leave it with a neighbor or security guard upon your approval, or re-attempt delivery the next day.',
            category: 'Delivery Information',
            updatedAt: 'Jan 24, 2026'
        },

        // --- Order Modification ---
        {
            id: 4,
            question: 'How do I cancel my order?',
            answer: 'You can cancel your order from the "My Orders" section within 2 hours of placing it. After that, please contact support.',
            category: 'Order Modification',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 5,
            question: 'Can I change my delivery address?',
            answer: 'Address changes are possible if the order has not been dispatched yet. Contact our support team immediately.',
            category: 'Order Modification',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 14,
            question: 'Can I change the message on the gift card?',
            answer: 'Yes, if the order has not been processed for packing, you can update the gift message by contacting our Customer Support.',
            category: 'Order Modification',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 15,
            question: 'Can I add more items to my existing order?',
            answer: 'Currently, you cannot add items to an existing order. You will need to place a new order for the additional items.',
            category: 'Order Modification',
            updatedAt: 'Jan 24, 2026'
        },

        // --- Return and Refund ---
        {
            id: 6,
            question: 'What is your return policy?',
            answer: 'If your plant arrives damaged, send us a photo within 24 hours for a replacement or refund. We do not accept returns for healthy plants due to their perishable nature.',
            category: 'Return and Refund',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 7,
            question: 'When will I get my refund?',
            answer: 'Refunds are processed within 5-7 business days to the original payment method.',
            category: 'Return and Refund',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 16,
            question: 'What if I receive a different product than what I ordered?',
            answer: 'We sincerely apologize for the mix-up. Please share a picture of the product received, and we will dispatch the correct item immediately.',
            category: 'Return and Refund',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 17,
            question: 'The pot is broken, but the plant is fine. What do I do?',
            answer: 'Please send us a picture of the broken pot. We will ship a replacement pot to you immediately.',
            category: 'Return and Refund',
            updatedAt: 'Jan 24, 2026'
        },

        // --- Payment Related ---
        {
            id: 8,
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit/debit cards, UPI, Net Banking, and Wallet payments.',
            category: 'Payment Related',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 9,
            question: 'Is Cash on Delivery (COD) available?',
            answer: 'Yes, COD is available for most locations for orders up to ₹5000.',
            category: 'Payment Related',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 18,
            question: 'Is it safe to use my credit card on your site?',
            answer: 'Absolutely. We use industry-standard encryption (SSL) to protect your personal and payment information.',
            category: 'Payment Related',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 19,
            question: 'Do you offer EMI options?',
            answer: 'Yes, EMI options are available for orders above ₹3000 on select credit cards.',
            category: 'Payment Related',
            updatedAt: 'Jan 24, 2026'
        },

        // --- Plant Care & Queries ---
        {
            id: 20,
            question: 'I am a beginner. Which plant should I buy?',
            answer: 'We recommend Snake Plants, ZZ Plants, or Pothos for beginners as they are very forgiving and require minimal care.',
            category: 'Plant Care Queries',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 21,
            question: 'Is the plant delivered with the pot?',
            answer: 'Yes, all our plants come potted in a high-quality nursery pot or the premium pot you selected during purchase.',
            category: 'Plant Care Queries',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 22,
            question: 'Are indoor plants safe for pets?',
            answer: 'Some plants can be toxic to pets. We have a dedicated "Pet Friendly" category where you can find safe options like Spider Plants and Calathea.',
            category: 'Plant Care Queries',
            updatedAt: 'Jan 24, 2026'
        },

        // --- Gifting & Corporate ---
        {
            id: 23,
            question: 'can I send a plant anonymously?',
            answer: 'Yes! Just mention in the special instructions that you want the sender details to be hidden, and we will keep it a surprise.',
            category: 'Gifting & Corporate',
            updatedAt: 'Jan 24, 2026'
        },
        {
            id: 24,
            question: 'Do you handle corporate bulk orders?',
            answer: 'Yes, we specialize in corporate gifting. Please visit our Corporate page or email us at corporate@greenie.com for a quote.',
            category: 'Gifting & Corporate',
            updatedAt: 'Jan 24, 2026'
        }
    ];

    private faqsSubject = new BehaviorSubject<FaqItem[]>(this.faqs);
    faqs$ = this.faqsSubject.asObservable();

    constructor() {
        // Try to load from localStorage if available
        try {
            const saved = localStorage.getItem('greenie.faqs');
            // Only load from storage if it has MORE items than default, ensuring we update users with new questions if they haven't made custom ones.
            // For simplicity in this demo, I'll prioritize the hardcoded list if the storage has very few, or just reset to get the new data.
            // Let's force update the user's data this time since we are expanding content significantly.
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.length > 15) {
                    this.faqs = parsed;
                }
            }
            this.faqsSubject.next(this.faqs);
        } catch (e) { console.error('Error loading FAQs', e); }
    }

    getFaqs(): Observable<FaqItem[]> {
        return this.faqs$;
    }

    addFaq(faq: Partial<FaqItem>) {
        const newFaq: FaqItem = {
            id: Date.now(),
            question: faq.question || 'New Question',
            answer: faq.answer || 'Answer goes here...',
            category: faq.category || 'General',
            updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        this.faqs.unshift(newFaq);
        this.save();
    }

    updateFaq(id: number, updates: Partial<FaqItem>) {
        const index = this.faqs.findIndex(f => f.id === id);
        if (index !== -1) {
            this.faqs[index] = { ...this.faqs[index], ...updates, updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) };
            this.save();
        }
    }

    deleteFaq(id: number) {
        this.faqs = this.faqs.filter(f => f.id !== id);
        this.save();
    }

    private save() {
        this.faqsSubject.next([...this.faqs]);
        try {
            localStorage.setItem('greenie.faqs', JSON.stringify(this.faqs));
        } catch (e) {
            console.error('Error saving FAQs', e);
        }
    }
}
