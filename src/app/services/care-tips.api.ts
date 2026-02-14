import { Injectable } from '@angular/core';
import { ApiBase } from './api.base';
import { Observable } from 'rxjs';

export interface CareTip {
    _id?: string;
    title: string;
    category: string;
    description: string;
    image: string;
    createdAt?: string;
    price?: number;
    details?: string;
}

@Injectable({ providedIn: 'root' })
export class CareTipsApiService {
    // We keep the api dependency if other methods need it, or we can remove it if completely mocking.
    // For now, let's just mock the 'list' method as requested to show specific items.

    private mockData: CareTip[] = [
        {
            _id: '1',
            title: 'Premium Ceramic Pots',
            description: 'Handcrafted ceramic pots with drainage holes, perfect for indoor plants. Available in multiple earthy tones.',
            price: 29.99,
            image: 'assets/care_pots.png',
            details: 'Enhance your home decor with our premium ceramic pots. Designed for both style and plant health, these pots feature excellent drainage and breathability.',
            category: 'Pots'
        },
        {
            _id: '2',
            title: 'Gardening Tool Set',
            description: 'Essential gardening tools including a trowel, fork, and shears. Made with durable copper and ergonomic wooden handles.',
            price: 45.50,
            image: 'assets/care_tools.png',
            details: 'This 3-piece gardening set is built to last. The copper heads resist rust while the ash wood handles provide a comfortable grip for all your planting needs.',
            category: 'Tools'
        },
        {
            _id: '3',
            title: 'Organic Fertilizer',
            description: 'A nutrient-rich organic blend to boost plant growth and health. Safe for pets and children.',
            price: 18.00,
            image: 'assets/care_fertilizer.png',
            details: 'Give your plants the nutrients they crave with our 100% organic fertilizer. Promotes strong root development and vibrant foliage without harsh chemicals.',
            category: 'Fertilizers'
        },
        {
            _id: '4',
            title: 'Modern Watering Can',
            description: 'Sleek metal watering can with a long spout for precise watering. A stylish addition to your plant corner.',
            price: 32.00,
            image: 'assets/care_watering_can_2.png',
            details: 'Watering becomes a joy with this perfectly balanced can. The long spout allows you to reach deep into foliage to water the soil directly, preventing leaf rot.',
            category: 'Watering'
        },
        {
            _id: '5',
            title: 'Halo Grow Light',
            description: 'A sleek, modern LED halo grow light ring inserted into a potted plant pot. Emitting a warm, cozy light.',
            price: 55.00,
            image: 'assets/care_light.png',
            details: 'High-tech, minimalist home decor. This full-spectrum LED light supports photosynthesis and adds a warm glow to your room. Adjustable height.',
            category: 'Lighting'
        },
        {
            _id: '6',
            title: 'Plant Humidifier',
            description: 'A small, modern, aesthetic portable humidifier misting water vapor next to lush green houseplants.',
            price: 14.50,
            image: 'assets/care_humidifier.png',
            details: 'Maintain calm spa-like atmosphere. Essential for tropical plants, this humidifier prevents dry crispy leaves and improves indoor air quality.',
            category: 'Humidity'
        }
    ];

    constructor(private api: ApiBase) { }

    list(): Observable<CareTip[]> {
        // Return mock data instead of API call for this specific request
        // Using 'of' from rxjs to return an observable
        return new Observable(observer => {
            observer.next(this.mockData);
            observer.complete();
        });
    }
}
