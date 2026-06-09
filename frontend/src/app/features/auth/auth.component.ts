import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <div class="min-h-screen flex items-center justify-center py-12 px-4 relative">
      <!-- Background -->
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 30% 50%, rgba(57,255,20,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(191,95,255,0.07) 0%, transparent 60%)"></div>
      <div class="relative w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <a routerLink="/" class="inline-flex items-center gap-2">
            <span class="text-3xl">⚡</span>
            <span class="font-display font-black text-2xl gradient-text">Custom Magic</span>
          </a>
          <p class="text-gray-500 text-sm mt-2">Fast delivery, faster checkout</p>
        </div>
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AuthComponent {}
