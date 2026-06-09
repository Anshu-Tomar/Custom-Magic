import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  products: Product[] = [];
  categories: string[] = [];
  loading = true;
  total = 0;
  page = 1;
  pages = 1;
  limit = 12;

  filters = {
    search: '',
    category: '',
    sort: '-createdAt',
    minPrice: '',
    maxPrice: '',
    flashDeal: ''
  };

  sortOptions = [
    { label: 'Latest', value: '-createdAt' },
    { label: 'Price: Low to High', value: 'price' },
    { label: 'Price: High to Low', value: '-price' },
    { label: 'Rating', value: '-rating' },
    { label: 'Popularity', value: '-reviewCount' }
  ];

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.filters.search = params['search'] || '';
      this.filters.category = params['category'] || '';
      this.filters.flashDeal = params['flashDeal'] || '';
      this.page = 1;
      this.loadProducts();
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe({
      next: (res: any) => this.categories = res.data?.categories || []
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productService.getProducts({ ...this.filters, page: this.page, limit: this.limit }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: any) => {
        this.products = res.data?.products || [];
        this.total = res.data?.total || 0;
        this.pages = res.data?.pages || 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilter(): void { this.page = 1; this.loadProducts(); }

  changePage(p: number): void {
    if (p < 1 || p > this.pages) return;
    this.page = p;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.filters = { search: '', category: '', sort: '-createdAt', minPrice: '', maxPrice: '', flashDeal: '' };
    this.page = 1;
    this.loadProducts();
  }

  get pageNumbers(): number[] {
    return Array.from({ length: Math.min(this.pages, 5) }, (_, i) => {
      const start = Math.max(1, this.page - 2);
      return start + i;
    }).filter(p => p <= this.pages);
  }

  get skeletonArray() { return Array(12).fill(0); }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
