import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Flag as FlagIcon } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";
import { getFlags } from "../api/admin";
import type { Flag } from "../api/types";
import { EmptyState, ErrorNote, Loading, Modal } from "./ui";

export function useUnresolvedFlags() {
  const { data } = useQuery({
    queryKey: ["flags", false],
    queryFn: () => getFlags(false),
  });
  return data ?? [];
}

export function flagsFor(
  flags: Flag[],
  targetType: Flag["targetType"],
  targetId: number,
): Flag[] {
  return flags.filter((f) => f.targetType === targetType && f.targetId === targetId);
}

export function FlagWarnings({ flags }: { flags: Flag[] }) {
  if (flags.length === 0) return null;
  return (
    <span style={{ display: "inline-flex", flexWrap: "wrap", gap: 6 }}>
      {flags.map((f) => (
        <span className="flag-warning" key={f.id} title={f.detail}>
          <FlagIcon size={12} strokeWidth={2.4} /> {f.type.replace(/_/g, " ")}
        </span>
      ))}
    </span>
  );
}

interface QueuePageProps<T extends { id: number }> {
  queryKey: string;
  fetch: () => Promise<T[]>;
  approve: (id: number) => Promise<void>;
  reject: (id: number, feedback: string) => Promise<void>;
  emptyMessage: string;
  headers: string[];
  renderCells: (item: T, flags: Flag[]) => ReactNode;
  renderDetail: (item: T, flags: Flag[], actions: ReactNode) => ReactNode;
  targetType: Flag["targetType"];
  itemLabel: (item: T) => string;
}

export default function QueuePage<T extends { id: number }>({
  queryKey,
  fetch,
  approve,
  reject,
  emptyMessage,
  headers,
  renderCells,
  renderDetail,
  targetType,
  itemLabel,
}: QueuePageProps<T>) {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: [queryKey], queryFn: fetch });
  const allFlags = useUnresolvedFlags();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [rejecting, setRejecting] = useState<T | null>(null);
  const [feedback, setFeedback] = useState("");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: [queryKey] });
    qc.invalidateQueries({ queryKey: ["analytics"] });
    qc.invalidateQueries({ queryKey: ["flags"] });
  };

  const approveMut = useMutation({
    mutationFn: (id: number) => approve(id),
    onSuccess: invalidate,
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, fb }: { id: number; fb: string }) => reject(id, fb),
    onSuccess: () => {
      setRejecting(null);
      setFeedback("");
      invalidate();
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorNote error={error} />;
  const items = data ?? [];

  return (
    <div className="card pad">
      {(approveMut.error || rejectMut.error) && (
        <div style={{ marginBottom: 12 }}>
          <ErrorNote error={approveMut.error ?? rejectMut.error} />
        </div>
      )}
      {items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const itemFlags = flagsFor(allFlags, targetType, item.id);
                const expanded = expandedId === item.id;
                const actions = (
                  <div className="detail-actions">
                    <button
                      type="button"
                      className="btn btn-danger-outline"
                      onClick={() => {
                        setRejecting(item);
                        setFeedback("");
                      }}
                      disabled={approveMut.isPending}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => approveMut.mutate(item.id)}
                      disabled={approveMut.isPending}
                    >
                      {approveMut.isPending && approveMut.variables === item.id ? (
                        <span className="spin" />
                      ) : (
                        "Approve"
                      )}
                    </button>
                  </div>
                );
                return (
                  <Fragment key={item.id}>
                    <tr
                      className="clickable"
                      onClick={() => setExpandedId(expanded ? null : item.id)}
                    >
                      {renderCells(item, itemFlags)}
                      <td style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                        <div className="row" style={{ justifyContent: "flex-end", gap: 8 }}>
                          <button
                            type="button"
                            className="btn btn-danger-outline sm"
                            onClick={() => {
                              setRejecting(item);
                              setFeedback("");
                            }}
                          >
                            Reject
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary sm"
                            onClick={() => approveMut.mutate(item.id)}
                            disabled={approveMut.isPending}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost sm"
                            onClick={() => setExpandedId(expanded ? null : item.id)}
                          >
                            {expanded ? "Hide" : "Review"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={headers.length + 1} style={{ padding: "6px 0 16px" }}>
                          {renderDetail(item, itemFlags, actions)}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {rejecting && (
        <Modal
          title={`Reject "${itemLabel(rejecting)}"`}
          subtitle="Feedback is required and will be sent to the vendor."
          onClose={() => setRejecting(null)}
        >
          <textarea
            className="textarea-round"
            placeholder="Explain why this submission is being rejected…"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            autoFocus
          />
          {rejectMut.error && <ErrorNote error={rejectMut.error} />}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setRejecting(null)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              disabled={feedback.trim().length === 0 || rejectMut.isPending}
              onClick={() => rejectMut.mutate({ id: rejecting.id, fb: feedback.trim() })}
            >
              {rejectMut.isPending ? <span className="spin" /> : "Reject submission"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
