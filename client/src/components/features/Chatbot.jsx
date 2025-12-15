import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config/api";

// --- Configuration & Helpers (Inlined for stability) ---
// In a fully modular setup, move these to their respective files as planned.

// const API_BASE_URL = "http://127.0.0.1:5000";

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white inline-block"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

function MessageBox({ message, type = "info" }) {
  const styles = {
    info: "bg-blue-100 border-blue-400 text-blue-700",
    error: "bg-red-100 border-red-400 text-red-700",
    warning: "bg-yellow-100 border-yellow-400 text-yellow-700",
  };
  return (
    <div
      className={`border px-4 py-3 rounded-md relative mb-4 ${
        styles[type] || styles.info
      }`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
}

// --- Main Chatbot Component ---

export default function Chatbot({ user }) {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you with your health today? Ask about symptoms or first-aid.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);
    setError(null);

    const typingIndicator = {
      text: "...",
      sender: "ai",
      isTyping: true,
      id: Date.now(),
    };
    setMessages((prev) => [...prev, typingIndicator]);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, userId: user.uid }),
      });

      setMessages((prev) => prev.filter((msg) => !msg.isTyping));

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { text: data.reply, sender: "ai" }]);
    } catch (err) {
      setMessages((prev) => prev.filter((msg) => !msg.isTyping));
      console.error("Chat API error:", err);
      const errorMsg = `Sorry, an error occurred: ${err.message}`;
      setError(errorMsg);
      setMessages((prev) => [
        ...prev,
        { text: errorMsg, sender: "ai", isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        AI Health Chat
      </h2>
      <div className="h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50 space-y-4 scroll-smooth">
        {messages.map((msg, index) => (
          <div
            key={msg.id || index}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.isTyping ? (
              <div className="px-4 py-2 rounded-lg shadow bg-gray-200 text-gray-800">
                <span className="inline-block animate-pulse">...</span>
              </div>
            ) : (
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow break-words ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : msg.isError
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.text.split("\n").map((line, i, arr) => (
                  <span key={i}>
                    {line}
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && !messages.some((msg) => msg.isError) && (
        <MessageBox message={error} type="error" />
      )}
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about symptoms..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-5 rounded-lg transition duration-300 disabled:opacity-50 min-w-[80px]"
          disabled={isLoading}
        >
          {isLoading ? <LoadingSpinner /> : "Send"}
        </button>
      </form>
    </div>
  );
}
