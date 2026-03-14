import { useEffect, useMemo, useRef, useState } from 'react';
import { EMPTY_ITEM, SEASONS, SIZE_OPTIONS } from '../constants';
import { discountedPrice, generateId, parseMoney, totalPaid } from '../utils';

export default function ManageView({
  items,
  categories,
  conditions,
  sources,
  editingItem,
  onEditItem,
  onSaveItem,
  onDeleteItems,
  onExport,
  onImport,
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_ITEM);
  const [selectedIds, setSelectedIds] = useState([]);
  const [message, setMessage] = useState('');
  const importRef = useRef(null);

  useEffect(() => {
    if (editingItem) {
      setFormOpen(true);
      setForm({ ...EMPTY_ITEM, ...editingItem });
    }
  }, [editingItem]);

  const allSelected = useMemo(() => items.length > 0 && selectedIds.length === items.length, [items, selectedIds]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => update('image', String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) {
      setMessage('Item Name and Category are required.');
      return;
    }
    const payload = {
      ...form,
      id: form.id || generateId(),
      image: form.image || form.imageUrl,
      createdAt: form.createdAt || new Date().toISOString(),
      pricePaid: form.pricePaid || totalPaid(form).toFixed(2),
    };
    onSaveItem(payload);
    setMessage(form.id ? 'Item updated successfully.' : 'Item added successfully.');
    setFormOpen(false);
    setForm(EMPTY_ITEM);
    onEditItem(null);
  };

  const onFileImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await onImport(file);
      setMessage('Backup imported.');
    } catch {
      setMessage('Import failed. Use a valid JSON backup.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold">Manage Inventory</h2>
            <p className="text-sm text-slate-600">Add, edit, import, export, and maintain your full table.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setFormOpen((v) => !v); setForm(EMPTY_ITEM); onEditItem(null); }} className="rounded-lg bg-[#25533b] px-3 py-2 text-sm font-medium text-white">Add New Item</button>
            <button onClick={onExport} className="rounded-lg border px-3 py-2 text-sm">Export Backup</button>
            <button onClick={() => importRef.current?.click()} className="rounded-lg border px-3 py-2 text-sm">Import Backup</button>
            <input ref={importRef} type="file" accept="application/json" className="hidden" onChange={onFileImport} />
          </div>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold">{form.id ? 'Edit Item' : 'Add Item'}</h3>
            <button type="button" onClick={() => { setFormOpen(false); onEditItem(null); }} className="text-sm text-slate-500">Close</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <input className="rounded border p-2" placeholder="Item Name *" value={form.name} onChange={(e) => update('name', e.target.value)} />
            <select className="rounded border p-2" value={form.category} onChange={(e) => update('category', e.target.value)}><option value="">Category *</option>{categories.map((c) => <option key={c}>{c}</option>)}</select>
            <input className="rounded border p-2" placeholder="Image URL" value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} />
            <input type="file" accept="image/*" className="rounded border p-2" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            <input className="rounded border p-2" placeholder="Color" value={form.color} onChange={(e) => update('color', e.target.value)} />
            <input className="rounded border p-2" placeholder="Style #" value={form.styleNumber} onChange={(e) => update('styleNumber', e.target.value)} />
            <input className="rounded border p-2" placeholder="Year" value={form.year} onChange={(e) => update('year', e.target.value)} />
            <input className="rounded border p-2" placeholder="List price" value={form.listPrice} onChange={(e) => update('listPrice', e.target.value)} />
            <input className="rounded border p-2" placeholder="Shipping price" value={form.shippingPrice} onChange={(e) => update('shippingPrice', e.target.value)} />
            <input className="rounded border p-2" placeholder="Discount %" value={form.discount} onChange={(e) => update('discount', e.target.value)} />
            <div className="flex gap-2">
              <input className="w-full rounded border p-2" placeholder="Price Paid" value={form.pricePaid} onChange={(e) => update('pricePaid', e.target.value)} />
              <button type="button" className="rounded border px-2 text-xs" onClick={() => update('pricePaid', totalPaid(form).toFixed(2))}>Auto-calc</button>
            </div>
            <select className="rounded border p-2" value={form.condition} onChange={(e) => update('condition', e.target.value)}><option value="">Condition</option>{conditions.map((c) => <option key={c}>{c}</option>)}</select>
            <select className="rounded border p-2" value={form.source} onChange={(e) => update('source', e.target.value)}><option value="">Source</option>{sources.map((s) => <option key={s}>{s}</option>)}</select>
          </div>

          <div className="mt-3 flex flex-wrap gap-6 text-sm">
            <fieldset><legend className="mb-1 font-medium">Season</legend>{SEASONS.map((s) => <label key={s} className="mr-3"><input type="radio" name="season" checked={form.season === s} onChange={() => update('season', s)} /> {s}</label>)}</fieldset>
            <fieldset><legend className="mb-1 font-medium">Size</legend>{SIZE_OPTIONS.map((s) => <label key={s} className="mr-3"><input type="radio" name="size" checked={form.size === s} onChange={() => update('size', s)} /> {s}</label>)}{form.size === 'Other' && <input className="mt-2 rounded border p-1" placeholder="Enter size" value={form.sizeOther} onChange={(e) => update('sizeOther', e.target.value)} />}</fieldset>
          </div>
          <textarea className="mt-3 w-full rounded border p-2" rows="3" placeholder="Notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} />

          {message && <p className="mt-2 text-sm text-[#25533b]">{message}</p>}
          <button className="mt-3 rounded-lg bg-[#25533b] px-4 py-2 text-white">Save Item</button>
        </form>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Inventory Table</h3>
          <button
            onClick={() => { if (!selectedIds.length) return; if (window.confirm(`Delete ${selectedIds.length} item(s)?`)) onDeleteItems(selectedIds); setSelectedIds([]); }}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-sm text-rose-700"
          >Bulk Delete</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-2"><input type="checkbox" checked={allSelected} onChange={() => setSelectedIds(allSelected ? [] : items.map((i) => i.id))} /></th>
                <th className="p-2">Item</th><th className="p-2">Category</th><th className="p-2">Season/Year</th><th className="p-2">Condition</th><th className="p-2">Source</th><th className="p-2">Price Paid</th><th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-2"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => setSelectedIds((prev) => prev.includes(item.id) ? prev.filter((id) => id !== item.id) : [...prev, item.id])} /></td>
                  <td className="p-2 font-medium">{item.name}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">{item.season} {item.year}</td>
                  <td className="p-2">{item.condition}</td>
                  <td className="p-2">{item.source}</td>
                  <td className="p-2">${parseMoney(item.pricePaid || totalPaid(item)).toFixed(2)}</td>
                  <td className="p-2"><button className="rounded border px-2 py-1" onClick={() => onEditItem(item)}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
