import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CareTipsApiService, CareTip } from '../../services/care-tips.api';
import { SearchService } from '../../services/search.service';
import { NotificationService } from '../../services/notification.service';

type CareCategory =
  | 'Watering'
  | 'Fertilizing'
  | 'Pruning'
  | 'Pest Control';

@Component({
  selector: 'app-care',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './care.html',
  styleUrls: ['./care.css']
})
export class CareComponent implements OnInit, OnDestroy {
  searchQuery = '';
  categories: CareCategory[] = [
    'Watering',
    'Fertilizing',
    'Pruning',
    'Pest Control'
  ];

  occasions = [
    {
      title: 'Birthday',
      details: 'Celebrate special moments with vibrant greens.',
      moreDetails: 'Birthdays are the perfect time to gift a life that grows. Our birthday collection includes air-purifying plants that symbolize health and prosperity. Whether it is a colorful Anthurium or a sleek Snake Plant, a living gift is far more memorable than flowers that fade.',
      image: 'assets/fnp_birthday_1769085231983.png',
      span: 'span-6'
    },
    {
      title: 'Good Luck',
      details: 'Bring prosperity and positive energy to any space.',
      moreDetails: 'Invite positive vibes with our Good Luck collection. Featuring the classic Lucky Bamboo and Money Plants, these selections are curated based on Feng Shui and Vastu principles to bring financial growth and harmony to your home or office.',
      image: 'assets/fnp_goodluck_1769085250193.png',
      span: 'span-3'
    },
    {
      title: 'Get Well Soon',
      details: 'Send healing vibes with air-purifying plants.',
      moreDetails: 'Plants have a natural calming effect that aids recovery. Our Get Well Soon range features low-maintenance, high-oxygenating plants like Peace Lilies and Aloe Vera, designed to brighten up hospital rooms or homes while purifying the air.',
      image: 'assets/fnp_getwell_1769085266819.png',
      span: 'span-3'
    },
    {
      title: 'Housewarming',
      details: 'Add warmth and life to a brand new home.',
      moreDetails: 'A new home needs a touch of green to feel complete. Gift a majestic Fiddle Leaf Fig or a lush Monstera to help your friends turn their new house into a home. These statement plants add instant character and warmth to any interior.',
      image: 'assets/fnp_housewarming_1769085290474.png',
      span: 'span-3'
    },
    {
      title: 'Congratulations',
      details: 'A perfect way to applaud their achievements.',
      moreDetails: 'Success deserves a grand gesture. Celebrate promotions, graduations, or new milestones with our Congratulations collection. These elegant plants serve as a lasting reminder of their hard work and remarkable achievements.',
      image: 'assets/fnp_congratulations_1769085306146.png',
      span: 'span-3'
    },
    {
      title: 'Anniversary',
      details: 'Evergreen gifts for a love that keeps growing.',
      moreDetails: 'Like a strong relationship, plants require care, patience, and love to thrive. Gift an evergreen bonsai or a pair of elegant succulents to symbolize a love that grows deeper with every passing year. A truly romantic and sustainable choice.',
      image: 'assets/anniversary_premium_wide_1769084933477.png',
      span: 'span-6'
    }
  ];

  // carousel state
  visibleCount = 4; // show 4 at a time
  itemsPerCategory = 10; // Config: Exactly 10 items per category as requested
  offsets: Record<CareCategory, number> = {
    'Watering': 0,
    'Fertilizing': 0,
    'Pruning': 0,
    'Pest Control': 0
  };

  private imagePool: string[] = [
    'assets/bg1.jpg',
    'assets/bg2.avif',
    'assets/bg3.jpg',
    'assets/bg4.jpg'
  ];

  isLoading = true;
  selectedOccasion: any = null;
  showOccasionModal = false;

  careProducts: CareTip[] = [];
  selectedProduct: any = null;
  showProductModal = false;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService,
    private cartService: CartService,
    private careApi: CareTipsApiService,
    private router: Router,
    private notif: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.careApi.list().subscribe({
      next: (data) => {
        this.careProducts = data;
        this.isLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void { }

  viewProduct(product: any) {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  addToCart(product: any) {
    if (!localStorage.getItem('greenie.loggedIn')) {
      this.notif.show('You must be logged in to add items to the cart!', 'info', 'modal');
      this.router.navigate(['/login']);
      return;
    }

    if (product) {
      // Mock ID for cart
      this.cartService.add(product.title as any);
      this.notif.show('Item added to your cart', 'success');
      this.closeProductModal();
    }
  }

  openOccasionDetails(occasion: any) {
    this.selectedOccasion = occasion;
    this.showOccasionModal = true;
  }

  exploreCollection() {
    const query = this.selectedOccasion?.title || '';
    this.closeOccasionModal();
    this.router.navigate(['/types'], { queryParams: { q: query } });
  }

  closeOccasionModal() {
    this.showOccasionModal = false;
    this.selectedOccasion = null;
  }
}