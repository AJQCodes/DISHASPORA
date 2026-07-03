import { AlertCircle, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth";
import Logo from "../components/Logo";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      if (err instanceof Error && err.message === "NOT_ADMIN") {
        setError("This console is for admins only.");
      } else {
        setError(err instanceof Error ? err.message : "Login failed");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="login-split">
      {/* Left: full-bleed food photography with ink gradient overlay */}
      <div className="login-hero">
        <img
          className={`login-hero-img${heroLoaded ? " loaded" : ""}`}
          src="/login-hero.jpg"
          alt=""
          onLoad={() => setHeroLoaded(true)}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="login-hero-brand">
          <Logo size={38} />
          <span className="login-wordmark-small">dishaspora</span>
        </div>
        <div className="login-hero-overlay">
          <p className="login-eyebrow">Admin Console</p>
          <h2 className="login-hero-headline">
            Every dish
            <br />
            tells a <span className="gradient-text">story.</span>
          </h2>
          <p className="login-hero-sub">
            Recipes, vendors, orders and moderation for Ghana and Nigeria —
            managed from one place.
          </p>
        </div>
      </div>

      {/* Right: white sign-in panel */}
      <div className="login-panel">
        <form className="login-panel-inner" onSubmit={onSubmit}>
          <Logo size={48} />
          <h1 className="login-heading">
            Welcome <span className="soft">back</span>
          </h1>
          <p className="login-subtext">Sign in to the Dishaspora admin console</p>

          {error && (
            <div className="login-error" role="alert">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <label className="field">
            <span className="field-label">Email</span>
            <div className="field-wrap">
              <Mail size={17} className="field-icon" />
              <input
                className="field-input"
                type="email"
                placeholder="you@dishaspora.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="field">
            <span className="field-label">Password</span>
            <div className="field-wrap">
              <Lock size={17} className="field-icon" />
              <input
                className="field-input has-trailing"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="field-eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </label>

          <button className="btn btn-primary btn-block login-cta" type="submit" disabled={busy}>
            {busy ? <span className="spin" /> : "Sign in"}
          </button>

          <p className="login-footer">Restricted access · Dishaspora © 2026</p>
        </form>
      </div>
    </div>
  );
}
