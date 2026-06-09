import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/services';

@Component({
  selector: 'app-register',
  template: `
    <div class="glass-card rounded-3xl p-8 animate-slide-in">
      <h2 class="font-display font-black text-2xl text-white mb-1">Join Custom Magic ⚡</h2>
      <p class="text-gray-500 text-sm mb-8">Create your account in seconds</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Full Name</label>
            <input formControlName="name" type="text" class="input-genz" placeholder="Your name">
            <p *ngIf="form.get('name')?.touched && form.get('name')?.invalid" class="text-xs text-red-400 mt-1">Name required</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
            <input formControlName="email" type="email" class="input-genz" placeholder="you@example.com">
            <p *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="text-xs text-red-400 mt-1">Valid email required</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Phone (optional)</label>
            <input formControlName="phone" type="tel" class="input-genz" placeholder="+91 9876543210">
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
            <div class="relative">
              <input formControlName="password" [type]="showPass ? 'text' : 'password'" class="input-genz pr-10" placeholder="Min 6 characters">
              <button type="button" (click)="showPass = !showPass" class="absolute right-3 top-3 text-gray-500">
                {{ showPass ? '🙈' : '👁️' }}
              </button>
            </div>
            <p *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="text-xs text-red-400 mt-1">Min 6 characters</p>
          </div>
        </div>

        <div *ngIf="error" class="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {{ error }}
        </div>

        <button type="submit" [disabled]="loading"
                class="btn-neon w-full mt-6 py-3.5 flex items-center justify-center gap-2 disabled:opacity-50">
          <span *ngIf="loading" class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
          {{ loading ? 'Creating account...' : 'Create Account 🚀' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <a routerLink="/auth/login" class="text-neon-cyan hover:underline font-semibold">Login</a>
      </p>
    </div>
  `
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPass = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.register(this.form.value).subscribe({
      next: (res) => {
        this.toast.success(`Welcome to Custom Magic, ${res.data.user.name}! 🎉`);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed.';
        this.loading = false;
      }
    });
  }
}
