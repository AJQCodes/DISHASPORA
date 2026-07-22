import {
  ChefHat,
  Flag,
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingBag,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth";
import Logo from "./Logo";
import { Avatar } from "./ui";

const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/vendors", label: "Vendor approvals", icon: Store },
  { to: "/recipes", label: "Recipe approvals", icon: ChefHat },
  { to: "/listings", label: "Listing approvals", icon: ShoppingBag },
  { to: "/flags", label: "Flags", icon: Flag },
  { to: "/users", label: "Users", icon: Users },
  { to: "/orders", label: "Orders", icon: Package },
];

const TITLES: Record<string, [string, string]> = {
  "/": ["Dashboard", "overview"],
  "/vendors": ["Vendor", "approvals"],
  "/recipes": ["Recipe", "approvals"],
  "/listings": ["Listing", "approvals"],
  "/flags": ["Content", "flags"],
  "/users": ["Manage", "users"],
  "/orders": ["Recent", "orders"],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const [bold, soft] = TITLES[pathname] ?? ["Dishaspora", "admin"];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo size={40} />
          <div className="sidebar-brand-name">
            Dishaspora
            <span>Admin</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              >
                <span className="nav-icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
                {item.label}
              </NavLink>
            );
          })}
          <button type="button" className="nav-item logout" onClick={logout}>
            <span className="nav-icon">
              <LogOut size={18} strokeWidth={2} />
            </span>
            Logout
          </button>
        </nav>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <h1>
            {bold} <span className="muted-word">{soft}</span>
          </h1>
          <div className="topbar-user">
            <div className="who">
              <div className="name">{user?.name ?? "Admin"}</div>
              <div className="role">Administrator</div>
            </div>
            <Avatar src={user?.avatarUrl} name={user?.name ?? "Admin"} />
          </div>
        </header>
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
