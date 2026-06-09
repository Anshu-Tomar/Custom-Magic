import { Component } from '@angular/core';

@Component({
  selector: 'app-careers',
  template: `
    <div class="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-16">

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="text-6xl mb-6">🚀</div>
        <h1 class="font-display font-black text-4xl sm:text-5xl text-white mb-4">
          Join Our <span class="gradient-text">Team</span>
        </h1>
        <p class="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Help us spread magic to kids everywhere. We're building something special — come be part of it.
        </p>
      </div>

      <!-- Perks -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <div *ngFor="let perk of perks" class="glass-card rounded-2xl p-5 text-center hover:border-neon-purple/20 transition-all">
          <div class="text-3xl mb-2">{{ perk.icon }}</div>
          <div class="text-xs font-semibold text-gray-600">{{ perk.label }}</div>
        </div>
      </div>

      <!-- Open Roles -->
      <h2 class="font-display font-black text-2xl text-white mb-6">
        Open <span class="gradient-text">Positions</span>
      </h2>

      <div class="space-y-4 mb-12">
        <div *ngFor="let job of jobs"
             class="glass-card rounded-2xl p-6 hover:border-neon-green/20 transition-all cursor-pointer group">
          <div class="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <span class="text-xl">{{ job.icon }}</span>
                <h3 class="font-display font-bold text-white text-lg">{{ job.title }}</h3>
                <span class="badge-neon text-xs">{{ job.type }}</span>
              </div>
              <p class="text-sm text-gray-400 mb-3">{{ job.desc }}</p>
              <div class="flex gap-3 flex-wrap">
                <span class="text-xs text-gray-500 flex items-center gap-1">📍 {{ job.location }}</span>
                <span class="text-xs text-gray-500 flex items-center gap-1">💼 {{ job.dept }}</span>
              </div>
            </div>
            <button class="btn-ghost text-xs px-4 py-2 group-hover:border-neon-green/40 flex-shrink-0">
              Apply →
            </button>
          </div>
        </div>
      </div>

      <!-- No fit CTA -->
      <div class="glass-card rounded-3xl p-8 text-center border-neon-cyan/20">
        <div class="text-4xl mb-4">💌</div>
        <h3 class="font-display font-bold text-xl text-white mb-2">Don't see a fit?</h3>
        <p class="text-gray-400 text-sm mb-5">Send us your resume and we'll keep you in mind for future roles.</p>
        <a routerLink="/contact" class="btn-neon px-6 py-3 inline-block">Send Resume →</a>
      </div>
    </div>
  `
})
export class CareersComponent {
  perks = [
    { icon: '🏠', label: 'Remote Friendly' },
    { icon: '📚', label: 'Learning Budget' },
    { icon: '🏥', label: 'Health Cover' },
    { icon: '🎉', label: 'Fun Culture' }
  ];

  jobs = [
    {
      icon: '🎨',
      title: 'UI/UX Designer',
      type: 'Full-time',
      dept: 'Design',
      location: 'Remote',
      desc: 'Craft delightful experiences for kids and parents on our platform.'
    },
    {
      icon: '💻',
      title: 'Frontend Developer',
      type: 'Full-time',
      dept: 'Engineering',
      location: 'Remote',
      desc: 'Build fast, accessible, and beautiful Angular/React interfaces.'
    },
    {
      icon: '📦',
      title: 'Category Manager',
      type: 'Full-time',
      dept: 'Product',
      location: 'Mumbai',
      desc: 'Own and grow our gifts & stationery category with data-driven decisions.'
    },
    {
      icon: '📣',
      title: 'Social Media Executive',
      type: 'Part-time',
      dept: 'Marketing',
      location: 'Remote',
      desc: 'Create engaging content and grow our brand across Instagram, YouTube & more.'
    }
  ];
}
