import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Download, MoveHorizontal, RefreshCw, X } from 'lucide-react';

type FurniturePiece =
  | 'sofa'
  | 'bed'
  | 'dining table'
  | 'wardrobe'
  | 'armchair'
  | 'accessories';

const labels: Record<FurniturePiece, string> = {
  sofa: 'Sofa',
  bed: 'Bed',
  'dining table': 'Dining table',
  wardrobe: 'Wardrobe',
  armchair: 'Armchair',
  accessories: 'Lamp, rug & plant set',
};

const silhouettes: Record<FurniturePiece, string> = {
  sofa: '<rect x="115" y="205" width="570" height="190" rx="48" fill="#8e523e"/><rect x="155" y="142" width="490" height="165" rx="55" fill="#b86d50"/><rect x="96" y="245" width="92" height="164" rx="32" fill="#704034"/><rect x="612" y="245" width="92" height="164" rx="32" fill="#704034"/><rect x="155" y="390" width="36" height="70" fill="#4b3329"/><rect x="609" y="390" width="36" height="70" fill="#4b3329"/>',
  bed: '<rect x="82" y="245" width="636" height="176" rx="28" fill="#8b563c"/><rect x="105" y="180" width="590" height="175" rx="45" fill="#eadac5"/><rect x="110" y="193" width="275" height="92" rx="30" fill="#fff7eb"/><rect x="415" y="193" width="275" height="92" rx="30" fill="#fff7eb"/><rect x="90" y="116" width="620" height="90" rx="34" fill="#5f473b"/><path d="M120 330h560v93H120z" fill="#b8573b"/>',
  'dining table': '<ellipse cx="400" cy="265" rx="240" ry="92" fill="#81533c"/><rect x="372" y="300" width="56" height="150" rx="15" fill="#4d3429"/><path d="M215 236v170m-45-105h90m325-65v170m-45-105h90" stroke="#33433c" stroke-width="35" stroke-linecap="round"/><rect x="128" y="188" width="128" height="105" rx="32" fill="#66766b"/><rect x="544" y="188" width="128" height="105" rx="32" fill="#66766b"/>',
  wardrobe: '<rect x="195" y="58" width="410" height="410" rx="30" fill="#70503a"/><rect x="218" y="80" width="172" height="360" rx="18" fill="#9b7456"/><rect x="410" y="80" width="172" height="360" rx="18" fill="#8b6549"/><circle cx="370" cy="260" r="10" fill="#d6ae63"/><circle cx="430" cy="260" r="10" fill="#d6ae63"/><path d="M225 460v35m350-35v35" stroke="#4a3329" stroke-width="22"/>',
  armchair: '<rect x="235" y="178" width="330" height="230" rx="78" fill="#9a5c48"/><rect x="280" y="115" width="240" height="220" rx="80" fill="#c98260"/><rect x="190" y="250" width="115" height="155" rx="45" fill="#754638"/><rect x="495" y="250" width="115" height="155" rx="45" fill="#754638"/><path d="M270 395l-32 84m292-84l32 84" stroke="#463129" stroke-width="28" stroke-linecap="round"/>',
  accessories: '<ellipse cx="380" cy="430" rx="300" ry="58" fill="#b76545" opacity=".84"/><path d="M185 410h160l-25-210H210z" fill="#d59a49"/><rect x="255" y="160" width="20" height="255" fill="#574238"/><path d="M560 410V205" stroke="#4a392f" stroke-width="22"/><path d="M470 215q90-150 180 0z" fill="#ead5a8"/><path d="M540 395q-75-85-22-180q80 70 52 180m18 0q10-125 92-155q18 115-92 155" fill="#536d58"/><rect x="520" y="380" width="125" height="66" rx="12" fill="#9b5a42"/>',
};

