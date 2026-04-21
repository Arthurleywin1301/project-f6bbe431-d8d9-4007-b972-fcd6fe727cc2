import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MobileNav } from "@/components/MobileNav";
import { askAssistant } from "@/utils/assistant.functions";
import { Send, Sparkles, Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "المساعد الذكي — موسوعة الحرب العالمية الثانية" },
      { name: "description", content: "اسأل المساعد الذكي أي سؤال عن الحرب العالمية الثانية." },
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
  "ما أهمية إنزال نورماندي؟",
  "ما الفرق بين الحلفاء والمحور؟",
];

const STORAGE_KEY = "ww2_chat_messages_v1";

// Lightweight markdown-ish formatter: bold, lists, headings, line breaks.
function formatContent(text: string): string {
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // Headings ###
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="font-display text-base text-gold mt-2 mb-1">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h3 class="font-display text-base text-gold mt-2 mb-1">$1</h3>');
  // Bold **xxx**
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-gold">$1</strong>');
  // Italic *xxx*
  html = html.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, "<em>$1</em>");
  // Bullet lists
  html = html.replace(/^[-•]\s+(.+)$/gm, '<li class="mr-4 list-disc">$1</li>');
  html = html.replace(/(<li[^>]*>.*?<\/li>\n?)+/gs, (m) => `<ul class="my-1 space-y-0.5">${m}</ul>`);
  // Paragraphs
  html = html
    .split(/\n{2,}/)
    .map((block) => block.startsWith("<") ? block : `<p>${block.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return html;
}

function AssistantPage() {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    setError(null);
    const userMsg: Msg = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
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
    } catch {
      setError("تعذّر الوصول إلى المساعد. تحقق من الاتصال وحاول مجددًا.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold shadow-gold">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1 overflow-hidden">
            <h1 className="truncate font-display text-base font-bold text-foreground">المساعد الذكي</h1>
            <p className="text-[10px] text-muted-foreground">خبير في الحرب العالمية الثانية</p>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-full p-2 text-muted-foreground hover:bg-card hover:text-destructive"
              aria-label="مسح المحادثة"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
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
                <div
                  className="space-y-1 [&_p]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatContent(m.content) }}
                />
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
