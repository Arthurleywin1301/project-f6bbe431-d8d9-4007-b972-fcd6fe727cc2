import { ReactNode } from "react";
import { AppHeader } from "./AppHeader";
import { MobileNav } from "./MobileNav";

interface Props {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function PageShell({ children, title, subtitle }: Props) {
  return (
    <div className="min-h-screen pb-24">
      <AppHeader title={title} subtitle={subtitle} />
      <main className="mx-auto max-w-3xl px-4 py-5 fade-up">{children}</main>
      <MobileNav />
    </div>
  );
}
