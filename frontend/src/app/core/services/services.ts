import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;
  private searchTerms = new Subject<string>();

  searchResults$ = this.searchTerms.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(q => this.search(q))
  );

  constructor(private http: HttpClient) {}

  typeSearch(q: string): void { this.searchTerms.next(q); }
  search(q: string): Observable<any> { return this.http.get(this.apiUrl, { params: { q } }); }
  getHistory(): Observable<any> { return this.http.get(`${this.apiUrl}/history`); }
  clearHistory(): Observable<any> { return this.http.delete(`${this.apiUrl}/history`); }
  deleteHistoryItem(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/history/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  constructor(private http: HttpClient) {}

  getProfile(): Observable<any> { return this.http.get(`${this.apiUrl}/profile`); }
  updateProfile(data: any): Observable<any> { return this.http.put(`${this.apiUrl}/profile`, data); }
  changePassword(data: any): Observable<any> { return this.http.put(`${this.apiUrl}/change-password`, data); }
  addAddress(data: any): Observable<any> { return this.http.post(`${this.apiUrl}/addresses`, data); }
  updateAddress(id: string, data: any): Observable<any> { return this.http.put(`${this.apiUrl}/addresses/${id}`, data); }
  deleteAddress(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/addresses/${id}`); }
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> { return this.http.get(`${this.apiUrl}/dashboard`); }
  getOrders(page = 1, status?: string): Observable<any> {
    const params: any = { page };
    if (status) params.status = status;
    return this.http.get(`${this.apiUrl}/orders`, { params });
  }
  updateOrderStatus(id: string, status: string, note?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/orders/${id}/status`, { status, note });
  }
  getUsers(page = 1): Observable<any> { return this.http.get(`${this.apiUrl}/users`, { params: { page } }); }
  toggleUserStatus(id: string): Observable<any> { return this.http.patch(`${this.apiUrl}/users/${id}/toggle`, {}); }
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastMessage[]>([]);
  toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: ToastMessage['type'] = 'success', duration = 3000): void {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, message, type, duration };
    this.toastsSubject.next([...this.toastsSubject.value, toast]);
    if (duration > 0) setTimeout(() => this.remove(id), duration);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
  warning(message: string): void { this.show(message, 'warning'); }
  info(message: string): void { this.show(message, 'info'); }

  remove(id: string): void {
    this.toastsSubject.next(this.toastsSubject.value.filter(t => t.id !== id));
  }
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private isDark = new BehaviorSubject<boolean>(true);
  isDark$ = this.isDark.asObservable();

  constructor() {
    const saved = localStorage.getItem('theme');
    const dark = saved !== 'light';
    this.isDark.next(dark);
    this.apply(dark);
  }

  toggle(): void {
    const dark = !this.isDark.value;
    this.isDark.next(dark);
    this.apply(dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }

  private apply(dark: boolean): void {
    document.body.classList.toggle('light-mode', !dark);
  }
}

@Injectable({ providedIn: 'root' })
export class CouponService {
  private apiUrl = `${environment.apiUrl}/coupons`;
  constructor(private http: HttpClient) {}
  validate(code: string, orderAmount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/validate`, { code, orderAmount });
  }
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: any = null;
  constructor(private http: HttpClient) {}
  load(): Observable<any> {
    return this.http.get(environment.appConfigUrl).pipe();
  }
  getConfig() { return this.config; }
  setConfig(config: any) { this.config = config; }
}
