import { useEffect, useMemo, useState } from 'react';
import { Mountain } from 'lucide-react';
import {
  CATEGORIES,
  CONDITIONS,
  EMPTY_ITEM,
  SOURCES,
} from './constants';
import { generateId, loadInventory, saveInventory, validateInventoryImport } from './utils';
import TopNav from './components/TopNav';
import CatalogView from './components/CatalogView';
import ManageView from './components/ManageView';
import ProductDetailPanel from './components/ProductDetailPanel';

export default function App() {
  const [mode, setMode] = useState('catalog');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    setItems(loadInventory());
  }, []);

  useEffect(() => {
    saveInventory(items);
  }, [items]);

  const sortedForTable = useMemo(
    () => [...items].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)),
    [items]
  );

  const handleSaveItem = (payload) => {
    if (payload.id) {
      setItems((prev) => prev.map((item) => (item.id === payload.id ? payload : item)));
      return;
    }
    setItems((prev) => [{ ...EMPTY_ITEM, ...payload, id: generateId(), createdAt: new Date().toISOString() }, ...prev]);
  };

  const exportBackup = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory-backup-${stamp}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = async (file) => {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const validation = validateInventoryImport(parsed);
    if (!validation.valid) {
      window.alert(validation.message);
      return;
    }
    if (!window.confirm('This will overwrite your current inventory. Continue?')) return;
    setItems(parsed);
    setSelectedItem(null);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f7f2] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-[#25533b] p-2.5 text-white"><Mountain size={24} /></div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Gorpcore Browser</h1>
            <p className="text-sm text-slate-600">Blake S</p>
          </div>
        </header>

        <TopNav mode={mode} onModeChange={setMode} />

        <div className="mt-5">
          {mode === 'catalog' ? (
            <CatalogView items={items} onSelectItem={setSelectedItem} />
          ) : (
            <ManageView
              items={sortedForTable}
              categories={CATEGORIES}
              conditions={CONDITIONS}
              sources={SOURCES}
              editingItem={editingItem}
              onEditItem={setEditingItem}
              onSaveItem={handleSaveItem}
              onDeleteItems={(ids) => setItems((prev) => prev.filter((item) => !ids.includes(item.id)))}
              onExport={exportBackup}
              onImport={importBackup}
            />
          )}
        </div>
      </div>

      <ProductDetailPanel
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onEdit={(item) => {
          setSelectedItem(null);
          setMode('manage');
          setEditingItem(item);
        }}
      />
    </div>
  );
}
