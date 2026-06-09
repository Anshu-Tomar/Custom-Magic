import { Component, OnInit } from '@angular/core';
import { AdminService, ToastService } from '../../../core/services/services';

@Component({
  selector: 'app-admin-orders',
  template: `
    <div class="animate-slide-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="font-display font-black text-3xl text-white">Orders 🚚</h1>
        <select [(ngModel)]="statusFilter" (change)="load()" class="input-genz w-auto text-sm">
          <option value="">All Status</option>
          <option *ngFor="let s of statuses" [value]="s.value">{{ s.label }}</option>
        </select>
      </div>

      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-white/5">
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Order</th>
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="text-right px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Amount</th>
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Date</th>
                <th class="text-right px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of orders" class="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td class="px-5 py-4">
                  <div class="font-mono text-xs text-neon-cyan">{{ order.orderNumber }}</div>
                  <div class="text-xs text-gray-500">{{ order.items?.length }} items</div>
                </td>
                <td class="px-5 py-4">
                  <div class="text-white text-sm">{{ order.user?.name }}</div>
                  <div class="text-xs text-gray-500">{{ order.user?.email }}</div>
                </td>
                <td class="px-5 py-4 text-right font-bold text-white">₹{{ order.total | number:'1.0-0' }}</td>
                <td class="px-5 py-4">
                  <span class="text-xs px-2 py-1 rounded-full font-semibold"
                        [class.text-green-400]="order.status==='delivered'"
                        [class.text-red-400]="order.status==='cancelled'"
                        [class.text-yellow-400]="order.status==='packed'||order.status==='out_for_delivery'"
                        [class.text-blue-400]="order.status==='placed'||order.status==='confirmed'"
                        [class.text-purple-400]="order.status==='shipped'">
                    {{ order.status | titlecase }}
                  </span>
                </td>
                <td class="px-5 py-4 text-xs text-gray-400">{{ order.createdAt | date:'dd MMM, HH:mm' }}</td>
                <td class="px-5 py-4 text-right">
                  <select (change)="updateStatus(order._id, $event.target.value)"
                          [value]="order.status"
                          class="text-xs bg-white/5 border border-white/10 text-gray-300 rounded-lg px-2 py-1.5 cursor-pointer hover:border-neon-cyan/30 transition-colors">
                    <option *ngFor="let s of statuses" [value]="s.value">{{ s.label }}</option>
                  </select>
                </td>
              </tr>
              <tr *ngIf="!loading && orders.length === 0">
                <td colspan="6" class="px-5 py-12 text-center text-gray-500">No orders found</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="pages > 1" class="flex justify-center gap-2 p-4 border-t border-white/5">
          <button (click)="changePage(page-1)" [disabled]="page===1" class="px-4 py-2 rounded-xl glass-card text-sm disabled:opacity-30">← Prev</button>
          <span class="px-4 py-2 text-sm text-gray-400">{{ page }} / {{ pages }}</span>
          <button (click)="changePage(page+1)" [disabled]="page===pages" class="px-4 py-2 rounded-xl glass-card text-sm disabled:opacity-30">Next →</button>
        </div>
      </div>
    </div>
  `
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  loading = true;
  statusFilter = '';
  page = 1;
  pages = 1;

  statuses = [
    { value: 'placed', label: 'Placed' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  constructor(private admin: AdminService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.admin.getOrders(this.page, this.statusFilter).subscribe({
      next: (res: any) => {
        this.orders = res.data?.orders || [];
        this.pages = res.data?.pages || 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  updateStatus(id: string, status: string): void {
    this.admin.updateOrderStatus(id, status).subscribe({
      next: () => { this.toast.success('Order status updated'); this.load(); },
      error: () => this.toast.error('Failed to update')
    });
  }

  changePage(p: number): void { this.page = p; this.load(); }
}
