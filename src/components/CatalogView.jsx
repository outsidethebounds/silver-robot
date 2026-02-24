import { useMemo, useState } from 'react';
import { CATEGORIES, CONDITIONS, SORT_OPTIONS, SOURCES } from '../constants';
import { getDisplaySize, groupByCategory, itemBasePrice, itemSearchText } from '../utils';
import ProductCard from './ProductCard';

const sortItems = (items, option) => {
  const sorted = [...items];
  if (option === 'Alphabetical') sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (option === 'Price: Low to High') sorted.sort((a, b) => itemBasePrice(a) - itemBasePrice(b));
  if (option === 'Price: High to Low') sorted.sort((a, b) => itemBasePrice(b) - itemBasePrice(a));
  if (option === 'Newest') sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  return sorted;
};

export default function CatalogView({ items, onSelectItem }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [condition, setCondition] = useState('');
  const [source, setSource] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('Newest');

  const filtered = useMemo(() => items.filter((item) => {
    if (search && !itemSearchText(item).includes(search.toLowerCase())) return false;
    if (category !== 'All' && item.category !== category) return false;
    if (size && !getDisplaySize(item).toLowerCase().includes(size.toLowerCase())) return false;
    if (color && !String(item.color || '').toLowerCase().includes(color.toLowerCase())) return false;
    if (condition && item.condition !== condition) return false;
    if (source && item.source !== source) return false;
    const price = itemBasePrice(item);
    if (minPrice && price < Number(minPrice)) return false;
    if (maxPrice && price > Number(maxPrice)) return false;
    return true;
  }), [items, search, category, size, color, condition, source, minPrice, maxPrice]);

  const grouped = useMemo(() => {
    const byCategory = groupByCategory(filtered);
    return Object.entries(byCategory)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, list]) => [name, sortItems(list, sortOption)]);
  }, [filtered, sortOption]);

  return (
    <div className="grid gap-4 lg:grid-cols-[240px,1fr]">
      <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-semibold">Filters</h2>
        <div className="space-y-2 text-sm">
          <input className="w-full rounded-lg border p-2" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select className="w-full rounded-lg border p-2" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>{CATEGORIES.map((entry) => <option key={entry}>{entry}</option>)}
          </select>
          <input className="w-full rounded-lg border p-2" placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} />
          <input className="w-full rounded-lg border p-2" placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
          <select className="w-full rounded-lg border p-2" value={condition} onChange={(e) => setCondition(e.target.value)}>
            <option value="">Condition</option>{CONDITIONS.map((entry) => <option key={entry}>{entry}</option>)}
          </select>
          <select className="w-full rounded-lg border p-2" value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="">Source</option>{SOURCES.map((entry) => <option key={entry}>{entry}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-lg border p-2" placeholder="Min $" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
            <input className="rounded-lg border p-2" placeholder="Max $" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
          </div>
        </div>
      </aside>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-slate-600">{filtered.length} item(s)</p>
          <select className="rounded-lg border bg-white p-2 text-sm" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            {SORT_OPTIONS.map((option) => <option key={option}>{option}</option>)}
          </select>
        </div>

        {grouped.length === 0 ? <div className="rounded-xl border border-dashed p-8 text-center text-sm text-slate-500">No items found.</div> : (
          <div className="space-y-6">
            {grouped.map(([catName, list]) => (
              <div key={catName}>
                <h3 className="mb-3 text-lg font-semibold">{catName}</h3>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((item) => <ProductCard key={item.id} item={item} onClick={onSelectItem} />)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
