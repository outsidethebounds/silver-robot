import { useEffect, useMemo, useRef, useState } from 'react';
import Field from './Field.jsx';
import TableView from './TableView.jsx';
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

function ManageView({
  // NEW: ManageView is now the combined page
  items = [],
  categories = [],
  conditions = [],
  sources = [],

  // existing callbacks
  onAddItem,
  onUpdateItem, // optional, for table editing if your TableView uses it
  onDeleteItems, // optional, for table bulk delete
  onImportItems, // optional, for table import if your TableView uses it
}) {
  const [showForm, setShowForm] = useState(false);

  // If you later wire "edit an existing item", this supports it.
  // For now, we keep it null (Add New Item flow).
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState(createEmptyForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // Size radio helper state
  const [sizeChoice, setSizeChoice] = useState(''); // 'Medium' | 'Large' | 'Other' | ''
  const isEditing = Boolean(editingItem);

  useEffect(() => {
    if (editingItem) {
      setForm({ ...createEmptyForm(), ...editingItem });
      setShowForm(true);
    } else {
      setForm(createEmptyForm());
    }

    setMessage('');
    setError('');
  }, [editingItem]);

  // Initialize sizeChoice from current form.size (works for edit + add)
  useEffect(() => {
    const s = (form.size || '').trim();
    if (s === 'Medium' || s === 'Large') {
      setSizeChoice(s);
    } else if (s) {
      setSizeChoice('Other');
    } else {
      setSizeChoice('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.id]); // only when we swap items / reset form

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewItemClick = () => {
    setEditingItem(null);
    setForm(createEmptyForm());
    setSizeChoice('');
    setError('');
    setMessage('');
    setShowForm((v) => !v);
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
      const updated = { ...editingItem, ...form };
      onUpdateItem && onUpdateItem(updated);
      setError('');
      setMessage('Changes saved.');
      setTimeout(() => setMessage(''), 2000);
      // keep form open for further edits
    } else {
      const now = Date.now();
      const newItem = {
        ...form,
        id: generateId(),
        createdAt: now,
      };
      onAddItem && onAddItem(newItem);
      setError('');
      setMessage('Item added. You can add another one.');
      setForm(createEmptyForm());
      setSizeChoice('');
      setTimeout(() => setMessage(''), 2000);
      // keep form open for multiple adds (same as your original behavior)
    }
  };

  const handleCancelForm = () => {
    setEditingItem(null);
    setForm(createEmptyForm());
    setSizeChoice('');
    setError('');
    setMessage('');
    setShowForm(false);
  };

  // If your TableView supports row-edit and you want it to open the form,
  // you can later wire a callback from TableView to setEditingItem(item).
  // For now we keep table-only rendering.
  const tableProps = useMemo(() => {
    const props = {
      items,
      conditions,
      sources,
    };

    if (onAddItem) props.onAddBlankItem = onAddItem; // matches prior TableView usage
    if (onUpdateItem) props.onUpdateItem = onUpdateItem;
    if (onDeleteItems) props.onDeleteItems = onDeleteItems;
    if (onImportItems) props.onImportItems = onImportItems;

    return props;
  }, [items, conditions, sources, onAddItem, onUpdateItem, onDeleteItems, onImportItems]);

  return (
    <section className="space-y-5">
      {/* Header + button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Manage Inventory</h2>
          <p className="text-sm text-slate-600">
            Add new items, update details, and manage your inventory list.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddNewItemClick}
          className="self-start sm:self-auto rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white hover:bg-forest-800 shadow-sm"
        >
          Add New Item
        </button>
      </div>

      {/* Expandable form */}
      {showForm && (
        <section className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {isEditing ? 'Edit Item' : 'Add New Item'}
              </h3>
              <p className="text-sm text-slate-600">
                Images are stored locally in your browser.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCancelForm}
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
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

                {/* SIZE: radio + Other input */}
                <Field label="Size">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-4">
                      {['Medium', 'Large', 'Other'].map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-sm text-slate-700">
                          <input
                            type="radio"
                            name="size"
                            value={opt}
                            checked={sizeChoice === opt}
                            onChange={(e) => {
                              const choice = e.target.value;
                              setSizeChoice(choice);

                              if (choice === 'Medium' || choice === 'Large') {
                                updateField('size', choice);
                              } else {
                                // Other: if previous was Medium/Large, clear to allow manual entry
                                if (form.size === 'Medium' || form.size === 'Large') updateField('size', '');
                              }
                            }}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>

                    {sizeChoice === 'Other' && (
                      <input
                        type="text"
                        value={form.size === 'Medium' || form.size === 'Large' ? '' : form.size}
                        onChange={(e) => updateField('size', e.target.value)}
                        placeholder="Enter size"
                        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
                      />
                    )}
                  </div>
                </Field>

                <Field label="Style #">
                  <input
                    type="text"
                    value={form.styleNumber}
                    onChange={(e) => updateField('styleNumber', e.target.value)}
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm"
                  />
                </Field>

                {/* SEASON: radio Spring/Fall */}
                <Field label="Season">
                  <div className="flex flex-wrap gap-4">
                    {['Spring', 'Fall'].map((opt) => (
                      <label key={opt} className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="radio"
                          name="season"
                          value={opt}
                          checked={form.season === opt}
                          onChange={(e) => updateField('season', e.target.value)}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
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

              <button
                type="button"
                onClick={handleCancelForm}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Table section (full listing from the old Table page) */}
      <section className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-4 sm:p-5">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Inventory Table</h3>
          <p className="text-sm text-slate-600">
            Full listing of items. Use the table tools to update, import/export, or bulk delete (if enabled).
          </p>
        </div>

        <TableView {...tableProps} />
      </section>
    </section>
  );
}

export default ManageView;
