import { useEffect, useState } from "react";

/**
 * Splash screen affiché au premier chargement.
 * - S'affiche uniquement à la première ouverture de la session (sessionStorage).
 * - Barre de progression simulée + fade-out automatique.
 * - Texte 100% en arabe, RTL.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Ne pas réafficher si déjà vu pendant cette session
    if (typeof window !== "undefined" && sessionStorage.getItem("splash_seen")) {
      setVisible(false);
      return;
    }

    let raf = 0;
    let start = performance.now();
    const DURATION = 1800; // ms

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / DURATION) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setFading(true);
        sessionStorage.setItem("splash_seen", "1");
        setTimeout(() => setVisible(false), 450);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  return (
    <div
      dir="rtl"
      aria-hidden={fading}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Décor : motif radial doré */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_color-mix(in_oklab,_var(--gold)_15%,_transparent)_0%,_transparent_70%)]" />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6">
        {/* Icône / monogramme */}
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-gold to-[color-mix(in_oklab,_var(--gold)_60%,_black)] shadow-gold">
          <span className="font-display text-4xl font-bold text-primary-foreground">٢</span>
        </div>

        {/* Titre */}
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            موسوعة الحرب العالمية الثانية
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            جاري تحضير المحتوى...
          </p>
        </div>

        {/* Barre de progression */}
        <div className="w-64 max-w-[80vw]">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-[color-mix(in_oklab,_var(--gold)_70%,_white)] transition-[width] duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-center text-xs font-medium text-muted-foreground tabular-nums">
            {Math.round(progress)}٪
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="absolute bottom-8 text-center text-xs text-muted-foreground">
        تطبيق تعليمي تفاعلي
      </div>
    </div>
  );
}
