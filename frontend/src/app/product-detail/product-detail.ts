
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../services/product.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './product-detail.html',
    styleUrl: './product-detail.css'
})
export class ProductDetailComponent {
    product: Product | undefined;
    route = inject(ActivatedRoute);
    productService = inject(ProductService);
    activeImageIndex = 0;

    constructor() {
        this.route.params.subscribe(params => {
            const slug = params['id'];
            if (slug) {
                this.product = this.productService.getProductBySlug(slug);
            }
        });
    }

    get thumbnails(): string[] {
        if (!this.product) return [];
        // If we only have 1 image, duplicate for UI or mock it
        const images = [this.product.image];
        if (this.product.hoverImage) images.push(this.product.hoverImage);
        // Fill up to 5 so UI matches request
        while (images.length < 5) {
            // Just repeat image 0 and 1
            images.push(this.product.image);
        }
        return images;
    }

    setActiveImage(index: number) {
        this.activeImageIndex = index;
    }
}
