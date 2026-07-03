import type { Order } from "../api/types";
import { imgUrl } from "../config";
import { formatDateTime, formatMoney } from "../format";
import { EmptyState } from "./ui";

function orderPillClass(status: Order["status"]): string {
  switch (status) {
    case "COMPLETED":
    case "PAID":
      return "approved";
    case "CANCELLED":
      return "rejected";
    case "PENDING_PAYMENT":
      return "pending";
    default:
      return "blue";
  }
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <EmptyState message="No orders yet." />;
  }
  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Order</th>
            <th>Vendor</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <div className="cell-main">
                  {o.items[0]?.imageUrl ? (
                    <img className="thumb" src={imgUrl(o.items[0].imageUrl)} alt="" />
                  ) : (
                    <div className="thumb" />
                  )}
                  <div>
                    <div className="cell-title">{o.reference}</div>
                    <div className="cell-sub">{o.items[0]?.title ?? "—"}</div>
                  </div>
                </div>
              </td>
              <td>{o.vendorName}</td>
              <td>{o.items.reduce((n, it) => n + it.qty, 0)}</td>
              <td>
                <span className="money">{formatMoney(o.totalMinor, o.currency)}</span>
              </td>
              <td>
                <span className={`pill ${orderPillClass(o.status)}`}>
                  {o.status.replace("_", " ")}
                </span>
              </td>
              <td>{formatDateTime(o.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
