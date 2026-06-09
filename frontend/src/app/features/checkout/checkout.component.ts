import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/services';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  addressForm: FormGroup;
  paymentMethod = 'COD';
  loading = false;
  step = 1; // 1: address, 2: payment, 3: confirm
  couponCode = '';
  couponDiscount = 0;

  paymentOptions = [
    { id: 'COD', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
    { id: 'UPI', label: 'UPI / PhonePe / GPay', icon: '📱', desc: 'Instant payment via UPI' },
    { id: 'CARD', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' }
  ];

  constructor(
    private fb: FormBuilder,
    public cart: CartService,
    private orderService: OrderService,
    private toast: ToastService,
    public auth: AuthService,
    private router: Router
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as any;
    if (state) {
      this.couponCode = state.couponCode || '';
      this.couponDiscount = state.couponDiscount || 0;
    }

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      notes: ['']
    });
  }

  ngOnInit(): void {
    if (this.cart.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
    // Pre-fill from user's default address
    const user = this.auth.currentUser;
    const defaultAddr = user?.addresses?.find(a => a.isDefault);
    if (defaultAddr) {
      this.addressForm.patchValue(defaultAddr);
    }
  }

  get summary() { return this.cart.getPriceSummary(this.couponDiscount); }

  nextStep(): void {
    if (this.step === 1 && this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }
    this.step = Math.min(this.step + 1, 3);
  }

  placeOrder(): void {
    this.loading = true;
    const orderData = {
      items: this.cart.cartItems.map(i => ({ productId: i.product._id, quantity: i.quantity })),
      shippingAddress: this.addressForm.value,
      paymentMethod: this.paymentMethod,
      couponCode: this.couponCode,
      notes: this.addressForm.get('notes')?.value
    };

    this.orderService.createOrder(orderData).subscribe({
      next: (res: any) => {
        this.cart.clearCart();
        this.toast.success('Order placed successfully! 🎉');
        this.router.navigate(['/user/orders'], { queryParams: { new: res.data?.order?.orderNumber } });
      },
      error: (err: any) => {
        this.toast.error(err.error?.message || 'Failed to place order');
        this.loading = false;
      }
    });
  }
}
