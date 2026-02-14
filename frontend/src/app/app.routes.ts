import { Routes } from '@angular/router';
import { ProductListingComponent } from './product-listing/product-listing';
import { HomeComponent } from './home/home';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'products/:category', component: ProductListingComponent },
    { path: 'product/:id', loadComponent: () => import('./product-detail/product-detail').then(m => m.ProductDetailComponent) }
];
