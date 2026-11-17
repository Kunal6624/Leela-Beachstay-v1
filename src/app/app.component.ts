import { Component, HostListener, OnDestroy, computed, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RevealDirective } from './reveal.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  // ---- EDIT THESE ----
  name = 'Leela BeachStay';
  phone = '917972421557';            // country code 91 + number, digits only
  phoneShow = '+91 79724 21557';
  address = 'Leela , At Kashid chikani, MAHARASTRA 402202';
  mapQuery = 'LEELA - BEACHSIDE STAY'; // dummy location - replace with your address
  // Photos: Unsplash photo IDs OR your own paths like '/rooms/sea-view.jpg'
  // All numbers, prices, policies, reviews and FAQs below are SAMPLE content - replace with yours.
  // --------------------

  nav = [['About', 'about'], ['Rooms', 'rooms'], ['Food', 'food'], ['Gallery', 'gallery'], ['Reviews', 'reviews'], ['FAQ', 'faq'], ['Location', 'location']];
  heroImgs = [{ src: '/images/hero.jpg', pos: 'center 60%' }, { src: '/images/pool.jpg', pos: 'center 58%' }, { src: '/images/dinner.jpg', pos: 'center' }, { src: '/images/lawn.jpg', pos: 'center' }];
  words = ['Your', 'Beach', 'Getaway', 'Starts'];
  stats = [
    { v: 1200, s: '+', l: 'Happy guests' }, { v: 850, s: '+', l: 'Bookings completed' }, { v: 420, s: '+', l: '5-star reviews' },
    { v: 4.8, s: '/5', l: 'Average rating' }, { v: 15000, s: '+', l: 'Meals served' }, { v: 8, s: '+', l: 'Years of hospitality' }
  ];
  aboutImgs = ['/images/pool.jpg', '/images/hero.jpg', '/images/dining.jpg', '/images/dinner.jpg'];
  aboutPoints = ['Swimming pool surrounded by palms', 'Fairy-lit lawn with outdoor seating', 'Clean, comfortable AC rooms', 'Free parking in the courtyard', 'Home-style meals in the garden', 'Hosts always on hand for tips'];
  rooms = [
    { tier: 'Silver', icon: '🥈', price: 2200, rating: 4.7, tag: 'Best value', ct: '#1b1b1b', c1: '#d9dee4', c2: '#8f9aa8', pos: 'left center',
      blurb: 'Neat, comfortable and great value for short stays.',
      feats: ['Air-conditioned room', 'Comfortable double bed', 'LED TV & free Wi-Fi', 'Daily breakfast for 2', 'Free parking'],
      imgs: ['/images/room.jpg', '/images/hero.jpg'] },
    { tier: 'Gold', icon: '🥇', price: 3200, rating: 4.9, tag: 'Most popular', ct: '#1b1b1b', c1: '#ffe08a', c2: '#e0a100', pos: 'center',
      blurb: 'More space, a private balcony and pool access.',
      feats: ['Everything in Silver', 'Private balcony', 'Swimming pool access', 'Tea & coffee kettle', 'Garden view'],
      imgs: ['/images/room.jpg', '/images/pool.jpg', '/images/hero.jpg'] },
    { tier: 'Premium', icon: '💎', price: 4500, rating: 5.0, tag: 'Luxury', ct: '#ffffff', c1: '#b39bff', c2: '#6a45ff', pos: 'right center',
      blurb: 'Our best room with the finest view and special perks.',
      feats: ['Everything in Gold', 'Largest room, king bed', 'Pool & garden view balcony', 'Candlelight dinner (once)', 'Airport pickup', 'Late check-out till 2 PM'],
      imgs: ['/images/room.jpg', '/images/pool.jpg', '/images/dinner.jpg', '/images/dining.jpg'] }
  ];
  // FOOD: 10 sections. Add your own speciality in each block's `special` field. Photos: '/images/x.jpg' or an Unsplash id.
  foods = [
    { icon: '🍳', t: 'Breakfast', tag: 'Included', time: '8:00 – 10:30 AM', d: 'A fresh, filling start to the day, served on the lawn.', items: ['Poha, upma or aloo paratha', 'Eggs made your way', 'Toast, jam & fresh fruit'], special: 'Fluffy neer dosa with coconut chutney', img: 'photo-1567620905732-2d1ec7ab7445', g: '#f2a65a,#ffd88a' },
    { icon: '🍛', t: 'Home-style Lunch', tag: '₹250 / person', time: '1:00 – 3:00 PM', d: 'A hearty thali cooked fresh every day.', items: ['Dal, sabzi & rice', 'Rotis or bhakri', 'Salad, papad & sweet'], special: 'Bhakri with pithla', img: 'photo-1565557623262-b51c2513a641', g: '#a3472b,#f2a65a' },
    { icon: '☕', t: 'Chai & Snacks', tag: 'From ₹80', time: '5:00 – 7:00 PM', d: 'Light bites for a lazy evening by the pool.', items: ['Onion bhaji & pakoras', 'Sandwiches & fries', 'Masala chai & coffee'], special: 'Crispy kanda bhaji with ginger chai', img: 'photo-1504674900247-0877df9cc836', g: '#2f7a4d,#9ad66f' },
    { icon: '🌙', t: 'Garden Dinner', tag: '₹350 / person', time: '8:00 – 10:00 PM', d: 'Dine under fairy lights on our lawn.', items: ['Veg & non-veg mains', 'Fresh rotis & rice', 'Dessert of the day'], special: 'Chicken sukka with rice bhakri', img: '/images/dinner.jpg', g: '#143a5c,#f2a65a' },
    { icon: '🔥', t: 'BBQ & Seafood', tag: 'On request', time: 'Order a day before', d: 'Grills and the catch of the day.', items: ['Grilled fish & prawns', 'Chicken tikka', 'Veg skewers'], special: 'Tandoori pomfret', img: 'photo-1555939594-58d7cb561ad1', g: '#a3472b,#2b1a3a' },
    { icon: '🥗', t: 'Veg, Jain & Kids', tag: 'Always available', time: 'All day', d: 'Tell us what you like and we will cook it.', items: ['Pure veg options', 'Jain meals on request', 'Kid-friendly dishes'], special: 'Jain-style paneer curry', img: '/images/dining.jpg', g: '#0f6e8c,#2bd4c0' },
    { icon: '🐟', t: 'Seafood Thali', tag: '₹450 / person', time: '1:00 – 3:00 PM', d: 'Our coastal signature, made from the day’s fresh catch.', items: ['Fish curry & fried fish', 'Prawns masala', 'Steamed rice & sol kadhi'], special: 'Surmai fish thali', img: 'photo-1414235077428-338989a2e8c0', g: '#0f6e8c,#143a5c' },
    { icon: '🥥', t: 'Drinks & Mocktails', tag: 'From ₹60', time: 'All day', d: 'Cool drinks for warm beach days.', items: ['Fresh coconut water', 'Lime soda & lassi', 'Fruit mocktails'], special: 'Kokum sherbet', img: 'photo-1544145945-f90425340c7e', g: '#e0527a,#ffb020' },
    { icon: '🍮', t: 'Sweets & Desserts', tag: 'From ₹90', time: 'After meals', d: 'A little sweet to end the meal.', items: ['Ukadiche modak', 'Gulab jamun', 'Coconut ladoo'], special: 'Warm modak with ghee', img: 'photo-1578985545062-69928b1d9587', g: '#8b4a2b,#f2a65a' },
    { icon: '🧺', t: 'Room Service & Picnic', tag: 'On request', time: '8:00 AM – 10:00 PM', d: 'Meals in your room or a hamper for the beach.', items: ['Room-service meals', 'Picnic hampers', 'Packed breakfast'], special: 'Beach picnic basket for two', img: 'photo-1512621776951-a57141f2eefd', g: '#2f7a4d,#ffd88a' }
  ];
  // CUISINES: edit freely. spice is 1 (mild) to 5 (very hot).
  cuisines = [
    { icon: '🐟', name: 'Malvani & Konkani', type: 'Coastal · our signature', info: 'Coconut-based curries, fresh catch and fiery masalas from the Konkan coast.', dishes: ['Fish curry rice', 'Kombdi vade', 'Prawns masala', 'Sol kadhi'], spice: 4 },
    { icon: '🌴', name: 'Goan', type: 'Seafood & spice', info: 'Tangy, spicy and coconut-rich dishes, best with fresh seafood.', dishes: ['Fish recheado', 'Prawn balchao', 'Xacuti', 'Sannas'], spice: 4 },
    { icon: '🍛', name: 'North Indian', type: 'Veg & non-veg', info: 'Comfort food with rich gravies and fresh breads.', dishes: ['Paneer butter masala', 'Dal tadka', 'Butter chicken', 'Jeera rice'], spice: 3 },
    { icon: '🥡', name: 'Indo-Chinese', type: 'Family favourite', info: 'Wok-tossed noodles and rice that kids and adults both love.', dishes: ['Veg noodles', 'Manchurian', 'Fried rice', 'Chilli chicken'], spice: 3 },
    { icon: '🍝', name: 'Continental', type: 'Light & mild', info: 'Simple, familiar dishes for guests who prefer less spice.', dishes: ['Pasta', 'Grilled sandwiches', 'Omelettes', 'Garden salad'], spice: 1 },
    { icon: '🥗', name: 'Jain & Healthy', type: 'Made to order', info: 'Light meals without onion and garlic, or with less oil, on request.', dishes: ['Jain thali', 'Fruit bowls', 'Sprouts salad', 'Khichdi'], spice: 1 }
  ];
  foodNotes = ['🥦 Veg & non-veg available', '🌶️ Spice level to your taste', '⏰ Order special dishes a day before', '🧾 Breakfast included, other meals billed separately'];
  amenities = [['❄️', 'Air conditioning'], ['📶', 'Fast Wi-Fi'], ['🍳', 'Fresh breakfast'], ['🅿️', 'Free parking'], ['🛵', 'Scooter rental'], ['🔒', '24x7 security'], ['🧺', 'Laundry'], ['🌿', 'Garden lawn'], ['🏊', 'Swimming pool'], ['☕', 'Tea & coffee'], ['🍽️', 'Outdoor dining'], ['🚕', 'Airport pickup']];
  // GALLERY (up to 50 photos): the 7 below are your photos. For more, drop files named 1.jpg ... 43.jpg
  // into public/images/gallery/ - each one appears automatically (missing files stay hidden).
  // Edit `cap` (caption) and `cat` (filter tab) of any entry to organise them.
  gallery = [
    { src: '/images/hero.jpg', cap: 'Our guest house', cat: 'Stay' }, { src: '/images/pool.jpg', cap: 'Swimming pool', cat: 'Pool' },
    { src: '/images/room.jpg', cap: 'Comfortable AC room', cat: 'Rooms' }, { src: '/images/dinner.jpg', cap: 'Garden evenings', cat: 'Garden' },
    { src: '/images/dining.jpg', cap: 'Outdoor dining', cat: 'Dining' }, { src: '/images/logo-night.jpg', cap: 'Leela at night', cat: 'Stay' },
    { src: '/images/lawn.jpg', cap: 'Fairy-lit lawn', cat: 'Garden' }
  ].concat(Array.from({ length: 43 }, (_, k) => ({ src: `/images/gallery/${k + 1}.jpg`, cap: 'Leela BeachStay', cat: 'More photos' })));
  experiences = [['🏊', 'Poolside days', 'Relax by the water', '/images/pool.jpg'], ['🍽️', 'Garden dining', 'Meals under the palms', '/images/dining.jpg'], ['✨', 'Fairy-light evenings', 'The lawn after dark', '/images/lawn.jpg'], ['🌴', 'Garden strolls', 'Coconut & banana groves', '/images/dinner.jpg']];
  nearby = [['🏖️', 'Calangute Beach', '2 min walk'], ['🍽️', 'Beach shacks & cafes', '5 min walk'], ['🛍️', 'Local market', '10 min'], ['🏰', 'Aguada Fort', '25 min'], ['✈️', 'Airport', '45 min'], ['🚆', 'Railway station', '40 min']];
  policies = [['🕛', 'Check-in', 'From 12:00 PM'], ['🕚', 'Check-out', 'By 11:00 AM'], ['🪪', 'ID proof', 'Required for all guests'], ['💳', 'Payment', 'UPI, cash, cards'], ['🐾', 'Pets', 'Ask us first'], ['🔁', 'Cancellation', 'Free up to 48 hours before']];
  reviews = [
    { n: 'Ananya R.', c: 'Mumbai', t: 'Woke up to waves every morning. The hosts made us feel like family.' },
    { n: 'Rahul & Meera', c: 'Pune', t: 'Spotless rooms, great breakfast and the beach right outside.' },
    { n: 'Daniel K.', c: 'London', t: 'Booked in minutes on WhatsApp. Easy, friendly and good value.' }
  ];
  faqs = [
    ['How do I book a room?', 'Tap any WhatsApp button and send us your dates and number of guests. We confirm availability and share payment details there.'],
    ['Is breakfast included?', 'Yes, a fresh breakfast is included with every room.'],
    ['Do you arrange airport pickup?', 'Yes. Message us your flight details and we will arrange a taxi at a fair rate.'],
    ['Is parking available?', 'Free parking is available for cars and scooters.'],
    ['Can I get an early check-in or late check-out?', 'Often yes, depending on the day. Ask us on WhatsApp.']
  ];

  // sea wave paths (viewBox 2880x200; period must divide 1440 so the loop is seamless)
  wBack = this.wavePath(1440, 16, 62, true);
  wMid = this.wavePath(720, 14, 98, true);
  wFront = this.wavePath(480, 12, 132, true);
  wFoam = this.wavePath(480, 12, 132, false);
  wavePath(period: number, amp: number, base: number, closed: boolean) {
    let d = `M0,${base} Q${period / 4},${base - amp * 2} ${period / 2},${base}`;
    for (let x = period; x <= 2880; x += period / 2) d += ` T${x},${base}`;
    return closed ? d + ' L2880,200 L0,200Z' : d;
  }

  theme = signal<'light' | 'dark'>('light');
  scrolled = signal(false);
  idx = signal(0);
  viewer = signal<{ imgs: string[]; i: number } | null>(null);
  picked = signal<any>(null);
  pi = signal(0);
  ok = signal<Set<string>>(new Set());   // gallery photos that actually exist
  cat = signal('All');
  limit = signal(12);
  shown = computed(() => this.gallery.filter(g => this.ok().has(g.src) && (this.cat() === 'All' || g.cat === this.cat())));
  list = computed(() => this.shown().slice(0, this.limit()));
  cats = computed(() => ['All', ...Array.from(new Set(this.gallery.filter(g => this.ok().has(g.src)).map(g => g.cat)))]);
  mapUrl: SafeResourceUrl;
  private timer: any;

  constructor(s: DomSanitizer) {
    this.mapUrl = s.bypassSecurityTrustResourceUrl('https://www.google.com/maps?q=' + encodeURIComponent(this.mapQuery) + '&output=embed');
    this.timer = setInterval(() => this.idx.update(i => (i + 1) % this.heroImgs.length), 6000);
    this.gallery.forEach(g => { const im = new Image(); im.onload = () => this.ok.update(o => new Set(o).add(g.src)); im.src = g.src; });
    let saved: string | null = null;
    try { saved = localStorage.getItem('theme'); } catch {}
    this.setTheme(saved === 'dark' ? 'dark' : 'light');
  }
  ngOnDestroy() { clearInterval(this.timer); }
  @HostListener('window:scroll') onScroll() { this.scrolled.set(window.scrollY > 60); }
  get galImgs() { return this.list().map(g => g.src); }
  setCat(c: string) { this.cat.set(c); this.limit.set(12); }
  loadMore() { this.limit.update(n => n + 12); }
  get expImgs() { return this.experiences.map(e => e[3]); }
  get foodImgs() { return this.foods.map(f => f.img); }

  show(imgs: string[], i: number) { this.viewer.set({ imgs, i }); this.lock(true); }
  step(d: number) { const v = this.viewer(); if (v) this.viewer.set({ imgs: v.imgs, i: (v.i + d + v.imgs.length) % v.imgs.length }); }
  closeViewer() { this.viewer.set(null); this.lock(false); }
  openRoom(r: any) { this.picked.set(r); this.pi.set(0); this.lock(true); }
  closeRoom() { this.picked.set(null); this.lock(false); }
  stepRoom(d: number) { const r = this.picked(); if (r) this.pi.set((this.pi() + d + r.imgs.length) % r.imgs.length); }
  lock(b: boolean) { document.body.style.overflow = b ? 'hidden' : ''; }
  url(img: string, w = 1600) { return img.startsWith('photo-') ? `https://images.unsplash.com/${img}?auto=format&fit=crop&w=${w}&q=75` : img; }
  @HostListener('window:keydown', ['$event']) key(e: KeyboardEvent) {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (this.viewer()) { if (e.key === 'Escape') this.closeViewer(); else if (dir) this.step(dir); }
    else if (this.picked()) { if (e.key === 'Escape') this.closeRoom(); else if (dir) this.stepRoom(dir); }
  }

  setTheme(t: 'light' | 'dark') {
    this.theme.set(t);
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem('theme', t); } catch {}
  }
  toggle() { this.setTheme(this.theme() === 'light' ? 'dark' : 'light'); }

  bg(img: string, g = '#0f6e8c,#f2a65a', w = 1000, pos = 'center') {
    const src = img.startsWith('photo-') ? `https://images.unsplash.com/${img}?auto=format&fit=crop&w=${w}&q=70` : img;
    return `url(${src}) ${pos}/cover, linear-gradient(135deg,${g})`;
  }
  wa(msg: string) { return `https://wa.me/${this.phone}?text=${encodeURIComponent(msg)}`; }
  get hello() { return this.wa(`Hi ${this.name}, I would like to know about rooms and rates.`); }
  room(r: string) { return this.wa(`Hi ${this.name}! I'm interested in the ${r}. Is it available? My dates: `); }
}
