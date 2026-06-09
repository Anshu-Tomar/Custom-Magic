import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  categories: string[] = [];
  featuredProducts: Product[] = [];
  flashDeals: Product[] = [];
  activeCategory = 'All';
  loading = true;
  flashLoading = true;
  countdown = { hours: 0, minutes: 0, seconds: 0 };
  private timer: any;

  categoryIcons: { [key: string]: string } = {
    'Fruits & Veggies': '🥑', 'Dairy & Eggs': '🥛', 'Snacks': '🍿',
    'Beverages': '🥤', 'Personal Care': '🧴', 'Household': '🧹',
    'Meat & Fish': '🥩', 'Bakery': '🍞', 'All': '🛒'
  };

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadFeatured();
    this.loadFlashDeals();
    this.startCountdown();
  }

  loadCategories(): void {
    this.productService.getCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => this.categories = ['All', ...(res.data?.categories || [])]
    });
  }

  loadFeatured(): void {
    this.loading = true;
    this.productService.getFeatured().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => { this.featuredProducts = res.data?.products || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  loadFlashDeals(): void {
    this.flashLoading = true;
    this.productService.getFlashDeals().pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => { this.flashDeals = res.data?.products || []; this.flashLoading = false; },
      error: () => this.flashLoading = false
    });
  }

  filterByCategory(cat: string): void {
    this.activeCategory = cat;
    if (cat === 'All') {
      this.loadFeatured();
    } else {
      this.loading = true;
      this.productService.getProducts({ category: cat, limit: 8 }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: any) => { this.featuredProducts = res.data?.products || []; this.loading = false; },
        error: () => this.loading = false
      });
    }
  }

  getCategoryIcon(cat: string): string {
    return this.categoryIcons[cat] || '🛍️';
  }

  startCountdown(): void {
    const end = new Date();
    end.setHours(23, 59, 59, 0);
    this.timer = setInterval(() => {
      const now = new Date();
      const diff = end.getTime() - now.getTime();
      if (diff <= 0) { clearInterval(this.timer); return; }
      this.countdown = {
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      };
    }, 1000);
  }

  pad(n: number): string { return n.toString().padStart(2, '0'); }

  navigateToProducts(): void { this.router.navigate(['/products']); }

  get skeletonArray() { return Array(8).fill(0); }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.timer);
  }
}
