function Field({ label, children, required = false, helpText }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-slate-800 flex items-center gap-1">
        {label}
        {required && <span className="text-rose-600">*</span>}
      </span>
      {children}
      {helpText && <span className="text-xs text-slate-500">{helpText}</span>}
    </label>
  );
}

export default Field;
