import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppTopBar } from "./AppTopBar";
import { Sidebar } from "./Sidebar";

const backdropTx = "transition-opacity duration-250 ease-out";

export function AppShell() {
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  return (
    <div className="min-h-[100dvh] bg-[var(--surface-page)]">
      <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close menu"
          className={`fixed inset-0 z-40 bg-[#0a0a0a]/65 backdrop-blur-[3px] ${backdropTx} md:hidden`}
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:pl-[272px]">
        <AppTopBar onOpenNav={() => setMobileNavOpen(true)} navOpen={mobileNavOpen} />

        <main className="mx-auto w-full max-w-[1200px] flex-1 px-[var(--s-300)] pb-[max(var(--s-500),env(safe-area-inset-bottom))] pt-[calc(3.5rem+env(safe-area-inset-top)+var(--s-400))] sm:px-[var(--s-400)] md:px-[var(--s-600)] md:pb-[var(--s-500)] md:pt-[calc(3.5rem+env(safe-area-inset-top)+var(--s-500))]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
