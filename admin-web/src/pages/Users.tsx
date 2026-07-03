import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { banUser, getUsers, unbanUser } from "../api/admin";
import type { User } from "../api/types";
import { Avatar, CountryTag, EmptyState, ErrorNote, Loading, Modal } from "../components/ui";

export default function Users() {
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [confirming, setConfirming] = useState<{ user: User; ban: boolean } | null>(null);
  const qc = useQueryClient();

  useEffect(() => {
    const t = setTimeout(() => setQ(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users", q],
    queryFn: () => getUsers(q),
  });

  const banMut = useMutation({
    mutationFn: ({ id, ban }: { id: number; ban: boolean }) =>
      ban ? banUser(id) : unbanUser(id),
    onSuccess: () => {
      setConfirming(null);
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const users = data ?? [];

  return (
    <>
      <div className="input-icon-wrap" style={{ maxWidth: 420 }}>
        <span className="icon">
          <Search size={16} />
        </span>
        <input
          className="input-round"
          placeholder="Search users by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card pad">
        {banMut.error && (
          <div style={{ marginBottom: 12 }}>
            <ErrorNote error={banMut.error} />
          </div>
        )}
        {isLoading ? (
          <Loading />
        ) : error ? (
          <ErrorNote error={error} />
        ) : users.length === 0 ? (
          <EmptyState message={q ? `No users match "${q}".` : "No users yet."} />
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Country</th>
                  <th>Premium</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const banned = u.banned === true;
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="cell-main">
                          <Avatar src={u.avatarUrl} name={u.name} small />
                          <div>
                            <div className="cell-title">
                              {u.name}{" "}
                              {banned && <span className="pill danger">BANNED</span>}
                            </div>
                            <div className="cell-sub">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`pill ${
                            u.role === "ADMIN" ? "cyan" : u.role === "VENDOR" ? "blue" : "gray"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <CountryTag country={u.country} />
                      </td>
                      <td>
                        {u.premium ? (
                          <span className="pill premium">
                            <Star size={12} fill="currentColor" strokeWidth={0} /> PREMIUM
                          </span>
                        ) : (
                          <span className="cell-sub">—</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        {u.role !== "ADMIN" &&
                          (banned ? (
                            <button
                              type="button"
                              className="btn btn-cyan sm"
                              onClick={() => setConfirming({ user: u, ban: false })}
                            >
                              Unban
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-danger-outline sm"
                              onClick={() => setConfirming({ user: u, ban: true })}
                            >
                              Ban
                            </button>
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {confirming && (
        <Modal
          title={confirming.ban ? "Ban user?" : "Unban user?"}
          subtitle={
            confirming.ban
              ? `${confirming.user.name} (${confirming.user.email}) will no longer be able to sign in.`
              : `${confirming.user.name} (${confirming.user.email}) will regain access.`
          }
          onClose={() => setConfirming(null)}
        >
          {banMut.error && <ErrorNote error={banMut.error} />}
          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(null)}>
              Cancel
            </button>
            <button
              type="button"
              className={`btn ${confirming.ban ? "btn-danger" : "btn-primary"}`}
              disabled={banMut.isPending}
              onClick={() => banMut.mutate({ id: confirming.user.id, ban: confirming.ban })}
            >
              {banMut.isPending ? <span className="spin" /> : confirming.ban ? "Ban user" : "Unban user"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
