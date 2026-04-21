import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Users, Swords, Map, BarChart3, Sparkles, ArrowLeft } from "lucide-react";
import { battles, figures } from "@/data/wwii";

export const Route = createFileRoute("/")({
  component: Index,
});

const tiles = [
  { to: "/figures", label: "الشخصيات", desc: "أبرز قادة الحرب", icon: Users, count: figures.length },
  { to: "/battles", label: "المعارك", desc: "حاسمة وأقل حسمًا", icon: Swords, count: battles.length },
  { to: "/map", label: "الخريطة", desc: "مواقع المعارك الكبرى", icon: Map, count: undefined },
  { to: "/stats", label: "الإحصاءات", desc: "الحلفاء مقابل المحور", icon: BarChart3, count: undefined },
] as const;

function Index() {
  return (
    <PageShell>
      <section className="relative overflow-hidden rounded-2xl border border-border gradient-card p-6 shadow-elegant">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-gold opacity-10 blur-3xl" />
        <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-10 blur-3xl" style={{ background: "var(--allies)" }} />
        <p className="font-numeric text-xs tracking-widest text-gold">1939 — 1945</p>
        <h2 className="mt-2 font-display text-3xl font-bold leading-tight text-foreground">
          أعظم صراع عرفه التاريخ
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          ست سنوات غيّرت وجه العالم. أكثر من 70 مليون قتيل، 30 دولة متحاربة، ومعارك كتبت مصير القرن العشرين. اكتشف القصة كاملة بالعربية.
        </p>
        <Link
          to="/assistant"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold transition-all hover:scale-[1.02] active:scale-95 pulse-gold"
        >
          <Sparkles className="h-4 w-4" />
          اسأل المساعد الذكي
        </Link>
      </section>

      <section className="mt-5 grid grid-cols-2 gap-3">
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.to}
              to={t.to}
              className="group relative overflow-hidden rounded-xl border border-border gradient-card p-4 shadow-elegant transition-all hover:border-gold hover:-translate-y-0.5"
            >
              <Icon className="h-6 w-6 text-gold" strokeWidth={1.6} />
              <h3 className="mt-3 font-display text-base font-bold text-foreground">{t.label}</h3>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{t.desc}</p>
              {t.count !== undefined && (
                <span className="absolute left-3 top-3 rounded-full border border-border bg-background/60 px-2 py-0.5 font-numeric text-[10px] text-gold">
                  {t.count}
                </span>
              )}
              <ArrowLeft className="absolute bottom-3 left-3 h-4 w-4 text-muted-foreground transition-all group-hover:-translate-x-1 group-hover:text-gold" />
            </Link>
          );
        })}
      </section>

      <section className="mt-6 rounded-xl border border-border gradient-card p-5 shadow-elegant">
        <h3 className="font-display text-lg font-bold text-foreground">محطات رئيسية</h3>
        <ol className="mt-4 space-y-3 border-r-2 border-gold/40 pr-4">
          {[
            ["1 سبتمبر 1939", "ألمانيا تغزو بولندا — بداية الحرب"],
            ["22 يونيو 1941", "عملية بارباروسا ضد الاتحاد السوفيتي"],
            ["7 ديسمبر 1941", "هجوم بيرل هاربر — أمريكا تدخل الحرب"],
            ["2 فبراير 1943", "استسلام الألمان في ستالينغراد"],
            ["6 يونيو 1944", "إنزال نورماندي — يوم النصر"],
            ["8 مايو 1945", "استسلام ألمانيا"],
            ["2 سبتمبر 1945", "استسلام اليابان — نهاية الحرب"],
          ].map(([date, text]) => (
            <li key={date} className="relative">
              <span className="absolute -right-[22px] top-1.5 h-2.5 w-2.5 rounded-full bg-gold shadow-gold" />
              <p className="font-numeric text-[11px] text-gold">{date}</p>
              <p className="text-sm text-foreground">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
