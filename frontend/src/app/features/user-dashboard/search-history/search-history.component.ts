import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService, ToastService } from '../../../core/services/services';
import { SearchHistory } from '../../../core/models';

@Component({
  selector: 'app-search-history',
  template: `
    <div class="animate-slide-in">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-display font-bold text-2xl text-white">Search History 🔍</h2>
        <button *ngIf="history.length > 0" (click)="clearAll()" class="text-sm text-red-400 hover:underline">Clear All</button>
      </div>

      <div *ngIf="loading" class="space-y-3">
        <div *ngFor="let s of [1,2,3,4,5]" class="skeleton h-12 rounded-xl"></div>
      </div>

      <div *ngIf="!loading && history.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="font-display text-xl text-white mb-2">No search history</h3>
        <p class="text-gray-500">Your recent searches will appear here</p>
      </div>

      <div class="space-y-2">
        <div *ngFor="let item of history"
             class="flex items-center gap-4 p-4 glass-card rounded-xl hover:border-white/15 transition-all group">
          <span class="text-gray-500 text-lg">🔍</span>
          <div class="flex-1 cursor-pointer" (click)="search(item.query)">
            <div class="text-sm text-white group-hover:text-neon-green transition-colors font-medium">{{ item.query }}</div>
            <div class="text-xs text-gray-600 mt-0.5">
              {{ item.resultCount }} results · {{ item.createdAt | date:'dd MMM, h:mm a' }}
            </div>
          </div>
          <button (click)="deleteItem(item._id)" class="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all text-lg">×</button>
        </div>
      </div>
    </div>
  `
})
export class SearchHistoryComponent implements OnInit {
  history: SearchHistory[] = [];
  loading = true;

  constructor(private searchService: SearchService, private toast: ToastService, private router: Router) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.searchService.getHistory().subscribe({
      next: (res: any) => { this.history = res.data?.history || []; this.loading = false; },
      error: () => this.loading = false
    });
  }

  search(query: string): void {
    this.router.navigate(['/products'], { queryParams: { search: query } });
  }

  deleteItem(id: string): void {
    this.searchService.deleteHistoryItem(id).subscribe({
      next: () => { this.history = this.history.filter(h => h._id !== id); }
    });
  }

  clearAll(): void {
    this.searchService.clearHistory().subscribe({
      next: () => { this.history = []; this.toast.success('Search history cleared'); }
    });
  }
}
