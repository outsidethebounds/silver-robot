import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import EmptyState from './EmptyState.jsx';
import { ALL_CATEGORIES, CONDITIONS, SOURCES } from '../constants.js';

function CatalogView({ items, onEditItem, onDeleteItem, calculateDiscountedPrice, formatCurrency }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sizeFilter, setSizeFilter] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortOption, setSortOption] = useState('Newest');
  const [filtersOpen, setFiltersOpen] = useState(true);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSizeFilter('');
    setColorFilter('');
    setConditionFilter('');
    setSourceFilter('');
    setMinPrice('');
    setMaxPrice('');
    setSortOption('Newest');
  };

  const filteredAndSortedItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const min = minPrice ? parseFloat(minPrice) : null;
    const max = maxPrice ? parseFloat(maxPrice) : null;

    let result = items.filter((item) => {
      // Text search
      if (q) {
        const haystack = [
          item.name,
          item.color,
          item.size,
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

        if (!haystack.includes(q)) return false;
      }

      // Category
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Size
      if (sizeFilter.trim()) {
        const sf = sizeFilter.toLowerCase();
        if (!String(item.size || '').toLowerCase().includes(sf)) return false;
      }

      // Color
      if (colorFilter.trim()) {
        const cf = colorFilter.toLowerCase();
        if (!String(item.color || '').toLowerCase().includes(cf)) return false;
      }

      // Condition
      if (conditionFilter && item.condition !== conditionFilter) {
        return false;
      }

      // Source
      if (sourceFilter && item.source !== sourceFilter) {
        return false;
      }

      // Discounted price range
      if (min !== null || max !== null) {
        const discounted = calculateDiscountedPrice(item.listPrice, item.discount);
        if (min !== null && discounted < min) return false;
        if (max !== null && discounted > max) return false;
      }

      return true;
    });

    // Sorting
    result = [...result];

    if (sortOption === 'Newest') {
      result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortOption === 'Alphabetical') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === 'Price: Low to High') {
      result.sort((a, b) => {
        const pa = calculateDiscountedPrice(a.listPrice, a.discount);
        const pb = calculateDiscountedPrice(b.listPrice, b.discount);
        return pa - pb;
      });
    } else if (sortOption === 'Price: High to Low') {
      result.sort((a, b) => {
        const pa = calculateDiscountedPrice(a.listPrice, a.discount);
        const pb = calculateDiscountedPrice(b.listPrice, b.discount);
        return pb - pa;
      });
    }

    return result;
  }, [
    items,
    searchQuery,
    selectedCategory,
    sizeFilter,
    colorFilter,
    conditionFilter,
    sourceFilter,
    minPrice,
    maxPrice,
    sortOption,
    calculateDiscountedPrice,
  ]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Categories sidebar */}
      <aside className="md:w-56 flex-shrink-0">
        <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-3">
          <h2 className="text-xs font-semibold tracking-wide text-slate-700 uppercase mb-2">
            Categories
          </h2>
          <div className="flex flex-col gap-1">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs border transition-colors
                  ${
                    selectedCategory === cat
                      ? 'bg-forest-700 text-white border-forest-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <section className="flex-1 flex flex-col gap-3">
        {/* Search + sort */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, color, size, style, season, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white/80 focus:ring-2 focus:ring-forest-500 focus:border-forest-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600">Sort by</label>
            <select
              className="text-sm rounded-lg border border-slate-200 bg-white/80 px-2 py-1.5"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option>Newest</option>
              <option>Alphabetical</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filters card */}
        <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm">
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold tracking-wide uppercase text-slate-700"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <span className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-forest-700" />
              Filters
            </span>
            <span className="text-slate-500">{filtersOpen ? 'Hide' : 'Show'}</span>
          </button>

          {filtersOpen && (
            <div className="border-t border-slate-100 p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-800">Size</span>
                  <input
                    type="text"
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    placeholder="e.g. M, 32, L"
                    className="rounded-md border border-slate-200 bg-white/80 px-2 py-1.5 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-800">Color</span>
                  <input
                    type="text"
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                    placeholder="e.g. navy, tan"
                    className="rounded-md border border-slate-200 bg-white/80 px-2 py-1.5 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-800">Condition</span>
                  <select
                    value={conditionFilter}
                    onChange={(e) => setConditionFilter(e.target.value)}
                    className="rounded-md border border-slate-200 bg-white/80 px-2 py-1.5 text-xs"
                  >
                    <option value="">Any</option>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-800">Source</span>
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="rounded-md border border-slate-200 bg-white/80 px-2 py-1.5 text-xs"
                  >
                    <option value="">Any</option>
                    {SOURCES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-800">Min price</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="rounded-md border border-slate-200 bg-white/80 px-2 py-1.5 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-medium text-slate-800">Max price</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="No limit"
                    className="rounded-md border border-slate-200 bg-white/80 px-2 py-1.5 text-xs"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex justify-center items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Reset filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Grid */}
        {filteredAndSortedItems.length === 0 ? (
          <EmptyState
            title="No items match your filters"
            message="Try clearing filters or add new items from the Manage or Table view."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
           {filteredAndSortedItems.length === 0 ? (
  <EmptyState
    title="No items match your filters"
    message="Try clearing filters or adjusting search."
  />
) : (
  Object.entries(
    filteredAndSortedItems.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized';
      acc[cat] = acc[cat] || [];
      acc[cat].push(item);
      return acc;
    }, {})
  ).map(([category, items]) => (
    <section key={category} className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide uppercase text-slate-700">
        {category}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <ProductCard
            key={item.id}
            item={item}
            onSelect={onEditItem} // temporary: opens detail view
            calculateDiscountedPrice={calculateDiscountedPrice}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>
    </section>
  ))
)}

              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default CatalogView;
