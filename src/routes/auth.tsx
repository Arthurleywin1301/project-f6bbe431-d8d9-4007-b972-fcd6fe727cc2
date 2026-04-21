import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — موسوعة الحرب العالمية الثانية" },
      { name: "description", content: "سجّل دخولك لحفظ محادثاتك مع المساعد الذكي." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/assistant" });
    }
  }, [user, authLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("يرجى إدخال البريد وكلمة المرور");
      return;
    }
    setBusy(true);
    const { error } = mode === "signin"
      ? await signIn(email, password)
      : await signUp(email, password);
    setBusy(false);
    if (error) {
      const msg = /already registered|user already/i.test(error)
        ? "هذا البريد مسجّل مسبقًا. سجّل الدخول بدلًا من ذلك."
        : /invalid login|invalid credentials/i.test(error)
        ? "بيانات الدخول غير صحيحة."
        : error;
      toast.error(msg);
      return;
    }
    toast.success(mode === "signin" ? "مرحبًا بعودتك" : "تم إنشاء حسابك");
    navigate({ to: "/assistant" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gold shadow-gold">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">الموسوعة</span>
        </Link>

        <div className="rounded-2xl border border-border gradient-card p-6 shadow-elegant">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {mode === "signin" ? "تسجيل الدخول" : "إنشاء حساب"}
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            احفظ محادثاتك مع المساعد وتابع أسئلتك في أي وقت.
          </p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">البريد الإلكتروني</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="any@thing.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                dir="ltr"
                className="w-full rounded-lg border border-border bg-input px-3 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
                placeholder="••••••••"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">نسخة تجريبية — أي قيمة مقبولة</p>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-gold transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {mode === "signin" ? "دخول" : "إنشاء حساب"}
            </button>
          </form>

          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-gold"
          >
            {mode === "signin" ? "ليس لديك حساب؟ أنشئ حسابًا" : "لديك حساب؟ سجّل الدخول"}
          </button>
        </div>

        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-gold">
          ← العودة إلى الموسوعة
        </Link>
      </div>
    </div>
  );
}
