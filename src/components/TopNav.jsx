function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors
        ${active ? 'bg-forest-700 text-white border-forest-700 shadow-sm' : 'bg-white/60 text-slate-700 border-slate-200 hover:bg-white'}
      `}
    >
      {children}
    </button>
  );
}

function TopNav({ mode, onChangeMode }) {
  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-800">Views</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline">Catalog / Manage / Table</span>
      </div>
      <div className="flex gap-2 bg-white/60 rounded-full p-1 shadow-sm">
        <TabButton active={mode === 'catalog'} onClick={() => onChangeMode('catalog')}>
          Catalog
        </TabButton>
        <TabButton active={mode === 'manage'} onClick={() => onChangeMode('manage')}>
          Manage
        </TabButton>
        <TabButton active={mode === 'table'} onClick={() => onChangeMode('table')}>
          Table
        </TabButton>
      </div>
    </nav>
  );
}

export default TopNav;
