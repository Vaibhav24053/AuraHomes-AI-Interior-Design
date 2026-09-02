import { Router, type IRouter } from "express";
import { z } from "zod";
import {
  askClaudeForJson,
  editRoomImage,
  normalizeImageInput,
} from "../lib/ai";
import { PublicApiError } from "../lib/errors";

const router: IRouter = Router();

const imageRequestSchema = z.object({
  imageBase64: z.string().min(16),
  mimeType: z.string().optional(),
});

const generateDesignSchema = imageRequestSchema.extend({
  prompt: z.string().trim().min(10).max(12_000),
});

const detectContextResponseSchema = z.object({
  roomType: z.string().min(1),
  estimatedOrientation: z.string().min(1),
});

const knownStyleNames: Record<string, string> = {
  nalukettu: "Nalukettu",
  chettinad: "Chettinad",
  "rajasthani-haveli": "Rajasthani Haveli",
  "pol-house": "Pol House",
  "bonedi-bari": "Bonedi Bari",
  "assam-type": "Assam-Type",
  "punjabi-haveli": "Punjabi Haveli",
  awadhi: "Awadhi",
  "wada-style": "Wada Style",
  "nizami-style": "Nizami Style",
  "indo-portuguese": "Indo-Portuguese",
  "kashmiri-wood": "Kashmiri Wood Style",
  "gen-z-minimal": "Gen-Z Minimal",
  "vastu-modern": "Vastu-Modern",
  japandi: "Japandi",
  bohemian: "Bohemian",
  "industrial-loft": "Industrial Loft",
  "coastal-modern": "Coastal Modern",
};

const archetypeResponseSchema = z.object({
  archetype: z.string().min(1),
  tagline: z.string().min(1),
  primaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  secondaryColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  accentColor: z.string().regex(/^#[0-9a-f]{6}$/i),
  styleKeywords: z.array(z.string().min(1)).length(3),
  signatureTip: z.string().min(1),
});

function parseProviderResponse<T>(
  schema: z.ZodType<T>,
  value: unknown,
): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new PublicApiError(
      502,
      "INVALID_PROVIDER_RESPONSE",
      "The reasoning provider returned data in an unexpected format.",
      { cause: parsed.error },
    );
  }
  return parsed.data;
}

function findValue(
  answers: unknown[],
  keys: string[],
): unknown {
  for (const answer of answers) {
    if (!answer || typeof answer !== "object" || Array.isArray(answer)) continue;
    const record = answer as Record<string, unknown>;
    for (const key of keys) {
      if (key in record) return record[key];
    }
  }
  return undefined;
}

function findStyleId(answers: unknown[]): string | undefined {
  const direct = findValue(answers, ["styleId", "style"]);
  if (typeof direct === "string") return direct;

  for (const answer of answers) {
    if (!answer || typeof answer !== "object" || Array.isArray(answer)) continue;
    const record = answer as Record<string, unknown>;
    const question = String(record["questionId"] ?? record["id"] ?? "").toLowerCase();
    const value = record["value"] ?? record["answer"];
    if (question.includes("style") && typeof value === "string") return value;
  }
  return undefined;
}

function findTasteVector(answers: unknown[]): number[] | undefined {
  const direct = findValue(answers, ["tasteVector", "dnaVector", "taste", "vector"]);
  if (Array.isArray(direct) && direct.length === 5 && direct.every((item) => typeof item === "number")) {
    return direct as number[];
  }

  for (const answer of answers) {
    if (!answer || typeof answer !== "object" || Array.isArray(answer)) continue;
    const record = answer as Record<string, unknown>;
    const value = record["value"] ?? record["answer"];
    if (Array.isArray(value) && value.length === 5 && value.every((item) => typeof item === "number")) {
      return value as number[];
    }
  }
  return undefined;
}

router.post("/detect-context", async (req, res, next) => {
  try {
    const input = imageRequestSchema.parse(req.body);
    const image = normalizeImageInput(input.imageBase64, input.mimeType);
    const result = await askClaudeForJson({
      system: [
        "You are AuraHomes' room-context vision specialist.",
        "Inspect the supplied room photo and respond with ONLY one JSON object.",
        'The exact schema is {"roomType":"string","estimatedOrientation":"string"}.',
        'Use "unknown" for estimatedOrientation when the direction cannot be responsibly inferred.',
        "Do not include markdown, explanation, or extra keys.",
      ].join(" "),
      userContent: [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: image.mimeType,
            data: image.base64,
          },
        },
        {
          type: "text",
          text: "Identify the primary room type and estimate which direction the most relevant wall faces, if determinable.",
        },
      ],
      maxTokens: 250,
    });
    res.json(parseProviderResponse(detectContextResponseSchema, result));
  } catch (error) {
    next(error);
  }
});

router.post("/generate-design", async (req, res, next) => {
  try {
    const input = generateDesignSchema.parse(req.body);
    const result = await editRoomImage(input);
    res.json({ imageDataUrl: result });
  } catch (error) {
    next(error);
  }
});

router.post("/design-archetype", async (req, res, next) => {
  try {
    const body = z.union([
      z.array(z.unknown()).min(1),
      z.object({ answers: z.array(z.unknown()).min(1) }).transform((value) => value.answers),
    ]).parse(req.body);
    const answers = body as unknown[];
    const styleId = findStyleId(answers);
    const tasteVector = findTasteVector(answers);

    if (!styleId || !knownStyleNames[styleId]) {
      res.status(400).json({
        error: "answers must include a valid styleId from regionalStyles.ts.",
        code: "INVALID_STYLE_ID",
      });
      return;
    }
    if (!tasteVector) {
      res.status(400).json({
        error: "answers must include the hidden 5-value taste vector.",
        code: "INVALID_TASTE_VECTOR",
      });
      return;
    }

    const result = await askClaudeForJson({
      system: [
        "You are AuraHomes' interior-style archetype writer for the Indian market.",
        "Return ONLY one JSON object, with no markdown fences, preamble, or extra keys.",
        "The archetype must be a creative 2-3 word name.",
        "styleKeywords must contain exactly 3 short strings.",
        "All three colors must be six-digit hex values.",
        'Use exactly this schema: {"archetype":"string","tagline":"string","primaryColor":"#RRGGBB","secondaryColor":"#RRGGBB","accentColor":"#RRGGBB","styleKeywords":["string","string","string"],"signatureTip":"string"}',
      ].join(" "),
      userContent: [
        {
          type: "text",
          text: JSON.stringify({
            selectedStyle: {
              styleId,
              styleName: knownStyleNames[styleId],
            },
            tasteVector,
            answers,
          }),
        },
      ],
      maxTokens: 500,
    });
    res.json(parseProviderResponse(archetypeResponseSchema, result));
  } catch (error) {
    next(error);
  }
});

export default router;