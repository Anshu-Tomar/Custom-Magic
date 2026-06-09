import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CouponService, ToastService } from '../../core/services/services';
import { AuthService } from '../../core/services/auth.service';
import { CartItem } from '../../core/models';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  couponCode = '';
  couponDiscount = 0;
  couponLoading = false;
  appliedCoupon = '';

  constructor(
    public cart: CartService,
    private couponService: CouponService,
    private toast: ToastService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cart.cart$.subscribe(items => this.cartItems = items);
  }

  get summary() { return this.cart.getPriceSummary(this.couponDiscount); }

  updateQty(productId: string, qty: number): void {
    this.cart.updateQuantity(productId, qty);
  }

  remove(productId: string, name: string): void {
    this.cart.removeFromCart(productId);
    this.toast.info(`${name} removed from cart`);
  }

  applyCoupon(): void {
    if (!this.couponCode.trim()) return;
    this.couponLoading = true;
    this.couponService.validate(this.couponCode, this.cart.subtotal).subscribe({
      next: (res: any) => {
        this.couponDiscount = res.data?.discount || 0;
        this.appliedCoupon = this.couponCode.toUpperCase();
        this.toast.success(`Coupon applied! You save ₹${this.couponDiscount}`);
        this.couponLoading = false;
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Invalid coupon');
        this.couponLoading = false;
      }
    });
  }

  removeCoupon(): void {
    this.couponDiscount = 0;
    this.appliedCoupon = '';
    this.couponCode = '';
    this.toast.info('Coupon removed');
  }

  checkout(): void {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.router.navigate(['/checkout'], {
      state: { couponCode: this.appliedCoupon, couponDiscount: this.couponDiscount }
    });
  }
}

  const trackByProduct = (_: number, item: CartItem) => item.product._id;
