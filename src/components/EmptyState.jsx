function EmptyState({ title = 'No items yet', message }) {
  return (
    <div className="border border-dashed border-forest-200 bg-white/60 rounded-xl p-6 text-center text-sm text-slate-600">
      <p className="font-semibold text-slate-800 mb-1">{title}</p>
      <p>
        {message || 'Use the Manage or Table view to add your first clothing item.'}
      </p>
    </div>
  );
}

export default EmptyState;
