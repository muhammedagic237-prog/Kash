import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useExpenses } from "../hooks/useExpenses";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function Dashboard() {
  const {
    categories,
    currency,
    getMonthExpenses,
    getCategoryTotals,
    getDailyTotals,
    budgets,
  } = useExpenses();

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const monthExpenses = useMemo(
    () => getMonthExpenses(year, month),
    [getMonthExpenses, year, month]
  );

  const total = useMemo(
    () => monthExpenses.reduce((s, e) => s + e.amount, 0),
    [monthExpenses]
  );

  const categoryTotals = useMemo(
    () => getCategoryTotals(monthExpenses),
    [getCategoryTotals, monthExpenses]
  );

  const dailyTotals = useMemo(
    () => getDailyTotals(monthExpenses),
    [getDailyTotals, monthExpenses]
  );

  const totalBudget = useMemo(() => {
    return budgets.reduce((s, b) => s + b.limit, 0);
  }, [budgets]);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else {
      setMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else {
      setMonth((m) => m + 1);
    }
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Kash</h1>
        <Link to="/settings" className="icon-btn" title="Settings">
          <Settings size={20} />
        </Link>
      </header>

      {/* Month Selector */}
      <div className="month-selector">
        <button className="icon-btn" onClick={prevMonth}>
          <ChevronLeft size={20} />
        </button>
        <span className="month-label">
          {MONTHS[month]} {year}
        </span>
        <button className="icon-btn" onClick={nextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Total Spent */}
      <div className="total-card">
        <span className="total-label">Total Spent</span>
        <span className="total-amount">
          {total.toFixed(2)} {currency}
        </span>
        {totalBudget > 0 && (
          <div className="budget-indicator">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min((total / totalBudget) * 100, 100)}%`,
                  backgroundColor:
                    total > totalBudget
                      ? "var(--red)"
                      : total > totalBudget * 0.8
                        ? "var(--orange)"
                        : "var(--green)",
                }}
              />
            </div>
            <span className="budget-text">
              {totalBudget > 0
                ? `${((total / totalBudget) * 100).toFixed(0)}% of ${totalBudget.toFixed(2)} ${currency} budget`
                : "No budget set"}
            </span>
          </div>
        )}
      </div>

      {monthExpenses.length === 0 ? (
        <div className="empty-state">
          <p>No expenses this month.</p>
          <Link to="/add" className="btn btn-primary">
            <Plus size={16} /> Add Expense
          </Link>
        </div>
      ) : (
        <>
          {/* Pie Chart */}
          {categoryTotals.length > 0 && (
            <div className="chart-card">
              <h2>By Category</h2>
              <div className="pie-wrapper">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                    >
                      {categoryTotals.map((cat) => (
                        <Cell key={cat.id} fill={cat.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) =>
                        `${Number(value).toFixed(2)} ${currency}`
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="category-legend">
                {categoryTotals.map((cat) => (
                  <div key={cat.id} className="legend-item">
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="legend-name">
                      {cat.icon} {cat.name}
                    </span>
                    <span className="legend-value">
                      {cat.total.toFixed(2)} {currency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bar Chart */}
          {dailyTotals.length > 0 && (
            <div className="chart-card">
              <h2>Daily Spending</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={dailyTotals}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} width={40} />
                  <Tooltip
                    formatter={(value) =>
                      `${Number(value).toFixed(2)} ${currency}`
                    }
                  />
                  <Bar dataKey="total" fill="var(--blue)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Recent Expenses */}
          <div className="section">
            <div className="section-header">
              <h2>Recent</h2>
              <Link to="/history" className="link">
                See All
              </Link>
            </div>
            <div className="expense-list">
              {monthExpenses.slice(0, 5).map((expense) => {
                const cat = categories.find((c) => c.id === expense.category);
                return (
                  <div key={expense.id} className="expense-row">
                    <div
                      className="expense-icon"
                      style={{ backgroundColor: cat?.color || "#6b7280" }}
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
                      <span className="expense-date">{expense.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      <Link to="/add" className="fab">
        <Plus size={28} />
      </Link>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <Link to="/" className="nav-item active">
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
        <Link to="/settings" className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}
