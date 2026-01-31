import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

function App() {
  const [inventory, setInventory] = useState([]);
  const [dirty, setDirty] = useState(false);

  // Warn before refresh if data not exported
  useEffect(() => {
    const handler = (e) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Add item
  const handleAddItem = (e) => {
    e.preventDefault();
    const form = e.target;

    const item = {
      sku: form.sku.value.trim(),
      name: form.name.value.trim(),
      quantity: Number(form.quantity.value),
      price: Number(form.price.value),
    };

    setInventory((prev) => [...prev, item]);
    setDirty(true);
    form.reset();
  };

  // Import JSON
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) {
          alert("Invalid file: expected an array of items");
          return;
        }
        setInventory(data);
        setDirty(false);
      } catch {
        alert("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
  };

  // Export JSON
  const handleExport = () => {
    const blob = new Blob(
      [JSON.stringify(inventory, null, 2)],
      { type: "application/json" }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.json";
    a.click();
    URL.revokeObjectURL(url);

    setDirty(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Manage Inventory</h1>

      {/* Import / Export */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          <strong>Import JSON</strong>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "block", marginTop: "0.5rem" }}
          />
        </label>

        <button
          onClick={handleExport}
          disabled={inventory.length === 0}
          style={{ marginTop: "0.5rem" }}
        >
          Export JSON
        </button>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} style={{ marginBottom: "1rem" }}>
        <input name="sku" placeholder="SKU" required />
        <input name="name" placeholder="Name" required />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          required
        />
        <button type="submit">Add Item</button>
      </form>

      {/* Inventory Table */}
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, index) => (
            <tr key={index}>
              <td>{item.sku}</td>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>${item.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {dirty && (
        <p style={{ marginTop: "1rem", color: "red" }}>
          ⚠ You have unsaved changes. Export JSON before leaving.
        </p>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
