import { Component, OnInit } from '@angular/core';
import { AdminService, ToastService } from '../../../core/services/services';

@Component({
  selector: 'app-admin-users',
  template: `
    <div class="animate-slide-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="font-display font-black text-3xl text-white">Users 👥</h1>
          <p class="text-gray-500 text-sm mt-1">{{ total }} registered users</p>
        </div>
      </div>

      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-white/5">
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">User</th>
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Phone</th>
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Joined</th>
                <th class="text-left px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Status</th>
                <th class="text-right px-5 py-4 text-xs text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="loading">
                <td colspan="5" class="px-5 py-8">
                  <div class="space-y-3">
                    <div *ngFor="let s of [1,2,3,4,5]" class="skeleton h-10 rounded-lg"></div>
                  </div>
                </td>
              </tr>
              <tr *ngFor="let user of users" class="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-sm font-bold text-black flex-shrink-0">
                      {{ user.name?.charAt(0).toUpperCase() }}
                    </div>
                    <div>
                      <div class="font-medium text-white">{{ user.name }}</div>
                      <div class="text-xs text-gray-500">{{ user.email }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 text-gray-400">{{ user.phone || '—' }}</td>
                <td class="px-5 py-4 text-xs text-gray-400">{{ user.createdAt | date:'dd MMM yyyy' }}</td>
                <td class="px-5 py-4">
                  <span [class.text-green-400]="user.isActive" [class.text-red-400]="!user.isActive"
                        class="text-xs font-semibold">
                    {{ user.isActive ? '✓ Active' : '✗ Inactive' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button (click)="toggleStatus(user._id)"
                          class="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          [class.text-red-400]="user.isActive"
                          [class.hover:bg-red-400]="user.isActive"
                          [class.text-green-400]="!user.isActive"
                          [class.hover:bg-green-400]="!user.isActive"
                          [class.hover:bg-opacity-10]="true">
                    {{ user.isActive ? 'Deactivate' : 'Activate' }}
                  </button>
                </td>
              </tr>
              <tr *ngIf="!loading && users.length === 0">
                <td colspan="5" class="px-5 py-12 text-center text-gray-500">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="pages > 1" class="flex justify-center gap-2 p-4 border-t border-white/5">
          <button (click)="changePage(page-1)" [disabled]="page===1" class="px-4 py-2 rounded-xl glass-card text-sm disabled:opacity-30">← Prev</button>
          <span class="px-4 py-2 text-sm text-gray-400">{{ page }} / {{ pages }}</span>
          <button (click)="changePage(page+1)" [disabled]="page===pages" class="px-4 py-2 rounded-xl glass-card text-sm disabled:opacity-30">Next →</button>
        </div>
      </div>
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users: any[] = [];
  loading = true;
  page = 1;
  pages = 1;
  total = 0;

  constructor(private admin: AdminService, private toast: ToastService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.admin.getUsers(this.page).subscribe({
      next: (res: any) => {
        this.users = res.data?.users || [];
        this.total = res.data?.total || 0;
        this.pages = res.data?.pages || 1;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  toggleStatus(id: string): void {
    this.admin.toggleUserStatus(id).subscribe({
      next: () => { this.toast.success('User status updated'); this.load(); },
      error: () => this.toast.error('Failed')
    });
  }

  changePage(p: number): void { this.page = p; this.load(); }
}
