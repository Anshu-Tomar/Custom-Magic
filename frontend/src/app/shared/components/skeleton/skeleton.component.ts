import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <div *ngIf="type === 'card'" class="glass-card overflow-hidden">
      <div class="skeleton h-40 w-full"></div>
      <div class="p-3 space-y-2">
        <div class="skeleton h-3 w-1/3 rounded"></div>
        <div class="skeleton h-4 w-4/5 rounded"></div>
        <div class="skeleton h-3 w-2/5 rounded"></div>
        <div class="flex justify-between items-center mt-3">
          <div class="skeleton h-5 w-16 rounded"></div>
          <div class="skeleton h-8 w-8 rounded-xl"></div>
        </div>
      </div>
    </div>
    <div *ngIf="type === 'line'" class="skeleton h-4 rounded w-full"></div>
    <div *ngIf="type === 'circle'" class="skeleton rounded-full" [style.width.px]="size" [style.height.px]="size"></div>
  `
})
export class SkeletonComponent {
  @Input() type: 'card' | 'line' | 'circle' = 'line';
  @Input() size = 40;
}

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="flex items-center gap-0.5">
      <span *ngFor="let star of stars" class="text-sm"
            [class.text-yellow-400]="star <= rating"
            [class.text-gray-600]="star > rating">★</span>
      <span *ngIf="showCount" class="text-xs text-gray-500 ml-1">({{ count }})</span>
    </div>
  `
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() count = 0;
  @Input() showCount = true;
  stars = [1, 2, 3, 4, 5];
}
