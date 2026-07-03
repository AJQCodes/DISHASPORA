import { useQuery } from "@tanstack/react-query";
import { getAnalytics } from "../api/admin";
import OrdersTable from "../components/OrdersTable";
import { ErrorNote, Loading } from "../components/ui";

/** Orders view backed by analytics.recentOrders (no dedicated admin orders endpoint). */
export default function Orders() {
  const { data, isLoading, error } = useQuery({ queryKey: ["analytics"], queryFn: getAnalytics });

  if (isLoading) return <Loading />;
  if (error) return <ErrorNote error={error} />;

  return (
    <div className="card pad">
      <h2 className="card-title">
        Recent orders <span className="see-all">latest platform activity</span>
      </h2>
      <OrdersTable orders={data?.recentOrders ?? []} />
    </div>
  );
}
