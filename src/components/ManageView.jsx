import { useState } from 'react';
import TableView from './TableView.jsx';
import ItemForm from './ItemForm.jsx';

function ManageView({
  items,
  categories,
  conditions,
  sources,
  editingItem,
  showForm,
  onShowForm,
  onCancelForm,
  onAddItem,
  onUpdateItem,
  onDeleteItems,
}) {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Manage Inventory</h2>
        <button
          onClick={onShowForm}
          className="rounded-md bg-forest-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Add New Item
        </button>
      </div>

      {showForm && (
        <ItemForm
          item={editingItem}
          categories={categories}
          conditions={conditions}
          sources={sources}
          onAddItem={onAddItem}
          onUpdateItem={onUpdateItem}
          onCancel={onCancelForm}
        />
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
