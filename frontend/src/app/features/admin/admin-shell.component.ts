import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-shell',
  template: `
    <div class="flex min-h-screen bg-genz-darker">
      <!-- Sidebar -->
      <aside class="w-64 hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 bg-genz-dark border-r border-white/5">
        <!-- Logo -->
        <div class="p-6 border-b border-white/5">
          <div class="flex items-center gap-2">
            <span class="text-2xl">⚡</span>
            <div>
              <div class="font-display font-black text-base gradient-text">Custom Magic</div>
              <div class="text-xs text-neon-purple font-mono">Admin Panel</div>
            </div>
          </div>
        </div>

        <!-- Nav -->
        <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
          <a *ngFor="let link of navLinks"
             [routerLink]="link.path"
             routerLinkActive="bg-neon-green/10 text-neon-green border-l-2 border-neon-green"
             class="flex items-center gap-3 px-4 py-3 rounded-r-xl text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-all">
            <span class="text-base">{{ link.icon }}</span>
            {{ link.label }}
          </a>
        </nav>

        <!-- Footer -->
        <div class="p-4 border-t border-white/5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-xs font-bold text-black">
              {{ auth.currentUser?.name?.charAt(0) }}
            </div>
            <div>
              <div class="text-xs font-semibold text-white">{{ auth.currentUser?.name }}</div>
              <span class="text-xs text-neon-purple">Admin</span>
            </div>
          </div>
          <button (click)="auth.logout()" class="btn-ghost text-xs w-full py-2">Logout</button>
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 lg:ml-64 p-6 page-enter">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AdminShellComponent {
  navLinks = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/admin/products', icon: '📦', label: 'Products' },
    { path: '/admin/orders', icon: '🚚', label: 'Orders' },
    { path: '/admin/users', icon: '👥', label: 'Users' },
  ];
  constructor(public auth: AuthService) {}
}
