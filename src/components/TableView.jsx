import { useRef, useState } from 'react';
import Papa from 'papaparse';
import { CATEGORIES } from '../constants.js';
import { generateId } from '../utils.js';

const FIELD_ORDER = [
  'image',
  'name',
  'color',
  'size',
  'category',
  'styleNumber',
  'season',
  'year',
  'listPrice',
  'shippingPrice',
  'discount',
  'condition',
  'source',
  'pricePaid',
  'notes',
];

function createBlankItem() {
  return {
    id: generateId(),
    createdAt: Date.now(),
    image: '',
    name: '',
    color: '',
    size: '',
    category: 'Short-Sleeve Tees',
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

function normalizeHeader(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function buildHeaderMap(fields) {
  const canonical = FIELD_ORDER.reduce((acc, key) => {
    acc[key] = normalizeHeader(key);
    return acc;
  }, {});

  const synonyms = {
    itemname: 'name',
    item: 'name',
    listprice: 'listPrice',
    price: 'listPrice',
    shipping: 'shippingPrice',
    shippingcost: 'shippingPrice',
    discountpercent: 'discount',
    discountpct: 'discount',
    pricepaid: 'pricePaid',
    style: 'styleNumber',
    stylenumber: 'styleNumber',
  };

  const map = {};

  fields.forEach((header) => {
    const norm = normalizeHeader(header);
    let matchKey = null;

    // Direct canonical match
    for (const key of FIELD_ORDER) {
      if (canonical[key] === norm) {
        matchKey = key;
        break;
      }
    }

    // Synonym match
    if (!matchKey && synonyms[norm]) {
      matchKey = synonyms[norm];
    }

    if (matchKey) {
      map[header] = matchKey;
    }
  });

  return map;
}

function convertCsvRowsToItems(results) {
  const { data, meta } = results;
  const fields = meta && meta.fields ? meta.fields : [];
  if (!fields.length) return [];

  const headerMap = buildHeaderMap(fields);

  const items = [];

  data.forEach((row, index) => {
    const base = createBlankItem();

    Object.entries(row || {}).forEach(([header, value]) => {
      const key = headerMap[header];
      if (!key) return;
      base[key] = String(value ?? '').trim();
    });

    if (!base.category) {
      base.category = 'Short-Sleeve Tees';
    }

    // Skip completely empty rows
    const hasContent = FIELD_ORDER.some((key) => base[key] && base[key].toString().trim() !== '');
    if (!hasContent) return;

    base.id = generateId();
    base.createdAt = Date.now() + index;

    items.push(base);
  });

  return items;
}

function TableView({ items, conditions, sources, onAddBlankItem, onUpdateItem, onDeleteItems, onImportItems }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const fileInputRef = useRef(null);

  const toggleAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((it) => it.id));
    }
  };

  const toggleOne = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleCellChange = (id, field, value) => {
    const item = items.find((it) => it.id === id);
    if (!item) return;
    const updated = { ...item, [field]: value };
    onUpdateItem(updated);
  };

  const handleAddRow = () => {
    const blank = createBlankItem();
    onAddBlankItem(blank);
  };

  const handleDeleteSelected = () => {
    if (!selectedIds.length) return;
    if (!window.confirm(`Delete ${selectedIds.length} selected item(s)?`)) return;
    onDeleteItems(selectedIds);
    setSelectedIds([]);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blakes-clothes-inventory.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClickImport = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleCsvChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const imported = convertCsvRowsToItems(results);
          if (imported.length) {
            onImportItems(imported);
            alert(`Imported ${imported.length} item(s) from CSV.`);
          } else {
            alert('No valid rows found in CSV.');
          }
        } catch (err) {
          console.error('Failed to import CSV', err);
          alert('There was a problem reading that CSV file.');
        } finally {
          event.target.value = '';
        }
      },
      error: (err) => {
        console.error('CSV parse error', err);
        alert('There was a problem reading that CSV file.');
        event.target.value = '';
      },
    });
  };

  return (
    <section className="bg-white/80 border border-slate-200 rounded-xl shadow-sm p-3 sm:p-4">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Table</h2>
          <p className="text-sm text-slate-600">
            Inline edit your inventory. Values are free text; price fields are not auto-calculated here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs mt-1 sm:mt-0">
          <button
            type="button"
            onClick={handleAddRow}
            className="rounded-md bg-forest-700 px-3 py-1.5 font-semibold text-white hover:bg-forest-800"
          >
            Add row
          </button>
          <button
            type="button"
            onClick={handleDeleteSelected}
            className="rounded-md border border-rose-200 bg-rose-50 px-3 py-1.5 font-medium text-rose-700 hover:bg-rose-100"
          >
            Delete selected
          </button>
          <button
            type="button"
            onClick={handleExportJson}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={handleClickImport}
            className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-100"
          >
            Import CSV
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleCsvChange}
            className="hidden"
          />
        </div>
      </div>

      <div className="overflow-auto border border-slate-200 rounded-lg bg-slate-50/60">
        <table className="min-w-full border-collapse text-xs">
          <thead className="bg-slate-100/80">
            <tr>
              <th className="border-b border-slate-200 px-2 py-1 text-left">
                <input
                  type="checkbox"
                  checked={items.length > 0 && selectedIds.length === items.length}
                  onChange={toggleAll}
                />
              </th>
              {FIELD_ORDER.map((field) => (
                <th key={field} className="border-b border-slate-200 px-2 py-1 text-left font-semibold text-slate-700">
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={FIELD_ORDER.length + 1}
                  className="px-3 py-4 text-center text-slate-500"
                >
                  No items yet. Use "Add row" or import a CSV.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="odd:bg-white even:bg-slate-50/60">
                  <td className="border-t border-slate-200 px-2 py-1 align-top">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleOne(item.id)}
                    />
                  </td>
                  {FIELD_ORDER.map((field) => {
                    const value = item[field] ?? '';

                    if (field === 'category') {
                      return (
                        <td
                          key={field}
                          className="border-t border-slate-200 px-2 py-1 align-top"
                        >
                          <select
                            className="w-40 rounded border border-slate-200 bg-white px-1 py-0.5"
                            value={value}
                            onChange={(e) => handleCellChange(item.id, field, e.target.value)}
                          >
                            <option value="">(blank)</option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    }

                    if (field === 'condition') {
                      return (
                        <td
                          key={field}
                          className="border-t border-slate-200 px-2 py-1 align-top"
                        >
                          <select
                            className="w-40 rounded border border-slate-200 bg-white px-1 py-0.5"
                            value={value}
                            onChange={(e) => handleCellChange(item.id, field, e.target.value)}
                          >
                            <option value="">(blank)</option>
                            {conditions.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    }

                    if (field === 'source') {
                      return (
                        <td
                          key={field}
                          className="border-t border-slate-200 px-2 py-1 align-top"
                        >
                          <select
                            className="w-40 rounded border border-slate-200 bg-white px-1 py-0.5"
                            value={value}
                            onChange={(e) => handleCellChange(item.id, field, e.target.value)}
                          >
                            <option value="">(blank)</option>
                            {sources.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={field}
                        className="border-t border-slate-200 px-2 py-1 align-top"
                      >
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleCellChange(item.id, field, e.target.value)}
                          className="w-40 rounded border border-slate-200 bg-white px-1 py-0.5"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TableView;
