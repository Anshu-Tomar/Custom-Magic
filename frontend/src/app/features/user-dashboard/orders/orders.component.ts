import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { ToastService } from '../../../core/services/services';
import { Order } from '../../../core/models';

@Component({
  selector: 'app-orders',
  template: `
    <div class="animate-slide-in">
      <h2 class="font-display font-bold text-2xl text-white mb-6">My Orders 📦</h2>

      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let s of [1,2,3]" class="glass-card rounded-2xl p-5 space-y-3">
          <div class="skeleton h-4 w-1/3 rounded"></div>
          <div class="skeleton h-3 w-1/2 rounded"></div>
          <div class="skeleton h-8 w-24 rounded-xl"></div>
        </div>
      </div>

      <div *ngIf="!loading && orders.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="font-display text-xl text-white mb-2">No orders yet</h3>
        <p class="text-gray-500 mb-6">Your order history will appear here</p>
        <a routerLink="/products" class="btn-neon px-6 py-3">Start Shopping →</a>
      </div>

      <div class="space-y-4">
        <div *ngFor="let order of orders" class="glass-card rounded-2xl overflow-hidden hover:border-white/15 transition-all">
          <!-- Order Header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-white/5">
            <div>
              <div class="font-mono text-sm text-neon-cyan">{{ order.orderNumber }}</div>
              <div class="text-xs text-gray-500 mt-0.5">{{ order.createdAt | date:'dd MMM yyyy, h:mm a' }}</div>
            </div>
            <div class="flex items-center gap-3">
              <span [ngClass]="getStatusClass(order.status)" class="text-xs px-3 py-1 rounded-full font-semibold">
                {{ getStatusLabel(order.status) }}
              </span>
              <span class="font-bold text-white">₹{{ order.total | number:'1.0-0' }}</span>
            </div>
          </div>

          <!-- Items preview -->
          <div class="p-5">
            <div class="flex items-center gap-3 mb-4">
              <div *ngFor="let item of order.items?.slice(0,3)" class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden">
                <img [src]="item.image" [alt]="item.name" class="w-full h-full object-contain p-1">
              </div>
              <div *ngIf="order.items?.length > 3" class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-sm text-gray-400">
                +{{ order.items.length - 3 }}
              </div>
              <div class="text-sm text-gray-400">
                {{ order.items?.length }} {{ order.items?.length === 1 ? 'item' : 'items' }}
              </div>
            </div>

            <!-- Progress bar for active orders -->
            <div *ngIf="!['delivered','cancelled'].includes(order.status)" class="mb-4">
              <div class="flex justify-between text-xs text-gray-500 mb-1">
                <span>Order Progress</span>
                <span>{{ getProgressPercent(order.status) }}%</span>
              </div>
              <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full transition-all duration-500"
                     [style.width.%]="getProgressPercent(order.status)"></div>
              </div>
            </div>

            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">{{ order.paymentMethod }} · {{ order.shippingAddress?.city }}</span>
              <div class="flex gap-2">
                <button *ngIf="['placed','confirmed'].includes(order.status)"
                        (click)="cancelOrder(order._id)"
                        class="text-xs text-red-400 hover:underline">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="pages > 1" class="flex justify-center gap-2 mt-6">
        <button (click)="changePage(page-1)" [disabled]="page===1" class="px-4 py-2 rounded-xl glass-card text-sm disabled:opacity-30">← Prev</button>
        <span class="px-4 py-2 text-sm text-gray-400">{{ page }} / {{ pages }}</span>
        <button (click)="changePage(page+1)" [disabled]="page===pages" class="px-4 py-2 rounded-xl glass-card text-sm disabled:opacity-30">Next →</button>
      </div>
    </div>
  `
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  page = 1;
  pages = 1;

  statusMap: any = {
    placed: { label: '🟡 Order Placed', class: 'status-placed', progress: 10 },
    confirmed: { label: '🔵 Confirmed', class: 'status-placed', progress: 25 },
    packed: { label: '📦 Packed', class: 'status-pending', progress: 45 },
    shipped: { label: '🚚 Shipped', class: 'status-shipped', progress: 65 },
    out_for_delivery: { label: '🛵 Out for Delivery', class: 'status-pending', progress: 85 },
    delivered: { label: '✅ Delivered', class: 'status-delivered', progress: 100 },
    cancelled: { label: '❌ Cancelled', class: 'status-cancelled', progress: 0 }
  };

  constructor(private orderService: OrderService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.orderService.getMyOrders(this.page).subscribe({
      next: (res: any) => {
        this.orders = res.data?.orders || [];
        this.pages = res.data?.pages || 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  cancelOrder(id: string): void {
    if (!confirm('Cancel this order?')) return;
    this.orderService.cancelOrder(id).subscribe({
      next: () => { this.toast.success('Order cancelled'); this.load(); },
      error: (err: any) => this.toast.error(err.error?.message || 'Cannot cancel')
    });
  }

  changePage(p: number): void { this.page = p; this.load(); }
  getStatusClass(s: string): string { return this.statusMap[s]?.class || 'status-pending'; }
  getStatusLabel(s: string): string { return this.statusMap[s]?.label || s; }
  getProgressPercent(s: string): number { return this.statusMap[s]?.progress || 0; }
}
