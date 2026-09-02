import { Link } from 'wouter';
import { BrandLogo } from '@/components/BrandLogo';

export function Footer() {
  return (
    <footer className="bg-[#f3ecdf] px-5 pb-8 pt-20 sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-12 border-b border-[#d7cbbb] pb-16 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex" data-testid="link-footer-logo">
              <BrandLogo size="footer" />
            </Link>
            <p className="mt-5 max-w-[245px] text-[14px] leading-6 text-[#29352f] opacity-80">
              Interior design, interpreted for the way we live here.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-5 text-[#b8573b]">Explore</div>
            <div className="grid gap-3 text-[13px] text-[#536059]">
              <Link href="/design" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-design">Design a room</Link>
              <Link href="/budget" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-budget">Work with a budget</Link>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-5 text-[#b8573b]">The house</div>
            <div className="grid gap-3 text-[13px] text-[#536059]">
              <Link href="/community" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-community">Community</Link>
              <a href="mailto:hello@aurahomes.in" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-contact">Say hello</a>
              <a href="#how-it-works" className="transition-colors hover:text-[#b8573b]" data-testid="link-footer-method">Our method</a>
            </div>
          </div>
          <div>
            <div className="eyebrow mb-5 text-[#b8573b]">From the journal</div>
            <p className="display text-[24px] leading-tight">“The things we keep are the things that make a home.”</p>
            <div className="mt-4 text-[12px] text-[#68766d]">Notes on living, occasionally.</div>
          </div>
        </div>
        <div className="flex flex-col justify-between gap-4 pt-6 text-[11px] text-[#7c887e] sm:flex-row">
          <span>© 2025 AuraHomes Studio</span>
          <span>Made with room for feeling.</span>
          <span>India · Everywhere</span>
        </div>
      </div>
    </footer>
  );
}
