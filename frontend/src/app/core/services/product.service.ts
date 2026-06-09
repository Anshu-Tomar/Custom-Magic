import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`);
  }

  getFeatured(): Observable<any> {
    return this.getProducts({ featured: true, limit: 8 });
  }

  getFlashDeals(): Observable<any> {
    return this.getProducts({ flashDeal: true, limit: 6 });
  }

  searchProducts(query: string, limit = 10): Observable<any> {
    return this.getProducts({ search: query, limit });
  }

  createProduct(data: FormData): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateProduct(id: string, data: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
