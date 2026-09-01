import { useEffect, useRef, useState, type ReactNode, type PointerEvent as ReactPointerEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
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
  return <main className="aura-shell grain overflow-hidden bg-[#f3ecdf] text-[#29352f]"><Hero /><Marquee /><RegionalStyles /><HowItWorks /><Comparison /><Stats /><Toolkit /><DarkFeature /><FinalCta /><Footer /></main>;
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

type StyleAccordionItem = {
  name: string;
  region: string;
  description: string;
  image: string;
};

function StyleAccordion({ items }: { items: StyleAccordionItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <div className="grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
      <div className="flex flex-col">
        {items.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={`group flex items-start justify-between border-t border-[#cfc2b2] py-5 text-left transition-colors last:border-b ${activeIndex === index ? 'text-[#b8573b]' : 'text-[#536059] hover:text-[#b8573b]'}`}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            aria-pressed={activeIndex === index}
          >
            <span>
              <span className="mono block text-[10px] tracking-[.14em] opacity-60">{item.region}</span>
              <span className="display mt-1 block text-[32px] leading-none">{item.name}</span>
            </span>
            <ArrowUpRight size={16} className={`mt-1 transition-transform duration-300 ${activeIndex === index ? 'translate-x-0.5 -translate-y-0.5' : 'opacity-40'}`} />
          </button>
        ))}
      </div>
      <div className="relative min-h-[330px] overflow-hidden rounded-[1.25rem] bg-[#d8c8b7]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={activeItem.image}
            src={activeItem.image}
            alt={`${activeItem.name} interior direction from ${activeItem.region}`}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.045 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#29352f]/80 to-transparent p-6 pt-20 text-[#f3ecdf]">
          <div className="eyebrow text-[#d89a48]">Regional point of view</div>
          <p className="mt-2 max-w-[360px] text-[13px] leading-6">{activeItem.description}</p>
        </div>
      </div>
    </div>
  );
}

