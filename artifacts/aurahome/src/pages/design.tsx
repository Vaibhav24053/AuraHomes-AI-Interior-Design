import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  MapPin, 
  Home, 
  RotateCcw,
  Sparkles, 
  ArrowRight,
  Camera,
  RefreshCw,
  Compass,
  Check,
  X,
  AlertTriangle,
  Smartphone
} from 'lucide-react';
import {
  regionalStyles,
} from '@/data/regionalStyles';
import { Link } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import {
  type DesignGenerationRequest,
  type DesignGenerationResult,
  type FurniturePiece,
} from '@/lib/designDemoService';
import { handleImageError } from '@/lib/imageFallback';
import {
  checkVastu,
  createDesignArchetype,
  detectRoomContext,
  generateRoomDesign,
  type DesignArchetype,
  type DetectedContext,
  type VastuInsight,
} from '@/lib/auraApi';
import { ARFurniturePreview } from '@/components/design/ARFurniturePreview';
import { getSourcingCatalog, type RoomSize, type SourcingTier } from '@/data/sourcing';
import { BrandLogo } from '@/components/BrandLogo';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
const BUDGET_BANDS = ['₹50k–1L', '₹1L–3L', '₹3L–7L', '₹7L+'] as const;
const FURNITURE_PIECES: FurniturePiece[] = ['sofa', 'bed', 'dining table', 'wardrobe', 'armchair', 'accessories'];

interface AnalysisBundle {
  context: DetectedContext;
  archetype: DesignArchetype;
  vastu: VastuInsight[];
}

const quizAnswers = (request: DesignGenerationRequest) => [
  { questionId: 'age', answer: request.age },
  { questionId: 'city', answer: request.city },
  { questionId: 'style', styleId: request.styleId === 'skipped' ? 'vastu-modern' : request.styleId },
  { questionId: 'ownership', answer: request.ownership },
  { questionId: 'household', answer: request.household },
  { questionId: 'budget', answer: request.budgetBand },
  { questionId: 'taste-vector', tasteVector: request.dnaVector },
];

function compileDesignPrompt(
  request: DesignGenerationRequest,
  analysis: AnalysisBundle,
) {
  const activeStyle = regionalStyles.find((style) => style.id === request.styleId)
    ?? regionalStyles.find((style) => style.id === 'vastu-modern')
    ?? regionalStyles[0];
  const vastuCorrections = analysis.vastu
    .filter((insight) => insight.applies)
    .map((insight) => insight.correctionInstruction)
    .join(' ');
  const scope = request.scope === 'piece'
    ? `Change only the ${request.piece}; keep all other existing furniture and decor unchanged.`
    : 'Redesign the complete room while keeping its real architecture intact.';

  return [
    `Create a photorealistic ${activeStyle.name} redesign of this exact ${analysis.context.roomType}.`,
    `Style direction: ${activeStyle.caption}`,
    `Resident persona: ${analysis.archetype.archetype}. ${analysis.archetype.tagline}`,
    request.ownership === 'rent'
      ? 'This is a rented home: use removable, no-drill, non-structural changes only.'
      : 'This is an owned home: permanent finishes and fitted elements are allowed.',
    `Household needs: ${request.household.join(', ') || 'not specified'}.`,
    `Budget band: ${request.budgetBand}.`,
    scope,
    vastuCorrections ? `Respect these practical Vastu corrections: ${vastuCorrections}` : '',
    `Palette: ${analysis.archetype.primaryColor}, ${analysis.archetype.secondaryColor}, and ${analysis.archetype.accentColor}.`,
    `Style cues: ${analysis.archetype.styleKeywords.join(', ')}.`,
    'Preserve all existing walls, windows, doors, openings, ceiling geometry, floor boundaries, camera perspective, and natural-light direction.',
  ].filter(Boolean).join('\n');
}

// --- STEP COMPONENTS ---

