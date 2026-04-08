import { useEffect, useId, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ThemeSegmentedControl } from "@/components/system/ThemeSegmentedControl";
import { usePresence } from "@/hooks/usePresence";
import { tx, txOverlayPanel } from "./motion";

type AppTopBarProps = {
  onOpenNav: () => void;
  navOpen: boolean;
};

export function AppTopBar({ onOpenNav, navOpen }: AppTopBarProps) {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { mounted: menuMounted, show: menuShow } = usePresence(menuOpen);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qParam = params.get("q") ?? "";
    if (location.pathname.startsWith("/assets")) {
      setQuery(qParam);
    } else {
      setQuery("");
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const qVal = query.trim();
    const params = new URLSearchParams(location.search);
    if (qVal) params.set("q", qVal);
    else params.delete("q");
    const search = params.toString() ? `?${params.toString()}` : "";

    let pathname = "/assets/props";
    if (location.pathname.startsWith("/assets/materials")) {
      pathname = "/assets/materials";
    } else if (location.pathname.startsWith("/assets/props")) {
      pathname = "/assets/props";
    } else if (location.pathname.startsWith("/assets")) {
      pathname = "/assets/props";
    }

    navigate({ pathname, search });
    setMenuOpen(false);
  };

  const handleSignOut = () => {
    setMenuOpen(false);
    signOut();
    navigate("/sign-in", { replace: true, state: { signedOut: true } });
  };

  const displayName = user?.name ?? "Account";
  const avatarLetter = displayName.trim().charAt(0).toUpperCase() || "?";

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[35] border-b border-[var(--border-default-secondary)] bg-[var(--surface-default)]/92 pt-[env(safe-area-inset-top)] backdrop-blur-md supports-[backdrop-filter]:bg-[var(--surface-default)]/88 md:left-[272px] ${tx}`}
    >
      <div className="flex h-14 w-full items-center gap-[var(--s-200)] px-[var(--s-300)] sm:gap-[var(--s-300)] sm:px-[var(--s-400)] md:px-[var(--s-500)]">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={navOpen}
          aria-controls="app-sidebar-nav"
          onClick={onOpenNav}
          className={`flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-br200 text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] active:scale-[0.98] md:hidden ${tx}`}
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
        </button>

        <form onSubmit={submitSearch} className="relative min-w-0 flex-1" role="search">
          <label htmlFor="app-global-search" className="sr-only">
            Search props and materials
          </label>
          <span className="pointer-events-none absolute left-[var(--s-300)] top-1/2 -translate-y-1/2 text-[var(--text-default-body)]">
            <span className={`material-symbols-outlined text-[20px] ${tx}`}>search</span>
          </span>
          <input
            id="app-global-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search props, materials, IDs…"
            className={`h-10 w-full rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-page-secondary)] py-[var(--s-200)] pl-[40px] pr-[var(--s-300)] text-[14px] text-[var(--text-default-heading)] placeholder:text-[var(--text-default-placeholder)] focus:border-[var(--border-primary-default)] focus:outline-none focus:ring-2 focus:ring-[var(--surface-primary-default-subtle)] ${tx}`}
          />
        </form>

        <div className="relative shrink-0" ref={menuRef}>
          <button
            type="button"
            id={`${menuId}-trigger`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls={`${menuId}-menu`}
            title={displayName}
            onClick={() => setMenuOpen((o) => !o)}
            className={`flex items-center rounded-br200 p-[var(--s-100)] text-left hover:bg-[var(--surface-page-secondary)] active:scale-[0.98] ${tx}`}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-primary-default)] text-[15px] font-semibold text-[var(--text-on-color-body)] ring-2 ring-[var(--surface-default)]"
              aria-hidden
            >
              {avatarLetter}
            </span>
          </button>

          {menuMounted ? (
            <div
              id={`${menuId}-menu`}
              role="menu"
              aria-labelledby={`${menuId}-trigger`}
              className={`absolute right-0 top-[calc(100%+6px)] z-50 min-w-[260px] overflow-hidden rounded-br200 border border-[var(--border-default-secondary)] bg-[var(--surface-default)] py-[var(--s-100)] shadow-lg ${txOverlayPanel} ${
                menuShow ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              <div className="border-b border-[var(--border-default-secondary)] px-[var(--s-400)] pb-[var(--s-300)] pt-[var(--s-300)]">
                <p className="truncate text-[13px] font-medium text-[var(--text-default-heading)]">{displayName}</p>
                <p className="mt-[var(--s-100)] text-[11px] font-semibold uppercase tracking-wide text-[var(--text-default-body)]">
                  Appearance
                </p>
                <ThemeSegmentedControl
                  value={theme}
                  onChange={setTheme}
                  className="mt-[var(--s-200)] !max-w-none"
                />
              </div>
              <Link
                role="menuitem"
                to="/account"
                className={`flex items-center gap-[var(--s-300)] px-[var(--s-400)] py-[var(--s-300)] text-[14px] text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]">
                  manage_accounts
                </span>
                Account
              </Link>
              <Link
                role="menuitem"
                to="/api"
                className={`flex items-center gap-[var(--s-300)] px-[var(--s-400)] py-[var(--s-300)] text-[14px] text-[var(--text-default-heading)] hover:bg-[var(--surface-page-secondary)] ${tx}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-[20px] text-[var(--text-default-body)]">code</span>
                API reference
              </Link>
              <div className="my-[var(--s-100)] h-px bg-[var(--border-default-secondary)]" />
              <button
                type="button"
                role="menuitem"
                className={`flex w-full items-center gap-[var(--s-300)] px-[var(--s-400)] py-[var(--s-300)] text-left text-[14px] text-[var(--text-default-body)] hover:bg-[var(--surface-page-secondary)] hover:text-[var(--text-error-default)] ${tx}`}
                onClick={handleSignOut}
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
