import { useMemo, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import ProductCard from './ProductCard.jsx';
import EmptyState from './EmptyState.jsx';
import { ALL_CATEGORIES, CONDITIONS, SOURCES } from '../constants.js';

function CatalogView({
  items,
  onSelectItem,
  calculateDiscountedPrice,
  formatCurrency,
}) {
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

      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      if (sizeFilter && !String(item.size || '').toLowerCase().includes(sizeFilter.toLowerCase())) {
        return false;
      }

      if (colorFilter && !String(item.color || '').toLowerCase().includes(colorFilter.toLowerCase())) {
        return false;
      }

      if (conditionFilter && item.condition !== conditionFilter) {
        return false;
      }

      if (sourceFilter && item.source !== sourceFilter) {
        return false;
      }

      if (min !== null || max !== null) {
        const discounted = calculateDiscountedPrice(item.listPrice, item.discount);
        if (min !== null && discounted < min) return false;
        if (max !== null && discounted > max) return false;
      }

      return true;
    });

    result = [...result];

    if (sortOption === 'Newest') {
      result.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortOption === 'Alphabetical') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortOption === 'Price: Low to High') {
      result.sort(
        (a, b) =>
          calculateDiscountedPrice(a.listPrice, a.discount) -
          calculateDiscountedPrice(b.listPrice, b.discount)
      );
    } else if (sortOption === 'Price: High to Low') {
      result.sort(
        (a, b) =>
          calculateDiscountedPrice(b.listPrice, b.discount) -
          calculateDiscountedPrice(a.listPrice, a.discount)
      );
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

  const groupedByCategory = useMemo(() => {
    return filteredAndSortedItems.reduce((acc, item) => {
      const cat = item.category || 'Uncategorized';
      acc[cat] = acc[cat] || [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [filteredAndSortedItems]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Categories */}
      <aside className="md:w-56 flex-shrink-0">
        <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-3">
          <h2 className="text-xs font-semibold tracking-wide text-slate-700 uppercase mb-2">
            Categories
          </h2>
          <div className="flex flex-col gap-1">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-left px-2.5 py-1.5 rounded-md text-xs border
                  ${
                    selectedCategory === cat
                      ? 'bg-forest-700 text-white border-forest-700'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="flex-1 flex flex-col gap-4">
        {/* Search & Sort */}
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search inventory…"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200"
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="text-sm rounded-lg border border-slate-200 px-2 py-1.5"
          >
            <option>Newest</option>
            <option>Alphabetical</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        {filteredAndSortedItems.length === 0 ? (
          <EmptyState
            title="No items match your filters"
            message="Try adjusting search or filters."
          />
        ) : (
          Object.entries(groupedByCategory).map(([category, items]) => (
            <section key={category} className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">
                {category}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onSelect={onSelectItem}
                    calculateDiscountedPrice={calculateDiscountedPrice}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </section>
    </div>
  );
}

export default CatalogView;
