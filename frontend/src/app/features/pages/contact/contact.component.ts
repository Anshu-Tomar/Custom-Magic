import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  template: `
    <div class="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-16">

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="text-6xl mb-6">📬</div>
        <h1 class="font-display font-black text-4xl sm:text-5xl text-white mb-4">
          Get in <span class="gradient-text">Touch</span>
        </h1>
        <p class="text-gray-400 text-lg max-w-md mx-auto">
          Have a question or need help? We'd love to hear from you.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">

        <!-- Contact Info -->
        <div class="space-y-5">
          <div *ngFor="let info of contactInfo" class="glass-card rounded-2xl p-5 flex items-start gap-4 hover:border-neon-cyan/20 transition-all">
            <span class="text-2xl">{{ info.icon }}</span>
            <div>
              <div class="text-sm font-semibold text-white mb-0.5">{{ info.label }}</div>
              <div class="text-sm text-gray-400">{{ info.value }}</div>
            </div>
          </div>

          <div class="glass-card rounded-2xl p-5 border-neon-green/10">
            <div class="text-sm font-semibold text-white mb-2">Business Hours</div>
            <div class="text-sm text-gray-400 space-y-1">
              <div class="flex justify-between"><span>Mon – Fri</span><span class="text-neon-green">9 AM – 6 PM</span></div>
              <div class="flex justify-between"><span>Saturday</span><span class="text-neon-green">10 AM – 4 PM</span></div>
              <div class="flex justify-between"><span>Sunday</span><span class="text-gray-600">Closed</span></div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="glass-card rounded-3xl p-8 border-white/5">
          <h2 class="font-display font-bold text-xl text-white mb-6">Send a Message</h2>
          <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Name</label>
              <input formControlName="name" class="input-genz" placeholder="Your name">
              <p *ngIf="form.get('name')?.touched && form.get('name')?.invalid" class="text-xs text-red-400 mt-1">Name is required</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Email</label>
              <input formControlName="email" type="email" class="input-genz" placeholder="you@example.com">
              <p *ngIf="form.get('email')?.touched && form.get('email')?.invalid" class="text-xs text-red-400 mt-1">Valid email required</p>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Subject</label>
              <input formControlName="subject" class="input-genz" placeholder="How can we help?">
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Message</label>
              <textarea formControlName="message" class="input-genz h-28 resize-none" placeholder="Tell us more..."></textarea>
              <p *ngIf="form.get('message')?.touched && form.get('message')?.invalid" class="text-xs text-red-400 mt-1">Message is required</p>
            </div>
            <button type="submit" class="btn-neon w-full py-3" [disabled]="form.invalid">
              {{ sent ? '✓ Message Sent!' : 'Send Message →' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent {
  form: FormGroup;
  sent = false;

  contactInfo = [
    { icon: '📧', label: 'Email', value: 'support@custommodic.in' },
    { icon: '📞', label: 'Phone', value: '+91-9876543210' },
    { icon: '📍', label: 'Address', value: 'Mumbai, Maharashtra, India' },
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.sent = true;
      this.form.reset();
      setTimeout(() => this.sent = false, 4000);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