function makeCutout(piece: FurniturePiece) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520"><defs><filter id="s"><feDropShadow dx="0" dy="18" stdDeviation="12" flood-opacity=".28"/></filter></defs><g filter="url(#s)">${silhouettes[piece]}</g></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function ARFurniturePreview({
  piece,
  onClose,
}: {
  piece: FurniturePiece;
  onClose: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const dragRef = useRef({ active: false, startX: 0, offsetX: 0 });
  const [wallWidth, setWallWidth] = useState(10);
  const [calibrated, setCalibrated] = useState(false);
  const [cameraState, setCameraState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [cameraError, setCameraError] = useState('');
  const [offsetX, setOffsetX] = useState(0);
  const [manualScale, setManualScale] = useState(1);
  const [captureUrl, setCaptureUrl] = useState('');
  const cutout = useMemo(() => makeCutout(piece), [piece]);
  const proportionalWidth = Math.min(82, Math.max(38, (10 / wallWidth) * 62)) * manualScale;

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const startCamera = async () => {
    setCalibrated(true);
    setCameraState('loading');
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraState('ready');
    } catch {
      setCameraState('error');
      setCameraError('Camera access was unavailable. Allow camera permission and try again.');
    }
  };

  const retryCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    void startCamera();
  };

  const capture = () => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay || !video.videoWidth || !video.videoHeight) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const width = canvas.width * (proportionalWidth / 100);
    const height = width * (overlay.naturalHeight / overlay.naturalWidth);
    const x = (canvas.width - width) / 2 + (offsetX / 100) * canvas.width;
    const y = canvas.height * 0.54 - height / 2;
    context.drawImage(overlay, x, y, width, height);
    setCaptureUrl(canvas.toDataURL('image/jpeg', 0.92));
  };

  const saveCapture = () => {
    if (!captureUrl) return;
    const link = document.createElement('a');
    link.href = captureUrl;
    link.download = `aurahomes-${piece.replace(/\s+/g, '-')}-ar-preview.jpg`;
    link.click();
  };

  if (!calibrated) {
    return (
      <div className="fixed inset-0 z-[100] grid place-items-center bg-[#1d2723]/95 p-5 text-[#f8f0e5]">
        <div className="w-full max-w-md rounded-[1.5rem] border border-white/15 bg-[#29352f] p-7 shadow-2xl">
          <div className="eyebrow text-[#d89a48]">Quick calibration</div>
          <h2 className="display mt-3 text-4xl">About how wide is this wall or space?</h2>
          <p className="mt-4 text-sm text-white/65">A simple width estimate helps scale the {labels[piece].toLowerCase()} realistically.</p>
          <p className="mt-2 text-xs text-white/45">This is an honest 2D camera overlay for placement and scale—not depth-aware 3D AR.</p>
          <div className="mt-8 flex items-end justify-between">
            <label htmlFor="wall-width" className="text-sm">Wall width</label>
            <span className="display text-4xl text-[#d89a48]">{wallWidth} ft</span>
          </div>
          <input id="wall-width" type="range" min="4" max="24" step="1" value={wallWidth} onChange={(event) => setWallWidth(Number(event.target.value))} className="mt-4 w-full accent-[#d89a48]" />
          <div className="mt-8 grid gap-3">
            <button onClick={() => void startCamera()} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#b8573b] px-6 py-3.5 font-semibold text-white">
              <Camera size={18} /> Open camera preview
            </button>
            <button onClick={onClose} className="rounded-full border border-white/20 px-6 py-3 text-sm text-white/75">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black text-white">
      <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
      {cameraState === 'loading' && <div className="absolute inset-0 grid place-items-center bg-black/70"><RefreshCw className="animate-spin" /></div>}
      {cameraState === 'error' && (
        <div className="absolute inset-0 grid place-items-center bg-[#1d2723] p-6 text-center">
          <div>
            <p className="max-w-sm text-sm text-white/70">{cameraError}</p>
            <button onClick={retryCamera} className="mt-5 rounded-full bg-[#b8573b] px-6 py-3">Retry camera</button>
          </div>
        </div>
      )}
      {cameraState === 'ready' && (
        <div
          className="absolute inset-0 touch-none"
          onWheel={(event) => {
            event.preventDefault();
            setManualScale((scale) => Math.min(1.25, Math.max(0.78, scale - event.deltaY * 0.001)));
          }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            dragRef.current = { active: true, startX: event.clientX, offsetX };
          }}
          onPointerMove={(event) => {
            if (!dragRef.current.active) return;
            setOffsetX(Math.min(32, Math.max(-32, dragRef.current.offsetX + ((event.clientX - dragRef.current.startX) / window.innerWidth) * 100)));
          }}
          onPointerUp={() => { dragRef.current.active = false; }}
          onPointerCancel={() => { dragRef.current.active = false; }}
        >
          <img
            ref={overlayRef}
            src={cutout}
            alt={`${labels[piece]} AR overlay`}
            className="pointer-events-none absolute left-1/2 top-[54%] max-h-[58vh] -translate-x-1/2 -translate-y-1/2 select-none object-contain"
            style={{ width: `${proportionalWidth}%`, marginLeft: `${offsetX}%` }}
          />
        </div>
      )}

      <div className="absolute left-4 top-4 rounded-full bg-black/55 px-4 py-2 text-xs font-semibold backdrop-blur">
        AR Preview — drag to position
      </div>
      <button aria-label="Close AR preview" onClick={onClose} className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-black/55 backdrop-blur"><X size={20} /></button>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/60 p-2 backdrop-blur">
        <span className="hidden items-center gap-2 px-3 text-[11px] text-white/70 sm:flex"><MoveHorizontal size={15} /> Drag · scroll/pinch to resize</span>
        <button onClick={capture} disabled={cameraState !== 'ready'} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#29352f] disabled:opacity-40">Capture</button>
      </div>

      {captureUrl && (
        <div className="absolute inset-0 z-20 grid place-items-center bg-black/80 p-5">
          <div className="w-full max-w-lg rounded-2xl bg-[#f3ecdf] p-4 text-[#29352f]">
            <img src={captureUrl} alt="Captured AR furniture preview" className="max-h-[65vh] w-full rounded-xl object-contain" />
            <div className="mt-4 flex gap-3">
              <button onClick={saveCapture} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#b8573b] px-5 py-3 font-semibold text-white"><Download size={17} /> Save capture</button>
              <button onClick={() => setCaptureUrl('')} className="rounded-full border border-[#d7cbbb] px-5 py-3">Retake</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}