import { Clapperboard, Flame, Headphones, Timer } from "lucide-react";
import { approveRecipe, getRecipeQueue, rejectRecipe } from "../api/admin";
import type { Recipe } from "../api/types";
import QueuePage, { FlagWarnings } from "../components/QueuePage";
import { CountryTag, StatusPill } from "../components/ui";
import { imgUrl } from "../config";
import { formatDate } from "../format";

export default function RecipeQueue() {
  return (
    <QueuePage<Recipe>
      queryKey="queue-recipes"
      fetch={getRecipeQueue}
      approve={approveRecipe}
      reject={rejectRecipe}
      targetType="RECIPE"
      emptyMessage="No recipes waiting for review."
      itemLabel={(r) => r.title}
      headers={["Recipe", "Vendor", "Country", "Submitted", "Status"]}
      renderCells={(r, flags) => (
        <>
          <td>
            <div className="cell-main">
              {r.imageUrl ? (
                <img className="thumb" src={imgUrl(r.imageUrl)} alt="" />
              ) : (
                <div className="thumb" />
              )}
              <div>
                <div className="cell-title">{r.title}</div>
                <div className="cell-sub">
                  {r.category} · {r.cuisine} · {r.mealType}
                </div>
                {flags.length > 0 && (
                  <div style={{ marginTop: 4 }}>
                    <FlagWarnings flags={flags} />
                  </div>
                )}
              </div>
            </div>
          </td>
          <td>{r.vendorName}</td>
          <td>
            <CountryTag country={r.countryOfOrigin} />
          </td>
          <td>{formatDate(r.createdAt)}</td>
          <td>
            <StatusPill status={r.status} />
          </td>
        </>
      )}
      renderDetail={(r, flags, actions) => (
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
            {r.imageUrl ? (
              <img className="detail-img" src={imgUrl(r.imageUrl)} alt={r.title} />
            ) : (
              <div className="detail-img" />
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="meta-chips">
                <span className="meta-chip">
                  Category <b>{r.category}</b>
                </span>
                <span className="meta-chip">
                  Cuisine <b>{r.cuisine}</b>
                </span>
                <span className="meta-chip">
                  Meal <b>{r.mealType}</b>
                </span>
                <span className="meta-chip">
                  <Flame size={13} className="chip-icon accent" /> <b>{r.calories} kcal</b>
                </span>
                <span className="meta-chip">
                  Serves <b>{r.servings}</b>
                </span>
                <span className="meta-chip">
                  <Timer size={13} className="chip-icon" />{" "}
                  <b>{r.prepMinutes + r.cookMinutes} min</b>
                </span>
                {r.hasVideo && (
                  <span className="meta-chip">
                    <Clapperboard size={13} className="chip-icon" /> Video
                  </span>
                )}
                {r.hasAudio && (
                  <span className="meta-chip">
                    <Headphones size={13} className="chip-icon" /> Audio
                  </span>
                )}
              </div>
              <div className="detail-section">
                <h4>Description</h4>
                <p>{r.description}</p>
              </div>
              <div className="detail-section">
                <h4>Meal frequency</h4>
                <p>
                  <b>{r.mealFrequency}</b> — {r.mealFrequencyReason}
                </p>
              </div>
            </div>
          </div>
          <div className="detail-section">
            <h4>Ingredients ({r.ingredients.length})</h4>
            <ul className="ingredient-list">
              {r.ingredients.map((ing, i) => (
                <li key={i}>
                  <b>
                    {ing.quantity} {ing.unit}
                  </b>{" "}
                  {ing.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="detail-section">
            <h4>Steps ({r.steps.length})</h4>
            <ol className="step-list">
              {r.steps.map((s) => (
                <li key={s.stepNumber}>
                  <span className="step-num">{s.stepNumber}</span>
                  <span>{s.instruction}</span>
                  {s.durationMinutes != null && (
                    <span className="step-duration">{s.durationMinutes} min</span>
                  )}
                </li>
              ))}
            </ol>
          </div>
          {r.story && (
            <div className="detail-section">
              <h4>Food story</h4>
              <p>{r.story}</p>
            </div>
          )}
          {actions}
        </div>
      )}
    />
  );
}
