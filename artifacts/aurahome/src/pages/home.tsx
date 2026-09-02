import { useState, useRef, useEffect, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'wouter';
import { Sparkles, ArrowRight, ArrowDownRight, ArrowUpRight, Compass, MoveHorizontal, Palette, House, IndianRupee } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';
import { regionalStyles, getImageUrl } from '@/data/regionalStyles';
import { handleImageError } from '@/lib/imageFallback';

function Hero() {
  return (
    <section className="hero-aurora relative min-h-[760px] px-5 pb-20 pt-36 sm:px-10 sm:pt-44 lg:min-h-[820px] lg:px-20">
      <div className="pointer-events-none absolute -left-32 top-40 size-72 rounded-full bg-[#d89a48]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-8%] top-12 size-96 rounded-full border border-[#b8573b]/10" />
      <div className="mx-auto grid max-w-[1240px] items-center gap-14 xl:grid-cols-[.93fr_1.07fr] xl:gap-20">
        <div className="relative z-10 max-w-none xl:max-w-[590px]">
          <Reveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b8573b]/30 bg-[#f8f0e5]/70 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-[#b8573b]">
              <Sparkles size={12} /> AI-Powered Interior Design
            </div>
          </Reveal>
          <Reveal delay="reveal-delay-1">
            <h1 className="display hero-title text-[#29352f]">
              <span className="hero-title-line">Your Dream Home,</span>
              <span className="hero-title-line text-gradient">Designed by <span className="hero-ai text-gradient">AI.</span></span>
            </h1>
          </Reveal>
          <Reveal delay="reveal-delay-2">
            <p className="mt-8 max-w-[440px] text-[16px] leading-[1.8] text-[#29352f] opacity-80">
              AI-powered room redesign personalized to your taste, your region's traditions, and your budget. The result should feel like you — only clearer.
            </p>
          </Reveal>
          <Reveal delay="reveal-delay-3">
            <div className="mt-9 flex flex-wrap items-center gap-5">
               <Link href="/design" className="group flex items-center gap-3 rounded-full bg-[#c8a97e] px-6 py-3.5 text-[14px] font-semibold text-[#29352f] shadow-[0_12px_26px_rgba(200,169,126,.28)] transition-all hover:-translate-y-1 hover:bg-[#b8976c] btn-gold-glow" data-testid="link-hero-design">
                 Start Designing <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
          </Reveal>
          <div className="mt-16 flex items-center gap-3 text-[#7a827b]">
            <div className="flex -space-x-2">
              {['#c68467', '#7c9b8d', '#d5a464'].map((color, index) => (
                <span key={color} className="grid size-7 place-items-center rounded-full border-2 border-[#f3ecdf] text-[9px] font-bold text-[#f3ecdf]" style={{ backgroundColor: color }}>
                  {['AK', 'MN', 'RS'][index]}
                </span>
              ))}
            </div>
             <span className="text-[12px] opacity-80">2,400+ Indian homes transformed this month</span>
          </div>
        </div>
        <Reveal className="relative xl:mt-0" delay="reveal-delay-2">
          <div className="relative mx-auto max-w-[570px]">
            <div className="absolute -left-8 top-8 h-[88%] w-16 rounded-[50%] bg-[#d89a48]/25 blur-2xl sm:-left-14" />
            <div className="image-zoom relative aspect-[.82] overflow-hidden rounded-[13rem_13rem_1rem_1rem] border-[10px] border-[#e3d6c6] shadow-[0_35px_70px_rgba(77,51,31,.18)] sm:aspect-[.9]">
              <img onError={handleImageError} className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1100&q=85" alt="Sunlit Indian-inspired living room with a low sofa and warm wood" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#29352f]/40 via-transparent to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between text-[#f8f0e5]">
                <div>
                  <div className="eyebrow mb-2 text-[#f8f0e5]/75">A home in progress</div>
                  <p className="display text-4xl">Jaipur, 08:42</p>
                </div>
                <span className="grid size-11 place-items-center rounded-full border border-[#f8f0e5]/60"><ArrowDownRight size={18} /></span>
              </div>
            </div>
            <motion.div animate={{ filter: ['drop-shadow(0 10px 18px rgba(77,51,31,.08))', 'drop-shadow(0 16px 27px rgba(184,87,59,.2))', 'drop-shadow(0 10px 18px rgba(77,51,31,.08))'] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-5 top-[16%] w-44 sm:-right-12">
              <div data-testid="hero-mood-card" className="float-slow rounded-2xl border border-[#e3d6c6] bg-[#f8f0e5]/95 p-4 shadow-[0_18px_35px_rgba(77,51,31,.12)]">
                <div className="mb-5 flex items-center justify-between"><span className="eyebrow text-[#b8573b]">Your mood</span><Sparkles size={15} className="text-[#d89a48]" /></div>
                <div className="display text-[28px] leading-none">Warm<br /><span className="italic text-[#536059]">and grounded</span></div>
                <div className="mt-4 h-1 rounded-full bg-[#e4d8c9]"><div className="h-full w-[76%] rounded-full bg-[#b8573b]" /></div>
              </div>
            </motion.div>
            <motion.div animate={{ filter: ['drop-shadow(0 10px 18px rgba(77,51,31,.08))', 'drop-shadow(0 16px 24px rgba(31,92,87,.2))', 'drop-shadow(0 10px 18px rgba(77,51,31,.08))'] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-5 -left-5 w-36 sm:-left-11">
              <div data-testid="hero-style-dna-card" className="float-slow-2 rounded-2xl bg-[#29352f] p-4 text-[#f8f0e5] shadow-xl">
                <Compass size={18} className="mb-6 text-[#d89a48]" /><div className="eyebrow text-[#f8f0e5]/55">Style DNA</div><div className="mt-1 text-sm">Modern heirloom</div>
              </div>
            </motion.div>
          </div>
        </Reveal>
      </div>
      <div className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 text-[#859087] lg:flex">
        <span className="h-10 w-px bg-[#b7b2a5]" />
        <span className="eyebrow">Scroll to explore</span>
      </div>
    </section>
  );
}

function Marquee() {
  const styles = regionalStyles.map(s => s.name);
  return (
    <section className="overflow-hidden border-y border-[#d7cbbb] bg-[#eee5d7] py-5" aria-label="Interior design styles">
      <div className="marquee-track flex items-center gap-8">
        {[...styles, ...styles].map((style, index) => (
          <div key={`${style}-${index}`} className="flex items-center gap-8 whitespace-nowrap">
            <span className="display text-[28px] italic text-[#536059]">{style}</span>
            <span className="size-1.5 rounded-full bg-[#b8573b]" />
          </div>
        ))}
      </div>
    </section>
  );
}

function StyleAccordion({ items }: { items: typeof regionalStyles }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <div className="grid gap-5 lg:grid-cols-[.78fr_1.22fr]">
      <div className="flex flex-col">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className={`group flex items-start justify-between border-t border-[#cfc2b2] py-6 text-left transition-colors last:border-b ${activeIndex === index ? 'text-[#b8573b]' : 'text-[#536059] hover:text-[#b8573b]'}`}
            onMouseEnter={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
            onClick={() => setActiveIndex(index)}
            aria-pressed={activeIndex === index}
            data-testid={`regional-style-option-${item.id}`}
            onPointerEnter={() => setActiveIndex(index)}
          >
            <span>
              <span className="mono block text-[11px] tracking-[.14em] opacity-60">{item.direction} / 0{index + 1}</span>
              <span className="display mt-2 block text-[36px] leading-none">{item.name}</span>
            </span>
            <ArrowUpRight size={20} className={`mt-2 transition-transform duration-300 ${activeIndex === index ? 'translate-x-0.5 -translate-y-0.5' : 'opacity-40'}`} />
          </button>
        ))}
      </div>
      <div className="relative min-h-[380px] overflow-hidden rounded-[1.25rem] bg-[#d8c8b7]">
        <AnimatePresence mode="sync" initial={false}>
          <motion.img
            key={activeItem.id}
            data-testid="regional-accordion-image"
            src={getImageUrl(activeItem.imageSearchTerm)}
            alt={activeItem.name}
              onError={handleImageError}
            className="regional-image-enter absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#29352f]/80 to-transparent p-8 pt-24 text-[#f3ecdf]">
          <div className="eyebrow text-[#d89a48]">{activeItem.region}</div>
          <p className="mt-2 max-w-[360px] text-[15px] leading-[1.6] opacity-90">{activeItem.caption}</p>
        </div>
      </div>
    </div>
  );
}

function RegionalStyles() {
  const directions = Array.from(new Set(regionalStyles.filter(s => s.isRegional).map(s => s.direction)));
  const [activeDirection, setActiveDirection] = useState(directions[0]);
  
  const activeItems = regionalStyles.filter(s => s.isRegional && s.direction === activeDirection);
  
  return (
    <section className="bg-[#eee5d7] px-5 py-24 sm:px-10 lg:px-20 lg:py-32">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow text-[#b8573b]">Regional style picker</div>
              <h2 className="display type-h2 mt-5 max-w-[680px]">
                A point of view for <span className="text-[#b8573b]">everywhere.</span>
              </h2>
            </div>
            <p className="max-w-[320px] text-[15px] leading-[1.8] text-[#29352f] opacity-80">
              Explore directions born from regional climate and craft. Select the one that feels closest to home.
            </p>
          </div>
        </Reveal>
        
        <Reveal delay="reveal-delay-1">
          <div className="mb-8 flex flex-wrap gap-2">
            {directions.map(dir => (
              <button 
                key={dir} 
                onClick={() => setActiveDirection(dir)}
                className={`rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${activeDirection === dir ? 'bg-[#b8573b] text-white' : 'border border-[#d7cbbb] bg-white/40 text-[#536059] hover:bg-white'}`}
              >
                {dir}
              </button>
            ))}
          </div>
          <StyleAccordion items={activeItems} />
        </Reveal>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { no: '01', icon: Compass, title: 'Share your room and taste', text: 'Upload a room photo and answer a short visual quiz so AuraHomes can read your colours, needs, and references.' },
    { no: '02', icon: Palette, title: 'Get a tailored redesign', text: 'Receive an AI-generated direction that balances your personal taste with regional traditions and practical constraints.' },
    { no: '03', icon: House, title: 'Shop the plan in budget', text: 'Turn the direction into a room plan with realistic INR sourcing, useful swaps, and a clear path to make it real.' },
  ];
  return (
    <section id="how-it-works" className="px-5 py-28 sm:px-10 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
            <div><div className="eyebrow text-[#b8573b]">The Aura method</div></div>
            <div className="max-w-[700px]">
              <h2 className="display type-h2">
                A clear path from room photo to <span className="text-[#b8573b]">redesign plan.</span>
              </h2>
              <p className="mt-7 max-w-[520px] text-[15px] leading-[1.8] text-[#29352f] opacity-80">
                AuraHomes translates your taste, regional context, and budget into practical design choices. The poetic part is making the room feel like it was always yours.
              </p>
            </div>
          </div>
        </Reveal>
        <div className="uniform-card-grid mt-20 grid gap-5 md:grid-cols-3">
          {steps.map(({ no, icon: Icon, title, text }, index) => (
            <Reveal key={no} delay={`reveal-delay-${index + 1}`}>
              <div className="grid h-full grid-rows-[4rem_7.5rem_1fr] border-t border-[#cfc2b2] pt-5">
                <div className="flex items-start justify-between">
                  <span className="mono text-[12px] text-[#b8573b]">{no}</span>
                  <Icon size={20} strokeWidth={1.5} className="text-[#b8573b]" />
                </div>
                <h3 className="display type-h3 self-start">{title}</h3>
                <p className="type-body max-w-[290px] text-[#536059]">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
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
  
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => { 
    if (event.buttons === 1) updatePosition(event.clientX); 
  };
  
  return (
    <section id="transform-preview" className="bg-[#dce5dc] px-5 py-24 sm:px-10 lg:px-20 lg:py-36">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
        <Reveal>
          <div>
            <div className="eyebrow flex items-center gap-3 text-[#557468]">
              <span className="h-px w-7 bg-[#557468]" />A little proof
            </div>
            <h2 className="display type-h2 mt-6">
              See a room<br /><span className="text-[#b8573b]">change.</span>
            </h2>
            <p className="mt-7 max-w-[360px] text-[15px] leading-[1.8] text-[#29352f] opacity-80">
              Compare an original room with an AI redesign, then use the direction as a practical starting point for your own home.
            </p>
            <Link href="/design" className="group mt-8 inline-flex items-center gap-3 text-[14px] font-semibold text-[#29352f]" data-testid="link-comparison-transform">
              Start redesigning <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
        <Reveal delay="reveal-delay-2">
          <div 
            ref={comparisonRef} 
            className="relative aspect-[1.08] cursor-ew-resize touch-none select-none overflow-hidden rounded-[1.5rem] border-[7px] border-[#f3ecdf] bg-[#c5b39f] shadow-[0_26px_50px_rgba(55,74,64,.14)]" 
            onPointerMove={onPointerMove} 
            onPointerDown={(e) => { userInteracted.current = true; e.currentTarget.setPointerCapture(e.pointerId); updatePosition(e.clientX); }} 
            role="slider" 
            tabIndex={0} 
            aria-label="Drag to compare the room before and after" 
            aria-valuemin={0} 
            aria-valuemax={100} 
            aria-valuenow={Math.round(position)} 
            onKeyDown={(event) => { 
              userInteracted.current = true; 
              if (event.key === 'ArrowLeft') setPosition((p) => Math.max(3, p - 3)); 
              if (event.key === 'ArrowRight') setPosition((p) => Math.min(97, p + 3)); 
            }} 
            data-testid="comparison-slider"
          >
            <img onError={handleImageError} className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85" alt="A calm living room before an AuraHomes transformation" />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
              <img onError={handleImageError} className="h-full w-full object-cover" src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85" alt="A warm, layered living room after an AuraHomes transformation" />
            </div>
            <div className="absolute left-5 top-5 rounded-full bg-[#f3ecdf]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#536059]">Before</div>
            <div className="absolute right-5 top-5 rounded-full bg-[#29352f]/90 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-[#f3ecdf]">After</div>
            <div className="slider-handle absolute bottom-0 top-0 z-10 w-px bg-[#f3ecdf]" style={{ left: `${position}%` }}>
              <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#f3ecdf] bg-[#b8573b] text-[#f3ecdf]">
                <MoveHorizontal size={19} />
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
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
      const tick = (now: number) => { 
        const progress = Math.min(1, (now - started) / 1300); 
        setValue(Math.round(target * (1 - Math.pow(1 - progress, 3)))); 
        if (progress < 1) requestAnimationFrame(tick); 
      };
      requestAnimationFrame(tick); 
      observer.disconnect();
    }, { threshold: .6 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{value.toLocaleString('en-IN')}{suffix}</span>;
}

function Stats() {
  return (
    <section className="bg-[#29352f] px-5 py-20 text-[#f3ecdf] sm:px-10 lg:px-20">
      <div className="mx-auto grid max-w-[1240px] gap-12 md:grid-cols-[.8fr_1.2fr] md:items-end">
        <Reveal>
          <div>
            <div className="eyebrow text-[#d89a48]">A growing point of view</div>
            <p className="display mt-5 max-w-[360px] text-4xl leading-[.95] text-[#f3ecdf]">
              A thousand homes, none of them the same.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-y-12 sm:grid-cols-4">
          {[
            [12400, '+', 'Rooms Transformed'], 
            [6, '', 'Regional Styles'], 
            [98, '%', 'Satisfaction'], 
            [45, 's', 'Avg Generation Time']
          ].map(([number, suffix, label], index) => (
            <Reveal key={label} delay={`reveal-delay-${(index % 3) + 1}`}>
              <div className="border-l border-[#f3ecdf]/20 pl-4 sm:pl-5">
                <div className="display text-[45px] leading-none text-[#d89a48]">
                  <CountUp target={Number(number)} suffix={String(suffix)} />
                </div>
                <div className="mt-3 max-w-[110px] text-[12px] leading-4 text-[#b5c0b8]">{label}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Toolkit() {
  const toolkit = [
    { icon: Sparkles, tag: 'Start here', title: 'Start Designing', text: 'Discover the colours, shapes, and memories that feel most like you.', href: '/design', color: '#e7c998' },
    { icon: Compass, tag: 'Tradition, reimagined', title: 'Vastu-Corrected', text: 'Thoughtful layouts that honour Vastu without compromising your point of view.', href: '/design', color: '#d7e3d8' },
    { icon: House, tag: 'See it in place', title: 'AR Room View', text: 'Preview a new direction in your actual room before you commit.', href: '/design', color: '#d6d4c4' },
    { icon: IndianRupee, tag: 'Keep it real', title: 'Real-Price Sourcing', text: 'Beautiful finds with transparent INR pricing from local makers and artisans.', href: '/budget', color: '#e1c4b8' },
  ];
  return (
    <section className="px-5 py-28 sm:px-10 lg:px-20 lg:py-40">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow text-[#b8573b]">The toolkit</div>
              <h2 className="display type-h2 mt-5">
                Tools to redesign<br /><span className="text-[#b8573b]">your room.</span>
              </h2>
            </div>
            <p className="max-w-[320px] text-[15px] leading-[1.8] text-[#29352f] opacity-80">
              Start your journey: discover your taste, preview a change, respect your home's traditions, or shop within a real budget.
            </p>
          </div>
        </Reveal>
        <div className="uniform-card-grid mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {toolkit.map(({ icon: Icon, tag, title, text, href, color }, index) => (
            <Reveal key={title} delay={`reveal-delay-${(index % 3) + 1}`}>
              <Link href={href} className="toolkit-card group block min-h-[300px] rounded-[1.25rem] p-6" style={{ backgroundColor: color }} data-testid={`card-toolkit-${index}`}>
                <div className="flex items-start justify-between">
                  <div className="grid size-10 place-items-center rounded-full bg-[#f3ecdf]/70 text-[#29352f]">
                    <Icon size={18} strokeWidth={1.6} />
                  </div>
                  <ArrowUpRight size={18} className="text-[#536059] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div className="mt-20">
                  <div className="eyebrow text-[#6b776e]">{tag}</div>
                   <h3 className="display type-h3 mt-2">{title}</h3>
                  <p className="mt-4 text-[13px] leading-[1.6] text-[#536059]">{text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DarkFeature() {
  const features = [
    { title: 'Vastu-Modern Fusion', text: 'A respectful balance of ancient wisdom and the way Indian families live today.', accent: '#b85c38', icon: Compass, href: '/design' },
    { title: 'Rent-Friendly No-Drill Design', text: 'Smart, beautiful changes that leave your walls — and your deposit — exactly as they were.', accent: '#1f5c57', icon: House, href: '/design' },
    { title: 'Real Prices in INR from Local Sources', text: 'A considered edit of makers and materials, priced clearly so your choices stay grounded.', accent: '#8b6b2e', icon: IndianRupee, href: '/budget' },
  ];
  return (
    <section className="bg-[#29352f] px-5 py-24 text-[#f3ecdf] sm:px-10 lg:px-20 lg:py-36">
      <div className="mx-auto max-w-[1240px]">
        <Reveal>
          <div className="max-w-[720px]">
            <div className="eyebrow text-[#d89a48]">Built for Indian homes</div>
            <h2 className="display type-h2 mt-6">
              Design that understands the <span className="text-[#d89a48] italic">whole picture.</span>
            </h2>
          </div>
        </Reveal>
        <div className="uniform-card-grid mt-16 grid gap-4 md:grid-cols-3">
          {features.map(({ title, text, accent, icon: Icon, href }, index) => (
            <Reveal key={title} delay={`reveal-delay-${index + 1}`}>
              <Link href={href} className="group flex min-h-[310px] flex-col justify-between rounded-[1.25rem] border border-[#f3ecdf]/15 bg-[#f3ecdf]/[.04] p-6 transition-all hover:-translate-y-2 hover:bg-[#f3ecdf]/[.08]" data-testid={`card-feature-${index}`}>
                <div className="flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-full text-[#f3ecdf]" style={{ backgroundColor: accent }}>
                    <Icon size={19} strokeWidth={1.5} />
                  </span>
                  <ArrowUpRight size={18} className="text-[#b5c0b8] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
                <div>
                  <div className="eyebrow mb-3" style={{ color: accent }}>Made for real life</div>
                  <h3 className="display type-h3">{title}</h3>
                  <p className="mt-5 max-w-[280px] text-[14px] leading-[1.6] text-[#b5c0b8]">{text}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-[#d89a48] px-5 py-28 text-[#29352f] sm:px-10 lg:px-20 lg:py-36">
      <div className="pointer-events-none absolute -right-20 top-[-40%] size-[520px] rounded-full border-[1px] border-[#29352f]/15" />
      <div className="pointer-events-none absolute -right-5 top-[-23%] size-[370px] rounded-full border-[1px] border-[#29352f]/15" />
      <Reveal>
        <div className="relative mx-auto max-w-[900px] text-center">
          <div className="eyebrow text-[#66705e]">Your next room is waiting</div>
          <h2 className="display type-h2 mt-5">
            Redesign your<br /><span className="italic">next room.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-[440px] text-[15px] leading-[1.8] text-[#29352f] opacity-80">
            Upload a room, answer a few questions, and get an AI direction personalized to your taste, traditions, and budget. Then make it yours.
          </p>
          <Link href="/design" className="group mt-9 inline-flex items-center gap-3 rounded-full bg-[#29352f] px-6 py-3.5 text-[14px] font-semibold text-[#f3ecdf] transition-transform hover:-translate-y-1 btn-primary-glow" data-testid="link-final-design">
            Start Designing <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <main className="aura-shell grain overflow-hidden bg-[#f3ecdf] text-[#29352f]">
      <Hero />
      <Marquee />
      <RegionalStyles />
      <HowItWorks />
      <Comparison />
      <Stats />
      <Toolkit />
      <DarkFeature />
      <FinalCta />
    </main>
  );
}
