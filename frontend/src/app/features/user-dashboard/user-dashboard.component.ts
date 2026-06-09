import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 page-enter">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar -->
        <aside class="lg:col-span-1">
          <div class="glass-card rounded-2xl p-5 sticky top-24">
            <!-- Avatar -->
            <div class="flex flex-col items-center text-center mb-6 pb-6 border-b border-white/10">
              <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-3xl font-bold text-black mb-3">
                {{ auth.currentUser?.name?.charAt(0).toUpperCase() }}
              </div>
              <div class="font-display font-bold text-white">{{ auth.currentUser?.name }}</div>
              <div class="text-xs text-gray-500 mt-1 truncate max-w-full">{{ auth.currentUser?.email }}</div>
              <span class="badge-neon mt-2">{{ auth.currentUser?.role }}</span>
            </div>

            <!-- Nav -->
            <nav class="space-y-1">
              <a *ngFor="let link of navLinks"
                 [routerLink]="link.path"
                 routerLinkActive="bg-neon-green/10 text-neon-green border border-neon-green/20"
                 class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all">
                <span class="text-base">{{ link.icon }}</span>
                {{ link.label }}
              </a>
              <button (click)="auth.logout()"
                      class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left">
                <span>🚪</span> Logout
              </button>
            </nav>
          </div>
        </aside>

        <!-- Content -->
        <main class="lg:col-span-3">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `
})
export class UserDashboardComponent {
  navLinks = [
    { path: '/user/dashboard', icon: '👤', label: 'Profile' },
    { path: '/user/orders', icon: '📦', label: 'My Orders' },
    { path: '/user/search-history', icon: '🔍', label: 'Search History' },
  ];
  constructor(public auth: AuthService) {}
}