function RegionalStyles() {
  const items: StyleAccordionItem[] = [
    { name: 'Nalukettu', region: 'South / 01', description: 'Timber, brass, and easy breathing room — a direction rooted in craft and climate.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85' },
    { name: 'Rajasthani Haveli', region: 'West / 02', description: 'Sun-washed colour and artisan texture, layered without feeling heavy.', image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85' },
    { name: 'Bonedi Bari', region: 'East / 03', description: 'Collected, literary, and full of old-world details that still work for today.', image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85' },
  ];
  return <section className="bg-[#eee5d7] px-5 py-24 sm:px-10 lg:px-20 lg:py-32"><div className="mx-auto max-w-[1240px]"><Reveal><div className="mb-14 flex flex-wrap items-end justify-between gap-6"><div><div className="eyebrow text-[#b8573b]">Regional style picker</div><h2 className="display mt-5 max-w-[680px] text-[clamp(3.2rem,6vw,6rem)] leading-[.88] tracking-[-.05em]">A point of view for <span className="text-[#b8573b]">everywhere.</span></h2></div><p className="max-w-[300px] text-[13px] leading-7 text-[#536059]">Explore regional directions and find the one that feels closest to home.</p></div></Reveal><Reveal delay="reveal-delay-1"><StyleAccordion items={items} /></Reveal></div></section>;
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
          <span className="display text-[26px] leading-none tracking-[-.035em]">aura<span className="text-[#b8573b]">/</span>homes</span>
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
          <Reveal delay="reveal-delay-2"><p className="mt-8 max-w-[440px] text-[15px] leading-7 text-[#536059]">AuraHomes uses AI to redesign your room around your taste, your region’s traditions, and your budget. The result should feel like you — only clearer.</p></Reveal>
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
            <div className="float-slow float-card absolute -right-5 top-[16%] w-44 rounded-2xl border border-[#e3d6c6] bg-[#f8f0e5]/95 p-4 shadow-[0_18px_35px_rgba(77,51,31,.12)] sm:-right-12">
              <div className="mb-5 flex items-center justify-between"><span className="eyebrow text-[#b8573b]">Your mood</span><Sparkles size={15} className="text-[#d89a48]" /></div>
              <div className="display text-[27px] leading-none">Warm<br /><em>and grounded</em></div>
              <div className="mt-4 h-1 rounded-full bg-[#e4d8c9]"><div className="h-full w-[76%] rounded-full bg-[#b8573b]" /></div>
            </div>
            <div className="float-slow-2 float-card absolute -bottom-5 -left-5 w-36 rounded-2xl bg-[#29352f] p-4 text-[#f8f0e5] shadow-xl sm:-left-11">
              <Compass size={18} className="mb-6 text-[#d89a48]" /><div className="eyebrow text-[#f8f0e5]/55">Style DNA</div><div className="mt-1 text-sm">Modern heirloom</div>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[#859087] lg:flex"><span className="h-10 w-px bg-[#b7b2a5]" /><span className="eyebrow">Scroll to explore</span></div>
    </section>
  );
}

const styles = ['Japandi', 'Bohemian', 'Nalukettu', 'Punjabi Haveli', 'Gen-Z Minimal', 'Vastu-Modern', 'Rajasthani Haveli', 'Bonedi Bari', 'Industrial Loft', 'Coastal', 'Chettinad', 'Pol House', 'Wada Style', 'Awadhi', 'Nizami Style', 'Indo-Portuguese', 'Kashmiri Wood Style', 'Assam-Type'];
function Marquee() {
  return <section className="overflow-hidden border-y border-[#d7cbbb] bg-[#eee5d7] py-5" aria-label="Interior design styles"><div className="marquee-track flex items-center gap-8">{[...styles, ...styles].map((style, index) => <div key={`${style}-${index}`} className="flex items-center gap-8 whitespace-nowrap"><span className="display text-[25px] italic text-[#536059]">{style}</span><span className="size-1.5 rounded-full bg-[#b8573b]" /></div>)}</div></section>;
}

function HowItWorks() {
  const steps = [
    { no: '01', icon: Compass, title: 'Share your room and taste', text: 'Upload a room photo and answer a short visual quiz so AuraHomes can read your colours, needs, and references.' },
    { no: '02', icon: Palette, title: 'Get a tailored redesign', text: 'Receive an AI-generated direction that balances your personal taste with regional traditions and practical constraints.' },
    { no: '03', icon: House, title: 'Shop the plan in budget', text: 'Turn the direction into a room plan with realistic INR sourcing, useful swaps, and a clear path to make it real.' },
  ];
  return <section id="how-it-works" className="px-5 py-28 sm:px-10 lg:px-20 lg:py-40"><div className="mx-auto max-w-[1240px]"><Reveal><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><div className="eyebrow text-[#b8573b]">The Aura method</div></div><div className="max-w-[700px]"><h2 className="display text-[clamp(3.2rem,6vw,6rem)] leading-[.9] tracking-[-.05em]">A clear path from room photo to <span className="text-[#b8573b]">redesign plan.</span></h2><p className="mt-7 max-w-[520px] text-[15px] leading-7 text-[#536059]">AuraHomes translates your taste, regional context, and budget into practical design choices. The poetic part is making the room feel like it was always yours.</p></div></div></Reveal>
    <div className="mt-20 grid gap-5 md:grid-cols-3">{steps.map(({ no, icon: Icon, title, text }, index) => <Reveal key={no} delay={`reveal-delay-${index + 1}`}><div className={`border-t border-[#cfc2b2] pt-5 ${index === 1 ? 'md:mt-12' : ''}`}><div className="flex items-center justify-between"><span className="mono text-[11px] text-[#b8573b]">{no}</span><Icon size={20} strokeWidth={1.5} className="text-[#b8573b]" /></div><h3 className="display mt-16 text-[32px] leading-none">{title}</h3><p className="mt-5 max-w-[290px] text-[13px] leading-6 text-[#68766d]">{text}</p></div></Reveal>)}</div>
  </div></section>;
}

function Comparison() {
  const [position, setPosition] = useState(54);
  const comparisonRef = useRef<HTMLDivElement>(null);
  const hasPreviewed = useRef(false);
  const previewFrame = useRef<number | null>(null);
  const userInteracted = useRef(false);
  useEffect(() => {
    const node = comparisonRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasPreviewed.current) return;
      hasPreviewed.current = true;
      const started = performance.now();
      const keyframes = [
        { at: 0, value: 54 },
        { at: 0.36, value: 27 },
        { at: 0.7, value: 70 },
        { at: 1, value: 54 },
      ];
      const tick = (now: number) => {
        if (userInteracted.current) return;
        const progress = Math.min(1, (now - started) / 1600);
        const segment = keyframes.findIndex((frame, index) => progress <= frame.at && index > 0);
        const nextIndex = segment === -1 ? keyframes.length - 1 : segment;
        const previous = keyframes[nextIndex - 1] ?? keyframes[0];
        const next = keyframes[nextIndex];
        const localProgress = (progress - previous.at) / (next.at - previous.at || 1);
        setPosition(previous.value + (next.value - previous.value) * Math.max(0, Math.min(1, localProgress)));
        if (progress < 1) previewFrame.current = requestAnimationFrame(tick);
      };
      previewFrame.current = requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (previewFrame.current) cancelAnimationFrame(previewFrame.current);
    };
  }, []);
  const updatePosition = (clientX: number) => {
    const box = comparisonRef.current?.getBoundingClientRect();
    if (!box) return;
    setPosition(Math.min(97, Math.max(3, ((clientX - box.left) / box.width) * 100)));
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => { if (event.buttons === 1) updatePosition(event.clientX); };
  return <section id="transform-preview" className="bg-[#dce5dc] px-5 py-24 sm:px-10 lg:px-20 lg:py-36"><div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20"><Reveal><div><div className="eyebrow flex items-center gap-3 text-[#557468]"><span className="h-px w-7 bg-[#557468]" />A little proof</div><h2 className="display mt-6 text-[clamp(3.6rem,6vw,6.5rem)] leading-[.86] tracking-[-.05em]">See a room<br /><span className="text-[#b8573b]">change.</span></h2><p className="mt-7 max-w-[360px] text-[15px] leading-7 text-[#536059]">Compare an original room with an AI redesign, then use the direction as a practical starting point for your own home.</p><Link href="/transform" className="group mt-8 inline-flex items-center gap-3 text-[13px] font-semibold text-[#29352f]" data-testid="link-comparison-transform">Explore your room <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link></div></Reveal>
       <Reveal delay="reveal-delay-2"><div ref={comparisonRef} className="relative aspect-[1.08] cursor-ew-resize touch-none select-none overflow-hidden rounded-[1.5rem] border-[7px] border-[#f3ecdf] bg-[#c5b39f] shadow-[0_26px_50px_rgba(55,74,64,.14)]" onPointerMove={onPointerMove} onPointerDown={(e) => { userInteracted.current = true; e.currentTarget.setPointerCapture(e.pointerId); updatePosition(e.clientX); }} role="slider" tabIndex={0} aria-label="Drag to compare the room before and after" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(position)} onKeyDown={(event) => { userInteracted.current = true; if (event.key === 'ArrowLeft') setPosition((p) => Math.max(3, p - 3)); if (event.key === 'ArrowRight') setPosition((p) => Math.min(97, p + 3)); }} data-testid="comparison-slider">
        <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="A calm living room before an AuraHomes transformation" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85" alt="A warm, layered living room after an AuraHomes transformation" /></div>
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
  return <section className="px-5 py-28 sm:px-10 lg:px-20 lg:py-40"><div className="mx-auto max-w-[1240px]"><Reveal><div className="flex flex-wrap items-end justify-between gap-6"><div><div className="eyebrow text-[#b8573b]">The toolkit</div><h2 className="display mt-5 text-[clamp(3.2rem,6vw,6rem)] leading-[.88] tracking-[-.05em]">Tools to redesign<br /><span className="text-[#b8573b]">your room.</span></h2></div><p className="max-w-[310px] text-[13px] leading-7 text-[#536059]">Choose a starting point: discover your taste, preview a change, respect your home’s traditions, or shop within a real budget.</p></div></Reveal>
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
  return <section className="relative overflow-hidden bg-[#d89a48] px-5 py-28 text-[#29352f] sm:px-10 lg:px-20 lg:py-36"><div className="pointer-events-none absolute -right-20 top-[-40%] size-[520px] rounded-full border-[1px] border-[#29352f]/15" /><div className="pointer-events-none absolute -right-5 top-[-23%] size-[370px] rounded-full border-[1px] border-[#29352f]/15" /><Reveal><div className="relative mx-auto max-w-[900px] text-center"><div className="eyebrow text-[#66705e]">Your next room is waiting</div><h2 className="display mt-5 text-[clamp(4rem,9vw,9rem)] leading-[.82] tracking-[-.06em]">Redesign your<br /><em>next room.</em></h2><p className="mx-auto mt-8 max-w-[440px] text-[14px] leading-7 text-[#536059]">Upload a room, answer a few questions, and get an AI direction personalized to your taste, traditions, and budget. Then make it yours.</p><Link href="/transform" className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#29352f] px-6 py-3.5 text-[13px] font-semibold text-[#f3ecdf] transition-transform hover:-translate-y-1" data-testid="link-final-quiz">Transform my room <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link></div></Reveal></section>;
}

function Footer() {
  return <footer className="bg-[#f3ecdf] px-5 pb-8 pt-20 sm:px-10 lg:px-20"><div className="mx-auto max-w-[1240px]"><div className="grid gap-12 border-b border-[#d7cbbb] pb-16 md:grid-cols-[1.35fr_1fr_1fr_1fr]"><div><Link href="/" className="display text-[35px] tracking-[-.04em]" data-testid="link-footer-logo">aura<span className="text-[#b8573b]">/</span>homes</Link><p className="mt-5 max-w-[245px] text-[13px] leading-6 text-[#536059]">Interior design, interpreted for the way we live here.</p></div><div><div className="eyebrow mb-5 text-[#b8573b]">Explore</div><div className="grid gap-3 text-[13px] text-[#536059]"><Link href="/transform" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-transform">Transform a room</Link><Link href="/quiz" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-quiz">Take the quiz</Link><Link href="/budget" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-budget">Work with a budget</Link></div></div><div><div className="eyebrow mb-5 text-[#b8573b]">The house</div><div className="grid gap-3 text-[13px] text-[#536059]"><Link href="/community" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-community">Community</Link><a href="mailto:hello@aurahomes.in" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-contact">Say hello</a><a href="#how-it-works" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-method">Our method</a></div></div><div><div className="eyebrow mb-5 text-[#b8573b]">From the journal</div><p className="display text-[22px] leading-tight">“The things we keep are the things that make a home.”</p><div className="mt-4 text-[11px] text-[#68766d]">Notes on living, occasionally.</div></div></div><div className="flex flex-col justify-between gap-4 pt-6 text-[10px] text-[#7c887e] sm:flex-row"><span>© 2025 AuraHomes Studio</span><span>Made with room for feeling.</span><span>India · Everywhere</span></div></div></footer>;
}

function PathwayPage({ eyebrow, title, description, Icon, accent }: { eyebrow: string; title: ReactNode; description: string; Icon: LucideIcon; accent: string }) {
  return <main className="aura-shell grain route-grid min-h-[100dvh] bg-[#f3ecdf] px-5 pb-24 pt-36 text-[#29352f] sm:px-10 lg:px-20"><div className="mx-auto max-w-[1050px]"><Link href="/" className="mb-16 inline-flex items-center gap-2 text-[12px] text-[#68766d] transition-colors hover:text-[#b8573b]" data-testid="link-pathway-back"><ChevronRight size={14} className="rotate-180" /> Back to AuraHomes</Link><div className="grid items-end gap-10 md:grid-cols-[1fr_.8fr]"><div><div className="eyebrow flex items-center gap-3 text-[#b8573b]"><span className="h-px w-7 bg-[#b8573b]" />{eyebrow}</div><h1 className="display mt-6 max-w-[680px] text-[clamp(4rem,9vw,8.5rem)] leading-[.82] tracking-[-.06em]">{title}</h1><p className="mt-8 max-w-[430px] text-[15px] leading-7 text-[#536059]">{description}</p><Link href="/quiz" className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#29352f] px-6 py-3.5 text-[13px] font-semibold text-[#f3ecdf] transition-transform hover:-translate-y-1" data-testid="link-pathway-continue">Continue exploring <ArrowRight size={16} /></Link></div><div className="relative min-h-[300px] overflow-hidden rounded-[1.4rem] p-8" style={{ backgroundColor: accent }}><div className="absolute -right-10 -top-10 size-52 rounded-full border border-[#29352f]/15" /><div className="absolute -bottom-16 -left-10 size-56 rounded-full border border-[#29352f]/15" /><Icon size={38} strokeWidth={1.2} /><div className="absolute bottom-8 left-8 right-8"><div className="eyebrow text-[#536059]">A small beginning</div><p className="display mt-2 text-3xl leading-none">Your point of view is already here.</p></div></div></div><div className="mt-24 grid gap-4 border-t border-[#d7cbbb] pt-6 text-[12px] text-[#68766d] sm:grid-cols-3"><span>01 / Notice</span><span>02 / Imagine</span><span>03 / Make it yours</span></div></div></main>;
}
function TransformPage() { return <PathwayPage eyebrow="Room transformer" title={<>See the room<br /><em className="text-[#b8573b]">differently.</em></>} description="Bring us a room, a corner or even a feeling. We’ll return a thoughtful direction you can actually live with." Icon={House} accent="#d7e3d8" />; }
function QuizPage() { return <PathwayPage eyebrow="The Aura quiz" title={<>Find your<br /><em className="text-[#b8573b]">home language.</em></>} description="A short, image-led ritual for discovering what your eyes already know. No design vocabulary required." Icon={Compass} accent="#e7c998" />; }
function BudgetPage() { return <PathwayPage eyebrow="The sensible edit" title={<>Beauty that<br /><em className="text-[#b8573b]">adds up.</em></>} description="Build a room around what matters most, then spend with clarity. Thoughtful interiors at your pace and your price." Icon={IndianRupee} accent="#e1c4b8" />; }
function CommunityPage() { return <PathwayPage eyebrow="The Aura circle" title={<>Homes with<br /><em className="text-[#b8573b]">a story.</em></>} description="A generous corner of the internet for real homes, clever fixes, inherited objects and the people who live around them." Icon={Users} accent="#d6d4c4" />; }

function Router() {
  const [location] = useLocation();
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location}
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.34, ease: 'easeOut' }}
      >
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
      </motion.div>
    </AnimatePresence>
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
