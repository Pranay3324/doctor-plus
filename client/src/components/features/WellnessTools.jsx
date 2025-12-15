import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { LoadingSpinner } from "../common/LoadingSpinner";

export default function WellnessTools({ user }) {
  const [journalInput, setJournalInput] = useState("");
  const [ingredientsInput, setIngredientsInput] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTool, setActiveTool] = useState("journal");

  const handleToolSubmit = async () => {
    const isJournal = activeTool === "journal";
    const input = isJournal ? journalInput : ingredientsInput;
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse(null);

    let prompt = "";
    if (isJournal) {
      prompt = `I am writing in my wellness journal. Here is my entry: "${input}". Please analyze my mood, provide a supportive and empathetic response, and suggest one simple mindfulness or breathing exercise.`;
    } else {
      prompt = `I have these ingredients: "${input}". Please generate a healthy, simple recipe I can make. Include a nutritional summary.`;
    }

    try {
      const fetchResponse = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt, userId: user.uid }),
      });

      if (!fetchResponse.ok) throw new Error("Failed to get response");
      const data = await fetchResponse.json();
      setResponse(data.reply);
    } catch (err) {
      console.error("Tool error:", err);
      setResponse(
        "Sorry, I couldn't process that right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Wellness & Lifestyle Tools
      </h2>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => {
            setActiveTool("journal");
            setResponse(null);
          }}
          className={`flex-1 py-3 rounded-lg font-medium transition ${
            activeTool === "journal"
              ? "bg-teal-100 text-teal-800 border-2 border-teal-500"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          📝 Mood Journal
        </button>
        <button
          onClick={() => {
            setActiveTool("recipe");
            setResponse(null);
          }}
          className={`flex-1 py-3 rounded-lg font-medium transition ${
            activeTool === "recipe"
              ? "bg-orange-100 text-orange-800 border-2 border-orange-500"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          🥗 Recipe Generator
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">
          {activeTool === "journal"
            ? "How are you feeling today?"
            : "What ingredients do you have?"}
        </h3>
        <textarea
          value={activeTool === "journal" ? journalInput : ingredientsInput}
          onChange={(e) =>
            activeTool === "journal"
              ? setJournalInput(e.target.value)
              : setIngredientsInput(e.target.value)
          }
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none mb-4 min-h-[100px]"
          placeholder={
            activeTool === "journal"
              ? "I'm feeling a bit stressed..."
              : "Eggs, avocado, bread..."
          }
        />
        <button
          onClick={handleToolSubmit}
          disabled={isLoading}
          className={`w-full py-3 rounded-lg text-white font-bold transition flex justify-center items-center ${
            activeTool === "journal"
              ? "bg-teal-600 hover:bg-teal-700"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : activeTool === "journal" ? (
            "Analyze Mood & Get Support ✨"
          ) : (
            "Generate Healthy Recipe ✨"
          )}
        </button>
      </div>

      {response && (
        <div
          className={`mt-6 p-6 rounded-lg border shadow-sm ${
            activeTool === "journal"
              ? "bg-teal-50 border-teal-200 text-teal-900"
              : "bg-orange-50 border-orange-200 text-orange-900"
          }`}
        >
          <h4 className="font-bold mb-3">
            {activeTool === "journal"
              ? "💙 AI Wellness Support"
              : "🍳 Your AI Recipe"}
          </h4>
          <div className="whitespace-pre-wrap leading-relaxed">
            {response.split("\n").map((line, i) => (
              <p key={i} className="mb-2">
                {line}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
