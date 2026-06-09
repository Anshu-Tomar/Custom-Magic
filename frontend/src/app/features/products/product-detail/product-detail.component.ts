import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/services';
import { Product } from '../../../core/models';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  selectedImage = 0;
  relatedProducts: Product[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    public cart: CartService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loading = true;
      this.productService.getProduct(params['id']).subscribe({
        next: (res: any) => {
          this.product = res.data?.product;
          this.loading = false;
          if (this.product) this.loadRelated(this.product.category);
        },
        error: () => this.loading = false
      });
    });
  }

  loadRelated(category: string): void {
    this.productService.getProducts({ category, limit: 4 }).subscribe({
      next: (res: any) => {
        this.relatedProducts = (res.data?.products || []).filter((p: Product) => p._id !== this.product?._id).slice(0, 4);
      }
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cart.addToCart(this.product);
    this.toast.success(`${this.product.name} added to cart! 🛒`);
  }

  increment(): void {
    if (this.product && this.cart.getQuantity(this.product._id) < this.product.stock) {
      this.cart.updateQuantity(this.product._id, this.cart.getQuantity(this.product._id) + 1);
    }
  }

  decrement(): void {
    if (this.product) {
      const qty = this.cart.getQuantity(this.product._id);
      if (qty > 1) this.cart.updateQuantity(this.product._id, qty - 1);
      else this.cart.removeFromCart(this.product._id);
    }
  }

  get isInCart(): boolean { return this.product ? this.cart.isInCart(this.product._id) : false; }
  get quantity(): number { return this.product ? this.cart.getQuantity(this.product._id) : 0; }
}
