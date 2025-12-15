import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { API_BASE_URL } from "../../config/api";
import { LoadingSpinner, InlineLoadingSpinner } from "../common/LoadingSpinner";
import MessageBox from "../common/MessageBox";

export default function HealthTracker({ user }) {
  const [logs, setLogs] = useState([]);
  const [foodInput, setFoodInput] = useState("");
  const [activityInput, setActivityInput] = useState("");
  const [insights, setInsights] = useState("");
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isAddingLog, setIsAddingLog] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) {
        setIsLoadingLogs(false);
        return;
      }
      setIsLoadingLogs(true);
      setError(null);
      try {
        const logsCollection = collection(db, "users", user.uid, "healthLogs");
        const q = query(
          logsCollection,
          orderBy("timestamp", "desc"),
          limit(20)
        );
        const querySnapshot = await getDocs(q);
        const fetchedLogs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc
            .data()
            .timestamp.toDate()
            .toLocaleString("en-US", {
              dateStyle: "short",
              timeStyle: "short",
            }),
        }));
        setLogs(fetchedLogs);
      } catch (err) {
        console.error("Error fetching logs:", err);
        setError("Could not load health logs.");
      } finally {
        setIsLoadingLogs(false);
      }
    };
    fetchLogs();
  }, [user]);

  const handleAddLog = async (type) => {
    const value = type === "food" ? foodInput : activityInput;
    if (!value.trim() || !user || isAddingLog) return;
    setError(null);
    setIsAddingLog(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/health-log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid, type: type, value: value }),
      });

      if (!response.ok) throw new Error(await response.text());
      const newLogData = await response.json();
      const timestampDate = newLogData.timestamp._seconds
        ? new Date(newLogData.timestamp._seconds * 1000)
        : new Date();

      setLogs((prev) => [
        {
          ...newLogData,
          timestamp: timestampDate.toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "short",
          }),
        },
        ...prev,
      ]);
      if (type === "food") setFoodInput("");
      else setActivityInput("");
    } catch (err) {
      setError(`Could not save log entry: ${err.message}`);
    } finally {
      setIsAddingLog(false);
    }
  };

  const getInsights = async () => {
    if (!user || isLoadingInsights) return;
    setIsLoadingInsights(true);
    setError(null);
    setInsights("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/health-insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.uid }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setInsights(data.insights || "No insights generated.");
    } catch (err) {
      setError(`Could not get AI health insights: ${err.message}`);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Personal Health Tracker
      </h2>
      {error && <MessageBox message={error} type="error" />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Log Food:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              placeholder="e.g., Apple, Salad"
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none"
              disabled={isAddingLog}
            />
            <button
              onClick={() => handleAddLog("food")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 min-w-[60px]"
              disabled={isAddingLog}
            >
              {isAddingLog ? <LoadingSpinner /> : "Add"}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Log Activity:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              placeholder="e.g., 30 min walk"
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none"
              disabled={isAddingLog}
            />
            <button
              onClick={() => handleAddLog("activity")}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 min-w-[60px]"
              disabled={isAddingLog}
            >
              {isAddingLog ? <LoadingSpinner /> : "Add"}
            </button>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <button
          onClick={getInsights}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50 min-h-[40px]"
          disabled={isLoadingInsights || logs.length < 3}
        >
          {isLoadingInsights ? <LoadingSpinner /> : "Get AI Health Insights"}
        </button>
        {insights && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-800 whitespace-pre-wrap">
            <h3 className="font-semibold mb-2">AI Insights:</h3>
            {insights}
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-700">Recent Logs:</h3>
      {isLoadingLogs ? (
        <div className="flex justify-center items-center h-40">
          <InlineLoadingSpinner />{" "}
          <span className="ml-2 text-gray-500">Loading logs...</span>
        </div>
      ) : (
        <div className="h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3 scroll-smooth">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No logs yet. Add some food or activity!
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-white rounded shadow border border-gray-100 flex justify-between items-center"
              >
                <div>
                  <span
                    className={`font-medium capitalize ${
                      log.type === "food" ? "text-green-700" : "text-yellow-700"
                    }`}
                  >
                    {log.type}:
                  </span>{" "}
                  <span className="ml-2 text-gray-800">{log.value}</span>
                </div>
                <span className="text-xs text-gray-400">{log.timestamp}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
