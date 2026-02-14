import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { PlantsApiService } from '../../services/plants.api';
import { CareTipsApiService } from '../../services/care-tips.api';
import { AuthApiService } from '../../services/auth.api';
import { OrderApiService } from '../../services/order.api';
import { ReviewService } from '../../services/review.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Component({
    selector: 'app-order',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './order.html',
    styleUrls: ['./order.css']
})
export class OrderComponent implements OnInit {
    orderDate = new Date();
    orderId = 'MDG-' + Math.floor(100000 + Math.random() * 900000); // MDG prefix for Million Dollar Girls

    // Checkout Form Data
    formData = {
        fullName: '',
        phone: '',
        email: '',
        address: '',
        paymentMethod: 'online', // 'online' | 'cod'
        transactionId: '',
        senderName: '',
        bankName: '',
        ifscCode: '',
        accountNumber: ''
    };

    user: any = {};
    items: any[] = [];
    subtotal = 0;
    total = 0;
    isLoading = true;
    step: 'checkout' | 'success' = 'checkout'; // State management

    constructor(
        private cartService: CartService,
        private plantsApi: PlantsApiService,
        private careApi: CareTipsApiService,
        private authApi: AuthApiService,
        private orderApi: OrderApiService,
        private router: Router,
        private reviewService: ReviewService
    ) { }

    ngOnInit() {
        this.loadUser();
        this.loadCart();
    }

    loadUser() {
        const currentUser = this.authApi.getCurrentUser();
        if (currentUser) {
            this.user = currentUser;
            // Pre-fill form
            this.formData.fullName = currentUser.name || '';
            this.formData.email = currentUser.email || '';
            this.formData.phone = currentUser.phone || '';
            this.formData.address = currentUser.address || '';
        } else {
            // Check localStorage as fallback
            try {
                const raw = localStorage.getItem('greenie.currentUser');
                if (raw) {
                    this.user = JSON.parse(raw);
                    this.formData.fullName = this.user.name || '';
                    this.formData.email = this.user.email || '';
                    this.formData.phone = this.user.phone || '';
                    this.formData.address = this.user.address || '';
                }
            } catch (e) { }
        }

        if (!this.formData.email && !this.user.email) {
            this.router.navigate(['/']);
        }
    }

    loadCart() {
        this.cartService.items$.pipe(take(1)).subscribe(cartItems => {
            if (cartItems.length === 0 && this.step === 'checkout') {
                this.router.navigate(['/cart']);
                return;
            }

            forkJoin({
                plants: this.plantsApi.list().pipe(take(1), catchError(() => of([]))),
                careTips: this.careApi.list().pipe(take(1), catchError(() => of([])))
            }).subscribe(({ plants, careTips }) => {
                this.items = cartItems.map(ci => {
                    const idStr = ci.id.toString();
                    let product = plants.find((p: any) => p._id === idStr);
                    if (!product) {
                        const tip = careTips.find((c: any) => c._id === idStr);
                        if (tip) {
                            product = {
                                _id: tip._id,
                                name: tip.title,
                                image: tip.image,
                                price: 0,
                                discountPrice: 0,
                                category: 'Care Tip',
                                description: tip.description || ''
                            };
                        }
                    }

                    if (!product) {
                        product = {
                            name: 'Unknown',
                            price: 0,
                            discountPrice: 0,
                            _id: ci.id,
                            category: 'Unknown',
                            description: '',
                            image: ''
                        };
                    }

                    return {
                        ...ci,
                        product,
                        total: (product.discountPrice || 0) * ci.qty
                    };
                });

                this.calculateTotals();
                this.isLoading = false;
            });
        });
    }

    calculateTotals() {
        this.subtotal = this.items.reduce((acc, item) => acc + item.total, 0);
        this.total = this.subtotal;
    }

    confirmOrder() {
        // Detailed Validation Debugging
        console.log('Confirming Order with Data:', this.formData);

        const missingFields = [];
        if (!this.formData.fullName?.trim()) missingFields.push('Full Name');
        if (!this.formData.phone?.trim()) missingFields.push('Phone Number');
        if (!this.formData.email?.trim()) missingFields.push('Email Address');
        if (!this.formData.address?.trim()) missingFields.push('Shipping Address');

        if (missingFields.length > 0) {
            alert(`Please fill in the following details: ${missingFields.join(', ')}`);
            return;
        }

        if (this.formData.paymentMethod === 'online' && (
            !this.formData.transactionId ||
            !this.formData.senderName ||
            !this.formData.bankName ||
            !this.formData.ifscCode ||
            !this.formData.accountNumber
        )) {
            alert('Please enter all bank and transaction details to confirm payment.');
            return;
        }

        // 1. Prepare payload for Backend
        const orderItems = this.items.map(item => ({
            plant: item.product._id, // The Plant ID
            name: item.product.name,
            image: item.product.image,
            price: item.product.discountPrice || item.product.price,
            quantity: item.qty
        }));

        const orderPayload = {
            items: orderItems,
            totalAmount: this.total,
            shippingAddress: {
                fullName: this.formData.fullName,
                phone: this.formData.phone,
                addressLine: this.formData.address,
            },
            paymentMethod: this.formData.paymentMethod
        };

        console.log('Sending Order Payload:', JSON.stringify(orderPayload, null, 2));

        const token = localStorage.getItem('greenie.token');
        if (!token) {
            alert('You must be logged in to place an order.');
            return;
        }

        // 2. Send to Backend
        this.isLoading = true;
        this.orderApi.createOrder(orderPayload, token).subscribe({
            next: (createdOrder: any) => {
                this.handleSuccess(createdOrder);
            },
            error: (err: any) => {
                console.warn('Backend failed, saving locally for demo:', err);

                // Fallback: Create a local order object
                const localOrder = {
                    _id: 'LOC-' + Math.floor(Math.random() * 1000000),
                    ...orderPayload,
                    user: this.user._id || 'guest', // or email
                    status: 'Pending',
                    createdAt: new Date().toISOString()
                };

                this.saveLocalOrder(localOrder);
                this.handleSuccess(localOrder);
            }
        });
    }

    saveLocalOrder(order: any) {
        try {
            const raw = localStorage.getItem('greenie.orders');
            const orders = raw ? JSON.parse(raw) : [];
            orders.unshift(order);
            localStorage.setItem('greenie.orders', JSON.stringify(orders));
        } catch (e) {
            console.error('Failed to save local order', e);
        }
    }

    handleSuccess(order: any) {
        // 3. Success
        this.orderId = order._id || this.orderId;
        this.orderDate = new Date(order.createdAt || Date.now());

        // Clear cart locally
        this.cartService.clear();

        // Move to success view
        this.step = 'success';
        this.isLoading = false;
        window.scrollTo(0, 0);
    }

    printInvoice() {
        window.print();
    }

    // Review Logic
    reviewRating = 5;
    reviewComment = '';
    reviewSubmitted = false;

    setRating(star: number) {
        this.reviewRating = star;
    }

    submitReview() {
        if (!this.reviewComment.trim()) {
            alert('Please write a short comment about your experience.');
            return;
        }

        const review = {
            id: 'REV-' + Math.floor(Math.random() * 1000000),
            user: this.formData.fullName || 'Greenie User',
            rating: this.reviewRating,
            comment: this.reviewComment,
            date: new Date().toISOString(),
            orderId: this.orderId
        };

        this.reviewService.addReview(review);
        this.reviewSubmitted = true;
    }
}
