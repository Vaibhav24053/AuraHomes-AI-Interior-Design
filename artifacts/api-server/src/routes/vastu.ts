import { Router, type IRouter } from "express";
import { z } from "zod";

const router: IRouter = Router();

const vastuRequestSchema = z.object({
  roomType: z.string().trim().min(1),
  orientation: z.string().trim().min(1).default("unknown"),
  furnitureList: z.array(z.string()).default([]),
});

type VastuRule = {
  rule: string;
  applies: boolean;
  correctionInstruction: string;
  plainLanguageWhy: string;
};

function hasFurniture(furniture: string[], terms: string[]): boolean {
  return furniture.some((item) => {
    const normalized = item.toLowerCase();
    return terms.some((term) => normalized.includes(term));
  });
}

function hasKnownOrientation(orientation: string): boolean {
  const normalized = orientation.toLowerCase().replace(/[-_]/g, " ");
  if (
    normalized.includes("unknown") ||
    normalized.includes("undetermined") ||
    normalized.includes("cannot determine") ||
    normalized.includes("not known")
  ) {
    return false;
  }

  return /\b(north|south|east|west|northeast|northwest|southeast|southwest|north east|north west|south east|south west)\b/.test(
    normalized,
  );
}

router.post("/vastu-check", (req, res, next) => {
  try {
    const input = vastuRequestSchema.parse(req.body);
    const furniture = input.furnitureList.map((item) => item.trim()).filter(Boolean);
    const knownOrientation = hasKnownOrientation(input.orientation);
    const rules: VastuRule[] = [
      {
        rule: "Keep the bed away from direct door alignment.",
        applies: hasFurniture(furniture, ["bed", "cot", "mattress"]),
        correctionInstruction: "Place the bed so it is not directly in line with the room entrance.",
        plainLanguageWhy: "A direct line from the door to the bed can make the sleeping area feel exposed and unsettled.",
      },
      {
        rule: "Place the kitchen stove toward the east or southeast when orientation is known.",
        applies: hasFurniture(furniture, ["stove", "hob", "cooktop", "kitchen"]),
        correctionInstruction: "If possible, orient the stove toward the east or southeast and keep the cooking zone clear.",
        plainLanguageWhy: "This traditional placement keeps the cooking area connected to the rising sun and a sense of warmth.",
      },
      {
        rule: "Keep the main door and entrance clutter-free.",
        applies: true,
        correctionInstruction: "Leave a clear path at the entrance and avoid storing shoes, boxes, or tall furniture in the doorway.",
        plainLanguageWhy: "A clear entrance makes the home easier to move through and creates a calmer first impression.",
      },
      {
        rule: "Do not place mirrors directly opposite the bed.",
        applies: hasFurniture(furniture, ["mirror", "dresser", "wardrobe"]),
        correctionInstruction: "Move the mirror to a side wall or angle it away from the bed.",
        plainLanguageWhy: "Avoiding a direct reflection helps the sleeping area feel quieter and less visually active at night.",
      },
      {
        rule: "Place a pooja or prayer corner in the northeast when orientation is known.",
        applies: hasFurniture(furniture, ["pooja", "prayer", "mandir", "altar"]),
        correctionInstruction: "If possible, reserve the northeast corner for the pooja or prayer space and keep it uncluttered.",
        plainLanguageWhy: "The northeast is traditionally treated as a light, reflective part of the home for prayer and contemplation.",
      },
    ];

    res.json(
      knownOrientation
        ? rules
        : rules.filter((rule) => !rule.rule.includes("when orientation is known")),
    );
  } catch (error) {
    next(error);
  }
});

export default router;