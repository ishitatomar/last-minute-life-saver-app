import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FiMenu } from "react-icons/fi";

import { chatWithAI } from "../services/chatService";
import { getTasks } from "../services/taskService";

export default function AIChat() {
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const prompts = [
    {
      icon: "📅",
      label: "Plan my day",
      prompt: "Plan my day",
    },
    {
      icon: "🔥",
      label: "What is urgent?",
      prompt: "What is urgent?",
    },
    {
      icon: "📚",
      label: "Study Schedule",
      prompt: "Create study schedule",
    },
    {
      icon: "📝",
      label: "Break Tasks",
      prompt: "Break my tasks into subtasks",
    },
    {
      icon: "⏰",
      label: "2 Hour Focus",
      prompt: "Give me a 2-hour focus plan",
    },
    {
      icon: "📊",
      label: "Productivity",
      prompt: "Analyze my productivity",
    },
    {
      icon: "💪",
      label: "Motivate Me",
      prompt: "Motivate me",
    },
  ];

  const [tasks, setTasks] = useState([]);

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Welcome to Last Minute Life Saver!\n\nI can help you plan your day, prioritize tasks, create study schedules and improve productivity.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        console.log(err);
      }
    }

    loadTasks();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  async function askAI(question) {
    if (!question.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: question,
      },
    ]);

    setLoading(true);

    try {
      const reply = await chatWithAI(tasks, question);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
        },
      ]);
    } catch (err) {
      console.error(err);

      let errorMessage =
        "❌ Something went wrong. Please try again later.";

      if (
        err.message?.includes("429") ||
        err.message?.includes("quota") ||
        err.message?.includes("Quota exceeded")
      ) {
        errorMessage =
          "🚫 Today's free AI request limit has been reached.\n\nPlease try again tomorrow when the quota resets.";
      } else if (
        err.message?.includes("API_KEY") ||
        err.message?.includes("API key")
      ) {
        errorMessage =
          "🔑 Gemini API key is invalid or missing.";
      } else if (
        err.message?.includes("Failed to fetch") ||
        err.message?.includes("Network")
      ) {
        errorMessage =
          "🌐 Unable to connect to Gemini.\nPlease check your internet connection.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);
    }

    setLoading(false);
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const question = input;
    setInput("");

    await askAI(question);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white lg:flex">
            {/* ================= DESKTOP SIDEBAR ================= */}

      <div className="hidden lg:block w-72 bg-slate-900 border-r border-slate-800 p-6">

        <h1 className="text-3xl font-bold text-cyan-400 mb-10">
          🤖 AI Assistant
        </h1>

        <div className="space-y-3">

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => navigate("/calendar")}
            className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
          >
            📅 Calendar
          </button>

          <button
            onClick={() => navigate("/analytics")}
            className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
          >
            📊 Analytics
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3 transition"
          >
            👤 Profile
          </button>

        </div>

        <hr className="my-8 border-slate-700" />

        <h2 className="text-xl font-semibold mb-5">
          ⚡ Quick Prompts
        </h2>

        <div className="space-y-3">

          {prompts.map((item) => (
            <button
              key={item.label}
              onClick={() => askAI(item.prompt)}
              className="w-full text-left bg-slate-800 hover:bg-violet-600 rounded-xl p-3 transition"
            >
              {item.icon} {item.label}
            </button>
          ))}

        </div>

        <button
          onClick={() =>
            setMessages([
              {
                sender: "ai",
                text: "👋 Welcome back! How can I help you today?",
              },
            ])
          }
          className="mt-10 w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 font-semibold"
        >
          🔄 New Chat
        </button>

      </div>

      {/* ================= MOBILE SIDEBAR ================= */}

      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          <div className="fixed left-0 top-0 w-72 h-full bg-slate-900 z-50 p-6 overflow-y-auto lg:hidden">

            <button
              onClick={() => setSidebarOpen(false)}
              className="mb-6 text-gray-400"
            >
              ✕ Close
            </button>

            <h1 className="text-3xl font-bold text-cyan-400 mb-8">
              🤖 AI Assistant
            </h1>

            <div className="space-y-3">

              <button
                onClick={() => {
                  navigate("/dashboard");
                  setSidebarOpen(false);
                }}
                className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
              >
                🏠 Dashboard
              </button>

              <button
                onClick={() => {
                  navigate("/calendar");
                  setSidebarOpen(false);
                }}
                className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
              >
                📅 Calendar
              </button>

              <button
                onClick={() => {
                  navigate("/analytics");
                  setSidebarOpen(false);
                }}
                className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
              >
                📊 Analytics
              </button>

              <button
                onClick={() => {
                  navigate("/profile");
                  setSidebarOpen(false);
                }}
                className="w-full text-left bg-slate-800 hover:bg-cyan-600 rounded-xl p-3"
              >
                👤 Profile
              </button>

            </div>

            <hr className="my-8 border-slate-700" />

            <h2 className="text-lg font-semibold mb-4">
              ⚡ Quick Prompts
            </h2>

            <div className="space-y-3">

              {prompts.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    askAI(item.prompt);
                    setSidebarOpen(false);
                  }}
                  className="w-full text-left bg-slate-800 hover:bg-violet-600 rounded-xl p-3"
                >
                  {item.icon} {item.label}
                </button>
              ))}

            </div>

          </div>
        </>
      )}

      {/* ================= CHAT ================= */}

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">

        <div className="flex items-center gap-4 mb-6">

          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden bg-slate-900 p-3 rounded-xl"
          >
            <FiMenu size={24} />
          </button>

          <h1 className="text-2xl sm:text-4xl font-bold">
            🤖 AI Assistant
          </h1>

        </div>

        <div className="bg-slate-900 rounded-2xl h-[60vh] sm:h-[70vh] lg:h-[650px] overflow-y-auto p-4 sm:p-6 lg:p-8">

          {messages.map((msg, index) => (

  msg.sender === "user" ? (

    <div
      key={index}
      className="flex justify-end mb-6"
    >
      <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 max-w-full sm:max-w-lg rounded-2xl px-4 sm:px-6 py-4 shadow-lg break-words">

        <p className="text-white whitespace-pre-wrap">
          {msg.text}
        </p>

      </div>
    </div>

  ) : (

    <div
      key={index}
      className="flex justify-start mb-6"
    >
      <div className="bg-slate-800 w-full sm:w-[90%] rounded-2xl border border-slate-700 shadow-lg overflow-hidden">

        {/* AI Header */}

        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-slate-700">

          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-violet-600 flex items-center justify-center text-lg sm:text-xl">
            🤖
          </div>

          <div>

            <h3 className="font-bold">
              Last Minute AI
            </h3>

            <p className="text-xs sm:text-sm text-gray-400">
              Productivity Assistant
            </p>

          </div>

        </div>

        {/* AI Response */}

        <div className="px-4 sm:px-8 py-6">

          <div className="prose prose-invert max-w-none">

            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {msg.text}
            </ReactMarkdown>

          </div>

        </div>

      </div>

    </div>

  )

))}

{loading && (

  <div className="flex justify-start mb-6">

    <div className="bg-slate-800 rounded-2xl px-6 py-5 border border-slate-700 animate-pulse">
      🤖 Thinking...
    </div>

  </div>

)}

<div ref={bottomRef} />

</div>

{/* ================= INPUT ================= */}

<div className="mt-5">

  <div className="flex gap-3">

    <input
      type="text"
      placeholder="Ask AI anything..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage();
        }
      }}
      className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4 outline-none focus:border-cyan-500"
    />

    <button
      onClick={sendMessage}
      className="bg-gradient-to-r from-cyan-500 to-violet-600 px-6 sm:px-10 rounded-2xl font-semibold hover:scale-105 transition"
    >
      🚀
    </button>

  </div>

</div>

{/* ================= FOOTER ================= */}

<div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mt-5 text-sm text-gray-400">

  <p>
    💡 Tip: Ask "Plan my day", "Break my tasks", or "Motivate me".
  </p>

  

</div>

</div>

</div>
);
}