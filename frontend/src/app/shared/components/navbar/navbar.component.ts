import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { SearchService, AppConfigService } from '../../../core/services/services';
import { User } from '../../../core/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  appConfig: any = {};
  currentUser: User | null = null;
  cartCount = 0;
  searchQuery = '';
  searchResults: any[] = [];
  showSearchDropdown = false;
  showUserMenu = false;
  showMobileMenu = false;
  isScrolled = false;

  constructor(
    public auth: AuthService,
    private cart: CartService,
    private search: SearchService,
    private router: Router,
    private configService: AppConfigService
  ) {}

  ngOnInit(): void {
    this.appConfig = this.configService.getConfig() || {};

    this.auth.currentUser$.pipe(takeUntil(this.destroy$))
      .subscribe(user => this.currentUser = user);

    this.cart.cart$.pipe(takeUntil(this.destroy$))
      .subscribe(() => this.cartCount = this.cart.itemCount);

    this.search.searchResults$.pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.searchResults = res?.data?.products || [];
        this.showSearchDropdown = this.searchQuery.length > 0;
      });
  }

  @HostListener('window:scroll')
  onScroll(): void { this.isScrolled = window.scrollY > 20; }

  onSearch(query: string): void {
    this.searchQuery = query;
    if (query.trim()) {
      this.search.typeSearch(query);
    } else {
      this.searchResults = [];
      this.showSearchDropdown = false;
    }
  }

  goToSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], { queryParams: { search: this.searchQuery } });
      this.showSearchDropdown = false;
    }
  }

  goToProduct(id: string): void {
    this.router.navigate(['/products', id]);
    this.showSearchDropdown = false;
    this.searchQuery = '';
  }

  toggleUserMenu(): void { this.showUserMenu = !this.showUserMenu; }
  toggleMobileMenu(): void { this.showMobileMenu = !this.showMobileMenu; }
  closeDropdowns(): void { this.showUserMenu = false; this.showSearchDropdown = false; }

  logout(): void { this.auth.logout(); this.showUserMenu = false; }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }
}
