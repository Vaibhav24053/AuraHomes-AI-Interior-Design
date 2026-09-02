import Anthropic from "@anthropic-ai/sdk";
import OpenAI, { toFile } from "openai";
import { PublicApiError } from "./errors";

export const supportedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export type SupportedImageMimeType = (typeof supportedImageMimeTypes)[number];

const dataUrlPattern = /^data:(image\/(?:jpeg|png|webp|gif));base64,(.+)$/i;
const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
const maxImageBytes = 12 * 1024 * 1024;

export function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new PublicApiError(
      503,
      "PROVIDER_NOT_CONFIGURED",
      "The requested AI provider is not configured.",
    );
  }
  return value;
}

export function getAnthropicClient(): Anthropic {
  return new Anthropic({ apiKey: getRequiredEnv("ANTHROPIC_API_KEY") });
}

export function getOpenAIClient(): OpenAI {
  return new OpenAI({ apiKey: getRequiredEnv("OPENAI_API_KEY") });
}

export function normalizeImageInput(
  imageBase64: string,
  mimeType: string | undefined,
): { base64: string; mimeType: SupportedImageMimeType; buffer: Buffer } {
  const dataUrlMatch = imageBase64.match(dataUrlPattern);
  const rawBase64 = dataUrlMatch?.[2] ?? imageBase64;
  const normalizedMimeType = (dataUrlMatch?.[1] ?? mimeType ?? "image/jpeg").toLowerCase();

  if (
    !supportedImageMimeTypes.includes(
      normalizedMimeType as SupportedImageMimeType,
    )
  ) {
    throw new PublicApiError(
      400,
      "INVALID_IMAGE",
      `Unsupported image type. Use one of: ${supportedImageMimeTypes.join(", ")}.`,
    );
  }

  if (!rawBase64 || rawBase64.length > maxImageBytes * 1.4 || !base64Pattern.test(rawBase64)) {
    throw new PublicApiError(
      400,
      "INVALID_IMAGE",
      "imageBase64 must be a valid base64-encoded image.",
    );
  }

  const buffer = Buffer.from(rawBase64, "base64");
  if (!buffer.length || buffer.length > maxImageBytes) {
    throw new PublicApiError(
      400,
      "INVALID_IMAGE",
      "The uploaded image must be between 1 byte and 12 MB.",
    );
  }

  return {
    base64: rawBase64,
    mimeType: normalizedMimeType as SupportedImageMimeType,
    buffer,
  };
}

export async function editRoomImage({
  imageBase64,
  mimeType,
  prompt,
}: {
  imageBase64: string;
  mimeType?: string;
  prompt: string;
}): Promise<string> {
  const image = normalizeImageInput(imageBase64, mimeType);
  if (image.mimeType === "image/gif") {
    throw new PublicApiError(
      400,
      "INVALID_IMAGE",
      "Room image editing supports JPEG, PNG, and WebP files.",
    );
  }
  const openai = getOpenAIClient();
  const extensionByMimeType = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  } as const;
  const upload = await toFile(
    image.buffer,
    `aurahomes-room.${extensionByMimeType[image.mimeType]}`,
    {
    type: image.mimeType,
    },
  );

  const response = await openai.images.edit({
    model: "gpt-image-1",
    image: upload,
    prompt: [
      "Edit the supplied room photograph rather than creating a new unrelated room.",
      "Preserve the real room architecture, wall positions, windows, doors, camera perspective, and lighting direction.",
      prompt,
    ].join("\n\n"),
    input_fidelity: "high",
  });

  const result = response.data?.[0]?.b64_json;
  if (!result) {
    throw new PublicApiError(
      502,
      "INVALID_PROVIDER_RESPONSE",
      "The image provider returned no edited image.",
    );
  }

  return `data:image/png;base64,${result}`;
}

export async function askClaudeForJson({
  system,
  userContent,
  maxTokens = 700,
}: {
  system: string;
  userContent: Anthropic.Messages.MessageCreateParams["messages"][number]["content"];
  maxTokens?: number;
}): Promise<unknown> {
  const anthropic = getAnthropicClient();
  const message = await anthropic.messages.create({
    model: process.env["ANTHROPIC_MODEL"] ?? "claude-sonnet-4-5",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userContent }],
  });

  const text = message.content
    .filter((block): block is Anthropic.Messages.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new PublicApiError(
      502,
      "INVALID_PROVIDER_RESPONSE",
      "The reasoning provider returned no content.",
    );
  }

  return parseJsonObject(text);
}

export function parseJsonObject(text: string): unknown {
  const withoutFences = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const start = withoutFences.indexOf("{");
  const end = withoutFences.lastIndexOf("}");

  if (start < 0 || end <= start) {
    throw new PublicApiError(
      502,
      "INVALID_PROVIDER_RESPONSE",
      "The reasoning provider returned an invalid response.",
    );
  }

  try {
    return JSON.parse(withoutFences.slice(start, end + 1)) as unknown;
  } catch {
    throw new PublicApiError(
      502,
      "INVALID_PROVIDER_RESPONSE",
      "The reasoning provider returned invalid JSON.",
    );
  }
}