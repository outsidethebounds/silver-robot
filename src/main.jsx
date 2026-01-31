let inventory = [];
let hasUnsavedChanges = false;

const tableBody = document.getElementById("inventoryTable");
const form = document.getElementById("inventoryForm");

const importBtn = document.getElementById("importBtn");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");

// --------------------
// Render Inventory
// --------------------
function renderInventory() {
  tableBody.innerHTML = "";

  inventory.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>$${item.price.toFixed(2)}</td>
    `;

    tableBody.appendChild(row);
  });
}

// --------------------
// Add Inventory Item
// --------------------
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const item = {
    sku: document.getElementById("sku").value.trim(),
    name: document.getElementById("name").value.trim(),
    quantity: Number(document.getElementById("quantity").value),
    price: Number(document.getElementById("price").value),
  };

  inventory.push(item);
  hasUnsavedChanges = true;

  renderInventory();
  form.reset();
});

// --------------------
// Import JSON
// --------------------
importBtn.addEventListener("click", () => {
  importFile.click();
});

importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);

      if (!Array.isArray(data)) {
        alert("Invalid file format: expected an array");
        return;
      }

      inventory = data;
      hasUnsavedChanges = false;
      renderInventory();
    } catch {
      alert("Failed to parse JSON file");
    }
  };

  reader.readAsText(file);
});

// --------------------
// Export JSON
// --------------------
exportBtn.addEventListener("click", () => {
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
  hasUnsavedChanges = false;
});

// --------------------
// Warn on Exit
// --------------------
window.addEventListener("beforeunload", (e) => {
  if (!hasUnsavedChanges) return;
  e.preventDefault();
  e.returnValue = "";
});
