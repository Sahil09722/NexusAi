import { useState, useRef, useEffect } from "react";
import ChatMessage from "./component/ChatMessages.jsx";
import Loader from "./component/Loader.jsx";
import axios from "axios";

export default function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello, how can I assist you today?" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai", { prompt: input });

      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to server!" }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      <header className="p-4 bg-gray-800 text-center text-lg font-bold">
       AI Assistant
      </header>

      <main className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <Loader />}
        <div ref={chatEndRef}></div>
      </main>

      <footer className="p-4 bg-gray-800 flex items-center gap-2">
        <input
          placeholder="Type a message..."
          className="flex-1 p-3 rounded-lg bg-gray-700 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
        >
          Send
        </button>
      </footer>
    </div>
  );
}
