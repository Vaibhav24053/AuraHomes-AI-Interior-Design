import { useRef, useState } from 'react';
import { Users, ChevronRight, Filter, Play, Hammer, Upload, Check, RefreshCw, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { regionalStyles, getImageUrl } from '@/data/regionalStyles';
import { useToast } from '@/hooks/use-toast';

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sandboxOpen, setSandboxOpen] = useState(false);
  const [sandboxImage, setSandboxImage] = useState<string | null>(null);
  const [sandboxStyle, setSandboxStyle] = useState(regionalStyles[0].id);
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Get unique style names for filters
  const styles = regionalStyles.map(s => s.name);
  
  const handleWorkshop = () => {
    toast({
      title: "Waitlist joined",
      description: "We'll notify you when DIY Workshops open in your region."
    });
  };

  const handleSandboxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setSandboxImage(e.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const activeSandboxStyle = regionalStyles.find(s => s.id === sandboxStyle);

  return (
    <main className="aura-shell grain route-grid min-h-[100dvh] bg-[#f3ecdf] px-5 pb-24 pt-36 text-[#29352f] sm:px-10 lg:px-20">
      <div className="mx-auto max-w-[1240px]">
        <Link href="/" className="mb-16 inline-flex items-center gap-2 text-[12px] text-[#68766d] transition-colors hover:text-[#b8573b]">
          <ChevronRight size={14} className="rotate-180" /> Back to AuraHomes
        </Link>
        
        <div className="grid items-end gap-10 md:grid-cols-[1fr_.8fr] mb-20 max-w-[1050px] mx-auto">
          <div>
            <div className="eyebrow flex items-center gap-3 text-[#b8573b]">
              <span className="h-px w-7 bg-[#b8573b]" />The Aura circle
            </div>
            <h1 className="display mt-6 max-w-[680px] text-[clamp(4rem,9vw,8.5rem)] leading-[.82] tracking-[-.06em]">
              Homes with<br /><span className="text-[#b8573b] italic">a story.</span>
            </h1>
            <p className="mt-8 max-w-[430px] text-[16px] leading-[1.8] text-[#536059]">
              A generous corner of the internet for real homes, clever fixes, inherited objects and the people who live around them.
            </p>
          </div>
          <div className="relative min-h-[250px] overflow-hidden rounded-[1.4rem] p-8 bg-[#d6d4c4]">
            <div className="absolute -right-10 -top-10 size-52 rounded-full border border-[#29352f]/15" />
            <div className="absolute -bottom-16 -left-10 size-56 rounded-full border border-[#29352f]/15" />
            <Users size={38} strokeWidth={1.2} />
            <div className="absolute bottom-8 left-8 right-8">
              <div className="eyebrow text-[#536059]">Shared Context</div>
              <p className="display mt-2 text-3xl leading-none">See how others live.</p>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mb-12 grid gap-6 md:grid-cols-2">
          {/* Sandbox Teaser */}
          <button
            type="button"
            onClick={() => setSandboxOpen(true)}
            aria-expanded={sandboxOpen}
            className="group relative overflow-hidden rounded-2xl border border-[#d7cbbb] bg-white/40 p-8 text-left transition-colors hover:border-[#b8573b] hover:bg-white/60"
          >
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="eyebrow mb-2 text-[#b8573b]">Experimental</div>
                <h3 className="display text-3xl mb-3">Try the Sandbox</h3>
                <p className="text-[14px] text-[#536059] max-w-sm">
                  Just playing around? Upload a room and freely swap styles with no quiz or context flow required.
                </p>
              </div>
              <div className="grid size-12 place-items-center rounded-full bg-[#b8573b] text-white shadow-md transition-transform group-hover:scale-110">
                <Play size={20} className="ml-1" />
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -bottom-12 -right-12 size-48 rounded-full bg-[#b8573b]/5 blur-3xl" />
          </button>

          {/* Workshop Teaser */}
          <button
            type="button"
            onClick={handleWorkshop}
            className="group relative overflow-hidden rounded-2xl border border-[#d7cbbb] bg-[#29352f] p-8 text-left text-white"
          >
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="eyebrow mb-2 text-[#d89a48]">Coming Soon</div>
                <h3 className="display text-3xl mb-3">DIY Workshops with Local Artisans</h3>
                <p className="text-[14px] text-white/70 max-w-sm">
                  Learn traditional finishing techniques, simple carpentry, and textile care directly from regional makers.
                </p>
              </div>
              <div className="grid size-12 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm">
                <Hammer size={20} />
              </div>
            </div>
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 size-48 rounded-full bg-[#d89a48]/10 blur-3xl" />
          </button>
        </div>

        {sandboxOpen && (
          <div className="mb-12 animate-in fade-in slide-in-from-top-4 rounded-2xl border border-[#b8573b]/30 bg-white/80 p-8 shadow-sm">
            <h3 className="display text-3xl mb-6">Style Sandbox</h3>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                {!sandboxImage ? (
                  <div className="flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-[#b8573b]/40 bg-[#b8573b]/5 transition-colors hover:border-[#b8573b]/80">
                    <button
                      type="button"
                      onClick={() => uploadInputRef.current?.click()}
                      className="flex cursor-pointer flex-col items-center gap-3 rounded-xl px-8 py-5 hover:bg-white/40"
                    >
                      <Upload size={32} className="text-[#b8573b]" />
                      <span className="text-[15px] font-medium">Upload a room</span>
                    </button>
                    <input
                      ref={uploadInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleSandboxUpload}
                    />
                    <span className="text-[12px] text-[#68766d]">or</span>
                    <button
                      type="button"
                      onClick={() => setSandboxImage("https://images.unsplash.com/photo-1598928506311-c55dd58c2419?auto=format&fit=crop&w=800&q=80")}
                      className="text-[12px] font-semibold text-[#b8573b] hover:underline"
                    >
                      Use Demo Room
                    </button>
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#d7cbbb]">
                    <img src={sandboxImage} alt="Uploaded room" className="h-full w-full object-cover" />
                    <button 
                      onClick={() => setSandboxImage(null)} 
                      aria-label="Choose a different room image"
                      className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black"
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <div className="mb-4 flex flex-wrap gap-2">
                  {regionalStyles.map(style => (
                    <button
                      key={style.id}
                      onClick={() => setSandboxStyle(style.id)}
                      className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${sandboxStyle === style.id ? 'bg-[#b8573b] text-white' : 'border border-[#d7cbbb] bg-white text-[#536059] hover:border-[#b8573b]'}`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
                {sandboxImage && activeSandboxStyle && (
                  <div className="mt-auto rounded-xl bg-[#29352f] p-6 text-white shadow-lg">
                    <div className="eyebrow mb-2 text-[#d89a48]">{activeSandboxStyle.name} Preview</div>
                    <div className="relative mb-4 aspect-[21/9] overflow-hidden rounded-lg">
                      <img src={getImageUrl(activeSandboxStyle.imageSearchTerm)} alt="Preview" className="h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <Sparkles className="text-[#d89a48]" size={32} />
                      </div>
                    </div>
                    <p className="text-[13px] text-white/80">{activeSandboxStyle.caption}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-8 flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#68766d] pr-4 border-r border-[#d7cbbb]">
            <Filter size={14} /> Filter by style
          </div>
          <button 
            onClick={() => setActiveFilter('all')}
            className={`whitespace-nowrap rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${activeFilter === 'all' ? 'bg-[#29352f] text-white' : 'border border-[#d7cbbb] bg-white/40 text-[#536059] hover:bg-white'}`}
          >
            All Styles
          </button>
          {styles.map(styleName => (
            <button 
              key={styleName}
              onClick={() => setActiveFilter(styleName)}
              className={`whitespace-nowrap rounded-full px-5 py-2 text-[13px] font-medium transition-colors ${activeFilter === styleName ? 'bg-[#b8573b] text-white' : 'border border-[#d7cbbb] bg-white/40 text-[#536059] hover:bg-white'}`}
            >
              {styleName}
            </button>
          ))}
        </div>

        {/* Community Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regionalStyles
            .filter(style => activeFilter === 'all' || style.name === activeFilter)
            .map((style, i) => (
            <div key={`${style.id}-${i}`} className="group overflow-hidden rounded-2xl border border-[#d7cbbb] bg-white/30 transition-all hover:bg-white hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={getImageUrl(style.imageSearchTerm)} 
                  alt={style.name} 
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-[10px] uppercase tracking-widest text-[#b8573b]">{style.direction} · {style.region || 'Global'}</div>
                  <div className="flex -space-x-2">
                    <div className="size-6 rounded-full border border-white bg-[#c68467]" />
                    <div className="size-6 rounded-full border border-white bg-[#7c9b8d]" />
                  </div>
                </div>
                <h3 className="display text-2xl mb-2">{style.name} Interpretation</h3>
                <p className="text-[13px] text-[#536059] line-clamp-2">{style.caption}</p>
                <div className="mt-4 flex items-center gap-2 text-[12px] font-medium text-[#29352f]">
                  <div className="size-5 rounded-full bg-[#d7cbbb] flex items-center justify-center text-[10px] text-white">
                    {String.fromCharCode(65 + (i % 26))}
                  </div>
                  <span>Shared by User</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
