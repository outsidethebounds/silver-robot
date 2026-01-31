import { X, Edit3 } from 'lucide-react';
import { calculateDiscountedPrice, formatCurrency, parsePrice } from '../utils.js';

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-sm text-slate-900">{value}</span>
    </div>
  );
}

function ProductDetailPanel({ item, onClose, onEdit }) {
  if (!item) return null;

  const listPrice = parsePrice(item.listPrice);
  const discounted = calculateDiscountedPrice(item.listPrice, item.discount);
  const shipping = parsePrice(item.shippingPrice);
  const hasDiscount = discounted !== listPrice && discounted > 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/30"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="w-full max-w-md bg-white shadow-xl overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold">Item Details</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image */}
        <div className="aspect-[4/3] bg-slate-100">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-xl font-semibold">{item.name}</h3>
            {(item.season || item.year) && (
              <p className="text-sm text-slate-500">
                {item.season} {item.year}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            {hasDiscount ? (
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-semibold">
                  {formatCurrency(discounted)}
                </span>
                <span className="text-sm line-through text-slate-400">
                  {formatCurrency(listPrice)}
                </span>
              </div>
            ) : (
              <span className="text-xl font-semibold">
                {listPrice > 0 ? formatCurrency(listPrice) : 'Price N/A'}
              </span>
            )}
            {shipping > 0 && (
              <div className="text-sm text-slate-500 mt-1">
                + {formatCurrency(shipping)} shipping
              </div>
            )}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3">
            <DetailRow label="Category" value={item.category} />
            <DetailRow label="Size" value={item.size} />
            <DetailRow label="Color" value={item.color} />
            <DetailRow label="Condition" value={item.condition} />
            <DetailRow label="Style #" value={item.styleNumber} />
            <DetailRow label="Source" value={item.source} />
          </div>

          {item.notes && (
            <div>
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Notes
              </span>
              <p className="text-sm text-slate-700 mt-1">
                {item.notes}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2">
            <button
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-2 rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800"
            >
              <Edit3 className="w-4 h-4" />
              Edit Item
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default ProductDetailPanel;
