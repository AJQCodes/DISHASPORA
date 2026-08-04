import type { Currency } from './types';

const SYMBOLS: Record<Currency, string> = { GHS: 'GH₵', NGN: '₦' };

/** Formats amountMinor (pesewas/kobo) as e.g. "GH₵ 45.00" / "₦ 1,500.00". */
export function formatMoney(amountMinor: number, currency: Currency): string {
  const major = amountMinor / 100;
  const formatted = major
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${SYMBOLS[currency] ?? currency} ${formatted}`;
}

export function currencySymbol(currency: Currency): string {
  return SYMBOLS[currency] ?? currency;
}
