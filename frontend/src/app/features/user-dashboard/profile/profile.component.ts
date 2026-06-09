import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, ToastService } from '../../../core/services/services';
import { AuthService } from '../../../core/services/auth.service';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../core/store/auth/auth.actions';

@Component({
  selector: 'app-profile',
  template: `
    <div class="space-y-6 animate-slide-in">
      <h2 class="font-display font-bold text-2xl text-white">My Profile 👤</h2>

      <!-- Profile Form -->
      <div class="glass-card rounded-2xl p-6">
        <h3 class="font-semibold text-white mb-5">Personal Information</h3>
        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label class="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Full Name</label>
              <input formControlName="name" class="input-genz" placeholder="Your name">
            </div>
            <div>
              <label class="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Phone</label>
              <input formControlName="phone" class="input-genz" placeholder="+91 XXXXXXXXXX">
            </div>
          </div>
          <div class="mb-5">
            <label class="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Email</label>
            <input [value]="auth.currentUser?.email" disabled class="input-genz opacity-50 cursor-not-allowed">
          </div>
          <button type="submit" [disabled]="saving" class="btn-neon px-6 py-2.5 text-sm disabled:opacity-50">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>

      <!-- Change Password -->
      <div class="glass-card rounded-2xl p-6">
        <h3 class="font-semibold text-white mb-5">Change Password 🔐</h3>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
          <div class="space-y-4 mb-5">
            <div>
              <label class="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Current Password</label>
              <input formControlName="currentPassword" type="password" class="input-genz" placeholder="Current password">
            </div>
            <div>
              <label class="text-xs text-gray-400 uppercase tracking-wider mb-1 block">New Password</label>
              <input formControlName="newPassword" type="password" class="input-genz" placeholder="Min 6 characters">
            </div>
          </div>
          <button type="submit" [disabled]="changingPass" class="btn-ghost px-6 py-2.5 text-sm disabled:opacity-50">
            {{ changingPass ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>

      <!-- Addresses -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-semibold text-white">Saved Addresses 📍</h3>
          <button (click)="showAddressForm = !showAddressForm" class="badge-neon cursor-pointer hover:bg-neon-green/20 transition-colors">+ Add</button>
        </div>

        <!-- Add Address Form -->
        <div *ngIf="showAddressForm" class="mb-5 p-4 rounded-xl bg-white/3 border border-white/5 animate-slide-in">
          <form [formGroup]="addressForm" (ngSubmit)="addAddress()" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <input formControlName="label" class="input-genz text-sm" placeholder="Label (Home/Work)">
              <input formControlName="pincode" class="input-genz text-sm" placeholder="Pincode">
            </div>
            <input formControlName="street" class="input-genz text-sm" placeholder="Street address">
            <div class="grid grid-cols-2 gap-3">
              <input formControlName="city" class="input-genz text-sm" placeholder="City">
              <input formControlName="state" class="input-genz text-sm" placeholder="State">
            </div>
            <div class="flex gap-3">
              <button type="submit" class="btn-neon text-xs px-4 py-2">Save Address</button>
              <button type="button" (click)="showAddressForm = false" class="btn-ghost text-xs px-4 py-2">Cancel</button>
            </div>
          </form>
        </div>

        <!-- Address List -->
        <div *ngIf="!auth.currentUser?.addresses?.length" class="text-center py-8 text-gray-500 text-sm">
          No saved addresses yet
        </div>
        <div class="space-y-3">
          <div *ngFor="let addr of auth.currentUser?.addresses"
               class="flex items-start justify-between p-4 rounded-xl bg-white/3 border border-white/5">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-semibold text-white">{{ addr.label }}</span>
                <span *ngIf="addr.isDefault" class="badge-neon text-xs">Default</span>
              </div>
              <div class="text-sm text-gray-400">{{ addr.street }}, {{ addr.city }}, {{ addr.state }} - {{ addr.pincode }}</div>
            </div>
            <button (click)="deleteAddress(addr._id!)" class="text-xs text-gray-600 hover:text-red-400 transition-colors ml-4">Remove</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;
  saving = false;
  changingPass = false;
  showAddressForm = false;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private userService: UserService,
    private toast: ToastService,
    private store: Store
  ) {
    this.profileForm = this.fb.group({ name: ['', Validators.required], phone: [''] });
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.addressForm = this.fb.group({
      label: ['Home'], street: ['', Validators.required],
      city: ['', Validators.required], state: ['', Validators.required],
      pincode: ['', Validators.required], isDefault: [false]
    });
  }

  ngOnInit(): void {
    const u = this.auth.currentUser;
    if (u) this.profileForm.patchValue({ name: u.name, phone: u.phone || '' });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.saving = true;
    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (res: any) => {
        this.store.dispatch(AuthActions.updateUser({ user: res.data?.user }));
        this.toast.success('Profile updated!');
        this.saving = false;
      },
      error: () => this.saving = false
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.changingPass = true;
    this.userService.changePassword(this.passwordForm.value).subscribe({
      next: () => { this.toast.success('Password changed!'); this.passwordForm.reset(); this.changingPass = false; },
      error: (err: any) => { this.toast.error(err.error?.message || 'Failed'); this.changingPass = false; }
    });
  }

  addAddress(): void {
    if (this.addressForm.invalid) return;
    this.userService.addAddress(this.addressForm.value).subscribe({
      next: (res: any) => {
        this.store.dispatch(AuthActions.updateUser({ user: { addresses: res.data?.addresses } }));
        this.toast.success('Address saved!');
        this.showAddressForm = false;
        this.addressForm.reset({ label: 'Home', isDefault: false });
      },
      error: () => {}
    });
  }

  deleteAddress(id: string): void {
    this.userService.deleteAddress(id).subscribe({
      next: (res: any) => {
        this.store.dispatch(AuthActions.updateUser({ user: { addresses: res.data?.addresses } }));
        this.toast.info('Address removed');
      }
    });
  }
}
