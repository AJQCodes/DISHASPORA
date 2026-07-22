import { Timer } from "lucide-react";
import { approveListing, getListingQueue, rejectListing } from "../api/admin";
import type { Listing } from "../api/types";
import QueuePage, { FlagWarnings } from "../components/QueuePage";
import { CountryTag, StatusPill } from "../components/ui";
import { imgUrl } from "../config";
import { formatDate, formatMoney } from "../format";

export default function ListingQueue() {
  return (
    <QueuePage<Listing>
      queryKey="queue-listings"
      fetch={getListingQueue}
      approve={approveListing}
      reject={rejectListing}
      targetType="LISTING"
      emptyMessage="No listings waiting for review."
      itemLabel={(l) => l.title}
      headers={["Listing", "Vendor", "Price", "Country", "Submitted", "Status"]}
      renderCells={(l, flags) => (
        <>
          <td>
            <div className="cell-main">
              {l.imageUrl ? (
                <img className="thumb" src={imgUrl(l.imageUrl)} alt="" />
              ) : (
                <div className="thumb" />
              )}
              <div>
                <div className="cell-title">{l.title}</div>
                <div className="cell-sub">
                  {l.type} · {l.quantity} {l.unit}
                </div>
                {flags.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <FlagWarnings flags={flags} />
                  </div>
                )}
              </div>
            </div>
          </td>
          <td>{l.vendorName}</td>
          <td>
            <span className="money">{formatMoney(l.amountMinor, l.currency)}</span>
          </td>
          <td>
            <CountryTag country={l.country} />
          </td>
          <td>{formatDate(l.createdAt)}</td>
          <td>
            <StatusPill status={l.status} />
          </td>
        </>
      )}
      renderDetail={(l, flags, actions) => (
        <div className="detail-panel">
          {flags.length > 0 && (
            <div className="detail-section">
              <h4>Open flags</h4>
              {flags.map((f) => (
                <p key={f.id}>
                  <span className="pill danger">{f.type.replace(/_/g, " ")}</span>{" "}
                  <span style={{ marginLeft: 6 }}>{f.detail}</span>
                </p>
              ))}
            </div>
          )}
          <div className="detail-grid">
            {l.imageUrl ? (
              <img className="detail-img" src={imgUrl(l.imageUrl)} alt={l.title} />
            ) : (
              <div className="detail-img" />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="meta-chips">
                <span className="meta-chip">
                  Type <b>{l.type}</b>
                </span>
                <span className="meta-chip">
                  Price <b>{formatMoney(l.amountMinor, l.currency)}</b>
                </span>
                {l.compareAtMinor != null && (
                  <span className="meta-chip">
                    Compare at <b>{formatMoney(l.compareAtMinor, l.currency)}</b>
                  </span>
                )}
                <span className="meta-chip">
                  Stock <b>{l.stockQty}</b>
                </span>
                <span className="meta-chip">
                  Unit{" "}
                  <b>
                    {l.quantity} {l.unit}
                  </b>
                </span>
                {l.prepMinutes != null && (
                  <span className="meta-chip">
                    <Timer size={13} className="chip-icon" /> <b>{l.prepMinutes} min prep</b>
                  </span>
                )}
                {l.linkedRecipeId != null && (
                  <span className="meta-chip">
                    Linked recipe <b>#{l.linkedRecipeId}</b>
                  </span>
                )}
                <span className="meta-chip">
                  Available <b>{l.available ? "Yes" : "No"}</b>
                </span>
              </div>
              <div className="detail-section">
                <h4>Description</h4>
                <p>{l.description}</p>
              </div>
            </div>
          </div>
          {actions}
        </div>
      )}
    />
  );
}
