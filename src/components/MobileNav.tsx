import { Link, useLocation } from "@tanstack/react-router";
import { Home, Users, Swords, Map, BarChart3, Sparkles } from "lucide-react";

const items = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/figures", label: "الشخصيات", icon: Users },
  { to: "/battles", label: "المعارك", icon: Swords },
  { to: "/map", label: "الخريطة", icon: Map },
  { to: "/stats", label: "الإحصاءات", icon: BarChart3 },
  { to: "/assistant", label: "المساعد", icon: Sparkles },
] as const;

export function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-xl shadow-elegant"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-around px-1 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || (item.to === "/assistant" && pathname.startsWith("/assistant"));
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className={`flex flex-col items-center gap-0.5 rounded-md px-1 py-2 text-[10px] font-medium transition-colors ${
                  active ? "text-gold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? "drop-shadow-[0_0_6px_var(--gold)]" : ""}`} strokeWidth={active ? 2.4 : 1.8} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
