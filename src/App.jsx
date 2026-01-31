import { useEffect, useState } from 'react';
import { Mountain } from 'lucide-react';
import { CATEGORIES, CONDITIONS, SOURCES } from './constants.js';
import { loadItems, saveItems, calculateDiscountedPrice, formatCurrency } from './utils.js';
import TopNav from './components/TopNav.jsx';
import CatalogView from './components/CatalogView.jsx';
import ManageView from './components/ManageView.jsx';

function App() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('catalog');

  useEffect(() => {
    setItems(loadItems());
  }, []);

  useEffect(() => {
    saveItems(items);
  }, [items]);

  const handleAddItem = (item) => {
    setItems((prev) => [item, ...prev]);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
  };

  const handleDeleteMany = (ids) => {
    setItems((prev) => prev.filter((it) => !ids.includes(it.id)));
  };

  const handleImportItems = (newItems) => {
    if (!Array.isArray(newItems) || newItems.length === 0) return;
    setItems((prev) => [...newItems, ...prev]);
  };

  const safeSetMode = (nextMode) => {
    // If TopNav still has a "Table" button, treat it as Manage Inventory
    if (nextMode === 'table') setMode('manage');
    else setMode(nextMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-slate-50 to-emerald-100 text-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-forest-700 text-white shadow-md">
            <Mountain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Blake&apos;s Clothes</h1>
            <p className="text-sm text-slate-600">Outdoor &amp; active wardrobe inventory</p>
          </div>
        </header>

        <TopNav mode={mode} onChangeMode={safeSetMode} />

        <main className="mt-6">
          {mode === 'catalog' && (
            <CatalogView
              items={items}
              calculateDiscountedPrice={calculateDiscountedPrice}
              formatCurrency={formatCurrency}
            />
          )}

          {(mode === 'manage' || mode === 'table') && (
            <ManageView
              items={items}
              categories={CATEGORIES}
              conditions={CONDITIONS}
              sources={SOURCES}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDeleteItems={handleDeleteMany}
              onImportItems={handleImportItems}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
