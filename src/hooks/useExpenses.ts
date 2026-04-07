import { useState, useCallback, useMemo } from "react";
import type { Expense, Category, Budget } from "../types";
import { storage } from "../services/storage";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    storage.getExpenses()
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    storage.getCategories()
  );
  const [budgets, setBudgets] = useState<Budget[]>(() => storage.getBudgets());
  const [currency, setCurrencyState] = useState(() => storage.getCurrency());

  const refresh = useCallback(() => {
    setExpenses(storage.getExpenses());
    setCategories(storage.getCategories());
    setBudgets(storage.getBudgets());
    setCurrencyState(storage.getCurrency());
  }, []);

  const addExpense = useCallback(
    (data: { amount: number; category: string; note: string; date: string }) => {
      const expense: Expense = {
        id: crypto.randomUUID(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      storage.addExpense(expense);
      refresh();
    },
    [refresh]
  );

  const updateExpense = useCallback(
    (updated: Expense) => {
      storage.updateExpense(updated);
      refresh();
    },
    [refresh]
  );

  const deleteExpense = useCallback(
    (id: string) => {
      storage.deleteExpense(id);
      refresh();
    },
    [refresh]
  );

  const setCurrency = useCallback(
    (c: string) => {
      storage.setCurrency(c);
      refresh();
    },
    [refresh]
  );

  const saveBudgets = useCallback(
    (b: Budget[]) => {
      storage.saveBudgets(b);
      refresh();
    },
    [refresh]
  );

  const getMonthExpenses = useCallback(
    (year: number, month: number) => {
      const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
      return expenses.filter((e) => e.date.startsWith(prefix));
    },
    [expenses]
  );

  const getCategoryTotals = useCallback(
    (monthExpenses: Expense[]) => {
      const totals: Record<string, number> = {};
      for (const e of monthExpenses) {
        totals[e.category] = (totals[e.category] || 0) + e.amount;
      }
      return categories
        .map((cat) => ({
          ...cat,
          total: totals[cat.id] || 0,
        }))
        .filter((c) => c.total > 0)
        .sort((a, b) => b.total - a.total);
    },
    [categories]
  );

  const getDailyTotals = useCallback((monthExpenses: Expense[]) => {
    const totals: Record<string, number> = {};
    for (const e of monthExpenses) {
      const day = e.date.split("-")[2];
      totals[day] = (totals[day] || 0) + e.amount;
    }
    return Object.entries(totals)
      .map(([day, total]) => ({ day: parseInt(day), total }))
      .sort((a, b) => a.day - b.day);
  }, []);

  const monthTotal = useMemo(() => {
    const now = new Date();
    const monthExpenses = getMonthExpenses(now.getFullYear(), now.getMonth());
    return monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [getMonthExpenses]);

  return {
    expenses,
    categories,
    budgets,
    currency,
    monthTotal,
    addExpense,
    updateExpense,
    deleteExpense,
    setCurrency,
    saveBudgets,
    getMonthExpenses,
    getCategoryTotals,
    getDailyTotals,
    refresh,
  };
}
