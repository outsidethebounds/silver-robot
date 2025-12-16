import { useEffect, useRef, useState } from 'react';
import Field from './Field.jsx';
import { generateId, calculateDiscountedPrice, formatCurrency, parsePrice } from '../utils.js';

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

function ManageView({ item, categories, conditions, sources, onAddItem, onUpdateItem, onDone, onCancelEdit }) {
  const [form, setForm] = useState(createEmptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const isEditing = Boolean(item);

  useEffect(() => {
    if (item) {
      setForm({ ...createEmptyForm(), ...item });
    } else {
      setForm(createEmptyForm());
    }
    setMessage('');
    setError('');
  }, [item]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result || '' }));
    };
    reader.readAsDataURL(file);
  };

  const handlePasteUrl = () => {
    const url = window.prompt('Paste image URL');
    if (url) {
      updateField('image', url.trim());
    }
  };

  const handleCalcPricePaid = () => {
    const listPrice = parsePrice(form.listPrice);
    const discounted = calculateDiscountedPrice(form.listPrice, form.discount);
    const shipping = parsePrice(form.shippingPrice);
    const total = Math.max(0, discounted + shipping);
    updateField('pricePaid', total.toFixed(2));
    setMessage(`Price paid set to ${formatCurrency(total)}`);
    setError('');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.category.trim()) {
      setError('Item name and category are required.');
      setMessage('');
      return;
    }

    if (isEditing) {
      const updated = { ...item, ...form };
      onUpdateItem(updated);
      setError('');
      setMessage('Changes saved. Returning to catalog...');
      setTimeout(() => {
        setMessage('');
        onDone();
      }, 2000);
    } else {
      const now = Date.now();
      const newItem = {
        ...form,
        id: generateId(),
        createdAt: now,
      };
      onAddItem(newItem);
      setError('');
      setMessage('Item added. You can add another one.');
      setForm(createEmptyForm());
      setTimeout(() => setMessage(''), 2000);
    }
  };

  const handleCancel = () => {
    onCancelEdit();
  };

  return (
    <section className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Manage Inventory</h2>
        <p className="text-sm text-slate-600">
          Add new items or edit existing ones. Images are stored locally in your browser.
        </p>
      </div>

      {message && (
        <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image section */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col items-start gap-2">
            <div className="w-32 h-32 rounded-lg border border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden">
              {form.image ? (
                <img src={form.image} alt={form.name || 'Item image'} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-500">No image</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Upload
              </button>
              <button
                type="button"
                onClick={handlePasteUrl}
                className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Paste URL
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <Field label="Item name" required>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Category" required>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Color">
              <input
                type="text"
                value={form.color}
                onChange={(e) => updateField('color', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Size">
              <input
                type="text"
                value={form.size}
                onChange={(e) => updateField('size', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Style #">
              <input
                type="text"
                value={form.styleNumber}
                onChange={(e) => updateField('styleNumber', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Season">
              <input
                type="text"
                value={form.season}
                onChange={(e) => updateField('season', e.target.value)}
                placeholder="e.g. FA, SP, Fall"
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Year">
              <input
                type="text"
                value={form.year}
                onChange={(e) => updateField('year', e.target.value)}
                placeholder="e.g. 2024"
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="List price">
              <input
                type="number"
                inputMode="decimal"
                value={form.listPrice}
                onChange={(e) => updateField('listPrice', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Shipping price">
              <input
                type="number"
                inputMode="decimal"
                value={form.shippingPrice}
                onChange={(e) => updateField('shippingPrice', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Discount" helpText="Percent off list (0–100)">
              <input
                type="number"
                inputMode="decimal"
                value={form.discount}
                onChange={(e) => updateField('discount', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              />
            </Field>

            <Field label="Price paid">
              <div className="flex gap-2">
                <input
                  type="number"
                  inputMode="decimal"
                  value={form.pricePaid}
                  onChange={(e) => updateField('pricePaid', e.target.value)}
                  className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
                />
                <button
                  type="button"
                  onClick={handleCalcPricePaid}
                  className="whitespace-nowrap rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  Calc
                </button>
              </div>
            </Field>

            <Field label="Condition">
              <select
                value={form.condition}
                onChange={(e) => updateField('condition', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              >
                <option value="">Select condition</option>
                {conditions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Obtained from">
              <select
                value={form.source}
                onChange={(e) => updateField('source', e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
              >
                <option value="">Select source</option>
                {sources.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <Field label="Notes">
          <textarea
            rows={3}
            value={form.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm"
          />
        </Field>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="submit"
            className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800 shadow-sm"
          >
            {isEditing ? 'Save changes' : 'Add item'}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default ManageView;
