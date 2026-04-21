import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MobileNav } from "@/components/MobileNav";
import { toast } from "sonner";
import { MessageSquare, Plus, Trash2, LogOut, Loader2, Sparkles, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/assistant/")({
  head: () => ({
    meta: [
      { title: "محادثاتي — المساعد الذكي" },
      { name: "description", content: "محادثاتك المحفوظة مع المساعد الذكي." },
    ],
  }),
  component: ConversationsList,
});

interface Conv {
  id: string;
  title: string;
  updated_at: string;
}

function ConversationsList() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [convs, setConvs] = useState<Conv[]>([]);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    void loadConvs();
  }, [user, loading]);

  const loadConvs = async () => {
    setBusy(true);
    const { data, error } = await supabase
      .from("conversations")
      .select("id, title, updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast.error("تعذّر تحميل المحادثات");
    setConvs(data ?? []);
    setBusy(false);
  };

  const newConv = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("conversations")
      .insert({ user_id: user.id, title: "محادثة جديدة" })
      .select("id")
      .single();
    if (error || !data) {
      toast.error("تعذّر إنشاء محادثة");
      return;
    }
    navigate({ to: "/assistant/$id", params: { id: data.id } });
  };

  const removeConv = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) {
      toast.error("تعذّر الحذف");
      return;
    }
    setConvs((c) => c.filter((x) => x.id !== id));
    toast.success("تم حذف المحادثة");
  };

  if (loading || busy) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("ar-EG", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold shadow-gold">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-foreground">محادثاتي</h1>
              <p className="text-[10px] text-muted-foreground" dir="ltr">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={async () => { await signOut(); toast.success("تم تسجيل الخروج"); navigate({ to: "/" }); }}
            className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-destructive"
            aria-label="خروج"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5">
        <button
          onClick={newConv}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 text-sm font-bold text-primary-foreground shadow-gold transition-all hover:scale-[1.01]"
        >
          <Plus className="h-4 w-4" />
          محادثة جديدة
        </button>

        {convs.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border p-8 text-center">
            <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-3 text-sm text-foreground">لا توجد محادثات بعد</p>
            <p className="mt-1 text-xs text-muted-foreground">ابدأ محادثة جديدة لطرح سؤالك الأول</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {convs.map((c) => (
              <li key={c.id}>
                <Link
                  to="/assistant/$id"
                  params={{ id: c.id }}
                  className="group flex items-center gap-3 rounded-xl border border-border gradient-card p-4 shadow-elegant transition-all hover:border-gold"
                >
                  <MessageSquare className="h-5 w-5 shrink-0 text-gold" />
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                    <p className="font-numeric text-[10px] text-muted-foreground">{fmt(c.updated_at)}</p>
                  </div>
                  <button
                    onClick={(e) => removeConv(c.id, e)}
                    className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>

      <MobileNav />
    </div>
  );
}
