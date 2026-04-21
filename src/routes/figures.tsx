import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { figures, sideLabel, type Side } from "@/data/wwii";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/figures")({
  head: () => ({
    meta: [
      { title: "شخصيات الحرب العالمية الثانية" },
      { name: "description", content: "أبرز القادة والشخصيات في الحرب العالمية الثانية من الحلفاء والمحور." },
    ],
  }),
  component: FiguresPage,
});

const filters: { id: "all" | Side; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "allies", label: "الحلفاء" },
  { id: "axis", label: "المحور" },
];

function FiguresPage() {
  const [filter, setFilter] = useState<"all" | Side>("all");
  const [open, setOpen] = useState<string | null>(null);
  const list = filter === "all" ? figures : figures.filter((f) => f.side === filter);

  return (
    <PageShell title="الشخصيات" subtitle="قادة وصنّاع الحرب">
      <div className="mb-4 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
              filter === f.id
                ? "border-gold bg-gold text-primary-foreground shadow-gold"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((f) => {
          const isOpen = open === f.id;
          const sideColor = f.side === "allies" ? "var(--allies)" : f.side === "axis" ? "var(--axis)" : "var(--muted-foreground)";
          return (
            <li key={f.id} className="overflow-hidden rounded-xl border border-border gradient-card shadow-elegant">
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="flex w-full items-center gap-3 p-4 text-right"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-display text-base font-bold text-foreground"
                  style={{ borderColor: sideColor, background: `color-mix(in oklab, ${sideColor} 15%, transparent)` }}
                >
                  {f.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-base font-bold text-foreground">{f.name}</h3>
                  <p className="text-[11px] text-muted-foreground">{f.role}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                      style={{ background: `color-mix(in oklab, ${sideColor} 20%, transparent)`, color: sideColor }}
                    >
                      {sideLabel(f.side)}
                    </span>
                    <span className="font-numeric text-[10px] text-muted-foreground">{f.years}</span>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180 text-gold" : ""}`} />
              </button>
              {isOpen && (
                <div className="border-t border-border bg-background/40 p-4 fade-up">
                  <p className="text-sm leading-relaxed text-foreground/90">{f.bio}</p>
                  <p className="mt-3 text-[11px] text-muted-foreground">الدولة: <span className="text-gold">{f.country}</span></p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </PageShell>
  );
}
