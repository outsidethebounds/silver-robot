import React from "react";
import ReactDOM from "react-dom/client";

function App() {
  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Manage Inventory</h1>
      <p>If you can see this, React is working.</p>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
