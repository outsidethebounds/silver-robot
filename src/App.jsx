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

  const handleDeleteItems = (ids) => {
    setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-slate-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <header className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-xl bg-forest-700 text-white flex items-center justify-center">
            <Mountain className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Blake&apos;s Clothes</h1>
            <p className="text-sm text-slate-600">Inventory manager</p>
          </div>
        </header>

        <TopNav mode={mode} onChangeMode={setMode} />

        <main className="mt-6">
          {mode === 'catalog' && (
            <CatalogView
              items={items}
              calculateDiscountedPrice={calculateDiscountedPrice}
              formatCurrency={formatCurrency}
            />
          )}

          {mode === 'manage' && (
            <ManageView
              items={items}
              categories={CATEGORIES}
              conditions={CONDITIONS}
              sources={SOURCES}
              onAddItem={handleAddItem}
              onDeleteItems={handleDeleteItems}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
