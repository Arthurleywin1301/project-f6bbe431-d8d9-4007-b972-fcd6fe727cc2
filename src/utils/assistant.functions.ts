import { createServerFn } from "@tanstack/react-start";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `أنت مؤرخ خبير ومتخصص في الحرب العالمية الثانية (1939-1945). مهمتك الإجابة على أسئلة المستخدمين باللغة العربية الفصحى الواضحة.

قواعد:
- أجب دائمًا بالعربية، حتى لو سُئلت بلغة أخرى.
- كن دقيقًا تاريخيًا واذكر التواريخ والأماكن والأسماء بدقة.
- أجوبة موجزة ومنظّمة (٢-٤ فقرات قصيرة كحد أقصى).
- استخدم تنسيق Markdown عند الحاجة (قوائم، عناوين فرعية).
- إذا كان السؤال خارج نطاق الحرب العالمية الثانية، أعد المستخدم بلطف إلى الموضوع.
- لا تخترع معلومات: إذا لم تكن متأكدًا، قل ذلك.`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: { messages: ChatMessage[] }) => {
    if (!input || !Array.isArray(input.messages)) {
      throw new Error("messages must be an array");
    }
    return {
      messages: input.messages.slice(-20).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: String(m.content || "").slice(0, 4000),
      })) as ChatMessage[],
    };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { error: "LOVABLE_API_KEY غير مضبوط على الخادم.", reply: "" };
    }

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...data.messages,
          ],
        }),
      });

      if (res.status === 429) {
        return { error: "تم تجاوز حد الطلبات. حاول بعد قليل.", reply: "" };
      }
      if (res.status === 402) {
        return { error: "نفد الرصيد. أضف رصيدًا في إعدادات Lovable Cloud.", reply: "" };
      }
      if (!res.ok) {
        const t = await res.text();
        console.error("AI gateway error:", res.status, t);
        return { error: "حدث خطأ أثناء الاتصال بالمساعد.", reply: "" };
      }

      const json = await res.json();
      const reply: string = json?.choices?.[0]?.message?.content ?? "";
      return { reply, error: null as string | null };
    } catch (err) {
      console.error("askAssistant failed:", err);
      return { error: "خطأ غير متوقع. حاول مرة أخرى.", reply: "" };
    }
  });
