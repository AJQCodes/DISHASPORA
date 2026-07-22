import { api } from "./client";
import type { Analytics, Flag, Listing, LoginResponse, Recipe, User, Vendor } from "./types";

export const login = (email: string, password: string) =>
  api<LoginResponse>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });

export const getAnalytics = () => api<Analytics>("/admin/analytics");

export const getVendorQueue = () => api<Vendor[]>("/admin/queue/vendors");
export const getRecipeQueue = () => api<Recipe[]>("/admin/queue/recipes");
export const getListingQueue = () => api<Listing[]>("/admin/queue/listings");

export const approveVendor = (id: number) => api<void>(`/admin/vendors/${id}/approve`, { method: "POST" });
export const rejectVendor = (id: number, feedback: string) =>
  api<void>(`/admin/vendors/${id}/reject`, { method: "POST", body: JSON.stringify({ feedback }) });

export const approveRecipe = (id: number) => api<void>(`/admin/recipes/${id}/approve`, { method: "POST" });
export const rejectRecipe = (id: number, feedback: string) =>
  api<void>(`/admin/recipes/${id}/reject`, { method: "POST", body: JSON.stringify({ feedback }) });

export const approveListing = (id: number) => api<void>(`/admin/listings/${id}/approve`, { method: "POST" });
export const rejectListing = (id: number, feedback: string) =>
  api<void>(`/admin/listings/${id}/reject`, { method: "POST", body: JSON.stringify({ feedback }) });

export const getFlags = (resolved: boolean) => api<Flag[]>(`/admin/flags?resolved=${resolved}`);
export const resolveFlag = (id: number) => api<void>(`/admin/flags/${id}/resolve`, { method: "POST" });

export const getUsers = (q: string) => api<User[]>(`/admin/users?q=${encodeURIComponent(q)}`);
export const banUser = (id: number) => api<void>(`/admin/users/${id}/ban`, { method: "POST" });
export const unbanUser = (id: number) => api<void>(`/admin/users/${id}/unban`, { method: "POST" });
