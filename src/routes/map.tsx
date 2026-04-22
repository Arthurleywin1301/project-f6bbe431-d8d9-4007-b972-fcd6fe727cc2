import { createFileRoute } from "@tanstack/react-router";
import { useState, memo } from "react";
import { PageShell } from "@/components/PageShell";
import { battles, sideLabel } from "@/data/wwii";
import { COUNTRIES } from "@/data/world-map";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "خريطة معارك الحرب العالمية الثانية" },
      { name: "description", content: "خريطة جغرافية تفاعلية لمواقع المعارك الكبرى في الحرب العالمية الثانية." },
    ],
  }),
  component: MapPage,
});

const SIDE_FILL: Record<string, string> = {
  allies: "oklch(0.42 0.08 240)",
  axis: "oklch(0.40 0.10 25)",
  neutral: "oklch(0.40 0.04 90)",
  other: "oklch(0.32 0.04 260)",
};
const SIDE_STROKE: Record<string, string> = {
  allies: "oklch(0.65 0.12 240)",
  axis: "oklch(0.65 0.15 25)",
  neutral: "oklch(0.65 0.06 90)",
  other: "oklch(0.50 0.05 260)",
};

const WorldMap = memo(function WorldMap() {
  return (
    <g>
      {COUNTRIES.map((c) => (
        <path
          key={c.name}
          d={c.d}
          fill={SIDE_FILL[c.side]}
          stroke={SIDE_STROKE[c.side]}
          strokeWidth="0.08"
          strokeLinejoin="round"
        >
          <title>{c.name}</title>
        </path>
      ))}
    </g>
  );
});

function MapPage() {
  const [selected, setSelected] = useState<string | null>("stalingrad");
  const battle = battles.find((b) => b.id === selected);

  return (
    <PageShell title="الخريطة" subtitle="مواقع المعارك الكبرى">
      <p className="mb-3 text-xs text-muted-foreground">
        خريطة جغرافية حقيقية. اضغط على أي علامة ذهبية لمعرفة تفاصيل المعركة.
      </p>

      <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded-sm" style={{ background: SIDE_FILL.allies }} />
          الحلفاء
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded-sm" style={{ background: SIDE_FILL.axis }} />
          المحور
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-4 rounded-sm" style={{ background: SIDE_FILL.neutral }} />
          محايد
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-gold shadow-gold" />
          معركة
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-border gradient-card shadow-elegant">
        <svg
          viewBox="0 0 100 60"
          className="block w-full"
          style={{ background: "linear-gradient(180deg, oklch(0.22 0.05 240), oklch(0.16 0.05 250))" }}
        >
          <g stroke="oklch(0.78 0.13 85 / 0.05)" strokeWidth="0.06">
            {[10, 20, 30, 40, 50].map((y) => <line key={`h${y}`} x1="0" x2="100" y1={y} y2={y} />)}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => <line key={`v${x}`} x1={x} x2={x} y1="0" y2="60" />)}
          </g>

          <g stroke="oklch(0.78 0.13 85 / 0.15)" strokeWidth="0.08" strokeDasharray="0.5 0.5">
            <line x1="0" x2="100" y1={(85 - 0) / 145 * 60} y2={(85 - 0) / 145 * 60} />
            <line x1="0" x2="100" y1={(85 - 23.5) / 145 * 60} y2={(85 - 23.5) / 145 * 60} />
            <line x1="0" x2="100" y1={(85 + 23.5) / 145 * 60} y2={(85 + 23.5) / 145 * 60} />
          </g>

          <g fill="oklch(0.60 0.08 240 / 0.5)" fontSize="1.4" fontStyle="italic" textAnchor="middle">
            <text x="38" y="22">المحيط الأطلسي</text>
            <text x="35" y="46">جنوب الأطلسي</text>
            <text x="92" y="32">المحيط الهادئ</text>
            <text x="3" y="32" textAnchor="start">الهادئ</text>
            <text x="72" y="42">المحيط الهندي</text>
            <text x="55" y="20" fontSize="1.1">المتوسط</text>
          </g>

          <WorldMap />

          {battles.map((b) => {
            const active = b.id === selected;
            const color = b.winner === "allies" ? "oklch(0.78 0.18 240)" : "oklch(0.72 0.22 25)";
            return (
              <g key={b.id} onClick={() => setSelected(b.id)} style={{ cursor: "pointer" }}>
                <circle cx={b.x} cy={b.y} r={active ? 1.0 : 0.65} fill={color} opacity="0.5">
                  <animate attributeName="r" values={`${active ? 1.0 : 0.65};${active ? 1.8 : 1.3};${active ? 1.0 : 0.65}`} dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={b.x} cy={b.y} r={active ? 0.6 : 0.4} fill="oklch(0.85 0.15 85)" stroke="oklch(0.18 0.04 260)" strokeWidth="0.08" />
                {active && (
                  <text
                    x={b.x}
                    y={b.y - 1.8}
                    fontSize="1.8"
                    fill="oklch(0.92 0.10 88)"
                    textAnchor="middle"
                    fontWeight="700"
                    stroke="oklch(0.16 0.04 260)"
                    strokeWidth="0.45"
                    paintOrder="stroke"
                  >
                    {b.name}
                  </text>
                )}
              </g>
            );
          })}

          <g transform="translate(5, 53)">
            <circle r="2" fill="oklch(0.18 0.04 260)" stroke="oklch(0.78 0.13 85 / 0.5)" strokeWidth="0.12" />
            <path d="M0,-1.6 L0.35,0 L0,1.6 L-0.35,0 Z" fill="oklch(0.78 0.13 85)" />
            <text y="-2.3" fontSize="1" fill="oklch(0.78 0.13 85)" textAnchor="middle" fontWeight="700">N</text>
          </g>
        </svg>
      </div>

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

      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold text-muted-foreground">جميع المعارك</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {battles.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelected(b.id)}
              className={`rounded-lg border p-2 text-right text-[11px] transition-all ${
                selected === b.id
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border bg-background/40 text-foreground hover:border-gold/50"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
