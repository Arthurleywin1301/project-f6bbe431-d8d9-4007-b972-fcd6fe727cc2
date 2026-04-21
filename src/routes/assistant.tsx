import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";
import { PageShell } from "@/components/PageShell";
import { askAssistant } from "@/utils/assistant.functions";
import { Send, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "المساعد الذكي — الحرب العالمية الثانية" },
      { name: "description", content: "اسأل المساعد الذكي أي سؤال عن الحرب العالمية الثانية باللغة العربية." },
    ],
  }),
  component: AssistantPage,
});

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "لماذا انهزمت ألمانيا في ستالينغراد؟",
  "من هو إرفين روميل؟",
  "كم عدد ضحايا الهولوكوست؟",
  "ما أهمية إنزال نورماندي؟",
];

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await ask({ data: { messages: next } });
      if (res.error) {
        setError(res.error);
      } else {
        setMessages([...next, { role: "assistant", content: res.reply }]);
      }
    } catch (e) {
      setError("تعذّر الوصول إلى المساعد.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <div className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold shadow-gold">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-base font-bold leading-tight text-foreground">المساعد الذكي</h1>
            <p className="text-[10px] text-muted-foreground">خبير في الحرب العالمية الثانية</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="mx-auto w-full max-w-3xl flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.length === 0 && (
          <div className="fade-up rounded-xl border border-border gradient-card p-5 text-center shadow-elegant">
            <Sparkles className="mx-auto h-8 w-8 text-gold" />
            <h2 className="mt-3 font-display text-lg font-bold text-foreground">مرحبًا بك</h2>
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
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
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

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <MobileNavWrapper />
      </div>
    </div>
  );
}

function MobileNavWrapper() {
  const { MobileNav } = require("@/components/MobileNav") as typeof import("@/components/MobileNav");
  return <MobileNav />;
}
