import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-16">

      <!-- Hero -->
      <div class="text-center mb-16">
        <div class="text-6xl mb-6">✨</div>
        <h1 class="font-display font-black text-4xl sm:text-5xl text-white mb-4">
          About <span class="gradient-text">Custom Magic</span>
        </h1>
        <p class="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          We believe every child deserves a little magic — through the perfect gift, the right stationery, and the joy of creativity.
        </p>
      </div>

      <!-- Mission -->
      <div class="glass-card rounded-3xl p-8 mb-8 border-neon-green/20">
        <div class="flex items-start gap-4">
          <span class="text-3xl">🎯</span>
          <div>
            <h2 class="font-display font-black text-2xl text-white mb-3">Our Mission</h2>
            <p class="text-gray-400 leading-relaxed">
              Custom Magic is your go-to destination for kids' gifts, stationery, art supplies, and creative tools. We curate products that spark imagination, support learning, and make every celebration memorable.
            </p>
          </div>
        </div>
      </div>

      <!-- Values grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        <div *ngFor="let v of values" class="glass-card rounded-2xl p-6 text-center hover:border-neon-green/20 transition-all">
          <div class="text-4xl mb-3">{{ v.icon }}</div>
          <h3 class="font-display font-bold text-white text-lg mb-2">{{ v.title }}</h3>
          <p class="text-sm text-gray-500">{{ v.desc }}</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="glass-card rounded-3xl p-8 border-neon-purple/20">
        <h2 class="font-display font-black text-2xl text-white text-center mb-8">By the Numbers</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          <div *ngFor="let s of stats">
            <div class="font-display font-black text-3xl gradient-text mb-1">{{ s.value }}</div>
            <div class="text-xs text-gray-500">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AboutComponent {
  values = [
    { icon: '🎁', title: 'Thoughtful Gifts', desc: 'Every product is hand-picked for quality and joy.' },
    { icon: '✏️', title: 'Creative Tools', desc: 'Stationery and art supplies that inspire learning.' },
    { icon: '💛', title: 'Made with Love', desc: 'We care about every child\'s smile and growth.' }
  ];

  stats = [
    { value: '500+', label: 'Products' },
    { value: '10K+', label: 'Happy Kids' },
    { value: '4.9★', label: 'Avg Rating' },
    { value: '50+', label: 'Brands' }
  ];
}
