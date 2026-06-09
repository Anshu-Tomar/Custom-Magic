import { Component, OnInit } from '@angular/core';
import { ThemeService } from './core/services/services';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <main class="min-h-screen">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
    <app-toast></app-toast>
    <app-cart-sidebar></app-cart-sidebar>
  `
})
export class AppComponent implements OnInit {
  constructor(private theme: ThemeService) {}
  ngOnInit(): void {}
}