function Step1Age({ age, setAge, nextStep }: any) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="eyebrow mb-4 text-[#b8573b]">Step 01 / Context</div>
      <h2 className="display type-h2 mb-8">What stage of life are you designing for?</h2>
      <div className="grid gap-3">
        {['18–25', '26–35', '36–50', '50+'].map(bracket => (
          <button 
            key={bracket}
            className={`group relative flex items-center justify-between overflow-hidden rounded-xl border p-5 text-left transition-all ${age === bracket ? 'border-[#b8573b] bg-[#b8573b]/5' : 'border-[#d7cbbb] hover:border-[#b8573b]/40 hover:bg-white/40'}`}
            onClick={() => { setAge(bracket); setTimeout(nextStep, 300); }}
          >
            <span className="text-[15px] font-medium">{bracket}</span>
            <div className={`flex size-6 items-center justify-center rounded-full border transition-colors ${age === bracket ? 'border-[#b8573b] bg-[#b8573b] text-white' : 'border-[#d7cbbb] group-hover:border-[#b8573b]/40'}`}>
              {age === bracket && <Check size={14} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2City({ city, setCity, nextStep }: any) {
  const majorCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi', 'Goa'];
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="eyebrow mb-4 text-[#b8573b]">Step 02 / Geography</div>
      <h2 className="display type-h2 mb-3">Where is this room located?</h2>
      <p className="text-[14px] text-[#68766d] mb-8">We'll suggest a starting style based on your city — you can change it to anything.</p>
      
      <div className="relative mb-6">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b8573b]" size={20} />
        <input 
          type="text" 
          placeholder="Type your city..." 
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full rounded-xl border border-[#d7cbbb] bg-white/50 py-4 pl-12 pr-4 text-[15px] outline-none focus:border-[#b8573b] focus:ring-1 focus:ring-[#b8573b]/20"
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {majorCities.map(c => (
          <button 
            key={c}
            onClick={() => { setCity(c); setTimeout(nextStep, 300); }}
            className="rounded-full border border-[#d7cbbb] bg-white/30 px-4 py-2 text-[13px] text-[#536059] transition-colors hover:border-[#b8573b]/40 hover:bg-[#b8573b]/5 hover:text-[#b8573b]"
          >
            {c}
          </button>
        ))}
      </div>
      
      {city.length > 2 && (
        <div className="mt-8">
          <button onClick={nextStep} className="inline-flex items-center gap-2 rounded-full bg-[#29352f] px-6 py-3 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5">
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function Step3Style({ city, styleId, setStyleId, nextStep }: any) {
  const suggestions: Record<string, string> = {
    'kochi': 'nalukettu', 'chennai': 'chettinad', 'jaipur': 'rajasthani-haveli',
    'ahmedabad': 'pol-house', 'kolkata': 'bonedi-bari', 'pune': 'wada-style',
    'mumbai': 'wada-style', 'hyderabad': 'nizami-style', 'goa': 'indo-portuguese',
    'delhi': 'awadhi'
  };
  
  const suggestedId = city ? suggestions[city.toLowerCase()] || '' : '';
  
  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-10">
        <div className="eyebrow mb-4 text-[#b8573b]">Step 03 / Point of view</div>
        <h2 className="display type-h2 mb-3">Choose a visual direction</h2>
        <p className="text-[14px] text-[#68766d] max-w-md mx-auto">Explore regional directions or modern aesthetics. {suggestedId ? `Based on ${city}, we have a suggestion.` : ''}</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regionalStyles.map(style => (
          <button
            key={style.id}
            onClick={() => { setStyleId(style.id); setTimeout(nextStep, 400); }}
            className={`group relative overflow-hidden rounded-xl border text-left transition-all ${styleId === style.id ? 'border-[#b8573b] shadow-md' : 'border-[#d7cbbb] hover:border-[#b8573b]/40'}`}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img 
                src={style.imageUrl}
                alt={style.name} 
                onError={handleImageError}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-4 bg-white/80 backdrop-blur-sm relative">
              {style.id === suggestedId && (
                <div className="absolute -top-3 left-4 rounded-full bg-[#b8573b] px-3 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white">
                  Suggested for {city}
                </div>
              )}
              <div className="text-[10px] uppercase tracking-widest text-[#68766d] mb-1">{style.direction}</div>
              <h3 className="display type-h3 mb-1">{style.name}</h3>
              <p className="text-[12px] text-[#68766d] line-clamp-2">{style.caption}</p>
            </div>
          </button>
        ))}
        
        <button
          onClick={() => {
            const regionalOptions = regionalStyles.filter(style => style.isRegional);
            const surprise = regionalOptions[Math.floor(Math.random() * regionalOptions.length)];
            setStyleId(surprise.id);
            setTimeout(nextStep, 300);
          }}
          className="group flex flex-col items-center justify-center rounded-xl border border-dashed border-[#b8573b]/40 bg-[#b8573b]/5 p-6 text-center transition-colors hover:border-[#b8573b] hover:bg-[#b8573b]/10"
        >
          <Sparkles className="mb-3 text-[#b8573b]" size={28} />
          <h3 className="display text-xl mb-1 text-[#b8573b]">Surprise me across regions</h3>
          <p className="text-[12px] text-[#b8573b]/80">Pick an unexpected regional direction</p>
        </button>
        
        <button 
          onClick={() => { setStyleId('skipped'); setTimeout(nextStep, 300); }}
          className="group flex flex-col items-center justify-center rounded-xl border border-[#d7cbbb] bg-white/40 p-6 text-center transition-colors hover:border-[#29352f] hover:bg-[#29352f]/5"
        >
          <div className="mb-3 rounded-full border border-[#29352f]/30 p-2 text-[#29352f]">
            <ArrowRight size={20} />
          </div>
          <h3 className="display text-xl mb-1 text-[#29352f]">Skip — I know my own style</h3>
          <p className="text-[12px] text-[#536059]">Choose the direction just before generation</p>
        </button>
      </div>
    </div>
  );
}

function Step4OwnRent({ ownership, setOwnership, nextStep }: any) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="eyebrow mb-4 text-[#b8573b]">Step 04 / Permissions</div>
      <h2 className="display type-h2 mb-8">Do you own or rent?</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {[
          { id: 'own', title: 'I own it', desc: 'Full redesign, permanent changes, structural edits allowed.', icon: Home },
          { id: 'rent', title: 'I rent it', desc: 'No-drill solutions, renter-friendly updates, removable pieces.', icon: RotateCcw }
        ].map(opt => (
          <button 
            key={opt.id}
            onClick={() => { setOwnership(opt.id); setTimeout(nextStep, 300); }}
            className={`group flex flex-col items-center rounded-2xl border p-10 text-center transition-all ${ownership === opt.id ? 'border-[#b8573b] bg-[#b8573b]/5 shadow-lg' : 'border-[#d7cbbb] hover:border-[#b8573b]/40 hover:bg-white/40 hover:-translate-y-1'}`}
          >
            <div className={`mb-6 rounded-full p-4 transition-colors ${ownership === opt.id ? 'bg-[#b8573b] text-white' : 'bg-white text-[#29352f] group-hover:text-[#b8573b]'}`}>
              <opt.icon size={32} strokeWidth={1.5} />
            </div>
            <h3 className="display type-h3 mb-3">{opt.title}</h3>
            <p className="text-[14px] text-[#68766d]">{opt.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5Household({ household, setHousehold, nextStep }: any) {
  const opts = ['Just me', 'Partner', 'Kids', 'Parents', 'Extended family', 'Roommates', 'Pets'];
  const toggle = (opt: string) => {
    setHousehold((prev: string[]) => prev.includes(opt) ? prev.filter(x => x !== opt) : [...prev, opt]);
  };
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="eyebrow mb-4 text-[#b8573b]">Step 05 / People</div>
      <h2 className="display type-h2 mb-3">Who shares this home?</h2>
      <p className="text-[14px] text-[#68766d] mb-10">Select all that apply. This helps us factor in durability, storage, and flow.</p>
      
      <div className="flex flex-wrap justify-center gap-3">
        {opts.map(opt => {
          const active = household.includes(opt);
          return (
            <button 
              key={opt}
              onClick={() => toggle(opt)}
              className={`rounded-full border px-5 py-3 text-[14px] font-medium transition-all ${active ? 'border-[#b8573b] bg-[#b8573b] text-white shadow-md' : 'border-[#d7cbbb] bg-white/40 text-[#536059] hover:border-[#b8573b]/50'}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
      
      <div className="mt-12">
        <button 
          disabled={household.length === 0}
          onClick={nextStep} 
          className="inline-flex items-center gap-2 rounded-full bg-[#29352f] px-8 py-3.5 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Step6Budget({ budget, setBudget, nextStep }: any) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="eyebrow mb-4 text-[#b8573b]">Step 06 / Budget</div>
      <h2 className="display type-h2 mb-3">What's your comfort zone?</h2>
      <p className="text-[14px] text-[#68766d] mb-12">We use this to pull real INR pricing from appropriate tiers (Artisan, Local, Branded).</p>
      
      <div className="grid gap-3">
        {BUDGET_BANDS.map((range, idx) => (
          <button 
            key={range}
            onClick={() => { setBudget(idx); setTimeout(nextStep, 300); }}
            className={`flex items-center justify-between rounded-xl border p-5 transition-all ${budget === idx ? 'border-[#b8573b] bg-[#b8573b]/5' : 'border-[#d7cbbb] hover:border-[#b8573b]/40 hover:bg-white/40'}`}
          >
            <span className="text-[16px] font-medium">{range}</span>
            <div className={`flex size-5 items-center justify-center rounded-full border transition-colors ${budget === idx ? 'border-[#b8573b] bg-[#b8573b] text-white' : 'border-[#d7cbbb]'}`}>
              {budget === idx && <Check size={12} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step7DNA({ nextStep, dnaVector, setDnaVector }: any) {
  const [pairIndex, setPairIndex] = useState(0);
  const pairs = [
    { a: 'photo-1618221195710-dd6b41faaea6', b: 'photo-1600566753086-00f18fb6b3ea', axis: 0, aAlt: 'Ornate classic room', bAlt: 'Clean minimal room' },
    { a: 'photo-1618220179428-22790b461013', b: 'photo-1616486338812-3dadae4b4ace', axis: 1, aAlt: 'Bold colourful interior', bAlt: 'Muted neutral interior' },
    { a: 'photo-1615874959474-d609969a20ed', b: 'photo-1600607687939-ce8a6c25118c', axis: 2, aAlt: 'Warm textured wood room', bAlt: 'Cool minimal room' },
    { a: 'photo-1616047006789-b7af5afb8c20', b: 'photo-1600210491892-03d54c0aaf87', axis: 3, aAlt: 'Dense layered room', bAlt: 'Spacious airy room' },
    { a: 'photo-1600121848594-d8644e57abab', b: 'photo-1600585154340-be6161a56a0c', axis: 4, aAlt: 'Traditional heritage home', bAlt: 'Contemporary apartment' },
    { a: 'photo-1616486338812-3dadae4b4ace', b: 'photo-1600573472550-8090b5e0745e', axis: 1, aAlt: 'Dark dramatic bedroom', bAlt: 'Bright sunlit bedroom' },
    { a: 'photo-1616046229478-9901c5536a45', b: 'photo-1600566753190-17f0baa2a6c3', axis: 0, aAlt: 'Patterned maximalist room', bAlt: 'Quiet solid-colour room' },
    { a: 'photo-1600573472591-ee6b68d14c68', b: 'photo-1618219908412-a29a1bb7b86e', axis: 2, aAlt: 'Raw industrial loft', bAlt: 'Polished elegant room' },
  ];
  const dnaImage = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;
  const totalPairs = pairs.length;
  
  const handleSelect = (choice: 'a' | 'b') => {
    const newVec = [...dnaVector];
    newVec[pairs[pairIndex].axis] += choice === 'a' ? 1 : -1;
    setDnaVector(newVec);
    
    if (pairIndex < totalPairs - 1) {
      setPairIndex(p => p + 1);
    } else {
      setTimeout(nextStep, 400);
    }
  };

  const currentPair = pairs[pairIndex];

  return (
    <div className="mx-auto max-w-3xl text-center">
      <div className="eyebrow mb-4 text-[#b8573b]">Step 07 / Taste DNA</div>
      <h2 className="display type-h2 mb-3">Which draws you in?</h2>
      <p className="text-[14px] text-[#68766d] mb-10">Don't overthink it. Just pick the room you'd rather sit in.</p>
      
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div 
            key={pairIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <button onClick={() => handleSelect('a')} className="group overflow-hidden rounded-2xl border border-[#d7cbbb] transition-all hover:-translate-y-1 hover:border-[#b8573b] hover:shadow-xl">
              <div className="aspect-[4/5] w-full overflow-hidden">
                  <img onError={handleImageError} src={dnaImage(currentPair.a)} alt={`Option A: ${currentPair.aAlt}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </button>
            <button onClick={() => handleSelect('b')} className="group overflow-hidden rounded-2xl border border-[#d7cbbb] transition-all hover:-translate-y-1 hover:border-[#b8573b] hover:shadow-xl">
              <div className="aspect-[4/5] w-full overflow-hidden">
                  <img onError={handleImageError} src={dnaImage(currentPair.b)} alt={`Option B: ${currentPair.bAlt}`} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-8 text-[12px] uppercase tracking-widest text-[#68766d]">Pair {pairIndex + 1} of {totalPairs}</div>
    </div>
  );
}

function Step8Upload({ roomImage, setRoomImage, nextStep }: any) {
  const [uploadError, setUploadError] = useState('');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError('');

    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a JPG, PNG, WEBP, or HEIC image.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('That image is larger than 10MB. Please choose a smaller file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = event => setRoomImage(event.target?.result as string);
    reader.onerror = () => setUploadError('We could not read that image. Please try another file.');
    reader.readAsDataURL(file);
  };

  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="eyebrow mb-4 text-[#b8573b]">Step 08 / The space</div>
      <h2 className="display type-h2 mb-4">Now let's see the actual room.</h2>
      <p className="text-[15px] text-[#68766d] mb-10">Everything you just told us shapes what happens next. Upload a clear photo of the room you want to transform.</p>
      
      {!roomImage ? (
        <label className="group flex w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-[#b8573b]/40 bg-[#f3ecdf]/50 p-12 transition-colors hover:border-[#b8573b] hover:bg-[#b8573b]/5">
          <div className="grid size-16 place-items-center rounded-full bg-white text-[#b8573b] shadow-sm transition-transform group-hover:-translate-y-1 group-hover:shadow-md">
            <Camera size={24} />
          </div>
          <div>
            <div className="text-[16px] font-medium text-[#29352f]">Tap to upload or take a photo</div>
            <div className="mt-1 text-[13px] text-[#68766d]">JPG, PNG or HEIC up to 10MB</div>
          </div>
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-[#d7cbbb] shadow-md">
          <img onError={handleImageError} src={roomImage} alt="Uploaded space" className="w-full object-cover aspect-[4/3]" />
          <button 
            onClick={() => setRoomImage(null)}
            className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black"
          >
            <RefreshCw size={16} />
          </button>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button onClick={nextStep} className="inline-flex items-center gap-2 rounded-full bg-[#29352f] px-6 py-3 text-[14px] font-medium text-white shadow-lg transition-transform hover:-translate-y-1">
              Looks good, continue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
      {uploadError && (
        <p role="alert" className="mt-4 text-[13px] font-medium text-red-700">
          {uploadError}
        </p>
      )}
    </div>
  );
}

function Step9Analyzing({
  request,
  onComplete,
}: {
  request: DesignGenerationRequest;
  onComplete: (analysis: AnalysisBundle) => void;
}) {
  const [stage, setStage] = useState<'layout' | 'vastu' | 'archetype'>('layout');
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setError('');
    setStage('layout');

    const runAnalysis = async () => {
      const archetypePromise = createDesignArchetype(quizAnswers(request), controller.signal);
      const context = await detectRoomContext(request.roomImage, controller.signal);
      setStage('vastu');
      const vastu = await checkVastu({
        roomType: context.roomType,
        orientation: context.estimatedOrientation,
        furnitureList: request.scope === 'piece'
          ? [request.piece]
          : ['bed', 'mirror', 'entrance', 'stove', 'pooja corner'],
      }, controller.signal);
      setStage('archetype');
      const archetype = await archetypePromise;
      onComplete({ context, archetype, vastu });
    };

    void runAnalysis().catch(cause => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setError(cause instanceof Error ? cause.message : 'Room analysis failed.');
      });

    return () => controller.abort();
  }, [attempt, onComplete, request]);

  const messages = {
    layout: 'Claude is detecting the room type and orientation…',
    vastu: 'Checking practical Vastu considerations…',
    archetype: 'Compiling your personal style archetype…',
  };

  return (
    <div className="mx-auto max-w-xl text-center py-20">
      <div className="relative mx-auto mb-10 size-24">
        <div className="absolute inset-0 rounded-full border-2 border-[#d7cbbb]" />
        <div className="absolute inset-0 rounded-full border-2 border-[#b8573b] border-t-transparent animate-spin" />
        <Sparkles className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#b8573b]" size={24} />
      </div>
      <h2 className="display text-3xl mb-4">
        {error ? 'Analysis paused' : 'Analyzing your space…'}
      </h2>
      {error ? (
        <>
          <p role="alert" className="mb-7 text-[14px] text-[#68766d]">{error}</p>
          <button
            onClick={() => setAttempt(value => value + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-[#29352f] px-6 py-3 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            <RefreshCw size={16} /> Retry analysis
          </button>
        </>
      ) : (
        <p className="animate-pulse text-[14px] text-[#68766d]">{messages[stage]}</p>
      )}
    </div>
  );
}

function Step10Confirm({
  styleId,
  roomImage,
  jumpToStep,
  nextStep,
  setStyleId,
  mode,
  setMode,
  piece,
  setPiece,
  analysis,
}: any) {
  const activeStyle = regionalStyles.find(s => s.id === styleId) || regionalStyles[0];
  const toVastuChips = (bundle: AnalysisBundle) => bundle.vastu.map((insight, index) => ({
    id: `vastu-${index}`,
    title: insight.rule,
    detail: `${insight.correctionInstruction} ${insight.plainLanguageWhy}`,
    applies: insight.applies,
  }));
  const [vastuChips, setVastuChips] = useState(() => toVastuChips(analysis));
  const [expandedChip, setExpandedChip] = useState<string | null>(null);

  useEffect(() => {
    setVastuChips(toVastuChips(analysis));
  }, [analysis]);

  const isSkipped = styleId === 'skipped';

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#d7cbbb]">
           <img onError={handleImageError} src={roomImage || "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"} alt="Uploaded room" className="h-full w-full object-cover opacity-60" />
          
          <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-white/95 p-5 shadow-2xl backdrop-blur-md">
            <div className="eyebrow mb-2 text-[#b8573b]">Your Persona</div>
            <h3 className="display text-2xl mb-1">{analysis.archetype.archetype}</h3>
            <p className="text-[12px] text-[#68766d] mb-4">{analysis.archetype.tagline}</p>
            <div className="flex gap-2 mb-3">
              {[analysis.archetype.primaryColor, analysis.archetype.secondaryColor, analysis.archetype.accentColor].map(c => <span key={c} className="size-6 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: c }} />)}
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-medium uppercase tracking-wider text-[#b8573b]">
              {analysis.archetype.styleKeywords.map((keyword: string) => (
                <span key={keyword} className="rounded-full bg-[#b8573b]/10 px-2 py-1">{keyword}</span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col justify-center py-4">
          <h2 className="display text-3xl mb-6">Ready to generate.</h2>
          
          <div className="mb-6 rounded-xl border border-[#d7cbbb] bg-white/50 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] uppercase tracking-widest text-[#68766d]">Direction</span>
              <button onClick={() => jumpToStep(3)} className="text-[12px] font-medium text-[#b8573b] hover:underline">Change</button>
            </div>
            {isSkipped ? (
              <div>
                <div className="text-[14px] text-[#b8573b] mb-2">You skipped style selection. Please confirm a direction:</div>
                <select 
                  className="w-full rounded-md border border-[#d7cbbb] p-2 text-[14px] bg-white outline-none focus:border-[#b8573b]"
                  onChange={(e) => setStyleId(e.target.value)}
                  value={styleId}
                >
                  <option value="skipped" disabled>Select a style...</option>
                  {regionalStyles.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            ) : (
              <div className="text-[18px] font-medium">{activeStyle.name}</div>
            )}
          </div>
          
          {vastuChips.length > 0 && (
            <div className="mb-6">
              <div className="text-[12px] uppercase tracking-widest text-[#68766d] mb-3">Vastu Insights</div>
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {vastuChips.map(chip => (
                    <motion.div 
                      key={chip.id} 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                       className={`rounded-xl border p-3 overflow-hidden ${chip.applies ? 'border-[#1f5c57]/20 bg-[#1f5c57]/5' : 'border-[#d7cbbb] bg-white/45 opacity-75'}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          aria-expanded={expandedChip === chip.id}
                          onClick={() => setExpandedChip(expandedChip === chip.id ? null : chip.id)}
                          className="flex flex-1 items-center gap-2 text-left"
                        >
                          <Compass className="text-[#1f5c57]" size={16} />
                           <span className="text-[14px] font-medium text-[#1f5c57]">{chip.title}{!chip.applies ? ' · not detected' : ''}</span>
                        </button>
                        <button
                          type="button"
                          aria-label={`Dismiss ${chip.title} insight`}
                          onClick={() => setVastuChips(prev => prev.filter(c => c.id !== chip.id))}
                          className="text-[#1f5c57]/60 hover:text-[#1f5c57]"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      {expandedChip === chip.id && (
                        <div className="mt-2 pl-6 text-[12px] text-[#29352f]/80 border-t border-[#1f5c57]/10 pt-2">
                          {chip.detail}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex gap-2 rounded-lg border border-[#d7cbbb] bg-[#f3ecdf] p-1 mb-3">
              <button onClick={() => setMode('whole')} className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${mode === 'whole' ? 'bg-white shadow-sm' : 'text-[#68766d] hover:bg-white/50'}`}>Whole Room</button>
              <button onClick={() => setMode('piece')} className={`flex-1 rounded-md py-2 text-[13px] font-medium transition-colors ${mode === 'piece' ? 'bg-white shadow-sm' : 'text-[#68766d] hover:bg-white/50'}`}>One Piece</button>
            </div>
            
            {mode === 'piece' && (
              <div className="animate-in fade-in flex flex-wrap gap-2">
                {FURNITURE_PIECES.map(p => (
                  <button 
                    key={p} onClick={() => setPiece(p)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] capitalize transition-colors ${piece === p ? 'border-[#b8573b] bg-[#b8573b] text-white' : 'border-[#d7cbbb] bg-white/50 text-[#536059]'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            disabled={isSkipped}
            onClick={nextStep} 
            className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#b8573b] px-6 py-4 text-[15px] font-semibold text-white shadow-lg transition-transform hover:-translate-y-1 btn-primary-glow disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <Sparkles size={18} /> Generate My Design
          </button>
        </div>
      </div>
    </div>
  );
}

function Step11Generating({
  request,
  analysis,
  onComplete,
}: {
  request: DesignGenerationRequest;
  analysis: AnalysisBundle;
  onComplete: (result: DesignGenerationResult) => void;
}) {
  const [status, setStatus] = useState<'loading' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = ['Analyzing your space…', 'Applying your style…', 'Balancing materials and light…', 'Finalizing details…'];

  useEffect(() => {
    const controller = new AbortController();
    setStatus('loading');
    setErrorMessage('');
    setMessageIndex(0);
    const timer = window.setInterval(() => {
      setMessageIndex((index) => (index + 1) % messages.length);
    }, 7000);

    generateRoomDesign(request.roomImage, compileDesignPrompt(request, analysis), controller.signal)
      .then(({ imageDataUrl }) => onComplete({
        designId: `design-${Date.now()}`,
        request,
        persona: analysis.archetype.archetype,
        summary: `${analysis.archetype.tagline}. ${analysis.archetype.signatureTip}`,
        imageDataUrl,
      }))
      .catch(cause => {
        if (cause instanceof DOMException && cause.name === 'AbortError') return;
        setStatus('error');
        setErrorMessage(cause instanceof Error ? cause.message : 'The design could not be generated.');
      });

    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [analysis, attempt, onComplete, request]);

  return (
    <div className="mx-auto max-w-xl text-center py-20">
      {status === 'loading' ? (
        <div className="mx-auto max-w-lg">
          <div className="relative mb-8 aspect-[4/3] overflow-hidden rounded-2xl border border-[#d7cbbb] bg-[#ddd0bf] shadow-xl">
            <img src={request.roomImage} alt="Your room while the redesign is generated" className="h-full w-full object-cover opacity-45 blur-[1px]" />
            <div className="generation-shimmer absolute inset-0" />
            <div className="absolute inset-0 grid place-items-center bg-[#29352f]/20">
              <div className="grid size-20 place-items-center rounded-full border border-white/40 bg-[#29352f]/75 text-white backdrop-blur">
                <Sparkles className="animate-pulse" size={26} />
              </div>
            </div>
          </div>
          <h2 className="display text-3xl mb-3">Creating your real redesign</h2>
          <AnimatePresence mode="wait">
            <motion.p key={messageIndex} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="text-[14px] text-[#68766d]">
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
          <p className="mt-3 text-[11px] text-[#68766d]/75">Image edits can take about a minute. Keep this page open.</p>
        </div>
      ) : (
        <div className="animate-in zoom-in-95">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={32} />
          </div>
          <h2 className="display text-3xl mb-4">Generation interrupted</h2>
          <p role="alert" className="mb-8 text-[14px] text-[#68766d]">{errorMessage}</p>
          <button 
             onClick={() => setAttempt(value => value + 1)}
            className="inline-flex items-center gap-2 rounded-full bg-[#29352f] px-6 py-3 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5"
          >
            <RefreshCw size={16} /> Retry Generation
          </button>
        </div>
      )}
    </div>
  );
}

function createPanoramaSource(styleName: string) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const context = canvas.getContext('2d');
  if (!context) return canvas;

  const seed = [...styleName].reduce((total, character) => total + character.charCodeAt(0), 0);
  const palettes = [
    ['#d9b38c', '#7e4c3c', '#273b34'],
    ['#d7c4a4', '#8f623f', '#40544a'],
    ['#cfa38c', '#735340', '#203f43'],
  ];
  const [wall, wood, accent] = palettes[seed % palettes.length];
  const wallGradient = context.createLinearGradient(0, 0, 0, 700);
  wallGradient.addColorStop(0, '#f3ecdf');
  wallGradient.addColorStop(1, wall);
  context.fillStyle = wallGradient;
  context.fillRect(0, 0, canvas.width, 710);

  const floorGradient = context.createLinearGradient(0, 710, 0, canvas.height);
  floorGradient.addColorStop(0, wood);
  floorGradient.addColorStop(1, '#2f2925');
  context.fillStyle = floorGradient;
  context.fillRect(0, 710, canvas.width, 314);

  for (let x = 0; x < canvas.width; x += 340) {
    context.fillStyle = x % 680 === 0 ? accent : wood;
    context.fillRect(x + 38, 90, 28, 620);
    context.fillStyle = 'rgba(255,255,255,.58)';
    context.fillRect(x + 92, 150, 205, 330);
    context.strokeStyle = 'rgba(41,53,47,.28)';
    context.lineWidth = 8;
    context.strokeRect(x + 92, 150, 205, 330);
    context.beginPath();
    context.moveTo(x + 194, 150);
    context.lineTo(x + 194, 480);
    context.moveTo(x + 92, 315);
    context.lineTo(x + 297, 315);
    context.stroke();
  }

  context.fillStyle = accent;
  context.beginPath();
  context.roundRect(720, 610, 610, 210, 55);
  context.fill();
  context.fillStyle = '#e7c5a6';
  context.beginPath();
  context.roundRect(770, 570, 225, 125, 36);
  context.roundRect(1040, 570, 225, 125, 36);
  context.fill();
  context.fillStyle = wood;
  context.fillRect(820, 815, 40, 120);
  context.fillRect(1190, 815, 40, 120);

  context.fillStyle = 'rgba(243,236,223,.92)';
  context.font = '600 42px serif';
  context.fillText(`${styleName} concept panorama`, 80, 955);
  return canvas;
}

function ARPanorama({ styleName }: { styleName: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const orientationEnabled = useRef(false);
  const dragState = useRef({ active: false, x: 0, y: 0, lon: 0, lat: 0 });
  const view = useRef({ lon: 0, lat: 0 });
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [rendererMode, setRendererMode] = useState<'webgl' | 'canvas'>('webgl');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const panoramaSource = createPanoramaSource(styleName);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1100);
    let renderCanvas = document.createElement('canvas');
    const webglContext =
      renderCanvas.getContext('webgl2') ??
      renderCanvas.getContext('webgl');
    let renderer: THREE.WebGLRenderer | null = null;

    if (webglContext) {
      try {
        renderer = new THREE.WebGLRenderer({
          canvas: renderCanvas,
          context: webglContext,
          antialias: true,
        });
      } catch {
        renderCanvas = document.createElement('canvas');
      }
    }

    const fallbackContext = renderer ? null : renderCanvas.getContext('2d');

    renderCanvas.className = 'h-full w-full';
    renderCanvas.setAttribute('role', 'img');
    renderCanvas.setAttribute('aria-label', `Interactive ${styleName} room panorama`);
    container.prepend(renderCanvas);

    if (renderer) {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      setRendererMode('webgl');
    } else {
      setRendererMode('canvas');
    }

    const geometry = new THREE.SphereGeometry(5, 64, 40);
    geometry.scale(-1, 1, 1);
    const texture = renderer ? new THREE.CanvasTexture(panoramaSource) : null;
    if (texture) texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshBasicMaterial({
      color: texture ? 0xffffff : 0x29352f,
      map: texture,
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (renderer) {
        renderer.setSize(width, height, false);
      } else {
        const ratio = Math.min(window.devicePixelRatio, 2);
        renderCanvas.width = width * ratio;
        renderCanvas.height = height * ratio;
        renderCanvas.style.width = `${width}px`;
        renderCanvas.style.height = `${height}px`;
      }
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const target = new THREE.Vector3();
    let frame = 0;
    const animate = () => {
      const lat = Math.max(-70, Math.min(70, view.current.lat));
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(view.current.lon);
      target.set(
        500 * Math.sin(phi) * Math.cos(theta),
        500 * Math.cos(phi),
        500 * Math.sin(phi) * Math.sin(theta),
      );
      camera.lookAt(target);

      if (renderer) {
        renderer.render(scene, camera);
      } else if (fallbackContext) {
        const canvasWidth = renderCanvas.width;
        const canvasHeight = renderCanvas.height;
        const coverScale = Math.max(
          canvasWidth / panoramaSource.width,
          canvasHeight / panoramaSource.height,
        ) * 1.15;
        const drawWidth = panoramaSource.width * coverScale;
        const drawHeight = panoramaSource.height * coverScale;
        const normalizedLon = ((view.current.lon % 360) + 360) % 360;
        const drawX = -(normalizedLon / 360) * drawWidth;
        const verticalRange = Math.max(0, drawHeight - canvasHeight);
        const drawY = -verticalRange / 2 - (lat / 70) * (verticalRange / 2);

        fallbackContext.clearRect(0, 0, canvasWidth, canvasHeight);
        for (let repeat = -1; repeat <= 2; repeat += 1) {
          fallbackContext.drawImage(
            panoramaSource,
            drawX + repeat * drawWidth,
            drawY,
            drawWidth,
            drawHeight,
          );
        }
      }
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (!orientationEnabled.current) return;
      view.current.lon = (event.gamma ?? 0) * 1.8;
      view.current.lat = (event.beta ?? 90) - 90;
    };
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('deviceorientation', handleOrientation);
      observer.disconnect();
      geometry.dispose();
      texture?.dispose();
      material.dispose();
      renderer?.dispose();
      renderCanvas.remove();
    };
  }, [styleName]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      lon: view.current.lon,
      lat: view.current.lat,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.active) return;
    view.current.lon = dragState.current.lon + (dragState.current.x - event.clientX) * 0.16;
    view.current.lat = dragState.current.lat + (event.clientY - dragState.current.y) * 0.16;
  };

  const enableTilt = async () => {
    const orientationEvent = DeviceOrientationEvent as typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    const permission = orientationEvent.requestPermission
      ? await orientationEvent.requestPermission()
      : 'granted';

    if (permission === 'granted') {
      orientationEnabled.current = true;
      setTiltEnabled(true);
    }
  };

  return (
    <div 
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={() => { dragState.current.active = false; }}
      onPointerCancel={() => { dragState.current.active = false; }}
      className="relative h-full w-full touch-none overflow-hidden bg-black cursor-grab active:cursor-grabbing"
    >
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-[11px] text-white backdrop-blur-md flex items-center gap-2">
        <Smartphone size={14} />
        <span>
          Drag to look around{rendererMode === 'canvas' ? ' · compatibility mode' : ''}
        </span>
        <button
          onClick={enableTilt}
          className="rounded-full bg-white/15 px-2 py-1 font-semibold hover:bg-white/25"
        >
          {tiltEnabled ? 'Tilt on' : 'Enable tilt'}
        </button>
      </div>
    </div>
  );
}

function Step12Result({
  styleId,
  result,
  analysis,
  jumpToStep,
}: {
  styleId: string;
  roomImage: string | null;
  result: DesignGenerationResult | null;
  analysis: AnalysisBundle;
  jumpToStep: (step: Step) => void;
}) {
  const activeStyle = regionalStyles.find(s => s.id === styleId) || regionalStyles[0];
  const { toast } = useToast();
  const [arMode, setArMode] = useState(false);
  const [tier, setTier] = useState<SourcingTier>('artisan');
  const [roomSize, setRoomSize] = useState<RoomSize>('medium');
  const sourcingItems = getSourcingCatalog(
    roomSize,
    result?.request.city || 'Delhi',
    analysis.context.roomType,
    activeStyle.name,
  );

  const handleSave = () => {
    if (!result) return;
    window.localStorage.setItem('aurahomes-design', JSON.stringify({
      designId: result.designId,
      styleId,
      summary: result.summary,
    }));
    toast({ title: 'Design plan saved', description: 'Your generated design plan is saved on this device.' });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-start gap-8 md:flex-row">
        <div className="w-full md:w-2/3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border-4 border-white bg-[#29352f] shadow-2xl">
            <img
              src={result?.imageDataUrl}
              alt={`${activeStyle.name} AI-generated room redesign`}
              onError={handleImageError}
              className="h-full w-full object-cover"
            />
            <div className="absolute bottom-4 right-4 rounded-full bg-[#f3ecdf]/90 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#29352f] backdrop-blur">
              AI-generated redesign
            </div>
            {result?.request.scope === 'piece' && (
              <button
                onClick={() => setArMode(true)}
                className="absolute left-4 top-4 z-10 rounded-full bg-black/60 px-4 py-1.5 text-[12px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black"
              >
                AR Preview
              </button>
            )}
          </div>

          <div className="mt-8 border-b border-[#d7cbbb] pb-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="display text-2xl">Sourcing & Budget</h3>
              <div className="flex flex-wrap gap-2">
                {(['small', 'medium', 'large'] as RoomSize[]).map(size => (
                  <button key={size} onClick={() => setRoomSize(size)} className={`rounded-full px-3 py-1.5 text-[11px] font-medium capitalize ${roomSize === size ? 'bg-[#b8573b] text-white' : 'border border-[#d7cbbb] text-[#536059]'}`}>
                    {size} · {size === 'small' ? '~100' : size === 'medium' ? '~150' : '~250+'} sq ft
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(['artisan', 'local', 'branded'] as SourcingTier[]).map(option => (
                <button key={option} onClick={() => setTier(option)} className={`rounded-full px-4 py-1.5 text-[12px] font-medium capitalize ${tier === option ? 'bg-[#29352f] text-white' : 'border border-[#d7cbbb] text-[#536059] hover:bg-white'}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={`${tier}-${roomSize}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-6 grid gap-4">
              {sourcingItems.map(item => {
                const option = item.tiers[tier];
                return (
                  <div key={item.id} className="grid gap-3 rounded-xl bg-white/60 p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="font-medium text-[#29352f]">{item.name} <span className="text-[#68766d]">×{item.quantity}</span></div>
                      <div className="mt-1 text-[12px] leading-relaxed text-[#68766d]">{option.detail}</div>
                      {option.link ? (
                        <a href={option.link} target="_blank" rel="noreferrer" className="mt-2 inline-block text-[11px] font-semibold text-[#1f5c57] underline underline-offset-4">{option.supplier}</a>
                      ) : (
                        <div className="mt-2 text-[11px] font-semibold text-[#1f5c57]">{option.supplier}</div>
                      )}
                    </div>
                    <div className="font-mono text-[15px] font-bold text-[#b8573b]">₹{(option.basePrice * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="w-full rounded-2xl border border-[#d7cbbb] bg-[#f8f0e5] p-6 md:w-1/3">
          <div className="eyebrow mb-2 text-[#b8573b]">{analysis.context.roomType}</div>
          <h4 className="display mb-4 text-xl">{analysis.archetype.archetype}</h4>
          <p className="mb-5 text-[14px] leading-relaxed text-[#536059]">{result?.summary}</p>
          <p className="mb-6 rounded-lg bg-[#d89a48]/10 p-3 text-[12px] leading-relaxed text-[#536059]">
            This image was generated from your uploaded room while preserving its existing architecture and perspective.
          </p>
          <div className="grid gap-3">
            <button onClick={handleSave} className="rounded-xl bg-[#c8a97e] px-4 py-3 text-[14px] font-semibold text-[#29352f]">Save Design Plan</button>
            <button onClick={() => jumpToStep(3)} className="flex items-center justify-center gap-2 rounded-xl border border-[#d7cbbb] bg-white px-4 py-3 text-[14px] font-medium text-[#29352f]"><RefreshCw size={16} /> Try another style</button>
          </div>
        </div>
      </div>
      {arMode && result?.request.scope === 'piece' && (
        <ARFurniturePreview piece={result.request.piece} onClose={() => setArMode(false)} />
      )}
    </div>
  );
}


// --- MAIN FLOW CONTAINER ---

export default function DesignFlow() {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState(1);
  
  // Global Flow State
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [styleId, setStyleId] = useState('');
  const [ownership, setOwnership] = useState('');
  const [household, setHousehold] = useState<string[]>([]);
  const [budget, setBudget] = useState(0); 
  const [dnaVector, setDnaVector] = useState([0,0,0,0,0]);
  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [designScope, setDesignScope] = useState<'whole' | 'piece'>('whole');
  const [furniturePiece, setFurniturePiece] = useState<FurniturePiece>('sofa');
  const [designResult, setDesignResult] = useState<DesignGenerationResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisBundle | null>(null);

  const generationRequest = useMemo<DesignGenerationRequest>(() => ({
    age,
    city,
    styleId,
    ownership,
    household,
    budgetBand: BUDGET_BANDS[budget],
    dnaVector,
    roomImage: roomImage ?? '',
    scope: designScope,
    piece: furniturePiece,
  }), [
    age,
    budget,
    city,
    designScope,
    dnaVector,
    furniturePiece,
    household,
    ownership,
    roomImage,
    styleId,
  ]);
  
  const nextStep = useCallback(() => {
    setStep(currentStep => {
      if (currentStep >= 12) return currentStep;
      setDirection(1);
      return (currentStep + 1) as Step;
    });
  }, []);

  const prevStep = useCallback(() => {
    setStep(currentStep => {
      if (currentStep <= 1) return currentStep;
      setDirection(-1);
      return (currentStep - 1) as Step;
    });
  }, []);

  const jumpToStep = useCallback((s: Step) => {
    if (s === step) return;
    setDirection(s > step ? 1 : -1);
    setStep(s);
  }, [step]);

  const handleGenerationComplete = useCallback((result: DesignGenerationResult) => {
    setDesignResult(result);
    setDirection(1);
    setStep(12);
  }, []);

  const handleAnalysisComplete = useCallback((nextAnalysis: AnalysisBundle) => {
    setAnalysis(nextAnalysis);
    setDirection(1);
    setStep(10);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 30 : -30,
      opacity: 0
    })
  };

  return (
    <main className="aura-shell min-h-[100dvh] bg-[#f3ecdf] px-5 pb-24 pt-32 text-[#29352f] sm:px-10 lg:px-20 overflow-x-hidden">
      <div className="mx-auto max-w-[1240px]">
        {/* Header / Nav */}
        <div className="mb-12 flex items-center justify-between">
          <Link href="/" className="inline-flex" aria-label="AuraHomes home">
            <BrandLogo size="flow" />
          </Link>
          
          <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-4">
            <div className="text-[10px] font-medium text-[#68766d] sm:text-[12px]">Step {step} of 12</div>
            <div className="h-1.5 w-32 overflow-hidden rounded-full bg-[#d7cbbb] sm:w-48">
              <div 
                className="h-full bg-[#b8573b] transition-all duration-500 ease-out"
                style={{ width: `${(step / 12) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="w-[68px]" aria-hidden="true" />
        </div>

        {/* Back button */}
        {step > 1 && step <= 12 && (
          <button 
            onClick={prevStep}
            className="mb-8 flex items-center gap-2 text-[12px] text-[#68766d] transition-colors hover:text-[#b8573b]"
          >
            <ChevronRight size={14} className="rotate-180" /> Back
          </button>
        )}

        {/* Step Content Area */}
        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
              className="absolute inset-0 w-full"
            >
              {step === 1 && <Step1Age age={age} setAge={setAge} nextStep={nextStep} />}
              {step === 2 && <Step2City city={city} setCity={setCity} nextStep={nextStep} />}
              {step === 3 && <Step3Style city={city} styleId={styleId} setStyleId={setStyleId} nextStep={nextStep} />}
              {step === 4 && <Step4OwnRent ownership={ownership} setOwnership={setOwnership} nextStep={nextStep} />}
              {step === 5 && <Step5Household household={household} setHousehold={setHousehold} nextStep={nextStep} />}
              {step === 6 && <Step6Budget budget={budget} setBudget={setBudget} nextStep={nextStep} />}
              {step === 7 && <Step7DNA dnaVector={dnaVector} setDnaVector={setDnaVector} nextStep={nextStep} />}
              {step === 8 && <Step8Upload roomImage={roomImage} setRoomImage={setRoomImage} nextStep={nextStep} />}
              {step === 9 && <Step9Analyzing request={generationRequest} onComplete={handleAnalysisComplete} />}
              {step === 10 && analysis && (
                <Step10Confirm
                  styleId={styleId}
                  setStyleId={setStyleId}
                  roomImage={roomImage}
                  nextStep={nextStep}
                  jumpToStep={jumpToStep}
                  mode={designScope}
                  setMode={setDesignScope}
                  piece={furniturePiece}
                  setPiece={setFurniturePiece}
                  analysis={analysis}
                />
              )}
              {step === 11 && analysis && (
                <Step11Generating
                  request={generationRequest}
                  analysis={analysis}
                  onComplete={handleGenerationComplete}
                />
              )}
              {step === 12 && analysis && (
                <Step12Result
                  styleId={styleId}
                  roomImage={roomImage}
                  result={designResult}
                  analysis={analysis}
                  jumpToStep={jumpToStep}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}} />
    </main>
  );
}
