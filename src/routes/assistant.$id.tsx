import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { MobileNav } from "@/components/MobileNav";
import { askAssistant } from "@/utils/assistant.functions";
import { Send, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/assistant/$id")({
  head: () => ({
    meta: [
      { title: "محادثة — المساعد الذكي" },
    ],
  }),
  component: ChatPage,
});

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "لماذا انهزمت ألمانيا في ستالينغراد؟",
  "من هو إرفين روميل؟",
  "ما أهمية إنزال نورماندي؟",
];

function ChatPage() {
  const { id } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const ask = useServerFn(askAssistant);

  const [messages, setMessages] = useState<Msg[]>([]);
  const [title, setTitle] = useState("محادثة جديدة");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hydrating, setHydrating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auth gate + load conversation
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/auth" });
      return;
    }
    void hydrate();
  }, [user, authLoading, id]);

  const hydrate = async () => {
    setHydrating(true);
    const [{ data: conv, error: ce }, { data: msgs, error: me }] = await Promise.all([
      supabase.from("conversations").select("title").eq("id", id).maybeSingle(),
      supabase.from("messages").select("role, content").eq("conversation_id", id).order("created_at", { ascending: true }),
    ]);
    if (ce || !conv) {
      toast.error("لم نجد هذه المحادثة");
      navigate({ to: "/assistant" });
      return;
    }
    if (me) toast.error("تعذّر تحميل الرسائل");
    setTitle(conv.title);
    setMessages(((msgs ?? []) as Msg[]));
    setHydrating(false);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading || !user) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    // Persist user message
    await supabase.from("messages").insert({
      conversation_id: id, user_id: user.id, role: "user", content: trimmed,
    });

    // Auto-title from first message
    if (messages.length === 0) {
      const newTitle = trimmed.slice(0, 60);
      setTitle(newTitle);
      await supabase.from("conversations").update({ title: newTitle }).eq("id", id);
    }

    try {
      const res = await ask({ data: { messages: next } });
      if (res.error) {
        setError(res.error);
      } else {
        const assistantMsg: Msg = { role: "assistant", content: res.reply };
        setMessages([...next, assistantMsg]);
        await supabase.from("messages").insert({
          conversation_id: id, user_id: user.id, role: "assistant", content: res.reply,
        });
      }
    } catch {
      setError("تعذّر الوصول إلى المساعد.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || hydrating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <Link to="/assistant" className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-gold" aria-label="رجوع">
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold shadow-gold">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="truncate font-display text-base font-bold text-foreground">{title}</h1>
            <p className="text-[10px] text-muted-foreground">خبير في الحرب العالمية الثانية</p>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="mx-auto w-full max-w-3xl flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.length === 0 && (
          <div className="fade-up rounded-xl border border-border gradient-card p-5 text-center shadow-elegant">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mt-3 font-display text-lg font-bold text-foreground">ابدأ محادثتك</h2>
            <p className="mt-1 text-sm text-muted-foreground">اسألني أي شيء عن الحرب العالمية الثانية.</p>
            <div className="mt-4 grid gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-lg border border-border bg-background/50 p-3 text-right text-xs text-foreground transition-all hover:border-gold hover:text-gold"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"} fade-up`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-elegant ${
                m.role === "user"
                  ? "bg-gold text-primary-foreground rounded-br-md"
                  : "border border-border gradient-card text-foreground rounded-bl-md"
              }`}
            >
              {m.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&>*]:my-1 [&_p]:leading-relaxed [&_strong]:text-gold [&_h3]:font-display [&_h3]:text-base [&_h3]:text-gold">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end fade-up">
            <div className="flex items-center gap-2 rounded-2xl border border-border gradient-card px-4 py-3 text-sm text-muted-foreground shadow-elegant">
              <Loader2 className="h-4 w-4 animate-spin text-gold" />
              يكتب...
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-center text-xs text-destructive">
            {error}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="fixed bottom-[calc(env(safe-area-inset-bottom)+64px)] left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك..."
            disabled={loading}
            className="flex-1 rounded-full border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-primary-foreground shadow-gold transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            aria-label="إرسال"
          >
            <Send className="h-4 w-4 -scale-x-100" />
          </button>
        </div>
      </form>

      <MobileNav />
    </div>
  );
}
