import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminShellComponent } from './admin-shell.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './products/admin-products.component';
import { AdminOrdersComponent } from './orders/admin-orders.component';
import { AdminUsersComponent } from './users/admin-users.component';

const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'orders', component: AdminOrdersComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [AdminShellComponent, AdminDashboardComponent, AdminProductsComponent, AdminOrdersComponent, AdminUsersComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class AdminModule {}
