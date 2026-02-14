import { Component, inject } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-product-listing',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './product-listing.html',
    styleUrl: './product-listing.css'
})
export class ProductListingComponent {
    private route = inject(ActivatedRoute);
    private productService = inject(ProductService);

    category: string = '';
    displayCategory: string = '';
    products: Product[] = [];

    constructor() {
        const viewportScroller = inject(ViewportScroller);
        this.route.paramMap.subscribe(params => {
            this.category = params.get('category') || 'Bestsellers';
            // Decode URL parameter if necessary, or map slug to display name
            this.displayCategory = decodeURIComponent(this.category);
            this.loadProducts();
            viewportScroller.scrollToPosition([0, 0]);
        });
    }

    loadProducts() {
        this.products = this.productService.getProducts(this.displayCategory);
        // If no products found (bad URL), maybe redirect or show empty
        if (this.products.length === 0) {
            this.displayCategory = 'Product Not Found';
        }
    }

    getSlug(name: string): string {
        return this.productService.createSlug(name);
    }
}
