import { currency, discountedPrice } from '../utils';

export default function ProductCard({ item, onClick }) {
  const price = discountedPrice(item.listPrice, item.discount);
  return (
    <button
      type="button"
      onClick={() => onClick(item)}
      className="group w-full overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-[4/3] w-full bg-slate-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">No image</div>
        )}
      </div>
      <div className="space-y-1 p-3">
        <p className="line-clamp-2 text-sm font-semibold text-slate-900">{item.name}</p>
        <p className="text-xs text-slate-600">{item.season} {item.year}</p>
        <p className="text-sm font-medium text-[#25533b]">{currency(price)}</p>
      </div>
    </button>
  );
}
