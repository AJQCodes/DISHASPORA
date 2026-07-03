import type { ReactNode } from "react";
import type { ApprovalStatus } from "../api/types";
import { imgUrl } from "../config";
import FlagBadge from "./FlagBadge";

export function StatusPill({ status }: { status: ApprovalStatus | string }) {
  const cls =
    status === "PENDING"
      ? "pending"
      : status === "APPROVED"
        ? "approved"
        : status === "REJECTED"
          ? "rejected"
          : "gray";
  return <span className={`pill ${cls}`}>{status}</span>;
}

export function CountryTag({ country }: { country: string }) {
  return (
    <span className="country-tag">
      <FlagBadge country={country} size={16} />
      {country}
    </span>
  );
}

export function Avatar({
  src,
  name,
  small,
}: {
  src?: string | null;
  name: string;
  small?: boolean;
}) {
  const url = imgUrl(src);
  if (url) {
    return <img className={`avatar${small ? " sm" : ""}`} src={url} alt={name} />;
  }
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return <div className={`avatar-fallback${small ? " sm" : ""}`}>{initials || "?"}</div>;
}

export function EmptyState({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <div className="empty-state">
      <img src={imgUrl("/images/empty-1.png")} alt="" />
      <p>{message}</p>
      {children}
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return <div className="loading">{label}</div>;
}

export function ErrorNote({ error }: { error: unknown }) {
  const message = error instanceof Error ? error.message : "Something went wrong";
  return <div className="form-error">{message}</div>;
}

export function Modal({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <h3>{title}</h3>
        {subtitle && <p className="modal-sub">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
