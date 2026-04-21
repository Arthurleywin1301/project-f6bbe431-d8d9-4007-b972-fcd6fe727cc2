import { Link } from "@tanstack/react-router";

interface Props {
  title?: string;
  subtitle?: string;
}

export function AppHeader({ title = "الحرب العالمية الثانية", subtitle = "موسوعة تفاعلية" }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold shadow-gold">
            <span className="font-display text-lg font-bold text-primary-foreground">٤٥</span>
          </div>
          <div className="text-right">
            <h1 className="font-display text-base font-bold leading-tight text-foreground">{title}</h1>
            <p className="text-[10px] text-muted-foreground">{subtitle}</p>
          </div>
        </Link>
        <div className="text-left">
          <p className="font-numeric text-[10px] text-gold">1939 — 1945</p>
          <p className="text-[10px] text-muted-foreground">٦ سنوات</p>
        </div>
      </div>
    </header>
  );
}
