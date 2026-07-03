import type { Country } from "./api/types";

/** `GH₵ 45.00` / `₦ 1,500` from amountMinor per DESIGN.md. */
export function formatMoney(amountMinor: number, currency: string): string {
  const value = amountMinor / 100;
  if (currency === "GHS") {
    return `GH₵ ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (currency === "NGN") {
    return `₦ ${value.toLocaleString("en-US", { maximumFractionDigits: value % 1 === 0 ? 0 : 2 })}`;
  }
  return `${currency} ${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export function countryName(country: Country | string): string {
  return country === "GH" ? "Ghana" : country === "NG" ? "Nigeria" : country;
}

export function formatDate(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string | undefined | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso ?? "—";
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
