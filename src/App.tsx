import { useState, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import History from "./pages/History";
import Budgets from "./pages/Budgets";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <SplashScreen onDone={handleSplashDone} />;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddExpense />} />
          <Route path="/edit/:id" element={<EditExpense />} />
          <Route path="/history" element={<History />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
