import { Edit3, Trash2 } from 'lucide-react';
import { parsePrice } from '../utils.js';

function ProductCard({ item, onEdit, onDelete, calculateDiscountedPrice, formatCurrency }) {
  const listPrice = parsePrice(item.listPrice);
  const discountedPrice = calculateDiscountedPrice(item.listPrice, item.discount);
  const discountValue = parseFloat(item.discount || '0');
  const hasDiscount = discountValue > 0 && discountedPrice !== listPrice;
  const shipping = parsePrice(item.shippingPrice);

  const handleDelete = () => {
    if (window.confirm(`Delete "${item.name || 'this item'}" from inventory?`)) {
      onDelete(item.id);
    }
  };

  return (
    <div className="bg-white/80 border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
      <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name || 'Clothing item'} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-slate-500">No image</span>
        )}
      </div>

      <div className="flex-1 flex flex-col gap-2 p-3">
        <div className="text-[11px] uppercase tracking-wide text-forest-700 font-semibold">
          {item.category || 'Uncategorized'}
        </div>

        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">{item.name || 'Untitled item'}</h3>
        </div>

        <div className="flex flex-wrap gap-1 text-[11px]">
          {item.size && (
            <span className="px-2 py-0.5 rounded-full bg-forest-50 text-forest-800 border border-forest-100">
              Size {item.size}
            </span>
          )}
          {item.color && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {item.color}
            </span>
          )}
          {item.condition && (
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100">
              {item.condition}
            </span>
          )}
        </div>

        <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 gap-y-1">
          {item.styleNumber && <span>Style #{item.styleNumber}</span>}
          {(item.season || item.year) && (
            <span>
              {item.season} {item.year}
            </span>
          )}
        </div>

        <div className="mt-1 text-sm">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <>
                <span className="font-semibold text-slate-900">
                  {formatCurrency(discountedPrice)}
                </span>
                {listPrice > 0 && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatCurrency(listPrice)}
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-medium">
                  -{discountValue.toFixed(0)}%
                </span>
              </>
            ) : (
              <span className="font-semibold text-slate-900">
                {listPrice > 0 ? formatCurrency(listPrice) : 'Price N/A'}
              </span>
            )}
          </div>
          {shipping > 0 && (
            <div className="text-xs text-slate-500 mt-0.5">
              + {formatCurrency(shipping)} shipping
            </div>
          )}
        </div>

        {item.notes && (
          <p className="mt-1 text-xs text-slate-600 max-h-10 overflow-hidden">
            {item.notes}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-2 text-[11px] text-slate-600">
        <span>Obtained: {item.source || 'Unknown'}</span>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(item.id)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-[11px]"
          >
            <Edit3 className="w-3 h-3" />
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-rose-100 bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px]"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
