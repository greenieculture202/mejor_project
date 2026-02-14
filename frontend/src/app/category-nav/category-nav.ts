import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-category-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './category-nav.html',
    styleUrl: './category-nav.css'
})
export class CategoryNavComponent {
    categories = [
        'Valentine\'s', 'Birthday', 'Occasions', 'Anniversary', 'Flowers',
        'Cakes', 'Personalised', 'Plants', 'Balloon Decor', 'Chocolates',
        'Luxe', 'Hampers', 'Lifestyle', 'International'
    ];

    // Specific data for the Plants Mega Menu to match the image
    plantsMenu = {
        eliteGreens: [
            'Lush Ferns Galore', 'All Plants', 'Best Sellers', 'Same Day Delivery',
            { name: 'Luxe Plants', badge: 'New' }, 'New Arrivals', 'Premium Plants',
            'Air Purifying Plants', 'Plants for Her', 'Plants for Him',
            { name: 'Kokedama Plants', badge: 'New' }, 'Plants Offers',
            'Garden Accessories', 'Terrariums Plants', 'Personalised Plants'
        ],
        perfectPlacements: ['Indoor Plants', 'Desktop Plants'],
        forCelebrations: ['Valentine\'s', 'Birthday', 'Anniversary', 'House Warming', 'Good Luck'],
        plantsCollection: [
            'Money Plants', 'Snake Plants', 'Jade Plants', 'Plants DIY Kits',
            'Lucky Bamboo', 'Palm Plants', 'Bonsai Plants', 'Ficus Plants',
            'Spider Plants', 'Exotic Plants', 'Aglaonema Plants', 'Flowering Plants',
            'Cactus n Succulent Plants', 'Low Maintenance Plants'
        ],
        plantersStyle: [
            'Ceramic Planters', 'Metal Planters', 'Glass Planters', 'Mugs Planters',
            'Planter Pots', 'Cake n Plants', 'Plants Combos', 'Flowers n Plants'
        ],
        sendPlantsTo: [
            'Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Hyderabad',
            'Kolkata', 'Chennai', 'Lucknow', 'Ahmedabad', 'All Other Cities'
        ]
    };

    activeCategory: string | null = null;

    showMenu(category: string) {
        this.activeCategory = category;
    }

    hideMenu() {
        this.activeCategory = null;
    }

    isComplexItem(item: any): boolean {
        return typeof item === 'object' && item !== null && 'name' in item;
    }
}
