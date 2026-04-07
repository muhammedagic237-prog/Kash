import { Link, useLocation } from "react-router-dom";
import { BarChart3, ClipboardList, Target, Settings } from "lucide-react";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/history", label: "History", icon: ClipboardList },
  { path: "/budgets", label: "Budgets", icon: Target },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
        <Link
          key={path}
          to={path}
          className={`nav-item ${pathname === path ? "active" : ""}`}
        >
          <Icon size={20} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
