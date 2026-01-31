function ProductCard({ item, onSelect, calculateDiscountedPrice, formatCurrency }) {
  const price = calculateDiscountedPrice(item.listPrice, item.discount);

  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className="text-left bg-white/80 border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-forest-500"
    >
      {/* Image */}
      <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name || 'Item image'}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col gap-1">
        {/* Name */}
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {item.name || 'Untitled item'}
        </h3>

        {/* Season & Year */}
        {(item.season || item.year) && (
          <div className="text-xs text-slate-500">
            {item.season} {item.year}
          </div>
        )}

        {/* Price */}
        <div className="pt-1 text-base font-semibold text-slate-900">
          {price > 0 ? formatCurrency(price) : 'Price N/A'}
        </div>
      </div>
    </button>
  );
}

export default ProductCard;
