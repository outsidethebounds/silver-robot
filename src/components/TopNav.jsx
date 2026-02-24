export default function TopNav({ mode, onModeChange }) {
  return (
    <nav className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {[
        ['catalog', 'Catalog'],
        ['manage', 'Manage Inventory'],
      ].map(([value, label]) => (
        <button
          key={value}
          type="button"
          onClick={() => onModeChange(value)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            mode === value ? 'bg-[#25533b] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
}
