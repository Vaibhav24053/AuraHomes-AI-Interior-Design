import { useState } from 'react';
import { IndianRupee, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Reveal } from '@/components/ui/reveal';
import { getSourcingCatalog, type RoomSize, type SourcingTier } from '@/data/sourcing';

export default function BudgetPage() {
  const [budgetType, setBudgetType] = useState<'lumpsum' | 'emi'>('lumpsum');
  const [lumpSum, setLumpSum] = useState(250000);
  const [tenure, setTenure] = useState(12);
  const [roomSize, setRoomSize] = useState<RoomSize>('medium');
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

  const items = getSourcingCatalog(roomSize);
  const scaledItems = items.map(item => ({
    ...item,
    prices: {
      branded: scalePrice(item.tiers.branded.basePrice * item.quantity),
      local: scalePrice(item.tiers.local.basePrice * item.quantity),
      artisan: scalePrice(item.tiers.artisan.basePrice * item.quantity),
    },
  }));

  const totals = (['branded', 'local', 'artisan'] as SourcingTier[]).reduce((result, tier) => ({
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

            <div className="mb-8">
              <span className="mb-3 block text-[13px] font-medium text-[#536059]">Room size</span>
              <div className="grid grid-cols-3 gap-2" data-testid="room-size-controls">
                {([
                  ['small', 'Small', '~100 sq ft'],
                  ['medium', 'Medium', '~150 sq ft'],
                  ['large', 'Large', '~250+ sq ft'],
                ] as const).map(([size, label, detail]) => (
                  <button
                    key={size}
                    type="button"
                    data-testid={`button-room-size-${size}`}
                    onClick={() => setRoomSize(size)}
                    className={`rounded-lg border px-2 py-3 text-left transition-colors ${
                      roomSize === size
                        ? 'border-[#b8573b] bg-[#b8573b]/10 text-[#29352f]'
                        : 'border-[#d7cbbb] bg-white/50 text-[#68766d] hover:bg-white'
                    }`}
                  >
                    <span className="block text-[12px] font-medium">{label}</span>
                    <span className="block text-[10px] opacity-75">{detail}</span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-[#68766d]" data-testid="text-room-size-summary">
                {scaledItems.length} essentials sized for a {roomSize} bedroom. Quantities and optional pieces adapt with the room.
              </p>
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
              <div className="min-w-[920px]">
              {/* Header */}
              <div className="grid grid-cols-[minmax(190px,1fr)_minmax(185px,.9fr)_minmax(185px,.9fr)_minmax(185px,.9fr)] gap-3 border-b border-[#d7cbbb] bg-[#f3ecdf]/50 p-4 text-[11px] font-medium uppercase tracking-wider text-[#68766d]">
                <div>Item</div>
                <div>Branded</div>
                <div>Local</div>
                <div className="text-[#b8573b]">Artisan</div>
              </div>
              
              {/* Items */}
              <div className="divide-y divide-[#d7cbbb]/50">
                 {scaledItems.map((item) => (
                    <div key={item.id} data-testid={`row-sourcing-item-${item.id}`} className="grid grid-cols-[minmax(190px,1fr)_minmax(185px,.9fr)_minmax(185px,.9fr)_minmax(185px,.9fr)] gap-3 p-4 hover:bg-[#f3ecdf]/20 transition-colors">
                    <div>
                       <div className="font-medium text-[#29352f]">{item.name} <span className="text-[#68766d]">×{item.quantity}</span></div>
                       <div className="mt-1 text-[11px] text-[#68766d]">Price includes selected quantity</div>
                    </div>
                     {(['branded', 'local', 'artisan'] as SourcingTier[]).map((tier) => {
                       const option = item.tiers[tier];
                       return (
                         <div key={tier}>
                           {option.link ? (
                             <a href={option.link} target="_blank" rel="noreferrer" data-testid={`link-${tier}-${item.id}`} className="block text-[12px] font-medium text-[#29352f] hover:text-[#b8573b] hover:underline">{option.supplier}</a>
                           ) : (
                             <div className="text-[12px] font-medium text-[#29352f]">{option.supplier}</div>
                           )}
                           <div className="mt-0.5 text-[11px] leading-snug text-[#68766d]">{option.detail}</div>
                           <div className={`mt-2 font-mono text-[13px] ${tier === 'artisan' ? 'font-medium text-[#b8573b]' : 'text-[#536059]'}`}>₹{item.prices[tier].toLocaleString('en-IN')}</div>
                         </div>
                       );
                     })}
                  </div>
                ))}
              </div>
              
              {/* Total Row */}
              <div className="grid grid-cols-[minmax(190px,1fr)_minmax(185px,.9fr)_minmax(185px,.9fr)_minmax(185px,.9fr)] gap-3 bg-[#29352f] p-4 text-white">
                <div className="font-medium">Estimated Total</div>
                <div className="font-mono text-[14px] opacity-70" data-testid="text-total-branded">
                  ₹{totals.branded.toLocaleString('en-IN')}
                </div>
                <div className="font-mono text-[14px] opacity-70" data-testid="text-total-local">
                  ₹{totals.local.toLocaleString('en-IN')}
                </div>
                <div className="font-mono text-[15px] font-bold text-[#d89a48]" data-testid="text-total-artisan">
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
