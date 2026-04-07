import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";

export default function EditExpense() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { expenses, categories, currency, updateExpense } = useExpenses();

  const expense = expenses.find((e) => e.id === id);

  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [category, setCategory] = useState(expense?.category || "other");
  const [note, setNote] = useState(expense?.note || "");
  const [date, setDate] = useState(expense?.date || "");

  if (!expense) {
    return (
      <div className="page">
        <header className="page-header">
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <h1>Not Found</h1>
          <div style={{ width: 36 }} />
        </header>
        <div className="empty-state">
          <p>Expense not found.</p>
        </div>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    updateExpense({
      ...expense!,
      amount: numAmount,
      category,
      note: note.trim(),
      date,
    });
    navigate(-1);
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>Edit Expense</h1>
        <div style={{ width: 36 }} />
      </header>

      <form onSubmit={handleSubmit} className="add-form">
        <div className="amount-input-wrapper">
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="amount-input"
            autoFocus
            step="0.01"
            min="0"
          />
          <span className="amount-currency">{currency}</span>
        </div>

        <div className="form-group">
          <label>Category</label>
          <div className="category-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${category === cat.id ? "selected" : ""}`}
                style={{
                  borderColor: category === cat.id ? cat.color : "transparent",
                  backgroundColor:
                    category === cat.id ? cat.color + "15" : undefined,
                }}
                onClick={() => setCategory(cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (optional)</label>
          <input
            id="note"
            type="text"
            placeholder="e.g. Coffee with friends"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
