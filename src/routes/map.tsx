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
        <svg viewBox="0 0 100 60" className="block w-full" style={{ background: "linear-gradient(180deg, oklch(0.20 0.04 260), oklch(0.13 0.04 260))" }}>
          <defs>
            <linearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.36 0.05 260)" />
              <stop offset="100%" stopColor="oklch(0.30 0.05 260)" />
            </linearGradient>
            <radialGradient id="oceanGlow" cx="50%" cy="50%">
              <stop offset="0%" stopColor="oklch(0.30 0.07 240 / 0.3)" />
              <stop offset="100%" stopColor="oklch(0.16 0.04 260 / 0)" />
            </radialGradient>
          </defs>

          {/* Ocean glow */}
          <rect x="0" y="0" width="100" height="60" fill="url(#oceanGlow)" />

          {/* Lat/long grid + tropics */}
          <g stroke="oklch(0.78 0.13 85 / 0.06)" strokeWidth="0.08">
            {[10, 20, 30, 40, 50].map((y) => <line key={`h${y}`} x1="0" x2="100" y1={y} y2={y} />)}
            {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((x) => <line key={`v${x}`} x1={x} x2={x} y1="0" y2="60" />)}
          </g>
          <g stroke="oklch(0.78 0.13 85 / 0.12)" strokeWidth="0.1" strokeDasharray="0.6 0.6">
            <line x1="0" x2="100" y1="30" y2="30" />
            <line x1="0" x2="100" y1="22" y2="22" />
            <line x1="0" x2="100" y1="38" y2="38" />
          </g>

          {/* Ocean labels */}
          <g fill="oklch(0.55 0.08 240 / 0.45)" fontSize="1.6" fontStyle="italic" textAnchor="middle">
            <text x="35" y="25">المحيط الأطلسي</text>
            <text x="35" y="48">جنوب الأطلسي</text>
            <text x="92" y="36">المحيط الهادئ</text>
            <text x="2" y="36" textAnchor="start">الهادئ</text>
            <text x="70" y="40">المحيط الهندي</text>
            <text x="50" y="6">المحيط المتجمد الشمالي</text>
            <text x="50" y="58">المحيط المتجمد الجنوبي</text>
            <text x="52" y="23" fontSize="1.3">المتوسط</text>
          </g>

          {/* Continents — detailed silhouettes */}
          <g fill="url(#landGrad)" stroke="oklch(0.58 0.07 260)" strokeWidth="0.18" strokeLinejoin="round">
            {/* Alaska */}
            <path d="M2,11 L8,10 L10,12 L7,14 L3,13 Z" />
            {/* Canada / North America */}
            <path d="M5,13 L12,10 L18,10 L23,12 L27,14 L25,17 L27,21 L25,25 L23,28 L20,31 L16,32 L12,31 L9,28 L7,24 L5,19 Z" />
            {/* Greenland */}
            <path d="M28,5 L33,4 L36,7 L35,11 L31,12 L29,10 Z" />
            {/* Iceland */}
            <path d="M40,11 L43,11 L43,13 L40,13 Z" />
            {/* Florida tip */}
            <path d="M21,29 L23,29 L23,32 L22,32 Z" />
            {/* Mexico / Central America */}
            <path d="M16,31 L21,32 L24,34 L25,37 L23,38 L20,37 L18,35 Z" />
            {/* Caribbean specks */}
            <circle cx="26" cy="35" r="0.4" />
            <circle cx="27.5" cy="35.5" r="0.3" />
            <circle cx="29" cy="36" r="0.3" />
            {/* South America */}
            <path d="M22,38 L27,37 L30,40 L31,44 L29,49 L27,53 L24,56 L21,55 L20,50 L20,45 L21,41 Z" />
            {/* Iberian Peninsula (Spain + Portugal) */}
            <path d="M40,21 L44,20 L46,22 L45,24 L41,24 L40,22 Z" />
            {/* France */}
            <path d="M44,18 L48,17 L49,20 L48,22 L45,21 L44,20 Z" />
            {/* British Isles */}
            <path d="M43,14 L45,14 L46,17 L44,18 L43,17 Z" />
            <path d="M41,16 L42,15 L42,17 L41,17 Z" />
            {/* Scandinavia */}
            <path d="M48,7 L52,6 L55,8 L56,12 L54,15 L51,14 L49,11 Z" />
            {/* Germany / Central Europe */}
            <path d="M48,15 L52,15 L54,17 L53,19 L49,19 L48,17 Z" />
            {/* Italy boot */}
            <path d="M50,19 L52,19 L53,22 L54,24 L52,24 L51,22 Z" />
            <path d="M50,25 L52,25 L52,26 L50,26 Z" />
            {/* Balkans + Greece */}
            <path d="M53,18 L57,18 L58,21 L57,23 L55,23 L53,21 Z" />
            {/* Eastern Europe / Russia (west) */}
            <path d="M54,9 L62,8 L66,11 L65,15 L60,17 L56,16 L54,13 Z" />
            {/* Russia (huge mass) */}
            <path d="M55,8 L72,6 L82,8 L88,11 L91,14 L89,18 L84,20 L78,19 L72,18 L66,17 L60,15 L56,12 Z" />
            {/* Turkey + Anatolia */}
            <path d="M56,20 L62,20 L64,22 L62,24 L57,24 L55,22 Z" />
            {/* Arabian Peninsula */}
            <path d="M58,25 L63,25 L65,28 L65,32 L62,33 L59,31 L57,28 Z" />
            {/* North Africa (Maghreb + Egypt) */}
            <path d="M40,24 L48,23 L55,24 L58,25 L57,28 L54,30 L48,31 L43,30 L40,28 Z" />
            {/* Sub-Saharan Africa */}
            <path d="M44,30 L54,30 L58,33 L60,38 L58,44 L54,49 L51,52 L48,51 L45,47 L43,42 L43,36 Z" />
            {/* Madagascar */}
            <path d="M61,46 L63,45 L63,49 L61,50 Z" />
            {/* Central Asia + Mongolia */}
            <path d="M66,12 L78,11 L84,13 L86,16 L82,18 L74,18 L68,16 Z" />
            {/* China */}
            <path d="M72,18 L82,18 L86,20 L86,24 L82,26 L76,26 L72,23 Z" />
            {/* Korea */}
            <path d="M85,21 L87,21 L87,24 L85,24 Z" />
            {/* Japan */}
            <path d="M88,18 L89,17 L90,20 L89,22 L88,20 Z" />
            <path d="M88,22 L90,22 L91,25 L89,26 Z" />
            {/* India */}
            <path d="M68,24 L73,24 L75,28 L73,33 L70,33 L68,30 Z" />
            {/* Sri Lanka */}
            <path d="M71,34 L72.5,34 L72.5,36 L71,36 Z" />
            {/* Indochina */}
            <path d="M76,26 L80,26 L81,30 L78,33 L77,30 Z" />
            {/* Thailand peninsula */}
            <path d="M77,33 L79,33 L79,37 L77,37 Z" />
            {/* Indonesia */}
            <path d="M77,37 L84,36 L86,38 L82,39 L78,39 Z" />
            <path d="M84,38 L88,37 L90,39 L86,40 Z" />
            {/* Philippines */}
            <path d="M85,30 L87,30 L87,34 L85,34 Z" />
            {/* Taiwan */}
            <path d="M85,26 L86,26 L86,28 L85,28 Z" />
            {/* Australia */}
            <path d="M81,43 L88,42 L93,44 L94,48 L90,52 L84,52 L80,49 L79,46 Z" />
            {/* Tasmania */}
            <path d="M86,53 L88,53 L88,55 L86,55 Z" />
            {/* New Zealand */}
            <path d="M94,52 L96,52 L96,55 L94,55 Z" />
            <path d="M95,50 L96,50 L96,52 L95,52 Z" />
          </g>

          {/* Country / region labels */}
          <g fill="oklch(0.58 0.05 260 / 0.55)" fontSize="1.3" fontWeight="600" textAnchor="middle">
            <text x="14" y="20">كندا</text>
            <text x="17" y="26">و.م.أ</text>
            <text x="19" y="35">المكسيك</text>
            <text x="26" y="48">البرازيل</text>
            <text x="22" y="53">الأرجنتين</text>
            <text x="42" y="22">إسبانيا</text>
            <text x="46" y="20">فرنسا</text>
            <text x="51" y="17">ألمانيا</text>
            <text x="44" y="16">بريطانيا</text>
            <text x="51" y="9">السويد</text>
            <text x="52" y="22" fontSize="1.1">إيطاليا</text>
            <text x="73" y="12">الاتحاد السوفيتي</text>
            <text x="78" y="22">الصين</text>
            <text x="89" y="20">اليابان</text>
            <text x="71" y="29">الهند</text>
            <text x="61" y="29">السعودية</text>
            <text x="48" y="27">مصر</text>
            <text x="50" y="40">أفريقيا</text>
            <text x="86" y="48">أستراليا</text>
            <text x="59" y="22">تركيا</text>
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
                  <text x={b.x} y={b.y - 2.5} fontSize="2.2" fill="oklch(0.86 0.10 88)" textAnchor="middle" fontWeight="700" stroke="oklch(0.16 0.04 260)" strokeWidth="0.5" paintOrder="stroke">
                    {b.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Compass rose */}
          <g transform="translate(6, 53)">
            <circle r="2.2" fill="oklch(0.18 0.04 260)" stroke="oklch(0.78 0.13 85 / 0.5)" strokeWidth="0.15" />
            <path d="M0,-1.8 L0.4,0 L0,1.8 L-0.4,0 Z" fill="oklch(0.78 0.13 85)" />
            <text y="-2.6" fontSize="1.1" fill="oklch(0.78 0.13 85)" textAnchor="middle" fontWeight="700">N</text>
          </g>
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
