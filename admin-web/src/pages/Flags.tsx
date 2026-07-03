import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getFlags, resolveFlag } from "../api/admin";
import type { FlagType } from "../api/types";
import { EmptyState, ErrorNote, Loading } from "../components/ui";
import { formatDateTime } from "../format";

const TYPE_CLASS: Record<FlagType, string> = {
  DUPLICATE_RECIPE: "blue",
  COUNTRY_MISMATCH: "cyan",
  CATEGORY_SUSPECT: "pending",
  INAPPROPRIATE: "danger",
  REPEATED_SUBMISSION: "gray",
};

export default function Flags() {
  const [showResolved, setShowResolved] = useState(false);
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["flags", showResolved],
    queryFn: () => getFlags(showResolved),
  });

  const resolveMut = useMutation({
    mutationFn: (id: number) => resolveFlag(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["flags"] }),
  });

  return (
    <>
      <div className="row between">
        <div className="segmented">
          <button
            type="button"
            className={!showResolved ? "active" : ""}
            onClick={() => setShowResolved(false)}
          >
            Unresolved
          </button>
          <button
            type="button"
            className={showResolved ? "active" : ""}
            onClick={() => setShowResolved(true)}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="card pad">
        {resolveMut.error && (
          <div style={{ marginBottom: 12 }}>
            <ErrorNote error={resolveMut.error} />
          </div>
        )}
        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorNote error={error} />
        ) : (data ?? []).length === 0 ? (
          <EmptyState
            message={
              showResolved ? "No resolved flags yet." : "All clear — no unresolved flags."
            }
          />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Target</th>
                  <th>Detail</th>
                  <th>Created</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((f) => (
                  <tr key={f.id}>
                    <td>
                      <span className={`pill ${TYPE_CLASS[f.type] ?? "gray"}`}>
                        {f.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td>
                      <div className="cell-title">{f.targetTitle}</div>
                      <div className="cell-sub">
                        {f.targetType} #{f.targetId}
                      </div>
                    </td>
                    <td style={{ maxWidth: 420 }}>{f.detail}</td>
                    <td>{formatDateTime(f.createdAt)}</td>
                    <td style={{ textAlign: "right" }}>
                      {f.resolved ? (
                        <span className="pill approved">RESOLVED</span>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary sm"
                          disabled={resolveMut.isPending}
                          onClick={() => resolveMut.mutate(f.id)}
                        >
                          {resolveMut.isPending && resolveMut.variables === f.id ? (
                            <span className="spin" />
                          ) : (
                            "Resolve"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
