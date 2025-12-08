import { useState, useRef, useEffect } from "react";
import ChatMessage from "./component/ChatMessages.jsx";
import Loader from "./component/Loader.jsx";
import axios from "axios";

const quickPrompts = [
  "What's the weather today?",
  "Will it rain this weekend?",
  "Give me a 3-day forecast.",
  "What should I wear tomorrow?",
];

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! Ask me anything about the weather." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai", {
        prompt: userMsg.text,
      });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to server!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-10 -top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-10 border-b border-white/5 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold">
              NX
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
                Nexus AI
              </p>
              <p className="text-lg font-semibold">Weather Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Live • Gemini 1.5 Flash
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-1 flex-col gap-4 px-4 py-6 md:px-6">
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-2xl backdrop-blur">
          <div className="flex flex-wrap gap-2 pb-3">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition hover:border-blue-400/50 hover:bg-blue-500/10"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="min-h-[400px] max-h-[400px] overflow-y-auto space-y-4 pr-1 scrollbar-hide">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
            ))}
            {loading && <Loader />}
            <div ref={chatEndRef} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Press Enter to send • Shift+Enter for new line</span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">
                Online
              </span>
            </div>
            <div className="flex gap-3">
              <textarea
                placeholder="Ask about the weather, forecasts, or recommendations..."
                className="flex-1 resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 shadow-inner outline-none ring-0 transition focus:border-blue-400/60 focus:bg-slate-950"
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="flex h-fit items-center gap-2 self-end rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600/50"
              >
                {loading ? "Sending..." : "Send"}
                <span className="text-lg">➤</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}