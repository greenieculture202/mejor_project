import { Component, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';



@Component({
    selector: 'app-product-tabs',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-tabs.html',
    styleUrl: './product-tabs.css'
})
export class ProductTabsComponent implements AfterViewInit {
    @ViewChild('sliderRef') sliderRef!: ElementRef;

    productService = inject(ProductService);

    tabs = ['Bestsellers', 'New Arrivals', 'Indoor Plants', 'Outdoor Plants', 'Money Plants', 'Air Purifying'];
    activeTab = 'Bestsellers';
    showArrows = true;

    products: Product[] = [];

    constructor() {
        this.loadProducts();
    }

    get currentProducts() {
        return this.products;
    }

    ngAfterViewInit() {
        // Initialize scroll position
    }

    loadProducts() {
        // user requested 10 items in the slider
        this.products = this.productService.getProducts(this.activeTab).slice(0, 10);
    }

    setActiveTab(tab: string) {
        this.activeTab = tab;
        this.loadProducts();

        // Reset scroll when changing tab
        if (this.sliderRef) {
            this.sliderRef.nativeElement.scrollLeft = 0;
        }
    }

    scrollLeft() {
        if (this.sliderRef) {
            this.sliderRef.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
        }
    }

    scrollRight() {
        if (this.sliderRef) {
            this.sliderRef.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }

    getSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
