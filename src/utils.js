import { STORAGE_KEY } from './constants';
import { SEED_ITEMS } from './seedData';

export const currency = (value) => `$${Number(value || 0).toFixed(2)}`;

export const parseMoney = (value) => {
  const num = Number.parseFloat(String(value ?? '').replace(/[^\d.-]/g, ''));
  return Number.isFinite(num) ? num : 0;
};

export const itemBasePrice = (item) => {
  const direct = parseMoney(item?.pricePaid);
  if (direct > 0) return direct;
  return discountedPrice(item?.listPrice, item?.discount);
};

export const discountedPrice = (listPrice, discountPercent) => {
  const list = parseMoney(listPrice);
  const discount = Number.parseFloat(discountPercent || 0);
  const next = list * (1 - (Number.isFinite(discount) ? discount : 0) / 100);
  return Math.max(0, next);
};

export const totalPaid = (item) => itemBasePrice(item) + parseMoney(item.shippingPrice);

export const generateId = () => crypto.randomUUID?.() || `item_${Date.now()}`;

export const saveInventory = (items) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const loadInventory = () => {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return SEED_ITEMS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_ITEMS;
  } catch {
    return SEED_ITEMS;
  }
};

const requiredShape = ['id', 'name', 'category'];

export const validateInventoryImport = (data) => {
  if (!Array.isArray(data)) return { valid: false, message: 'JSON must be an array.' };
  for (const entry of data) {
    const ok = entry && typeof entry === 'object' && requiredShape.every((k) => k in entry);
    if (!ok) return { valid: false, message: 'Each item must include id, name, and category fields.' };
  }
  return { valid: true };
};

export const itemSearchText = (item) =>
  [
    item.name,
    item.color,
    item.size === 'Other' ? item.sizeOther : item.size,
    item.styleNumber,
    item.season,
    item.year,
    item.notes,
    item.source,
    item.condition,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

export const getDisplaySize = (item) => (item.size === 'Other' ? item.sizeOther || 'Other' : item.size);

export const groupByCategory = (items) =>
  items.reduce((acc, item) => {
    const key = item.category || 'Uncategorized';
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
