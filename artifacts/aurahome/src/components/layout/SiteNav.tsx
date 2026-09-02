import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/BrandLogo';

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  
  useEffect(() => setOpen(false), [location]);
  
  // Hide nav on design flow as it has its own minimal header
  if (location === '/design') return null;
  
  const items = [
    ['Home', '/'], 
    ['Design', '/design'], 
    ['Budget', '/budget'], 
    ['Community', '/community']
  ];
  
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-7 sm:pt-6">
      <nav className="mx-auto flex max-w-[1240px] items-center justify-between rounded-full border border-[#d7cbbb]/80 bg-[#f3ecdf]/85 px-4 py-3 shadow-[0_10px_40px_rgba(74,52,32,.06)] backdrop-blur-md sm:px-6" aria-label="Primary navigation">
        <Link href="/" className="flex items-center gap-2.5" data-testid="link-logo">
          <BrandLogo size="nav" />
        </Link>
        <div className="hidden items-center gap-7 lg:flex">
          {items.map(([label, href]) => (
            <Link key={href} href={href} className="nav-link text-[14px] font-medium text-[#536059] transition-colors hover:text-[#b8573b]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>
              {label}
            </Link>
          ))}
        </div>
        <div className="hidden items-center gap-4 sm:flex">
          <Link href="/design" className="group flex items-center gap-2 rounded-full bg-[#29352f] px-4 py-2.5 text-[13px] font-semibold text-[#f3ecdf] transition-transform hover:-translate-y-0.5 btn-primary-glow" data-testid="link-nav-get-started">
            Start Designing <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <button type="button" className="grid size-10 place-items-center rounded-full border border-[#d7cbbb] text-[#29352f] sm:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} data-testid="button-mobile-menu">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>
      {open && (
        <div className="mx-0 mt-2 rounded-3xl border border-[#d7cbbb] bg-[#f3ecdf] p-5 shadow-xl sm:hidden">
          <div className="grid gap-4">
            {items.map(([label, href]) => (
              <Link key={href} href={href} className="flex items-center justify-between border-b border-[#d7cbbb] pb-3 text-[15px]" data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>
                {label}<ArrowUpRight size={16} />
              </Link>
            ))}
            <Link href="/design" className="mt-1 flex items-center justify-center rounded-full bg-[#b8573b] px-4 py-3 text-[15px] font-semibold text-[#f3ecdf]" data-testid="link-mobile-get-started">
              Start Designing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
