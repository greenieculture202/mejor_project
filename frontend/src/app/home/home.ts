import { Component } from '@angular/core';
import { HeroSliderComponent } from '../hero-slider/hero-slider';
import { ProductTabsComponent } from '../product-tabs/product-tabs';

@Component({
    selector: 'app-home',
    imports: [HeroSliderComponent, ProductTabsComponent],
    templateUrl: './home.html',
    styleUrl: './home.css'
})
export class HomeComponent { }
