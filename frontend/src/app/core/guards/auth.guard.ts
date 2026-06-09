import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.auth.isLoggedIn) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    const roles = route.data['roles'] as string[];
    if (roles && !roles.includes(this.auth.currentUser!.role)) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn) {
      this.router.navigate([this.auth.isAdmin ? '/admin' : '/user/dashboard']);
      return false;
    }
    return true;
  }
}
