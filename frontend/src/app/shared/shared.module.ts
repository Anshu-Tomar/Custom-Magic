import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';
import { CartSidebarComponent } from './components/cart-sidebar/cart-sidebar.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';

const COMPONENTS = [
  NavbarComponent,
  FooterComponent,
  ToastComponent,
  CartSidebarComponent,
  ProductCardComponent,
  SkeletonComponent,
  StarRatingComponent
];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, ...COMPONENTS]
})
export class SharedModule {}
