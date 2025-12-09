import ReactMarkdown from "react-markdown";

export default function ChatMessage({ sender, text }) {
  const isUser = sender === "user";
  const bg = isUser ? "bg-blue-600/90" : "bg-white/5";
  const border = isUser ? "border-blue-400/50" : "border-white/10";
  const textColor = isUser ? "text-white" : "text-slate-100";
  const avatar = isUser ? "You" : "AI";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[80%] items-start gap-3">
        {!isUser && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-100">
            {avatar}
          </div>
        )}
        <div
          className={`w-full rounded-2xl border ${border} ${bg} ${textColor} px-4 py-3 shadow-lg prose prose-invert prose-sm max-w-none`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap m-0">{text}</p>
          ) : (
            <ReactMarkdown>{text}</ReactMarkdown>
          )}
        </div>
        {isUser && (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-slate-100">
            {avatar}
          </div>
        )}
      </div>
    </div>
  );
}
