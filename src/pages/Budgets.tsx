import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";
import BottomNav from "../components/BottomNav";

export default function Budgets() {
  const navigate = useNavigate();
  const {
    categories,
    budgets,
    currency,
    saveBudgets,
    getMonthExpenses,
  } = useExpenses();

  const now = new Date();
  const monthExpenses = useMemo(
    () => getMonthExpenses(now.getFullYear(), now.getMonth()),
    [getMonthExpenses]
  );

  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function getCategorySpent(categoryId: string): number {
    return monthExpenses
      .filter((e) => e.category === categoryId)
      .reduce((s, e) => s + e.amount, 0);
  }

  function getBudgetLimit(categoryId: string): number {
    return budgets.find((b) => b.categoryId === categoryId)?.limit || 0;
  }

  function handleSave(categoryId: string) {
    const limit = parseFloat(editValue) || 0;
    const updated = budgets.filter((b) => b.categoryId !== categoryId);
    if (limit > 0) {
      updated.push({ categoryId, limit });
    }
    saveBudgets(updated);
    setEditing(null);
  }

  function startEdit(categoryId: string) {
    setEditing(categoryId);
    setEditValue(getBudgetLimit(categoryId).toString() || "");
  }

  return (
    <div className="page page-with-nav">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate("/")}>
          <ArrowLeft size={20} />
        </button>
        <h1>Budgets</h1>
        <div style={{ width: 36 }} />
      </header>

      <p className="page-subtitle">
        Set monthly spending limits per category.
      </p>

      <div className="budget-list">
        {categories.map((cat) => {
          const spent = getCategorySpent(cat.id);
          const limit = getBudgetLimit(cat.id);
          const percent = limit > 0 ? (spent / limit) * 100 : 0;
          const isOver = spent > limit && limit > 0;

          return (
            <div key={cat.id} className="budget-card">
              <div className="budget-header">
                <div className="budget-cat">
                  <span
                    className="expense-icon small"
                    style={{ backgroundColor: cat.color }}
                  >
                    {cat.icon}
                  </span>
                  <span className="budget-cat-name">{cat.name}</span>
                </div>

                {editing === cat.id ? (
                  <div className="budget-edit">
                    <input
                      type="number"
                      inputMode="decimal"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="0"
                      className="budget-input"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave(cat.id);
                        if (e.key === "Escape") setEditing(null);
                      }}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleSave(cat.id)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => startEdit(cat.id)}
                  >
                    {limit > 0
                      ? `${limit.toFixed(0)} ${currency}`
                      : "Set Limit"}
                  </button>
                )}
              </div>

              {limit > 0 && (
                <div className="budget-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: isOver
                          ? "var(--red)"
                          : percent > 80
                            ? "var(--orange)"
                            : "var(--green)",
                      }}
                    />
                  </div>
                  <div className="budget-amounts">
                    <span className={isOver ? "over-budget" : ""}>
                      {spent.toFixed(2)} spent
                    </span>
                    <span>
                      {(limit - spent).toFixed(2)} {currency} left
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
