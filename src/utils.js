export const STORAGE_KEY = 'clothing_inventory_items_v1';

export function loadItems() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load items from localStorage', err);
    return [];
  }
}

export function saveItems(items) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to localStorage', err);
  }
}

export function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `item_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function parsePrice(value) {
  if (value === null || value === undefined || value === '') return 0;
  const num = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

export function calculateDiscountedPrice(listPriceStr, discountStr) {
  const listPrice = parsePrice(listPriceStr);
  const discount = parseFloat(discountStr);
  const discountPct = Number.isFinite(discount) ? discount : 0;
  const discounted = listPrice * (1 - discountPct / 100);
  return discounted < 0 ? 0 : discounted;
}

export function formatCurrency(value) {
  const num = typeof value === 'number' ? value : parsePrice(value);
  return `$${num.toFixed(2)}`;
}
