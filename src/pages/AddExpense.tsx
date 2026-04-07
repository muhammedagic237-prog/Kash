import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useExpenses } from "../hooks/useExpenses";

export default function AddExpense() {
  const navigate = useNavigate();
  const { categories, currency, addExpense } = useExpenses();

  const today = new Date().toISOString().split("T")[0];

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]?.id || "other");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;

    addExpense({
      amount: numAmount,
      category,
      note: note.trim(),
      date,
    });
    navigate(-1);
  }

  function handleQuickAmount(value: number) {
    setAmount(value.toString());
  }

  return (
    <div className="page">
      <header className="page-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>Add Expense</h1>
        <div style={{ width: 36 }} />
      </header>

      <form onSubmit={handleSubmit} className="add-form">
        {/* Amount */}
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

        {/* Quick amounts */}
        <div className="quick-amounts">
          {[1, 2, 5, 10, 20, 50].map((val) => (
            <button
              key={val}
              type="button"
              className="quick-btn"
              onClick={() => handleQuickAmount(val)}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>
          <div className="category-grid">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-btn ${category === cat.id ? "selected" : ""}`}
                style={{
                  borderColor:
                    category === cat.id ? cat.color : "transparent",
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

        {/* Note */}
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

        {/* Date */}
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-lg btn-full"
          disabled={!amount || parseFloat(amount) <= 0}
        >
          Add Expense
        </button>
      </form>
    </div>
  );
}
