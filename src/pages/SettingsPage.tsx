import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Trash2 } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { storage } from "../services/storage";

const CURRENCIES = [
  "BAM", "EUR", "USD", "GBP", "CHF", "CAD", "AUD",
  "JPY", "CNY", "RSD", "HRK", "TRY",
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { currency, setCurrency, refresh } = useExpenses();
  const [showConfirm, setShowConfirm] = useState(false);

  function handleExport() {
    const csv = storage.exportCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kash-expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleClearData() {
    localStorage.clear();
    refresh();
    setShowConfirm(false);
    navigate("/");
  }

  return (
    <div className="page page-with-nav">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <h1>Settings</h1>
        <div style={{ width: 36 }} />
      </header>

      <div className="settings-content">
        <section className="settings-section">
          <h2>Currency</h2>
          <div className="currency-grid">
            {CURRENCIES.map((c) => (
              <button
                key={c}
                className={`chip ${currency === c ? "active" : ""}`}
                onClick={() => setCurrency(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section className="settings-section">
          <h2>Data</h2>
          <button className="btn btn-secondary btn-full" onClick={handleExport}>
            <Download size={16} /> Export to CSV
          </button>

          {!showConfirm ? (
            <button
              className="btn btn-danger-outline btn-full"
              onClick={() => setShowConfirm(true)}
              style={{ marginTop: "0.5rem" }}
            >
              <Trash2 size={16} /> Clear All Data
            </button>
          ) : (
            <div className="confirm-box">
              <p>Are you sure? This cannot be undone.</p>
              <div className="confirm-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleClearData}>
                  Yes, Delete Everything
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="settings-section">
          <h2>About</h2>
          <div className="about-info">
            <div>
              <span>App</span>
              <span>Kash</span>
            </div>
            <div>
              <span>Version</span>
              <span>1.0.0</span>
            </div>
            <div>
              <span>Data</span>
              <span>Stored locally on device</span>
            </div>
          </div>
        </section>
      </div>

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/history" className="nav-item">
          <span className="nav-icon">📋</span>
          <span>History</span>
        </Link>
        <Link to="/budgets" className="nav-item">
          <span className="nav-icon">🎯</span>
          <span>Budgets</span>
        </Link>
        <Link to="/settings" className="nav-item active">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
