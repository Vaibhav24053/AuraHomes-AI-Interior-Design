import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Compass,
  House,
  IndianRupee,
  Menu,
  MoveHorizontal,
  Palette,
  Sparkles,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  return <main className="aura-shell grain overflow-hidden bg-[#f3ecdf] text-[#29352f]"><Hero /><Marquee /><HowItWorks /><Comparison /><Stats /><Toolkit /><DarkFeature /><FinalCta /><Footer /></main>;
}

function Reveal({ children, className = '', delay = '' }: { children: ReactNode; className?: string; delay?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        observer.unobserve(node);
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${delay} ${className}`}>{children}</div>;
}

function SiteNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  useEffect(() => setOpen(false), [location]);
  const items = [['Home', '/'], ['Transform', '/transform'], ['Quiz', '/quiz'], ['Budget', '/budget'], ['Community', '/community']];
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-7 sm:pt-6">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between rounded-full border border-[#d7cbbb]/80 bg-[#f3ecdf]/85 px-4 py-3 shadow-[0_10px_40px_rgba(74,52,32,.06)] backdrop-blur-md sm:px-6" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
          <span className="relative grid size-8 place-items-center rounded-full bg-[#b8573b] text-[#f3ecdf]">
            <span className="absolute h-3 w-3 rounded-full border border-[#f3ecdf]/80" />
            <span className="absolute h-5 w-5 rounded-full border border-[#f3ecdf]/40" />
          </span>
          <span className="display text-[26px] leading-none tracking-[-.035em]">aura<span className="text-[#b8573b]">/</span>home</span>
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {items.map(([label, href]) => <Link key={href} href={href} className="nav-link text-[12px] font-medium text-[#536059] transition-colors hover:text-[#b8573b]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</Link>)}
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <Link href="/quiz" className="text-[12px] font-semibold text-[#536059] transition-colors hover:text-[#b8573b]" data-testid="link-nav-quiz">Take the quiz</Link>
          <Link href="/transform" className="group flex items-center gap-2 rounded-full bg-[#29352f] px-4 py-2.5 text-[12px] font-semibold text-[#f3ecdf] transition-transform hover:-translate-y-0.5" data-testid="link-nav-get-started">Get Started <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
        </div>
        <button type="button" className="grid size-10 place-items-center rounded-full border border-[#d7cbbb] text-[#29352f] sm:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">{open ? <X size={18} /> : <Menu size={18} />}</button>
      </nav>
      {open && <div className="mx-0 mt-2 rounded-3xl border border-[#d7cbbb] bg-[#f3ecdf] p-5 shadow-xl sm:hidden">
        <div className="grid gap-4">
          {items.map(([label, href]) => <Link key={href} href={href} className="flex items-center justify-between border-b border-[#d7cbbb] pb-3 text-[15px]" data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}<ArrowUpRight size={15} /></Link>)}
          <Link href="/transform" className="mt-1 flex items-center justify-center rounded-full bg-[#b8573b] px-4 py-3 text-sm font-semibold text-[#f3ecdf]" data-testid="link-mobile-get-started">Get Started</Link>
        </div>
      </div>}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-aurora relative min-h-[760px] px-5 pb-20 pt-36 sm:px-10 sm:pt-44 lg:min-h-[820px] lg:px-20">
      <div className="pointer-events-none absolute -left-32 top-40 size-72 rounded-full bg-[#d89a48]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8%] top-12 size-96 rounded-full border border-[#b8573b]/10" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 lg:grid-cols-[.93fr_1.07fr] lg:gap-20">
        <div className="relative z-10 max-w-[590px]">
          <Reveal><div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8573b]/30 bg-[#f8f0e5]/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#b8573b]"><Sparkles size={12} /> AI-Powered Interior Design</div></Reveal>
          <Reveal delay="reveal-delay-1"><h1 className="display text-[clamp(4.2rem,8.4vw,8.2rem)] leading-[.84] tracking-[-.06em] text-[#29352f]">Your Dream Home,<br /><em className="text-gradient">Designed by AI.</em></h1></Reveal>
          <Reveal delay="reveal-delay-2"><p className="mt-8 max-w-[400px] text-[16px] leading-7 text-[#607067]">Discover a home that feels like you — shaped by your stories, your style, and the way you really live.</p></Reveal>
          <Reveal delay="reveal-delay-3"><div className="mt-9 flex flex-wrap items-center gap-5">
             <Link href="/transform" className="group flex items-center gap-3 rounded-full bg-[#c8a97e] px-6 py-3.5 text-[13px] font-semibold text-[#29352f] shadow-[0_12px_26px_rgba(200,169,126,.28)] transition-all hover:-translate-y-1 hover:bg-[#b8976c]" data-testid="link-hero-transform">Transform My Room <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link>
             <Link href="/quiz" className="underlined rounded-full border border-[#29352f]/30 px-5 py-3 text-[13px] font-semibold text-[#29352f] transition-colors hover:border-[#b8573b] hover:text-[#b8573b]" data-testid="link-hero-quiz">Take the Style Quiz</Link>
          </div></Reveal>
          <div className="mt-16 flex items-center gap-3 text-[#7a827b]">
            <div className="flex -space-x-2">
              {['#c68467', '#7c9b8d', '#d5a464'].map((color, index) => <span key={color} className="grid size-7 place-items-center rounded-full border-2 border-[#f3ecdf] text-[9px] font-bold text-[#f3ecdf]" style={{ backgroundColor: color }}>{['AK', 'MN', 'RS'][index]}</span>)}
            </div>
             <span className="text-[11px]">2,400+ Indian homes transformed this month</span>
          </div>
        </div>
        <Reveal className="relative" delay="reveal-delay-2">
          <div className="relative mx-auto max-w-[570px]">
            <div className="absolute -left-8 top-8 h-[88%] w-16 rounded-[50%] bg-[#d89a48]/25 blur-2xl sm:-left-14" />
            <div className="image-zoom relative aspect-[.82] overflow-hidden rounded-[13rem_13rem_1rem_1rem] border-[10px] border-[#e3d6c6] shadow-[0_35px_70px_rgba(77,51,31,.18)] sm:aspect-[.9]">
              <img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85" alt="Sunlit Indian-inspired living room with a low sofa and warm wood" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#29352f]/40 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-[#f8f0e5]">
                <div><div className="eyebrow mb-2 text-[#f8f0e5]/75">A home in progress</div><p className="display text-3xl">Jaipur, 08:42</p></div>
                <span className="grid size-11 place-items-center rounded-full border border-[#f8f0e5]/60"><ArrowDownRight size={18} /></span>
              </div>
            </div>
            <div className="float-slow absolute -right-5 top-[16%] w-44 rounded-2xl border border-[#e3d6c6] bg-[#f8f0e5]/95 p-4 shadow-[0_18px_35px_rgba(77,51,31,.12)] sm:-right-12">
              <div className="mb-5 flex items-center justify-between"><span className="eyebrow text-[#b8573b]">Your mood</span><Sparkles size={15} className="text-[#d89a48]" /></div>
              <div className="display text-[27px] leading-none">Warm<br /><em>and grounded</em></div>
              <div className="mt-4 h-1 rounded-full bg-[#e4d8c9]"><div className="h-full w-[76%] rounded-full bg-[#b8573b]" /></div>
            </div>
            <div className="float-slow-2 absolute -bottom-5 -left-5 w-36 rounded-2xl bg-[#29352f] p-4 text-[#f8f0e5] shadow-xl sm:-left-11">
              <Compass size={18} className="mb-6 text-[#d89a48]" /><div className="eyebrow text-[#f8f0e5]/55">Style DNA</div><div className="mt-1 text-sm">Modern heirloom</div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[#859087] lg:flex"><span className="h-10 w-px bg-[#b7b2a5]" /><span className="eyebrow">Scroll to explore</span></div>
    </section>
  );
}

const styles = ['Japandi', 'Bohemian', 'Kerala Traditional', 'Punjabi Maximalist', 'Gen-Z Minimal', 'Vastu-Modern', 'Rajasthani', 'Bengali', 'Industrial Loft', 'Coastal'];
function Marquee() {
  return <section className="overflow-hidden border-y border-[#d7cbbb] bg-[#eee5d7] py-5" aria-label="Interior design styles"><div className="marquee-track flex items-center gap-8">{[...styles, ...styles].map((style, index) => <div key={`${style}-${index}`} className="flex items-center gap-8 whitespace-nowrap"><span className="display text-[25px] italic text-[#536059]">{style}</span><span className="size-1.5 rounded-full bg-[#b8573b]" /></div>)}</div></section>;
}

function HowItWorks() {
  const steps = [
    { no: '01', icon: Compass, title: 'Notice what moves you', text: 'A quick, image-led quiz finds the colours, shapes and memories you naturally lean towards.' },
    { no: '02', icon: Palette, title: 'See your language', text: 'Aura turns those instincts into a living design direction — not a rigid style label.' },
    { no: '03', icon: House, title: 'Make it real', text: 'Room plans, shoppable edits and thoughtful swaps, shaped for your budget and your life.' },
  ];
  return <section id="how-it-works" className="px-5 py-28 sm:px-10 lg:px-20 lg:py-40"><div className="mx-auto max-w-[1240px]"><Reveal><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><div className="eyebrow text-[#b8573b]">The Aura method</div></div><div className="max-w-[700px]"><h2 className="display text-[clamp(3.2rem,6vw,6rem)] leading-[.9] tracking-[-.05em]">Good design is less about rules, <em className="text-[#b8573b]">more about recognition.</em></h2><p className="mt-7 max-w-[520px] text-[15px] leading-7 text-[#66746b]">Indian homes have always been layered — inherited and new, practical and poetic. We designed AuraHome for that beautiful in-between.</p></div></div></Reveal>
    <div className="mt-20 grid gap-5 md:grid-cols-3">{steps.map(({ no, icon: Icon, title, text }, index) => <Reveal key={no} delay={`reveal-delay-${index + 1}`}><div className={`border-t border-[#cfc2b2] pt-5 ${index === 1 ? 'md:mt-12' : ''}`}><div className="flex items-center justify-between"><span className="mono text-[11px] text-[#b8573b]">{no}</span><Icon size={20} strokeWidth={1.5} className="text-[#b8573b]" /></div><h3 className="display mt-16 text-[32px] leading-none">{title}</h3><p className="mt-5 max-w-[290px] text-[13px] leading-6 text-[#68766d]">{text}</p></div></Reveal>)}</div>
  </div></section>;
}

function Comparison() {
  const [position, setPosition] = useState(54);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const updatePosition = (clientX: number) => {
    const box = comparisonRef.current?.getBoundingClientRect();
    if (!box) return;
    setPosition(Math.min(97, Math.max(3, ((clientX - box.left) / box.width) * 100)));
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.buttons === 1) updatePosition(event.clientX); };
  return <section id="transform-preview" className="bg-[#dce5dc] px-5 py-24 sm:px-10 lg:px-20 lg:py-36"><div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20"><Reveal><div><div className="eyebrow flex items-center gap-3 text-[#557468]"><span className="h-px w-7 bg-[#557468]" />A little proof</div><h2 className="display mt-6 text-[clamp(3.6rem,6vw,6.5rem)] leading-[.86] tracking-[-.05em]">From almost<br /><em className="text-[#b8573b]">to entirely.</em></h2><p className="mt-7 max-w-[360px] text-[15px] leading-7 text-[#5e7066]">Not a makeover for the sake of it. A clearer version of the room you already knew was in there.</p><Link href="/transform" className="group mt-8 inline-flex items-center gap-3 text-[13px] font-semibold text-[#29352f]" data-testid="link-comparison-transform">Explore your room <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link></div></Reveal>
      <Reveal delay="reveal-delay-2"><div ref={comparisonRef} className="relative aspect-[1.08] cursor-ew-resize touch-none select-none overflow-hidden rounded-[1.5rem] border-[7px] border-[#f3ecdf] bg-[#c5b39f] shadow-[0_26px_50px_rgba(55,74,64,.14)]" onPointerMove={onPointerMove} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); updatePosition(e.clientX); }} role="slider" tabIndex={0} aria-label="Drag to compare the room before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} onKeyDown={(event) => { if (event.key === 'ArrowLeft') setPosition((p) => Math.max(3, p - 3)); if (event.key === 'ArrowRight') setPosition((p) => Math.min(97, p + 3)); }} data-testid="comparison-slider">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="A calm living room before an AuraHome transformation" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85" alt="A warm, layered living room after an AuraHome transformation" /></div>
        <div className="absolute left-5 top-5 rounded-full bg-[#f3ecdf]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#536059]">Before</div><div className="absolute right-5 top-5 rounded-full bg-[#29352f]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#f3ecdf]">After</div>
        <div className="slider-handle absolute bottom-0 top-0 z-10 w-px bg-[#f3ecdf]" style={{ left: `${position}%` }}><span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#f3ecdf] bg-[#b8573b] text-[#f3ecdf]"><MoveHorizontal size={19} /></span></div>
      </div></Reveal>
    </div></section>;
}

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const started = performance.now();
      const tick = (now: number) => { const progress = Math.min(1, (now - started) / 1300); setValue(Math.round(target * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick); observer.disconnect();
    }, { threshold: .6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{value.toLocaleString('en-IN')}{suffix}</span>;
}

function Stats() {
  return <section className="bg-[#29352f] px-5 py-20 text-[#f3ecdf] sm:px-10 lg:px-20"><div className="mx-auto grid max-w-[1240px] gap-12 md:grid-cols-[.8fr_1.2fr] md:items-end"><Reveal><div><div className="eyebrow text-[#d89a48]">A growing point of view</div><p className="display mt-5 max-w-[360px] text-4xl leading-[.95] text-[#f3ecdf]">A thousand homes, none of them the same.</p></div></Reveal><div className="grid grid-cols-2 gap-y-12 sm:grid-cols-4">{[[12400, '+', 'Rooms Transformed'], [6, '', 'Regional Styles'], [98, '%', 'Satisfaction'], [45, 's', 'Avg Generation Time']].map(([number, suffix, label], index) => <Reveal key={label} delay={`reveal-delay-${(index % 3) + 1}`}><div className="border-l border-[#f3ecdf]/20 pl-4 sm:pl-5"><div className="display text-[45px] leading-none text-[#d89a48]"><CountUp target={Number(number)} suffix={String(suffix)} /></div><div className="mt-3 max-w-[110px] text-[11px] leading-4 text-[#b5c0b8]">{label}</div></div></Reveal>)}</div></div></section>;
}

const toolkit = [
  { icon: Sparkles, tag: 'Start here', title: 'Design DNA Quiz', text: 'Discover the colours, shapes, and memories that feel most like you.', href: '/quiz', color: '#e7c998' },
  { icon: Compass, tag: 'Tradition, reimagined', title: 'Vastu-Corrected Redesign', text: 'Thoughtful layouts that honour Vastu without compromising your point of view.', href: '/transform', color: '#d7e3d8' },
  { icon: House, tag: 'See it in place', title: 'AR Room View', text: 'Preview a new direction in your actual room before you commit.', href: '/transform', color: '#d6d4c4' },
  { icon: IndianRupee, tag: 'Keep it real', title: 'Real-Price Sourcing', text: 'Beautiful finds with transparent INR pricing from local makers and artisans.', href: '/budget', color: '#e1c4b8' },
];
function Toolkit() {
  return <section className="px-5 py-28 sm:px-10 lg:px-20 lg:py-40"><div className="mx-auto max-w-[1240px]"><Reveal><div className="flex flex-wrap items-end justify-between gap-6"><div><div className="eyebrow text-[#b8573b]">The toolkit</div><h2 className="display mt-5 text-[clamp(3.2rem,6vw,6rem)] leading-[.88] tracking-[-.05em]">A little help,<br /><em className="text-[#b8573b]">beautifully given.</em></h2></div><p className="max-w-[280px] text-[13px] leading-6 text-[#68766d]">No blank-canvas panic. Just the right nudge, at the right moment.</p></div></Reveal>
    <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{toolkit.map(({ icon: Icon, tag, title, text, href, color }, index) => <Reveal key={title} delay={`reveal-delay-${(index % 3) + 1}`}><Link href={href} className="toolkit-card group block min-h-[300px] rounded-[1.25rem] p-6" style={{ backgroundColor: color }} data-testid={`card-toolkit-${index}`}><div className="flex items-start justify-between"><div className="grid size-10 place-items-center rounded-full bg-[#f3ecdf]/70 text-[#29352f]"><Icon size={18} strokeWidth={1.6} /></div><ArrowUpRight size={18} className="text-[#536059] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><div className="mt-20"><div className="eyebrow text-[#6b776e]">{tag}</div><h3 className="display mt-2 text-[30px] leading-[.95]">{title}</h3><p className="mt-4 text-[12px] leading-5 text-[#536059]">{text}</p></div></Link></Reveal>)}</div>
  </div></section>;
}

function DarkFeature() {
  const features = [
    { title: 'Vastu-Modern Fusion', text: 'A respectful balance of ancient wisdom and the way Indian families live today.', accent: '#b85c38', icon: Compass, href: '/transform' },
    { title: 'Rent-Friendly No-Drill Design', text: 'Smart, beautiful changes that leave your walls — and your deposit — exactly as they were.', accent: '#1f5c57', icon: House, href: '/transform' },
    { title: 'Real Prices in INR from Local + Artisan Sources', text: 'A considered edit of makers and materials, priced clearly so your choices stay grounded.', accent: '#8b6b2e', icon: IndianRupee, href: '/budget' },
  ];
  return <section className="bg-[#29352f] px-5 py-24 text-[#f3ecdf] sm:px-10 lg:px-20 lg:py-36"><div className="mx-auto max-w-[1240px]"><Reveal><div className="max-w-[720px]"><div className="eyebrow text-[#d89a48]">Built for Indian homes</div><h2 className="display mt-6 text-[clamp(3.7rem,6.8vw,7rem)] leading-[.85] tracking-[-.055em]">Design that understands the <em className="text-[#d89a48]">whole picture.</em></h2></div></Reveal><div className="mt-16 grid gap-4 md:grid-cols-3">{features.map(({ title, text, accent, icon: Icon, href }, index) => <Reveal key={title} delay={`reveal-delay-${index + 1}`}><Link href={href} className="group flex min-h-[310px] flex-col justify-between rounded-[1.25rem] border border-[#f3ecdf]/15 bg-[#f3ecdf]/[.04] p-6 transition-all hover:-translate-y-2 hover:bg-[#f3ecdf]/[.08]" data-testid={`card-feature-${index}`}><div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-full text-[#f3ecdf]" style={{ backgroundColor: accent }}><Icon size={19} strokeWidth={1.5} /></span><ArrowUpRight size={18} className="text-[#b5c0b8] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div><div><div className="eyebrow mb-3" style={{ color: accent }}>Made for real life</div><h3 className="display text-3xl leading-[.95]">{title}</h3><p className="mt-5 max-w-[280px] text-[13px] leading-6 text-[#b5c0b8]">{text}</p></div></Link></Reveal>)}</div></div></section>;
}

function FinalCta() {
  return <section className="relative overflow-hidden bg-[#d89a48] px-5 py-28 text-[#29352f] sm:px-10 lg:px-20 lg:py-36"><div className="pointer-events-none absolute -right-20 top-[-40%] size-[520px] rounded-full border-[1px] border-[#29352f]/15" /><div className="pointer-events-none absolute -right-5 top-[-23%] size-[370px] rounded-full border-[1px] border-[#29352f]/15" /><Reveal><div className="relative mx-auto max-w-[900px] text-center"><div className="eyebrow text-[#66705e]">Your next room is waiting</div><h2 className="display mt-5 text-[clamp(4rem,9vw,9rem)] leading-[.82] tracking-[-.06em]">Begin with<br /><em>a feeling.</em></h2><p className="mx-auto mt-8 max-w-[380px] text-[14px] leading-6 text-[#536059]">Two minutes. A handful of images. A home that suddenly makes more sense.</p><Link href="/quiz" className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#29352f] px-6 py-3.5 text-[13px] font-semibold text-[#f3ecdf] transition-transform hover:-translate-y-1" data-testid="link-final-quiz">Find my language <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link></div></Reveal></section>;
}

function Footer() {
  return <footer className="bg-[#f3ecdf] px-5 pb-8 pt-20 sm:px-10 lg:px-20"><div className="mx-auto max-w-[1240px]"><div className="grid gap-12 border-b border-[#d7cbbb] pb-16 md:grid-cols-[1.35fr_1fr_1fr_1fr]"><div><Link href="/" className="display text-[35px] tracking-[-.04em]" data-testid="link-footer-logo">aura<span className="text-[#b8573b]">/</span>home</Link><p className="mt-5 max-w-[245px] text-[13px] leading-6 text-[#68766d]">Interior design, interpreted for the way we live here.</p></div><div><div className="eyebrow mb-5 text-[#b8573b]">Explore</div><div className="grid gap-3 text-[13px] text-[#536059]"><Link href="/transform" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-transform">Transform a room</Link><Link href="/quiz" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-quiz">Take the quiz</Link><Link href="/budget" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-budget">Work with a budget</Link></div></div><div><div className="eyebrow mb-5 text-[#b8573b]">The house</div><div className="grid gap-3 text-[13px] text-[#536059]"><Link href="/community" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-community">Community</Link><a href="mailto:hello@aurahome.in" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-contact">Say hello</a><a href="#how-it-works" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-method">Our method</a></div></div><div><div className="eyebrow mb-5 text-[#b8573b]">From the journal</div><p className="display text-[22px] leading-tight">“The things we keep are the things that make a home.”</p><div className="mt-4 text-[11px] text-[#68766d]">Notes on living, occasionally.</div></div></div><div className="flex flex-col justify-between gap-4 pt-6 text-[10px] text-[#7c887e] sm:flex-row"><span>© 2025 AuraHome Studio</span><span>Made with room for feeling.</span><span>India · Everywhere</span></div></div></footer>;
}

function PathwayPage({ eyebrow, title, description, Icon, accent }: { eyebrow: string; title: ReactNode; description: string; Icon: LucideIcon; accent: string }) {
  return <main className="aura-shell grain route-grid min-h-[100dvh] bg-[#f3ecdf] px-5 pb-24 pt-36 text-[#29352f] sm:px-10 lg:px-20"><div className="mx-auto max-w-[1050px]"><Link href="/" className="mb-16 inline-flex items-center gap-2 text-[12px] text-[#68766d] transition-colors hover:text-[#b8573b]" data-testid="link-pathway-back"><ChevronRight size={14} className="rotate-180" /> Back to AuraHome</Link><div className="grid items-end gap-10 md:grid-cols-[1fr_.8fr]"><div><div className="eyebrow flex items-center gap-3 text-[#b8573b]"><span className="h-px w-7 bg-[#b8573b]" />{eyebrow}</div><h1 className="display mt-6 max-w-[680px] text-[clamp(4rem,9vw,8.5rem)] leading-[.82] tracking-[-.06em]">{title}</h1><p className="mt-8 max-w-[430px] text-[15px] leading-7 text-[#68766d]">{description}</p><Link href="/quiz" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#29352f] px-6 py-3.5 text-[13px] font-semibold text-[#f3ecdf] transition-transform hover:-translate-y-1" data-testid="link-pathway-continue">Continue exploring <ArrowRight size={16} /></Link></div><div className="relative min-h-[300px] overflow-hidden rounded-[1.4rem] p-8" style={{ backgroundColor: accent }}><div className="absolute -right-10 -top-10 size-52 rounded-full border border-[#29352f]/15" /><div className="absolute -bottom-16 -left-10 size-56 rounded-full border border-[#29352f]/15" /><Icon size={38} strokeWidth={1.2} /><div className="absolute bottom-8 left-8 right-8"><div className="eyebrow text-[#536059]">A small beginning</div><p className="display mt-2 text-3xl leading-none">Your point of view is already here.</p></div></div></div><div className="mt-24 grid gap-4 border-t border-[#d7cbbb] pt-6 text-[12px] text-[#68766d] sm:grid-cols-3"><span>01 / Notice</span><span>02 / Imagine</span><span>03 / Make it yours</span></div></div></main>;
}
function TransformPage() { return <PathwayPage eyebrow="Room transformer" title={<>See the room<br /><em className="text-[#b8573b]">differently.</em></>} description="Bring us a room, a corner or even a feeling. We’ll return a thoughtful direction you can actually live with." Icon={House} accent="#d7e3d8" />; }
function QuizPage() { return <PathwayPage eyebrow="The Aura quiz" title={<>Find your<br /><em className="text-[#b8573b]">home language.</em></>} description="A short, image-led ritual for discovering what your eyes already know. No design vocabulary required." Icon={Compass} accent="#e7c998" />; }
function BudgetPage() { return <PathwayPage eyebrow="The sensible edit" title={<>Beauty that<br /><em className="text-[#b8573b]">adds up.</em></>} description="Build a room around what matters most, then spend with clarity. Thoughtful interiors at your pace and your price." Icon={IndianRupee} accent="#e1c4b8" />; }
function CommunityPage() { return <PathwayPage eyebrow="The Aura circle" title={<>Homes with<br /><em className="text-[#b8573b]">a story.</em></>} description="A generous corner of the internet for real homes, clever fixes, inherited objects and the people who live around them." Icon={Users} accent="#d6d4c4" />; }

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/transform" component={TransformPage} />
        <Route path="/quiz" component={QuizPage} />
        <Route path="/budget" component={BudgetPage} />
        <Route path="/community" component={CommunityPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SiteNav />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
