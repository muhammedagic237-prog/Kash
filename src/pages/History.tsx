import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Search, Download } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import { storage } from "../services/storage";

export default function History() {
  const navigate = useNavigate();
  const { expenses, categories, currency, deleteExpense } = useExpenses();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        !search ||
        e.note.toLowerCase().includes(search.toLowerCase()) ||
        categories
          .find((c) => c.id === e.category)
          ?.name.toLowerCase()
          .includes(search.toLowerCase());
      const matchCat = filterCat === "all" || e.category === filterCat;
      return matchSearch && matchCat;
    });
  }, [expenses, search, filterCat, categories]);

  // Group by date
  const grouped = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const e of filtered) {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

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

  return (
    <div className="page page-with-nav">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <h1>History</h1>
        <button className="icon-btn" onClick={handleExport} title="Export CSV">
          <Download size={20} />
        </button>
      </header>

      {/* Search */}
      <div className="search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="filter-chips">
        <button
          className={`chip ${filterCat === "all" ? "active" : ""}`}
          onClick={() => setFilterCat("all")}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`chip ${filterCat === cat.id ? "active" : ""}`}
            onClick={() => setFilterCat(cat.id)}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Expense List */}
      {grouped.length === 0 ? (
        <div className="empty-state">
          <p>{search || filterCat !== "all" ? "No matching expenses." : "No expenses yet."}</p>
          <Link to="/add" className="btn btn-primary">
            Add Expense
          </Link>
        </div>
      ) : (
        <div className="grouped-list">
          {grouped.map(([date, items]) => {
            const dayTotal = items.reduce((s, e) => s + e.amount, 0);
            return (
              <div key={date} className="date-group">
                <div className="date-header">
                  <span>{formatDate(date)}</span>
                  <span className="date-total">
                    -{dayTotal.toFixed(2)} {currency}
                  </span>
                </div>
                {items.map((expense) => {
                  const cat = categories.find(
                    (c) => c.id === expense.category
                  );
                  return (
                    <div key={expense.id} className="expense-row">
                      <div
                        className="expense-icon"
                        style={{
                          backgroundColor: cat?.color || "#6b7280",
                        }}
                      >
                        {cat?.icon || "📌"}
                      </div>
                      <div className="expense-info">
                        <span className="expense-category">
                          {cat?.name || "Other"}
                        </span>
                        {expense.note && (
                          <span className="expense-note">{expense.note}</span>
                        )}
                      </div>
                      <div className="expense-right">
                        <span className="expense-amount">
                          -{expense.amount.toFixed(2)}
                        </span>
                      </div>
                      <button
                        className="icon-btn danger small"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      <nav className="bottom-nav">
        <Link to="/" className="nav-item">
          <span className="nav-icon">📊</span>
          <span>Dashboard</span>
        </Link>
        <Link to="/history" className="nav-item active">
          <span className="nav-icon">📋</span>
          <span>History</span>
        </Link>
        <Link to="/budgets" className="nav-item">
          <span className="nav-icon">🎯</span>
          <span>Budgets</span>
        </Link>
        <Link to="/settings" className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split("T")[0]) return "Today";
  if (dateStr === yesterday.toISOString().split("T")[0]) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
