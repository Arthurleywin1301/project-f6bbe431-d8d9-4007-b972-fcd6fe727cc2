import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { battles, sideLabel } from "@/data/wwii";
import { Calendar, MapPin, Skull, Star } from "lucide-react";

export const Route = createFileRoute("/battles")({
  head: () => ({
    meta: [
      { title: "معارك الحرب العالمية الثانية" },
      { name: "description", content: "أبرز معارك الحرب العالمية الثانية الحاسمة والأقل حسمًا." },
    ],
  }),
  component: BattlesPage,
});

function BattlesPage() {
  const [onlyDecisive, setOnlyDecisive] = useState(false);
  const list = onlyDecisive ? battles.filter((b) => b.decisive) : battles;

  return (
    <PageShell title="المعارك" subtitle="من بولندا إلى برلين">
      <button
        onClick={() => setOnlyDecisive((v) => !v)}
        className={`mb-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-semibold transition-all ${
          onlyDecisive
            ? "border-gold bg-gold text-primary-foreground shadow-gold"
            : "border-border bg-card text-muted-foreground"
        }`}
      >
        <Star className="h-4 w-4" />
        {onlyDecisive ? "عرض الكل" : "المعارك الحاسمة فقط"}
      </button>

      <ul className="space-y-3">
        {list.map((b) => {
          const sideColor = b.winner === "allies" ? "var(--allies)" : b.winner === "axis" ? "var(--axis)" : "var(--muted-foreground)";
          return (
            <li key={b.id} className="rounded-xl border border-border gradient-card p-4 shadow-elegant">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base font-bold text-foreground">{b.name}</h3>
                {b.decisive && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold text-gold">
                    <Star className="h-3 w-3 fill-current" /> حاسمة
                  </span>
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {b.date}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {b.location}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{b.summary}</p>
              <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Skull className="h-3.5 w-3.5" />
                  <span>{b.casualties}</span>
                </div>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: `color-mix(in oklab, ${sideColor} 20%, transparent)`, color: sideColor }}
                >
                  المنتصر: {sideLabel(b.winner)}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
