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
        <svg viewBox="0 0 100 60" className="block w-full" style={{ background: "linear-gradient(180deg, oklch(0.20 0.04 260), oklch(0.14 0.04 260))" }}>
          {/* Ocean grid (lat/long) */}
          <g stroke="oklch(0.78 0.13 85 / 0.06)" strokeWidth="0.08">
            {[10, 20, 30, 40, 50].map((y) => <line key={`h${y}`} x1="0" x2="100" y1={y} y2={y} />)}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => <line key={`v${x}`} x1={x} x2={x} y1="0" y2="60" />)}
          </g>

          {/* Continents — detailed silhouettes */}
          <g fill="oklch(0.34 0.05 260)" stroke="oklch(0.55 0.07 260)" strokeWidth="0.18" strokeLinejoin="round">
            {/* North America */}
            <path d="M4,12 L10,9 L17,9 L22,11 L26,14 L24,17 L26,20 L24,24 L22,28 L18,31 L14,32 L11,30 L9,26 L7,22 L5,18 Z M3,8 L7,7 L9,9 L6,10 Z" />
            {/* Greenland */}
            <path d="M28,5 L33,4 L35,8 L33,12 L29,11 Z" />
            {/* Central America */}
            <path d="M18,32 L22,32 L24,35 L22,37 L20,36 Z" />
            {/* South America */}
            <path d="M22,37 L27,36 L29,40 L28,46 L26,52 L23,56 L20,54 L19,48 L20,42 Z" />
            {/* Europe */}
            <path d="M44,15 L50,13 L54,14 L57,16 L56,19 L52,21 L48,21 L45,19 Z M46,11 L49,11 L48,13 L46,13 Z" />
            {/* UK & Ireland */}
            <path d="M43,16 L45,16 L45,19 L43,19 Z M41,17 L42,17 L42,19 L41,19 Z" />
            {/* Scandinavia */}
            <path d="M50,7 L55,8 L56,12 L53,14 L51,12 Z" />
            {/* Africa */}
            <path d="M48,24 L56,23 L60,26 L62,30 L60,36 L58,42 L54,48 L50,50 L46,48 L45,42 L46,36 L47,30 Z" />
            {/* Middle East */}
            <path d="M57,22 L63,22 L65,25 L63,28 L59,28 L57,26 Z" />
            {/* Asia (main mass) */}
            <path d="M57,12 L66,10 L75,11 L82,13 L86,16 L88,20 L86,24 L82,26 L78,25 L72,26 L66,25 L60,23 L57,20 Z" />
            {/* India */}
            <path d="M68,26 L73,26 L74,30 L72,33 L70,32 L69,29 Z" />
            {/* Southeast Asia */}
            <path d="M76,28 L82,28 L83,32 L80,34 L77,32 Z" />
            {/* Indonesia / Philippines */}
            <path d="M78,36 L84,35 L86,37 L82,38 Z M85,32 L87,32 L87,34 L85,34 Z" />
            {/* Japan */}
            <path d="M86,20 L88,21 L88,24 L86,25 Z M88,18 L89,18 L89,20 L88,20 Z" />
            {/* Australia */}
            <path d="M80,44 L88,43 L92,46 L91,50 L86,52 L81,51 L79,48 Z" />
            {/* New Zealand */}
            <path d="M93,52 L95,52 L95,55 L93,55 Z" />
            {/* Iceland */}
            <path d="M40,11 L43,11 L43,13 L40,13 Z" />
          </g>

          {/* Subtle continent labels */}
          <g fill="oklch(0.55 0.05 260 / 0.5)" fontSize="1.6" fontWeight="600" textAnchor="middle">
            <text x="14" y="22">أمريكا الشمالية</text>
            <text x="24" y="46">أمريكا الجنوبية</text>
            <text x="51" y="18">أوروبا</text>
            <text x="53" y="38">أفريقيا</text>
            <text x="74" y="19">آسيا</text>
            <text x="85" y="49">أستراليا</text>
          </g>

          {/* Battle markers */}
          {battles.map((b) => {
            const active = b.id === selected;
            const color = b.winner === "allies" ? "oklch(0.65 0.15 240)" : "oklch(0.62 0.20 25)";
            return (
              <g key={b.id} onClick={() => setSelected(b.id)} style={{ cursor: "pointer" }}>
                <circle cx={b.x} cy={b.y} r={active ? 1.8 : 1.2} fill={color} opacity="0.4">
                  <animate attributeName="r" values={`${active ? 1.8 : 1.2};${active ? 3 : 2.2};${active ? 1.8 : 1.2}`} dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx={b.x} cy={b.y} r={active ? 1.2 : 0.8} fill="oklch(0.78 0.13 85)" stroke="oklch(0.18 0.04 260)" strokeWidth="0.2" />
                {active && (
                  <text x={b.x} y={b.y - 2.5} fontSize="2.2" fill="oklch(0.86 0.10 88)" textAnchor="middle" fontWeight="700" stroke="oklch(0.16 0.04 260)" strokeWidth="0.4" paintOrder="stroke">
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
