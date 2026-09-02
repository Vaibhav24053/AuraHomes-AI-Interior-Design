import { useState } from 'react';
import { IndianRupee, ChevronRight, Info } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Reveal } from '@/components/ui/reveal';

export default function BudgetPage() {
  const [budgetType, setBudgetType] = useState<'lumpsum' | 'emi'>('lumpsum');
  const [lumpSum, setLumpSum] = useState(250000);
  const [tenure, setTenure] = useState(12);
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Downloading List",
      description: "Your sourced items list is being prepared.",
    });
  };

  // EMI Calculation: P x R x (1+R)^N / [(1+R)^N-1]
  const calculateEMI = (principal: number, months: number, annualRate = 13) => {
    const r = (annualRate / 12) / 100;
    const emi = principal * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1);
    return Math.round(emi);
  };

  const currentEMI = calculateEMI(lumpSum, tenure);
  const scalePrice = (price: number) => Math.round((price * (lumpSum / 250000)) / 100) * 100;

  const items = [
    {
      name: 'Solid Wood Bed Frame',
      artisanDesc: 'Hand-carved reclaimed teak from local workshop',
      prices: { branded: 85000, local: 35000, artisan: 52000 }
    },
    {
      name: 'Textured Wool Rug',
      artisanDesc: 'Hand-loomed natural undyed wool',
      prices: { branded: 18000, local: 6500, artisan: 12000 }
    },
    {
      name: 'Terracotta Accent Lamp',
      artisanDesc: 'Thrown by regional potters cluster',
      prices: { branded: 6500, local: 1200, artisan: 3800 }
    },
    {
      name: 'Linen Curtains (Set of 2)',
      artisanDesc: 'Hand block printed natural linen',
      prices: { branded: 12000, local: 4500, artisan: 7500 }
    }
  ];

  const scaledItems = items.map(item => ({
    ...item,
    prices: {
      branded: scalePrice(item.prices.branded),
      local: scalePrice(item.prices.local),
      artisan: scalePrice(item.prices.artisan),
    },
  }));

  const totals = (['branded', 'local', 'artisan'] as const).reduce((result, tier) => ({
    ...result,
    [tier]: scaledItems.reduce((sum, item) => sum + item.prices[tier], 0),
  }), { branded: 0, local: 0, artisan: 0 });

  return (
    <main className="aura-shell grain route-grid min-h-[100dvh] bg-[#f3ecdf] px-5 pb-24 pt-36 text-[#29352f] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1050px]">
        <Link href="/" className="mb-16 inline-flex items-center gap-2 text-[12px] text-[#68766d] transition-colors hover:text-[#b8573b]">
          <ChevronRight size={14} className="rotate-180" /> Back to AuraHomes
        </Link>
        
        <Reveal className="grid items-end gap-10 md:grid-cols-[1fr_.8fr] mb-20">
          <div>
            <div className="eyebrow flex items-center gap-3 text-[#b8573b]">
              <span className="h-px w-7 bg-[#b8573b]" />The sensible edit
            </div>
            <h1 className="display type-h1 mt-6 max-w-[680px]">
              Beauty that<br /><span className="text-[#b8573b] italic">adds up.</span>
            </h1>
            <p className="mt-8 max-w-[430px] text-[16px] leading-[1.8] text-[#536059]">
              Build a room around what matters most, then spend with clarity. See how different sourcing tiers affect your total.
            </p>
          </div>
          <div className="relative min-h-[250px] overflow-hidden rounded-[1.4rem] p-8 bg-[#e1c4b8]">
            <div className="absolute -right-10 -top-10 size-52 rounded-full border border-[#29352f]/15" />
            <div className="absolute -bottom-16 -left-10 size-56 rounded-full border border-[#29352f]/15" />
            <IndianRupee size={38} strokeWidth={1.2} />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="eyebrow text-[#536059]">Transparent pricing</div>
              <p className="display mt-2 text-3xl leading-none">Know exactly where it goes.</p>
            </div>
          </div>
        </Reveal>

        <Reveal className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          {/* Budget Calculator */}
          <div className="rounded-2xl border border-[#d7cbbb] bg-white/40 p-8 shadow-sm">
            <h2 className="display type-h3 mb-6">Plan your spend</h2>
            
            <div className="mb-8 flex gap-2 rounded-lg border border-[#d7cbbb] bg-[#f3ecdf] p-1">
              <button 
                onClick={() => setBudgetType('lumpsum')}
                className={`flex-1 rounded-md py-2.5 text-[13px] font-medium transition-colors ${budgetType === 'lumpsum' ? 'bg-white shadow-sm' : 'text-[#68766d] hover:bg-white/50'}`}
              >
                Lump Sum
              </button>
              <button 
                onClick={() => setBudgetType('emi')}
                className={`flex-1 rounded-md py-2.5 text-[13px] font-medium transition-colors ${budgetType === 'emi' ? 'bg-white shadow-sm' : 'text-[#68766d] hover:bg-white/50'}`}
              >
                Monthly EMI
              </button>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[13px] font-medium text-[#536059]">Total Project Budget</span>
                <span className="display text-3xl text-[#b8573b]">₹{lumpSum.toLocaleString('en-IN')}</span>
              </div>
              <input 
                type="range" 
                min={50000} 
                max={1000000} 
                step={10000}
                value={lumpSum}
                onChange={e => setLumpSum(Number(e.target.value))}
                className="w-full accent-[#b8573b]"
              />
              <div className="flex justify-between mt-2 text-[11px] text-[#68766d]">
                <span>₹50k</span>
                <span>₹10L+</span>
              </div>
            </div>

            {budgetType === 'emi' && (
              <div className="mb-8 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-end mb-4">
                  <span className="text-[13px] font-medium text-[#536059]">Tenure (Months)</span>
                  <span className="display text-2xl">{tenure} mo</span>
                </div>
                <input 
                  type="range" 
                  min={6} 
                  max={36} 
                  step={6}
                  value={tenure}
                  onChange={e => setTenure(Number(e.target.value))}
                  className="w-full accent-[#b8573b]"
                />
                <div className="flex justify-between mt-2 text-[11px] text-[#68766d]">
                  <span>6m</span>
                  <span>36m</span>
                </div>
                
                <div className="mt-6 rounded-xl bg-[#29352f] p-5 text-white">
                  <div className="text-[12px] opacity-70 mb-1">Estimated Monthly Payment</div>
                  <div className="display text-4xl text-[#d89a48]">₹{currentEMI.toLocaleString('en-IN')}</div>
                  <div className="mt-2 text-[11px] opacity-60">*Calculated at ~13% p.a. standard personal loan rate</div>
                </div>
              </div>
            )}
          </div>

          {/* Sourcing Tiers */}
          <div className="min-w-0">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="display type-h3">Tiered Sourcing</h2>
              <button onClick={handleDownload} className="text-[13px] font-medium text-[#b8573b] hover:underline">Download List</button>
            </div>
            
            <p className="mb-2 text-[11px] text-[#68766d] sm:hidden">
              Swipe horizontally to compare all three sourcing tiers.
            </p>
            <div className="w-full max-w-full overflow-x-auto rounded-2xl border border-[#d7cbbb] bg-white">
              <div className="min-w-[560px]">
              {/* Header */}
              <div className="grid grid-cols-[minmax(190px,1fr)_84px_84px_84px] gap-3 border-b border-[#d7cbbb] bg-[#f3ecdf]/50 p-4 text-[11px] font-medium uppercase tracking-wider text-[#68766d]">
                <div>Item</div>
                <div className="text-right">Branded</div>
                <div className="text-right">Local</div>
                <div className="text-right text-[#b8573b]">Artisan</div>
              </div>
              
              {/* Items */}
              <div className="divide-y divide-[#d7cbbb]/50">
                {scaledItems.map((item, idx) => (
                   <div key={idx} className="grid grid-cols-[minmax(190px,1fr)_84px_84px_84px] gap-3 p-4 items-center hover:bg-[#f3ecdf]/20 transition-colors">
                    <div>
                      <div className="font-medium text-[#29352f]">{item.name}</div>
                      <div className="text-[12px] text-[#b8573b] mt-0.5 flex items-center gap-1">
                        <Info size={12} /> {item.artisanDesc}
                      </div>
                    </div>
                    <div className="text-right font-mono text-[13px] text-[#68766d]">₹{item.prices.branded.toLocaleString('en-IN')}</div>
                    <div className="text-right font-mono text-[13px] text-[#68766d]">₹{item.prices.local.toLocaleString('en-IN')}</div>
                    <div className="text-right font-mono text-[14px] font-medium text-[#b8573b]">₹{item.prices.artisan.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
              
              {/* Total Row */}
              <div className="grid grid-cols-[minmax(190px,1fr)_84px_84px_84px] gap-3 bg-[#29352f] p-4 text-white">
                <div className="font-medium">Estimated Total</div>
                <div className="text-right font-mono text-[14px] opacity-70">
                  ₹{totals.branded.toLocaleString('en-IN')}
                </div>
                <div className="text-right font-mono text-[14px] opacity-70">
                  ₹{totals.local.toLocaleString('en-IN')}
                </div>
                <div className="text-right font-mono text-[15px] font-bold text-[#d89a48]">
                  ₹{totals.artisan.toLocaleString('en-IN')}
                </div>
              </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
