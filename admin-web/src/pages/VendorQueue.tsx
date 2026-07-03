import { approveVendor, getVendorQueue, rejectVendor } from "../api/admin";
import type { Vendor } from "../api/types";
import QueuePage, { FlagWarnings } from "../components/QueuePage";
import { CountryTag, StatusPill } from "../components/ui";
import { imgUrl } from "../config";
import { formatDate } from "../format";

export default function VendorQueue() {
  return (
    <QueuePage<Vendor>
      queryKey="queue-vendors"
      fetch={getVendorQueue}
      approve={approveVendor}
      reject={rejectVendor}
      targetType="VENDOR"
      emptyMessage="No vendor applications waiting for review."
      itemLabel={(v) => v.name}
      headers={["Vendor", "Type", "Country", "Submitted", "Status"]}
      renderCells={(v, flags) => (
        <>
          <td>
            <div className="cell-main">
              {v.logoUrl ? (
                <img className="thumb" src={imgUrl(v.logoUrl)} alt="" />
              ) : (
                <div className="thumb" />
              )}
              <div>
                <div className="cell-title">{v.name}</div>
                <div className="cell-sub">{v.specialty}</div>
                {flags.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <FlagWarnings flags={flags} />
                  </div>
                )}
              </div>
            </div>
          </td>
          <td>
            <span className="pill cyan">{v.type}</span>
          </td>
          <td>
            <CountryTag country={v.country} />
          </td>
          <td>{formatDate(v.createdAt)}</td>
          <td>
            <StatusPill status={v.status} />
          </td>
        </>
      )}
      renderDetail={(v, flags, actions) => (
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
            {v.coverUrl || v.logoUrl ? (
              <img className="detail-img" src={imgUrl(v.coverUrl ?? v.logoUrl)} alt={v.name} />
            ) : (
              <div className="detail-img" />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="meta-chips">
                <span className="meta-chip">
                  Type <b>{v.type}</b>
                </span>
                <span className="meta-chip">
                  Specialty <b>{v.specialty}</b>
                </span>
                <span className="meta-chip">
                  Location <b>{v.location}</b>
                </span>
                <span className="meta-chip">
                  Phone <b>{v.phone}</b>
                </span>
              </div>
              <div className="detail-section">
                <h4>Bio</h4>
                <p>{v.bio}</p>
              </div>
            </div>
          </div>
          {actions}
        </div>
      )}
    />
  );
}
