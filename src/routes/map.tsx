import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { battles, sideLabel } from "@/data/wwii";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "خريطة معارك الحرب العالمية الثانية" },
      { name: "description", content: "خريطة تفاعلية لمواقع المعارك الكبرى في الحرب العالمية الثانية." },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [selected, setSelected] = useState<string | null>("stalingrad");
  const battle = battles.find((b) => b.id === selected);

  return (
    <PageShell title="الخريطة" subtitle="مواقع المعارك الكبرى">
      <p className="mb-3 text-xs text-muted-foreground">
        اضغط على أي علامة ذهبية لمعرفة تفاصيل المعركة.
      </p>

      <div className="relative overflow-hidden rounded-xl border border-border gradient-card shadow-elegant">
        <svg viewBox="0 0 100 60" className="block w-full" style={{ background: "linear-gradient(180deg, oklch(0.20 0.04 260), oklch(0.16 0.04 260))" }}>
          {/* Stylized world map silhouette */}
          <g fill="oklch(0.32 0.05 260)" stroke="oklch(0.45 0.06 260)" strokeWidth="0.15">
            {/* North America */}
            <path d="M5,18 Q8,12 14,13 L20,15 L22,22 L18,30 L12,32 L8,28 Z" />
            {/* South America */}
            <path d="M18,38 L22,38 L24,48 L20,55 L16,52 L15,45 Z" />
            {/* Europe + Africa + Mid-East */}
            <path d="M44,22 L52,20 L58,22 L62,26 L60,32 L66,38 L62,48 L52,52 L46,48 L44,38 L42,30 Z" />
            {/* Asia */}
            <path d="M58,18 L72,16 L82,20 L84,26 L78,32 L72,30 L66,28 L60,26 Z" />
            {/* Japan */}
            <path d="M82,28 L84,28 L84,32 L82,33 Z" />
            {/* Australia */}
            <path d="M76,46 L84,45 L86,50 L82,53 L77,52 Z" />
            {/* UK */}
            <path d="M46,26 L48,26 L48,29 L46,29 Z" />
          </g>

          {/* Latitude/longitude grid */}
          <g stroke="oklch(0.78 0.13 85 / 0.08)" strokeWidth="0.1">
            {[10,20,30,40,50].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} />)}
            {[10,20,30,40,50,60,70,80,90].map((x) => <line key={x} x1={x} x2={x} y1="0" y2="60" />)}
          </g>

          {/* Battle markers */}
          {battles.map((b) => {
            const active = b.id === selected;
            const color = b.winner === "allies" ? "oklch(0.65 0.15 240)" : "oklch(0.60 0.18 25)";
            return (
              <g key={b.id} onClick={() => setSelected(b.id)} style={{ cursor: "pointer" }}>
                <circle cx={b.x} cy={b.y} r={active ? 1.8 : 1.2} fill={color} opacity="0.4">
                  <animate attributeName="r" values={`${active ? 1.8 : 1.2};${active ? 3 : 2.2};${active ? 1.8 : 1.2}`} dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={b.x} cy={b.y} r={active ? 1.2 : 0.8} fill="oklch(0.78 0.13 85)" stroke="oklch(0.18 0.04 260)" strokeWidth="0.2" />
                {active && (
                  <text x={b.x} y={b.y - 2.5} fontSize="2" fill="oklch(0.86 0.10 88)" textAnchor="middle" fontWeight="700">
                    {b.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--allies)" }} />
          نصر الحلفاء
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--axis)" }} />
          نصر المحور
        </span>
      </div>

      {/* Detail card */}
      {battle && (
        <div className="mt-5 rounded-xl border border-border gradient-card p-4 shadow-elegant fade-up" key={battle.id}>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display text-lg font-bold text-foreground">{battle.name}</h3>
            <span className="font-numeric text-[11px] text-gold">{battle.date}</span>
          </div>
          <p className="text-[11px] text-muted-foreground">{battle.location}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{battle.summary}</p>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[11px]">
            <span className="text-muted-foreground">{battle.casualties}</span>
            <span className="text-gold">المنتصر: {sideLabel(battle.winner)}</span>
          </div>
        </div>
      )}
    </PageShell>
  );
}
