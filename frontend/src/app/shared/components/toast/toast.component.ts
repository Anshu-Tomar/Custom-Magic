import { Component, OnInit } from '@angular/core';
import { ToastService, ToastMessage } from '../../../core/services/services';

@Component({
  selector: 'app-toast',
  template: `
    <div class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div *ngFor="let toast of toasts; trackBy: trackById"
           class="pointer-events-auto min-w-[280px] max-w-sm glass-card px-4 py-3.5 rounded-2xl shadow-2xl border animate-slide-in flex items-start gap-3"
           [ngClass]="{
             'border-green-500/30 bg-green-500/10': toast.type === 'success',
             'border-red-500/30 bg-red-500/10': toast.type === 'error',
             'border-yellow-500/30 bg-yellow-500/10': toast.type === 'warning',
             'border-blue-500/30 bg-blue-500/10': toast.type === 'info'
           }">
        <span class="text-lg mt-0.5">
          {{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : 'ℹ️' }}
        </span>
        <span class="flex-1 text-sm text-white font-body">{{ toast.message }}</span>
        <button (click)="remove(toast.id)" class="text-gray-500 hover:text-gray-800 text-lg leading-none ml-2">×</button>
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit {
  toasts: ToastMessage[] = [];
  constructor(private toastService: ToastService) {}
  ngOnInit(): void { this.toastService.toasts$.subscribe(t => this.toasts = t); }
  remove(id: string): void { this.toastService.remove(id); }
  trackById = (_: number, t: ToastMessage) => t.id;
}
