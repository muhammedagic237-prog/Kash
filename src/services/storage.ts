import type { Expense, Category, Budget } from "../types";
import { DEFAULT_CATEGORIES } from "../types";

const KEYS = {
  expenses: "kash_expenses",
  categories: "kash_categories",
  budgets: "kash_budgets",
  currency: "kash_currency",
};

export const storage = {
  // Expenses
  getExpenses(): Expense[] {
    const data = localStorage.getItem(KEYS.expenses);
    return data ? JSON.parse(data) : [];
  },

  saveExpenses(expenses: Expense[]) {
    localStorage.setItem(KEYS.expenses, JSON.stringify(expenses));
  },

  addExpense(expense: Expense) {
    const expenses = this.getExpenses();
    expenses.unshift(expense);
    this.saveExpenses(expenses);
  },

  updateExpense(updated: Expense) {
    const expenses = this.getExpenses().map((e) =>
      e.id === updated.id ? updated : e
    );
    this.saveExpenses(expenses);
  },

  deleteExpense(id: string) {
    const expenses = this.getExpenses().filter((e) => e.id !== id);
    this.saveExpenses(expenses);
  },

  // Categories
  getCategories(): Category[] {
    const data = localStorage.getItem(KEYS.categories);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  },

  saveCategories(categories: Category[]) {
    localStorage.setItem(KEYS.categories, JSON.stringify(categories));
  },

  // Budgets
  getBudgets(): Budget[] {
    const data = localStorage.getItem(KEYS.budgets);
    return data ? JSON.parse(data) : [];
  },

  saveBudgets(budgets: Budget[]) {
    localStorage.setItem(KEYS.budgets, JSON.stringify(budgets));
  },

  // Currency
  getCurrency(): string {
    return localStorage.getItem(KEYS.currency) || "BAM";
  },

  setCurrency(currency: string) {
    localStorage.setItem(KEYS.currency, currency);
  },

  // Export
  exportCSV(): string {
    const expenses = this.getExpenses();
    const categories = this.getCategories();
    const header = "Date,Category,Amount,Note\n";
    const rows = expenses
      .map((e) => {
        const cat = categories.find((c) => c.id === e.category);
        return `${e.date},${cat?.name || e.category},${e.amount},"${e.note.replace(/"/g, '""')}"`;
      })
      .join("\n");
    return header + rows;
  },
};
