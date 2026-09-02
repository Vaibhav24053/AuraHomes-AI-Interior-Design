export interface DetectedContext {
  roomType: string;
  estimatedOrientation: string;
}

export interface DesignArchetype {
  archetype: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  styleKeywords: [string, string, string];
  signatureTip: string;
}

export interface VastuInsight {
  rule: string;
  applies: boolean;
  correctionInstruction: string;
  plainLanguageWhy: string;
}

const apiBase = `${import.meta.env.BASE_URL}backend-api`;

async function postJson<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });

  const payload = await response.json().catch(() => null) as {
    error?: string | { message?: string };
    message?: string;
  } | null;
  if (!response.ok) {
    const message = typeof payload?.error === 'string'
      ? payload.error
      : payload?.error?.message || payload?.message;
    throw new Error(message || `AuraHomes API request failed (${response.status}).`);
  }
  return payload as T;
}

export function splitImageDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/i);
  if (!match) throw new Error('The uploaded image format could not be read.');
  return { mimeType: match[1].toLowerCase(), imageBase64: match[2] };
}

export function detectRoomContext(dataUrl: string, signal?: AbortSignal) {
  return postJson<DetectedContext>('/detect-context', splitImageDataUrl(dataUrl), signal);
}

export function createDesignArchetype(
  answers: unknown[],
  signal?: AbortSignal,
) {
  return postJson<DesignArchetype>('/design-archetype', { answers }, signal);
}

export function checkVastu(
  input: {
    roomType: string;
    orientation: string;
    furnitureList: string[];
  },
  signal?: AbortSignal,
) {
  return postJson<VastuInsight[]>('/vastu-check', input, signal);
}

export function generateRoomDesign(
  dataUrl: string,
  prompt: string,
  signal?: AbortSignal,
) {
  return postJson<{ imageDataUrl: string }>(
    '/generate-design',
    { ...splitImageDataUrl(dataUrl), prompt },
    signal,
  );
}