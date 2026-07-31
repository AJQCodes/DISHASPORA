import type { Ingredient, Recipe, RecipeStep } from '../types';

/**
 * Recipe scaling.
 *
 * Ingredient quantities are stored as free-text strings ('3', '1/2', '1 1/4'),
 * so every amount is parsed, scaled, then re-rendered as something a cook would
 * actually read off a measuring spoon — never '1.3333 cups'. Anything we cannot
 * parse is passed through untouched rather than mangled.
 */

/** Units counted in whole things: you cannot use 1.5 eggs or 2.3 cloves. */
const COUNTABLE_UNITS = new Set([
  'pcs',
  'pc',
  'piece',
  'pieces',
  'cloves',
  'clove',
  'sheets',
  'sheet',
  'slices',
  'slice',
  'sprigs',
  'sprig',
  'eggs',
  'egg',
  'leaves',
  'leaf',
  'bunch',
  'bunches',
  'thumb',
]);

/** Fraction denominators a home cook can actually measure. */
const DENOMINATORS = [2, 3, 4, 8];

const VULGAR: Record<string, string> = {
  '1/2': '½',
  '1/3': '⅓',
  '2/3': '⅔',
  '1/4': '¼',
  '3/4': '¾',
  '1/8': '⅛',
  '3/8': '⅜',
  '5/8': '⅝',
  '7/8': '⅞',
};

/**
 * Parse '2', '1.5', '1/2' or '1 1/4' into a number.
 * Returns null for anything else so callers can fall back to the raw string.
 */
export function parseQuantity(raw: string): number | null {
  const text = raw.trim();
  if (!text) return null;

  const mixed = text.match(/^(\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const [, whole, num, den] = mixed;
    if (Number(den) === 0) return null;
    return Number(whole) + Number(num) / Number(den);
  }

  const fraction = text.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const [, num, den] = fraction;
    if (Number(den) === 0) return null;
    return Number(num) / Number(den);
  }

  const decimal = text.match(/^\d*\.?\d+$/);
  if (decimal) return Number(text);

  return null;
}

/** Reduce a fraction so we render 1/2 rather than 4/8. */
function reduce(num: number, den: number): [number, number] {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(num, den) || 1;
  return [num / d, den / d];
}

/**
 * Snap a scaled amount to something measurable, then render it.
 * Large amounts round to tidy multiples; small ones to kitchen fractions.
 */
export function formatQuantity(value: number, unit: string): string {
  if (!Number.isFinite(value) || value <= 0) return '0';

  if (COUNTABLE_UNITS.has(unit.trim().toLowerCase())) {
    return String(Math.max(1, Math.round(value)));
  }

  // Bulk amounts (grams, millilitres) read better rounded than fractioned.
  if (value >= 100) return String(Math.round(value / 10) * 10);
  if (value >= 20) return String(Math.round(value / 5) * 5);
  if (value >= 10) return String(Math.round(value));

  const whole = Math.floor(value);
  const remainder = value - whole;

  // Find the measurable fraction closest to the leftover part.
  let best = { num: 0, den: 1, error: remainder };
  for (const den of DENOMINATORS) {
    for (let num = 1; num < den; num++) {
      const error = Math.abs(remainder - num / den);
      if (error < best.error - 1e-9) best = { num, den, error };
    }
  }
  // Rounding up to a whole is sometimes the closest option of all.
  if (Math.abs(remainder - 1) < best.error) return String(whole + 1);

  // A trace amount is still an amount — round it up to the smallest measurable
  // fraction rather than silently promoting it to a whole unit.
  if (best.num === 0) return whole > 0 ? String(whole) : VULGAR['1/8'];

  const [num, den] = reduce(best.num, best.den);
  const fraction = VULGAR[`${num}/${den}`] ?? `${num}/${den}`;
  return whole > 0 ? `${whole} ${fraction}` : fraction;
}

/** Scale one ingredient. Unparseable quantities survive untouched. */
export function scaleIngredient(ingredient: Ingredient, factor: number): Ingredient {
  const parsed = parseQuantity(ingredient.quantity);
  if (parsed === null || factor === 1) return ingredient;
  return { ...ingredient, quantity: formatQuantity(parsed * factor, ingredient.unit) };
}

export function scaleIngredients(ingredients: Ingredient[], factor: number): Ingredient[] {
  return ingredients.map((item) => scaleIngredient(item, factor));
}

/** Times scale with batch size, floored at a minute so nothing reads as 0. */
export function scaleMinutes(minutes: number, factor: number): number {
  if (!minutes) return minutes;
  return Math.max(1, Math.round(minutes * factor));
}

export function scaleSteps(steps: RecipeStep[], factor: number): RecipeStep[] {
  if (factor === 1) return steps;
  return steps.map((step) => ({
    ...step,
    durationMinutes:
      step.durationMinutes === null ? null : scaleMinutes(step.durationMinutes, factor),
  }));
}

export interface ScaledRecipe {
  servings: number;
  factor: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  prepMinutes: number;
  cookMinutes: number;
  totalMinutes: number;
  /** Calories for one serving — a constant, by definition. */
  caloriesPerServing: number;
  /** Calories for the whole scaled batch. */
  caloriesTotal: number;
}

/**
 * Derive every serving-dependent value for a recipe at `servings` portions.
 * `recipe.calories` is treated as per-serving, matching how the detail screen
 * has always labelled it.
 */
export function scaleRecipe(recipe: Recipe, servings: number): ScaledRecipe {
  const base = recipe.servings > 0 ? recipe.servings : 1;
  const target = Math.max(1, Math.round(servings));
  const factor = target / base;

  const prepMinutes = scaleMinutes(recipe.prepMinutes, factor);
  const cookMinutes = scaleMinutes(recipe.cookMinutes, factor);

  return {
    servings: target,
    factor,
    ingredients: scaleIngredients(recipe.ingredients, factor),
    steps: scaleSteps(recipe.steps, factor),
    prepMinutes,
    cookMinutes,
    totalMinutes: prepMinutes + cookMinutes,
    caloriesPerServing: recipe.calories,
    caloriesTotal: Math.round(recipe.calories * target),
  };
}

export const MIN_SERVINGS = 1;
export const MAX_SERVINGS = 20;
