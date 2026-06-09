import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { CartItem, Product } from '../models';
import * as CartActions from '../store/cart/cart.actions';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartKey = 'cart_items';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.loadCart());
  cart$ = this.cartSubject.asObservable();

  constructor(private store: Store) {}

  get cartItems(): CartItem[] { return this.cartSubject.value; }
  get itemCount(): number { return this.cartItems.reduce((sum, i) => sum + i.quantity, 0); }
  get subtotal(): number { return this.cartItems.reduce((sum, i) => sum + (i.product.price * i.quantity), 0); }

  private loadCart(): CartItem[] {
    try {
      const data = localStorage.getItem(this.cartKey);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  private saveCart(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartSubject.next(items);
    this.store.dispatch(CartActions.setCart({ items }));
  }

  addToCart(product: Product, quantity = 1): void {
    const items = [...this.cartItems];
    const existing = items.find(i => i.product._id === product._id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stock);
    } else {
      items.push({ product, quantity });
    }
    this.saveCart(items);
  }

  updateQuantity(productId: string, quantity: number): void {
    const items = this.cartItems.map(i =>
      i.product._id === productId ? { ...i, quantity: Math.max(1, quantity) } : i
    );
    this.saveCart(items);
  }

  removeFromCart(productId: string): void {
    this.saveCart(this.cartItems.filter(i => i.product._id !== productId));
  }

  clearCart(): void { this.saveCart([]); }

  isInCart(productId: string): boolean {
    return this.cartItems.some(i => i.product._id === productId);
  }

  getQuantity(productId: string): number {
    return this.cartItems.find(i => i.product._id === productId)?.quantity || 0;
  }

  getPriceSummary(couponDiscount = 0) {
    const subtotal = this.subtotal;
    const tax = subtotal * 0.05;
    const delivery = subtotal > 500 ? 0 : 30;
    const total = subtotal + tax + delivery - couponDiscount;
    return { subtotal, tax, delivery, couponDiscount, total };
  }
}
