export interface Expense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Budget {
  categoryId: string;
  limit: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "food", name: "Food", icon: "🍔", color: "#ef4444" },
  { id: "transport", name: "Transport", icon: "🚗", color: "#3b82f6" },
  { id: "shopping", name: "Shopping", icon: "🛍️", color: "#8b5cf6" },
  { id: "bills", name: "Bills", icon: "📄", color: "#f59e0b" },
  { id: "entertainment", name: "Entertainment", icon: "🎬", color: "#ec4899" },
  { id: "health", name: "Health", icon: "💊", color: "#22c55e" },
  { id: "education", name: "Education", icon: "📚", color: "#06b6d4" },
  { id: "groceries", name: "Groceries", icon: "🛒", color: "#10b981" },
  { id: "rent", name: "Rent", icon: "🏠", color: "#6366f1" },
  { id: "other", name: "Other", icon: "📌", color: "#6b7280" },
];
