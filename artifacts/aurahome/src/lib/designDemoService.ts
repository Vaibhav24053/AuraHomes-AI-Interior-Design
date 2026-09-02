export type AnalysisStage = 'layout' | 'vastu' | 'archetype';
export type FurniturePiece = 'sofa' | 'bed' | 'dining table' | 'wardrobe' | 'armchair' | 'accessories';

export interface DesignGenerationRequest {
  age: string;
  city: string;
  styleId: string;
  ownership: string;
  household: string[];
  budgetBand: string;
  dnaVector: number[];
  roomImage: string;
  scope: 'whole' | 'piece';
  piece: FurniturePiece;
}

export interface DesignGenerationResult {
  designId: string;
  request: DesignGenerationRequest;
  persona: string;
  summary: string;
  imageDataUrl?: string;
}

export class DemoServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DemoServiceError';
  }
}

const wait = (duration: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, duration);

    signal?.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timer);
        reject(new DOMException('Request cancelled', 'AbortError'));
      },
      { once: true },
    );
  });

export async function analyzeRoomDemo({
  signal,
  onStage,
  simulateFailure = false,
}: {
  signal?: AbortSignal;
  onStage: (stage: AnalysisStage) => void;
  simulateFailure?: boolean;
}) {
  const stages: AnalysisStage[] = ['layout', 'vastu', 'archetype'];

  for (const stage of stages) {
    onStage(stage);
    await wait(850, signal);
  }

  if (simulateFailure) {
    throw new DemoServiceError('The room analysis service did not respond.');
  }
}

export async function generateDesignDemo({
  request,
  signal,
  simulateFailure = false,
}: {
  request: DesignGenerationRequest;
  signal?: AbortSignal;
  simulateFailure?: boolean;
}): Promise<DesignGenerationResult> {
  await wait(3000, signal);

  if (simulateFailure) {
    throw new DemoServiceError('The design generation service timed out.');
  }

  const persona = request.dnaVector[0] >= 0
    ? 'The Grounded Collector'
    : 'The Quiet Modernist';
  const scope = request.scope === 'whole'
    ? 'the full room'
    : `your ${request.piece}`;

  return {
    designId: `demo-${Date.now()}`,
    request,
    persona,
    summary: `This demo concept applies the selected direction to ${scope}, tuned for ${request.city || 'your city'}, ${request.ownership === 'rent' ? 'renter-friendly changes' : 'permanent upgrades'}, and the ${request.budgetBand} budget band.`,
  };
}