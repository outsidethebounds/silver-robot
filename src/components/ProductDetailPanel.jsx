import { X } from 'lucide-react';
import { currency, effectiveDiscountPercent, getDisplaySize, itemBasePrice, parseMoney } from '../utils';

export default function ProductDetailPanel({ item, onClose, onEdit }) {
  const open = Boolean(item);
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition ${open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />
      <aside className={`fixed right-0 top-0 z-50 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {item && (
          <div className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Item Details</h2>
              <button type="button" onClick={onClose} className="rounded-lg border p-2"><X size={18} /></button>
            </div>
            <div className="mb-4 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
              {item.image ? <img src={item.image} alt={item.name} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">No image</div>}
            </div>
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="mb-3 text-sm text-slate-600">{item.season} {item.year}</p>

            <div className="mb-3 rounded-xl border-2 border-[#25533b] bg-[#25533b]/5 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-600">Price Summary</p>
              <p className="mt-1 text-3xl font-bold text-[#25533b]">{currency(itemBasePrice(item))}</p>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-slate-600">Shipping: {currency(parseMoney(item.shippingPrice))}</span>
                <span className="font-semibold text-emerald-700">{effectiveDiscountPercent(item).toFixed(1)}% off list</span>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 rounded-xl border p-4 text-sm">
              <Detail label="Size" value={getDisplaySize(item)} />
              <Detail label="Color" value={item.color || '-'} />
              <Detail label="Condition" value={item.condition || '-'} />
              <Detail label="Style #" value={item.styleNumber || '-'} />
              <Detail label="Source" value={item.source || '-'} />
              <Detail label="List Price" value={currency(parseMoney(item.listPrice))} />
            </dl>
            <div className="mt-3 rounded-xl border p-4 text-sm">
              <p className="mb-1 font-medium">Notes</p>
              <p className="text-slate-600">{item.notes || '—'}</p>
            </div>
            <button type="button" onClick={() => onEdit(item)} className="mt-4 w-full rounded-lg bg-[#25533b] px-4 py-2 font-medium text-white">Edit Item</button>
          </div>
        )}
      </aside>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
