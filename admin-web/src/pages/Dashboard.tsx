import { useQuery } from "@tanstack/react-query";
import {
  ChefHat,
  Package,
  ShoppingBag,
  Star,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getAnalytics } from "../api/admin";
import FlagBadge from "../components/FlagBadge";
import OrdersTable from "../components/OrdersTable";
import { ErrorNote, Loading } from "../components/ui";
import { countryName, formatMoney } from "../format";

const STAT_META: {
  key: "users" | "vendors" | "recipes" | "listings" | "orders";
  label: string;
  icon: LucideIcon;
  tone: string;
}[] = [
  { key: "users", label: "Users", icon: Users, tone: "cyan" },
  { key: "vendors", label: "Vendors", icon: Store, tone: "orange" },
  { key: "recipes", label: "Recipes", icon: ChefHat, tone: "cyan" },
  { key: "listings", label: "Listings", icon: ShoppingBag, tone: "blue" },
  { key: "orders", label: "Orders", icon: Package, tone: "orange" },
];

function barLabel(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });

  if (isLoading) return <Loading />;
  if (error) return <ErrorNote error={error} />;
  if (!data) return null;

  const maxPerDay = Math.max(1, ...data.ordersPerDay.map((d) => d.count));
  const revenue = Object.entries(data.revenueMinorByCurrency ?? {});
  const countries = Object.entries(data.byCountry ?? {});

  return (
    <>
      <div className="stat-grid">
        {STAT_META.map((s) => {
          const Icon = s.icon;
          return (
            <div className="stat-tile" key={s.key}>
              <div className={`stat-icon ${s.tone}`}>
                <Icon size={18} strokeWidth={2.2} />
              </div>
              <div className="stat-value">{data[s.key].toLocaleString()}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          );
        })}
        <div className="stat-tile">
          <div className="stat-icon star">
            <Star size={18} strokeWidth={2.2} fill="currentColor" />
          </div>
          <div className="stat-value">{data.premiumUsers.toLocaleString()}</div>
          <div className="stat-label">Premium users</div>
        </div>
      </div>

      <div className="grid-2">
        {revenue.length === 0 && (
          <div className="revenue-card ghs">
            <div className="rev-label">Revenue</div>
            <div className="rev-value">—</div>
          </div>
        )}
        {revenue.map(([currency, minor]) => (
          <div key={currency} className={`revenue-card ${currency === "NGN" ? "ngn" : "ghs"}`}>
            <div className="rev-label">Revenue · {currency}</div>
            <div className="rev-value">{formatMoney(minor, currency)}</div>
          </div>
        ))}
      </div>

      <div className="dash-row">
        <div className="card pad">
          <h2 className="card-title">Orders per day</h2>
          {data.ordersPerDay.length === 0 ? (
            <p style={{ color: "var(--ink-faint)" }}>No order activity yet.</p>
          ) : (
            <div className="bar-chart">
              {data.ordersPerDay.map((d) => (
                <div className="bar-col" key={d.date} title={`${d.date}: ${d.count} orders`}>
                  <span className="bar-count">{d.count}</span>
                  <div
                    className="bar"
                    style={{ height: `${Math.max(3, (d.count / maxPerDay) * 100)}%` }}
                  />
                  <span className="bar-date">{barLabel(d.date)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card pad">
          <h2 className="card-title">Country split</h2>
          <div className="grid-2">
            {countries.map(([code, stats]) => (
              <div className="mini-country-card" key={code}>
                <div className="flag">
                  <FlagBadge country={code} size={26} />
                </div>
                <div className="cname">
                  {countryName(code)} · {code}
                </div>
                <div className="cstats">
                  {stats.users.toLocaleString()} users
                  <br />
                  {stats.orders.toLocaleString()} orders
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card pad">
        <h2 className="card-title">Recent orders</h2>
        <OrdersTable orders={data.recentOrders} />
      </div>
    </>
  );
}
