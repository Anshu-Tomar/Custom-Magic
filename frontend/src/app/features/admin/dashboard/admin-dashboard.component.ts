import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/services';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="animate-slide-in">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-display font-black text-3xl text-white">Dashboard 📊</h1>
          <p class="text-gray-500 text-sm mt-1">Welcome back, Admin</p>
        </div>
        <div class="badge-neon text-sm">{{ today | date:'EEE, dd MMM' }}</div>
      </div>

      <!-- Stats Grid -->
      <div *ngIf="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div *ngFor="let s of [1,2,3,4]" class="skeleton h-28 rounded-2xl"></div>
      </div>

      <div *ngIf="!loading && stats" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div *ngFor="let card of statCards"
             class="glass-card rounded-2xl p-5 border-white/5 hover:border-opacity-20 transition-all group"
             [style.borderColor]="card.color + '33'">
          <div class="flex items-start justify-between mb-4">
            <div class="text-3xl">{{ card.icon }}</div>
            <div class="w-8 h-8 rounded-xl flex items-center justify-center text-xs"
                 [style.background]="card.color + '20'" [style.color]="card.color">↑</div>
          </div>
          <div class="font-display font-black text-2xl text-white mb-1">{{ card.value }}</div>
          <div class="text-xs text-gray-500">{{ card.label }}</div>
        </div>
      </div>

      <!-- Orders by Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="glass-card rounded-2xl p-5">
          <h3 class="font-display font-semibold text-white mb-5">Order Status Breakdown</h3>
          <div *ngIf="!loading && stats?.ordersByStatus" class="space-y-3">
            <div *ngFor="let s of stats!.ordersByStatus" class="flex items-center gap-3">
              <div class="text-xs text-gray-400 w-28 capitalize">{{ s._id.replace('_',' ') }}</div>
              <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                     [style.width.%]="(s.count / totalOrders) * 100"
                     [style.background]="getStatusColor(s._id)"></div>
              </div>
              <div class="text-xs text-white font-bold w-6 text-right">{{ s.count }}</div>
            </div>
          </div>
        </div>

        <!-- Top Products -->
        <div class="glass-card rounded-2xl p-5">
          <h3 class="font-display font-semibold text-white mb-5">Top Selling Products</h3>
          <div *ngIf="!loading && stats?.topProducts" class="space-y-3">
            <div *ngFor="let p of stats!.topProducts; let i = index"
                 class="flex items-center gap-3 p-3 rounded-xl bg-white/3">
              <div class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                   [class.bg-yellow-500]="i === 0" [class.bg-gray-400]="i === 1"
                   [class.bg-orange-500]="i === 2" [class.bg-white]="i > 2"
                   [class.bg-opacity-20]="i > 2" [class.text-white]="true">
                {{ i + 1 }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-white truncate">{{ p.name }}</div>
                <div class="text-xs text-gray-500">{{ p.totalSold }} sold</div>
              </div>
              <div class="text-sm font-bold text-neon-green">₹{{ p.revenue | number:'1.0-0' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity (last 7 days) -->
      <div class="glass-card rounded-2xl p-5">
        <h3 class="font-display font-semibold text-white mb-5">Last 7 Days Activity</h3>
        <div *ngIf="!loading && stats?.last7Days?.length === 0" class="text-center text-gray-500 py-8">No data yet</div>
        <div class="space-y-2">
          <div *ngFor="let day of stats?.last7Days"
               class="flex items-center gap-4 p-3 rounded-xl bg-white/3">
            <div class="text-xs text-gray-400 w-24">{{ day._id | date:'dd MMM' }}</div>
            <div class="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-neon-green to-neon-cyan rounded-full"
                   [style.width.%]="(day.count / maxDayCount) * 100"></div>
            </div>
            <div class="text-xs text-white">{{ day.count }} orders</div>
            <div class="text-xs text-neon-green w-20 text-right">₹{{ day.revenue | number:'1.0-0' }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;
  today = new Date();

  get statCards() {
    if (!this.stats) return [];
    return [
      { icon: '👥', label: 'Total Users', value: this.stats.totalUsers.toLocaleString(), color: '#00FFFF' },
      { icon: '📦', label: 'Total Products', value: this.stats.totalProducts.toLocaleString(), color: '#39FF14' },
      { icon: '🚚', label: 'Total Orders', value: this.stats.totalOrders.toLocaleString(), color: '#BF5FFF' },
      { icon: '💰', label: 'Total Revenue', value: '₹' + (this.stats.revenue / 1000).toFixed(1) + 'K', color: '#FF6EC7' }
    ];
  }

  get totalOrders() { return this.stats?.ordersByStatus?.reduce((s, o) => s + o.count, 0) || 1; }
  get maxDayCount() { return Math.max(...(this.stats?.last7Days?.map(d => d.count) || [1])); }

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (res: any) => { this.stats = res.data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getStatusColor(s: string): string {
    const map: any = { placed: '#60a5fa', confirmed: '#a78bfa', packed: '#fbbf24', shipped: '#34d399', out_for_delivery: '#fb923c', delivered: '#4ade80', cancelled: '#f87171' };
    return map[s] || '#6b7280';
  }
}
