import { useEffect, useState } from 'react';
import { Mountain } from 'lucide-react';
import { CATEGORIES, CONDITIONS, SOURCES } from './constants.js';
import { loadItems, saveItems, calculateDiscountedPrice, formatCurrency } from './utils.js';
import TopNav from './components/TopNav.jsx';
import CatalogView from './components/CatalogView.jsx';
import ManageView from './components/ManageView.jsx';
import TableView from './components/TableView.jsx';

function App() {
  const [items, setItems] = useState([]);
  const [mode, setMode] = useState('catalog'); // 'catalog' | 'manage' | 'table'
  const [editingId, setEditingId] = useState(null);

  // Load from localStorage on first mount
  useEffect(() => {
    const loaded = loadItems();
    setItems(loaded);
  }, []);

  // Persist to localStorage whenever items change
  useEffect(() => {
    saveItems(items);
  }, [items]);

  const handleAddItem = (newItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  const handleUpdateItem = (updatedItem) => {
    setItems((prev) => prev.map((it) => (it.id === updatedItem.id ? updatedItem : it)));
    setEditingId(null);
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleDeleteMany = (ids) => {
    setItems((prev) => prev.filter((it) => !ids.includes(it.id)));
  };

  const handleStartEdit = (id) => {
    setEditingId(id);
    setMode('manage');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setMode('catalog');
  };

  const handleImportItems = (newItems) => {
    if (!Array.isArray(newItems) || newItems.length === 0) return;
    setItems((prev) => [...newItems, ...prev]);
  };

  const editingItem = items.find((it) => it.id === editingId) || null;

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

        <TopNav mode={mode} onChangeMode={setMode} />

        <main className="mt-6">
          {mode === 'catalog' && (
            <CatalogView
              items={items}
              onEditItem={handleStartEdit}
              onDeleteItem={handleDeleteItem}
              calculateDiscountedPrice={calculateDiscountedPrice}
              formatCurrency={formatCurrency}
            />
          )}

          {mode === 'manage' && (
            <ManageView
              item={editingItem}
              categories={CATEGORIES}
              conditions={CONDITIONS}
              sources={SOURCES}
              onAddItem={handleAddItem}
              onUpdateItem={handleUpdateItem}
              onDone={() => setMode('catalog')}
              onCancelEdit={handleCancelEdit}
            />
          )}

          {mode === 'table' && (
            <TableView
              items={items}
              conditions={CONDITIONS}
              sources={SOURCES}
              onAddBlankItem={handleAddItem}
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
