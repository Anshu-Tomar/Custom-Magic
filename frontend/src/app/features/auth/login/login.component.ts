import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/services';

@Component({
  selector: 'app-login',
  template: `
    <div class="glass-card rounded-3xl p-8 animate-slide-in">
      <h2 class="font-display font-black text-2xl text-white mb-1">Welcome back 👋</h2>
      <p class="text-gray-500 text-sm mb-8">Login to your Custom Magic account</p>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="space-y-4">
          <div>
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
            <input formControlName="email" type="email" class="input-genz" placeholder="you@example.com">
            <p *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="text-xs text-red-400 mt-1">Valid email required</p>
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Password</label>
            <div class="relative">
              <input formControlName="password" [type]="showPass ? 'text' : 'password'" class="input-genz pr-10" placeholder="••••••••">
              <button type="button" (click)="showPass = !showPass" class="absolute right-3 top-3 text-gray-500 hover:text-purple-600">
                {{ showPass ? '🙈' : '👁️' }}
              </button>
            </div>
            <p *ngIf="form.get('password')?.touched && form.get('password')?.invalid" class="text-xs text-red-400 mt-1">Password required</p>
          </div>
        </div>

        <div *ngIf="error" class="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {{ error }}
        </div>

        <button type="submit" [disabled]="loading"
                class="btn-neon w-full mt-6 py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <span *ngIf="loading" class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-white/10"></div></div>
        <div class="relative flex justify-center text-xs text-gray-500 bg-genz-dark px-3 mx-auto w-fit">or</div>
      </div>

      <p class="text-center text-sm text-gray-500">
        Don't have an account?
        <a routerLink="/auth/register" class="text-neon-cyan hover:underline font-semibold">Sign up</a>
      </p>

      <!-- Demo credentials hint -->
      <div class="mt-4 p-3 rounded-xl bg-white/3 border border-white/5 text-xs text-gray-500 text-center">
        Demo: user@blinkit.com / User@123 | Admin: admin@blinkit.com / Admin@123
      </div>
    </div>
  `
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  error = '';
  showPass = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: ToastService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.toast.success(`Welcome back, ${res.data.user.name}! 🎉`);
        this.router.navigate([res.data.user.role === 'admin' ? '/admin' : '/']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}
