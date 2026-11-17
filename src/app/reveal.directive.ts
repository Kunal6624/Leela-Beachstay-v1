import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';

/** Fades/slides an element in when scrolled into view and counts up any [data-count] numbers inside it. */
@Directive({ selector: '[reveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  private io?: IntersectionObserver;
  constructor(private el: ElementRef<HTMLElement>) {}
  ngOnInit() {
    const e = this.el.nativeElement;
    e.classList.add('rv');
    if (!('IntersectionObserver' in window)) { e.classList.add('in'); e.querySelectorAll<HTMLElement>('[data-count]').forEach(n => this.count(n, true)); return; }
    this.io = new IntersectionObserver(([x]) => {
      if (!x.isIntersecting) return;
      e.classList.add('in');
      e.querySelectorAll<HTMLElement>('[data-count]').forEach(n => this.count(n));
      this.io?.disconnect();
    }, { threshold: 0.2 });
    this.io.observe(e);
  }
  private count(n: HTMLElement, instant = false) {
    const to = +(n.dataset['count'] || 0), pre = n.dataset['prefix'] || '', suf = n.dataset['suffix'] || '';
    const dec = to % 1 ? 1 : 0, t0 = performance.now();
    const fmt = (v: number) => pre + v.toLocaleString('en-IN', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (instant) { n.textContent = fmt(to); return; }
    const step = (t: number) => {
      const p = Math.min((t - t0) / 2200, 1), ease = 1 - Math.pow(1 - p, 3);
      n.textContent = fmt(to * ease);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  ngOnDestroy() { this.io?.disconnect(); }
}
