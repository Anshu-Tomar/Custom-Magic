import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models';

@Component({
  selector: 'app-cart-sidebar',
  template: `
    <!-- This is a mini cart preview that can be triggered -->
  `
})
export class CartSidebarComponent {
  constructor(public cart: CartService, private router: Router) {}
}
