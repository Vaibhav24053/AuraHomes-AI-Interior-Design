import { useRef, useState } from 'react';
import { Users, ChevronRight, Filter, Play, Hammer, Upload, RefreshCw, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';
import { regionalStyles } from '@/data/regionalStyles';
import { useToast } from '@/hooks/use-toast';
import { Reveal } from '@/components/ui/reveal';
import { handleImageError } from '@/lib/imageFallback';

const communityPeople = [
  ['Meera', '3 days ago', 'I kept my grandmother’s brass urli and built the whole reading corner around its warm patina.', 284, 19],
  ['Arjun', '5 days ago', 'Our dining room finally feels ready for long Sunday lunches without losing the old tile floor.', 193, 14],
  ['Sana', '1 week ago', 'The arched nook used to collect boxes. Now it is where I drink chai every evening.', 421, 37],
  ['Dev', '1 week ago', 'We restored the carved cabinet instead of replacing it, then let that wood set the mood for the room.', 156, 11],
  ['Riya', '2 weeks ago', 'A little terracotta, softer lighting, and my parents’ wedding photograph made this rented flat feel ours.', 347, 28],
  ['Ishan', '2 weeks ago', 'Bamboo screens gave us privacy without making the room dark during Guwahati’s long rains.', 208, 17],
  ['Gurleen', '3 weeks ago', 'The phulkari cushions are stitched from an old dupatta my mother saved for years.', 512, 44],
  ['Kabir', '3 weeks ago', 'We wanted Lucknow elegance without turning the drawing room into a museum. This balance feels right.', 265, 22],
  ['Ananya', '1 month ago', 'Opening the centre of the room changed how three generations move through the house.', 384, 31],
  ['Zoya', '1 month ago', 'The blue-grey walls made our old Deccani metalwork feel surprisingly contemporary.', 229, 16],
  ['Nikhil', '1 month ago', 'This sunny corner now carries the colours of the old Panjim houses I grew up around.', 318, 25],
  ['Aamir', '2 months ago', 'Walnut details and a softer ceiling pattern made the bedroom feel calm through winter.', 176, 13],
  ['Tara', '2 months ago', 'I edited the room down to the pieces I actually use and kept one bold rug for joy.', 447, 36],
  ['Neha', '2 months ago', 'Moving the desk away from the bed gave this tiny room a sense of ritual and rest.', 301, 24],
  ['Mira', '3 months ago', 'Warm oak and handmade ceramics helped us find the middle between minimal and lived-in.', 392, 29],
  ['Aditi', '3 months ago', 'Nothing matches perfectly, but every textile has a story from a trip or a family home.', 534, 48],
  ['Rohan', '4 months ago', 'Exposed brick felt cold until we layered in cane, amber light, and a very comfortable chair.', 246, 20],
  ['Leena', '4 months ago', 'Linen curtains and pale wood made the sea breeze feel like part of the room.', 366, 27],
] as const;

const beforeImages = [
  'photo-1600566753190-17f0baa2a6c3', 'photo-1600585152915-d208bec867a1', 'photo-1600585154363-67eb9e2e2099',
  'photo-1600585154526-990dced4db0d', 'photo-1600566752355-35792bedcfea', 'photo-1615874959474-d609969a20ed',
  'photo-1600607687939-ce8a6c25118c', 'photo-1600607688969-a5bfcd646154', 'photo-1600607688960-e095ff83135c',
  'photo-1617104611622-d5f245d317f0', 'photo-1616046229478-9901c5536a45', 'photo-1615874694520-474822394e73',
  'photo-1615529162924-f8605388461d', 'photo-1616486338812-3dadae4b4ace', 'photo-1618220179428-22790b461013',
  'photo-1628744448840-55bdb2497bd4', 'photo-1630699144867-37acec97df5a', 'photo-1618219740975-d40978bb7378',
];

const communityImage = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

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
        
        <Reveal className="grid items-end gap-10 md:grid-cols-[1fr_.8fr] mb-20 max-w-[1050px] mx-auto">
          <div>
            <div className="eyebrow flex items-center gap-3 text-[#b8573b]">
              <span className="h-px w-7 bg-[#b8573b]" />The Aura circle
            </div>
            <h1 className="display type-h1 mt-6 max-w-[680px]">
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
        </Reveal>

        {/* Action Row */}
        <Reveal className="uniform-card-grid mb-12 grid gap-6 md:grid-cols-2">
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
                <h3 className="display type-h3 mb-3">Try the Sandbox</h3>
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
                <h3 className="display type-h3 mb-3">DIY Workshops with Local Artisans</h3>
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
        </Reveal>

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
                      onClick={() => setSandboxImage("https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80")}
                      className="text-[12px] font-semibold text-[#b8573b] hover:underline"
                    >
                      Use Demo Room
                    </button>
                  </div>
                ) : (
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#d7cbbb]">
                    <img onError={handleImageError} src={sandboxImage} alt="Uploaded room" className="h-full w-full object-cover" />
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
                      <img onError={handleImageError} src={activeSandboxStyle.imageUrl} alt="Preview" className="h-full w-full object-cover opacity-80" />
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
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap border-r border-[#d7cbbb] pr-4 text-[12px] font-medium text-[#68766d]">
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
        <div className="uniform-card-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regionalStyles
            .filter(style => activeFilter === 'all' || style.name === activeFilter)
            .map((style, i) => (
            <article key={`${style.id}-${i}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#d7cbbb] bg-white/30 transition-all hover:bg-white hover:shadow-lg">
              <div className="grid aspect-[4/3] grid-cols-2 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img onError={handleImageError} src={communityImage(beforeImages[i])} alt={`Before ${communityPeople[i][0]}'s room redesign`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-2 top-2 rounded-full bg-[#f3ecdf]/90 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider">Before</span>
                </div>
                <div className="relative overflow-hidden">
                  <img onError={handleImageError} src={style.imageUrl} alt={`After ${communityPeople[i][0]}'s ${style.name} room redesign`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute right-2 top-2 rounded-full bg-[#29352f]/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-white">After</span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid size-8 place-items-center rounded-full bg-[#b8573b] text-[11px] font-semibold text-white">{communityPeople[i][0].slice(0, 1)}</div>
                    <div>
                      <div className="text-[13px] font-semibold">{communityPeople[i][0]}</div>
                      <div className="text-[10px] text-[#68766d]">{communityPeople[i][1]}</div>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#b8573b]/10 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#b8573b]">{style.name}</span>
                </div>
                <p className="type-body flex-1 text-[#536059]">“{communityPeople[i][2]}”</p>
                <div className="mt-5 flex items-center gap-5 border-t border-[#d7cbbb]/70 pt-4 text-[12px] text-[#536059]">
                  <span className="flex items-center gap-1.5"><Heart size={14} /> {communityPeople[i][3]}</span>
                  <span className="flex items-center gap-1.5"><MessageCircle size={14} /> {communityPeople[i][4]}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </main>
  );
}
