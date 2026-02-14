import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PlantsApiService } from '../../services/plants.api';
import { SearchService } from '../../services/search.service';
import { NotificationService } from '../../services/notification.service';
import { SocketService } from '../../services/socket.service';

type PlantCategory =
  | 'Indoor Plant'
  | 'Outdoor Plant'
  | 'Flowering Plant'
  | 'Trending Plant';

interface Plant {
  id: number;
  name: string;
  category: PlantCategory;
  description: string;
  price: number;
  discountPrice: number;
  image: string;
}

@Component({
  selector: 'app-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './types.html',
  styleUrls: ['./types.css']
})
export class TypesComponent implements OnInit, OnDestroy {
  searchQuery = '';
  categories: PlantCategory[] = [
    'Indoor Plant',
    'Outdoor Plant',
    'Flowering Plant',
    'Trending Plant'
  ];

  // carousel state
  visibleCount = 4; // show 4 at a time
  itemsPerCategory = 10; // Config: Exactly 10 items per category as requested
  offsets: Record<PlantCategory, number> = {
    'Indoor Plant': 0,
    'Outdoor Plant': 0,
    'Flowering Plant': 0,
    'Trending Plant': 0
  };

  private imagePool: string[] = [
    'assets/bg1.jpg',
    'assets/bg2.avif',
    'assets/bg3.jpg',
    'assets/bg4.jpg'
  ];

  plants: any[] = [];
  isLoading = true;
  refreshInterval: any;


  constructor(
    private route: ActivatedRoute,
    private cart: CartService,
    private plantsApi: PlantsApiService,
    private searchService: SearchService,
    private router: Router,
    private notif: NotificationService,
    private socketService: SocketService
  ) {
    this.route.queryParams.subscribe((params) => {
      const q = (params['q'] || '').toString();
      if (q) {
        this.searchQuery = q;
        this.searchService.setQuery(q);
      }
      this.categories.forEach((c) => (this.offsets[c] = 0));
    });
  }

  // Grouped logic: sorts by createdAt desc (if available) or falls back to server order
  get groupedPlants(): Record<PlantCategory, any[]> {
    return this.categories.reduce((acc, category) => {
      // 1. Filter by category (Loose matching)
      const keyword = category.split(' ')[0].toLowerCase(); // "indoor", "outdoor", "flowering", "trending"

      let list = this.plants.filter((p) => {
        if (!p.category) return false;
        const pCat = p.category.toLowerCase();
        return pCat.includes(keyword);
      });

      // 2. Client-side sort (safety check) - Newest first
      list.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Descending
      });

      // 3. Filter by search query
      if (this.searchQuery.trim()) {
        const q = this.searchQuery.trim().toLowerCase();
        list = list.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q))
        );
      }

      acc[category] = list;
      return acc;
    }, {} as Record<PlantCategory, any[]>);
  }

  isNew(plant: any): boolean {
    if (!plant.createdAt) return false;
    const diff = Date.now() - new Date(plant.createdAt).getTime();
    return diff < 3 * 24 * 60 * 60 * 1000; // New if created in last 3 days
  }

  getRecentPlants(): any[] {
    const sorted = [...this.plants].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });
    return sorted.slice(0, 4);
  }

  getVisiblePlants(category: PlantCategory): any[] {
    const list = this.groupedPlants[category] ?? [];
    if (!list.length) return [];

    // Ensure offsets are within bounds
    if (this.offsets[category] >= list.length) {
      this.offsets[category] = 0;
    }

    const maxOffset = Math.max(0, list.length - this.visibleCount);
    // Double check offset isn't stuck too high
    const safeOffset = Math.min(this.offsets[category], maxOffset);

    return list.slice(safeOffset, safeOffset + this.visibleCount);
  }

  slide(category: PlantCategory, direction: 'prev' | 'next') {
    const list = this.groupedPlants[category] ?? [];
    if (!list.length) return;
    const len = list.length;

    // If we have fewer items than visible count, no need to slide, but we just reset
    if (len <= this.visibleCount) {
      this.offsets[category] = 0;
      return;
    }

    const current = this.offsets[category];
    const maxOffset = len - this.visibleCount;

    if (direction === 'next') {
      // No loop back to start
      if (current < maxOffset) {
        this.offsets[category] = current + 1;
      }
    } else {
      // No loop to end
      if (current > 0) {
        this.offsets[category] = current - 1;
      }
    }
  }

  ngOnInit(): void {
    this.loadRealPlants();

    // Subscribe to global search
    this.searchService.searchQuery$.subscribe(q => {
      this.searchQuery = q;
      this.categories.forEach(c => this.offsets[c] = 0);
    });

    // Listen for real-time updates
    this.socketService.listen('plants_updated').subscribe(() => {
      console.log('Real-time update received: Reloading plants...');
      this.loadRealPlants(true); // silent reload
    });
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  loadRealPlants(silent = false) {
    if (!silent) this.isLoading = true;
    this.plantsApi.list().subscribe({
      next: (data) => {
        if (!silent) {
          console.log('TypesComponent: Loaded plants:', data);
          // Verify categories (log once)
          this.categories.forEach(c => {
            const count = data.filter((p: any) => p.category === c).length;
            console.log(`Category ${c}: ${count} items`);
          });
        }
        this.plants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load plants', err);
        this.isLoading = false;
      }
    });
  }



  addToCart(plant: any) {
    if (!localStorage.getItem('greenie.loggedIn')) {
      this.notif.show('Please login to buy items!', 'info', 'modal');
      this.router.navigate(['/login']);
      return;
    }
    // Handle both _id and id (backend uses _id)
    this.cart.add(plant._id || plant.id);
    this.notif.show('Item added to your cart', 'success');
  }

  removeFromCart(plant: Plant) {
    this.cart.remove(plant.id);
  }

  inCartQty(plant: Plant) {
    return this.cart.quantity(plant.id);
  }

  deleteFromCart(plant: Plant) {
    this.cart.delete(plant.id);
  }
}
