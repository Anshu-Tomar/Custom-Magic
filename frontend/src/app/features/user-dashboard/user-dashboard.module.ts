import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { UserDashboardComponent } from './user-dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { OrdersComponent } from './orders/orders.component';
import { SearchHistoryComponent } from './search-history/search-history.component';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    children: [
      { path: 'dashboard', component: ProfileComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'search-history', component: SearchHistoryComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [UserDashboardComponent, ProfileComponent, OrdersComponent, SearchHistoryComponent],
  imports: [SharedModule, RouterModule.forChild(routes)]
})
export class UserDashboardModule {}
