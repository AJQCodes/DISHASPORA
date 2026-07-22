// DTO shapes exactly per docs/API.md

export type Country = "GH" | "NG";
export type Role = "USER" | "VENDOR" | "ADMIN";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  country: Country;
  avatarUrl: string | null;
  premium: boolean;
  premiumUntil: string | null;
  vendorId: number | null;
  banned?: boolean;
}

export interface Vendor {
  id: number;
  name: string;
  bio: string;
  country: Country;
  logoUrl: string | null;
  coverUrl: string | null;
  type: "FOOD" | "INGREDIENT" | "BOTH";
  status: ApprovalStatus;
  rejectionFeedback: string | null;
  rating: number;
  reviewCount: number;
  specialty: string;
  location: string;
  phone: string;
  createdAt?: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes: number | null;
  imageUrl: string | null;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  category: "LOCAL" | "CONTINENTAL" | "FOREIGN" | "DRINK";
  cuisine: string;
  countryOfOrigin: string;
  mealType: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" | "DRINK";
  imageUrl: string | null;
  calories: number;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  mealFrequency: string;
  mealFrequencyReason: string;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  story: string;
  storyImageUrl: string | null;
  videoUrl: string | null;
  videoSearchUrl: string | null;
  audioUrl: string | null;
  hasVideo: boolean;
  hasAudio: boolean;
  vendorId: number;
  vendorName: string;
  status: ApprovalStatus;
  rating: number;
  reviewCount: number;
  savedByMe: boolean;
  cookedByMe: boolean;
  createdAt?: string;
}

export interface Listing {
  id: number;
  type: "FOOD" | "INGREDIENT";
  title: string;
  description: string;
  imageUrl: string | null;
  amountMinor: number;
  currency: string;
  compareAtMinor: number | null;
  country: Country;
  available: boolean;
  stockQty: number;
  quantity: string;
  unit: string;
  prepMinutes: number | null;
  vendorId: number;
  vendorName: string;
  vendorLogoUrl: string | null;
  status: ApprovalStatus;
  linkedRecipeId: number | null;
  createdAt?: string;
}

export interface OrderItem {
  listingId: number;
  title: string;
  imageUrl: string | null;
  qty: number;
  amountMinor: number;
}

export interface Order {
  id: number;
  reference: string;
  status: "PENDING_PAYMENT" | "PAID" | "PREPARING" | "READY" | "COMPLETED" | "CANCELLED";
  items: OrderItem[];
  subtotalMinor: number;
  feeMinor: number;
  deliveryMinor: number;
  totalMinor: number;
  currency: string;
  vendorId: number;
  vendorName: string;
  createdAt: string;
}

export type FlagType =
  | "DUPLICATE_RECIPE"
  | "COUNTRY_MISMATCH"
  | "CATEGORY_SUSPECT"
  | "INAPPROPRIATE"
  | "REPEATED_SUBMISSION";

export interface Flag {
  id: number;
  type: FlagType;
  targetType: "RECIPE" | "LISTING" | "VENDOR";
  targetId: number;
  targetTitle: string;
  detail: string;
  resolved: boolean;
  createdAt: string;
}

export interface Analytics {
  users: number;
  vendors: number;
  recipes: number;
  listings: number;
  orders: number;
  revenueMinorByCurrency: Record<string, number>;
  premiumUsers: number;
  byCountry: Record<string, { users: number; orders: number }>;
  recentOrders: Order[];
  ordersPerDay: { date: string; count: number }[];
}

export interface LoginResponse {
  token: string;
  user: User;
}
