import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../core/models';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/services';

@Component({
  selector: 'app-product-card',
  template: `
    <div class="product-card group relative" [routerLink]="['/products', product._id]">
      <!-- Flash Deal Badge -->
      <div *ngIf="product.isFlashDeal"
           class="absolute top-3 left-3 z-10 badge-neon text-xs">
        ⚡ Flash
      </div>

      <!-- Discount Badge -->
      <div *ngIf="product.discountPercent && product.discountPercent > 0"
           class="absolute top-3 right-3 z-10 bg-green-500/90 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
        {{ product.discountPercent }}% OFF
      </div>

      <!-- Image -->
      <div class="relative overflow-hidden bg-white/3 h-40">
        <img [src]="product.thumbnail || 'assets/images/placeholder.svg'"
             [alt]="product.name"
             class="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
             loading="lazy"
             (error)="onImgError($event)">
        <!-- Out of Stock Overlay -->
        <div *ngIf="product.stock === 0"
             class="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span class="text-sm font-semibold text-red-400">Out of Stock</span>
        </div>
      </div>

      <!-- Info -->
      <div class="p-3">
        <div class="text-xs text-gray-500 mb-1 font-mono">{{ product.deliveryTime }}</div>
        <h3 class="text-sm font-semibold text-white line-clamp-2 leading-tight mb-1 group-hover:text-neon-green transition-colors">
          {{ product.name }}
        </h3>
        <div class="text-xs text-gray-500 mb-2">{{ product.unit }}</div>

        <!-- Rating -->
        <div class="flex items-center gap-1 mb-3">
          <span class="text-yellow-400 text-xs">★</span>
          <span class="text-xs text-gray-400">{{ product.rating | number:'1.1-1' }}</span>
          <span class="text-xs text-gray-600">({{ product.reviewCount }})</span>
        </div>

        <!-- Price + Cart -->
        <div class="flex items-center justify-between">
          <div>
            <span class="text-base font-bold text-white">₹{{ product.price }}</span>
            <span *ngIf="product.originalPrice && product.originalPrice > product.price"
                  class="text-xs text-gray-500 line-through ml-1.5">₹{{ product.originalPrice }}</span>
          </div>

          <button *ngIf="!isInCart && product.stock > 0"
                  (click)="addToCart($event)"
                  class="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 border border-neon-green/30 hover:bg-neon-green hover:text-black text-neon-green font-bold text-lg">
            +
          </button>

          <!-- Quantity Controls -->
          <div *ngIf="isInCart && product.stock > 0"
               class="flex items-center gap-1" (click)="$event.stopPropagation()">
            <button (click)="decrement()" class="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-green/20 text-white flex items-center justify-center text-sm font-bold transition-colors">−</button>
            <span class="w-6 text-center text-sm font-bold text-neon-green">{{ quantity }}</span>
            <button (click)="increment()" class="w-7 h-7 rounded-lg bg-white/5 hover:bg-neon-green/20 text-white flex items-center justify-center text-sm font-bold transition-colors">+</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductCardComponent {
  @Input() product!: Product;

  constructor(private cart: CartService, private toast: ToastService) {}

  get isInCart(): boolean { return this.cart.isInCart(this.product._id); }
  get quantity(): number { return this.cart.getQuantity(this.product._id); }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = 'assets/images/placeholder.svg';
  }

  addToCart(e: Event): void {
    e.preventDefault(); e.stopPropagation();
    this.cart.addToCart(this.product);
    this.toast.success(`${this.product.name} added to cart! 🛒`);
  }

  increment(): void {
    if (this.quantity < this.product.stock) {
      this.cart.updateQuantity(this.product._id, this.quantity + 1);
    }
  }

  decrement(): void {
    if (this.quantity > 1) {
      this.cart.updateQuantity(this.product._id, this.quantity - 1);
    } else {
      this.cart.removeFromCart(this.product._id);
    }
  }
}
