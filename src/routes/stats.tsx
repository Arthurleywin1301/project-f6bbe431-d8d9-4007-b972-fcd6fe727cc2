import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { stats } from "@/data/wwii";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "إحصاءات الحرب العالمية الثانية" },
      { name: "description", content: "مقارنة الأرقام بين الحلفاء والمحور: قوات، خسائر، إنتاج عسكري." },
    ],
  }),
  component: StatsPage,
});

const fmt = (n: number) => new Intl.NumberFormat("ar-EG").format(n);

function StatsPage() {
  return (
    <PageShell title="الإحصاءات" subtitle="الحلفاء مقابل المحور">
      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border p-4 text-center shadow-elegant" style={{ background: "color-mix(in oklab, var(--allies) 18%, var(--card))" }}>
          <p className="text-[11px] text-muted-foreground">المعسكر</p>
          <p className="mt-1 font-display text-xl font-bold" style={{ color: "var(--allies)" }}>الحلفاء</p>
          <p className="mt-1 text-[10px] text-foreground/70">المملكة المتحدة • الاتحاد السوفيتي • الولايات المتحدة • فرنسا</p>
        </div>
        <div className="rounded-xl border border-border p-4 text-center shadow-elegant" style={{ background: "color-mix(in oklab, var(--axis) 18%, var(--card))" }}>
          <p className="text-[11px] text-muted-foreground">المعسكر</p>
          <p className="mt-1 font-display text-xl font-bold" style={{ color: "var(--axis)" }}>المحور</p>
          <p className="mt-1 text-[10px] text-foreground/70">ألمانيا • إيطاليا • اليابان</p>
        </div>
      </div>

      <ul className="space-y-4">
        {stats.map((s) => {
          const total = s.allies + s.axis;
          const alliesPct = (s.allies / total) * 100;
          const axisPct = (s.axis / total) * 100;
          return (
            <li key={s.label} className="rounded-xl border border-border gradient-card p-4 shadow-elegant">
              <p className="mb-3 text-sm font-semibold text-foreground">{s.label}</p>
              <div className="flex items-end justify-between text-[11px]">
                <span style={{ color: "var(--allies)" }} className="font-numeric font-bold">
                  {fmt(s.allies)} <span className="text-muted-foreground font-normal">{s.unit}</span>
                </span>
                <span style={{ color: "var(--axis)" }} className="font-numeric font-bold">
                  {fmt(s.axis)} <span className="text-muted-foreground font-normal">{s.unit}</span>
                </span>
              </div>
              <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-background/60">
                <div className="h-full transition-all" style={{ width: `${alliesPct}%`, background: "var(--allies)" }} />
                <div className="h-full transition-all" style={{ width: `${axisPct}%`, background: "var(--axis)" }} />
              </div>
              <div className="mt-1.5 flex justify-between font-numeric text-[10px] text-muted-foreground">
                <span>{alliesPct.toFixed(0)}%</span>
                <span>{axisPct.toFixed(0)}%</span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-5 rounded-lg border border-border bg-card/50 p-3 text-center text-[11px] text-muted-foreground">
        * أرقام تقديرية مستندة إلى مصادر تاريخية متنوعة. تختلف التقديرات بين المؤرخين.
      </p>
    </PageShell>
  );
}
