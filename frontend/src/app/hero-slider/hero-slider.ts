import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-hero-slider',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hero-slider.html',
    styleUrl: './hero-slider.css'
})
export class HeroSliderComponent implements OnInit, OnDestroy {
    slides = [
        {
            image: 'https://images.unsplash.com/photo-1470058869958-2a77ade41c02?auto=format&fit=crop&w=1920&q=80', // Lush Forest/Ferns
            title: 'Bring Nature Home',
            subtitle: 'Curated collection of',
            highlight: 'Exotic Ferns',
            discount: 'Starting ₹299',
            color: '#fff',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1463320898484-cdee8141c787?auto=format&fit=crop&w=1920&q=80', // Lush Green Plants
            title: 'Modern Living',
            subtitle: 'Transform your space with',
            highlight: 'Statement Plants',
            discount: 'Up to 40% Off',
            color: '#fff',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?auto=format&fit=crop&w=1920&q=80', // Cosy Indoor Plants
            title: 'Blooming Joy',
            subtitle: 'Add colors to life with',
            highlight: 'Premium Flowers',
            discount: 'Best Sellers',
            color: '#fff',
            bgType: 'plain'
        },
        {
            image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1920&q=80', // Sustainable pots/tools
            title: 'Sustainable Care',
            subtitle: 'Eco-friendly essentials &',
            highlight: 'Handcrafted Pots',
            discount: 'New Arrivals',
            color: '#fff',
            bgType: 'plain'
        }
    ];

    currentIndex = 0;
    intervalId: any;

    ngOnInit() {
        this.startAutoPlay();
    }

    ngOnDestroy() {
        this.stopAutoPlay();
    }

    startAutoPlay() {
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    stopAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    }

    goToSlide(index: number) {
        this.currentIndex = index;
        this.stopAutoPlay();
        this.startAutoPlay(); // Restart timer
    }
}
