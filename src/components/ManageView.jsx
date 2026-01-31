import { useEffect, useRef, useState } from 'react';
import Field from './Field.jsx';
import TableView from './TableView.jsx';
import {
  generateId,
  calculateDiscountedPrice,
  formatCurrency,
  parsePrice,
} from '../utils.js';

function createEmptyForm() {
  return {
    id: '',
    createdAt: null,
    image: '',
    name: '',
    color: '',
    size: '',
    category: '',
    styleNumber: '',
    season: '',
    year: '',
    listPrice: '',
    shippingPrice: '',
    discount: '',
    condition: '',
    source: '',
    pricePaid: '',
    notes: '',
  };
}

function ManageView({
  items,
  categories,
  conditions,
  sources,
  onAddItem,
  onUpdateItem,
  onDeleteItems,
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(createEmptyForm());
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.category) {
      setError('Item name and category are required.');
      return;
    }

    const item = {
      ...form,
      id: generateId(),
      createdAt: Date.now(),
    };

    onAddItem(item);
    setForm(createEmptyForm());
    setShowForm(false);
    setError('');
    setMessage('Item added successfully.');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Inventory</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Add New Item
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-xl p-4 space-y-4"
        >
          <Field label="Item name" required>
            <input
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="w-full border rounded px-2 py-1"
            />
          </Field>

          <Field label="Category" required>
            <select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>

          <Field label="Season">
            <div className="flex gap-4">
              {['Spring', 'Fall'].map((s) => (
                <label key={s} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="season"
                    value={s}
                    checked={form.season === s}
                    onChange={(e) => updateField('season', e.target.value)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </Field>

          <Field label="Size">
            <div className="space-y-2">
              {['Medium', 'Large', 'Other'].map((s) => (
                <label key={s} className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="size"
                    value={s}
                    checked={form.size === s}
                    onChange={(e) => updateField('size', e.target.value)}
                  />
                  {s}
                </label>
              ))}
              {form.size === 'Other' && (
                <input
                  placeholder="Enter size"
                  className="w-full border rounded px-2 py-1"
                  onChange={(e) => updateField('size', e.target.value)}
                />
              )}
            </div>
          </Field>

          <button
            type="submit"
            className="bg-forest-700 text-white px-4 py-2 rounded"
          >
            Save Item
          </button>
        </form>
      )}

      <TableView
        items={items}
        conditions={conditions}
        sources={sources}
        onDeleteItems={onDeleteItems}
      />
    </section>
  );
}

export default ManageView;
