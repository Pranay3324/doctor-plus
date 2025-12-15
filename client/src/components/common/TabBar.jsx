import React from "react";

export default function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "chat", label: "AI Chat" },
    { id: "tracker", label: "Health Tracker" },
    { id: "wellness", label: "Wellness Tools ✨" },
    { id: "locate", label: "Find Hospitals" },
    { id: "multimodal", label: "Image Analysis" },
  ];
  return (
    <div className="flex flex-wrap border-b border-gray-200 bg-gray-50">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 py-3 px-2 text-center text-sm md:text-base font-medium transition duration-300 ease-in-out focus:outline-none whitespace-nowrap ${
            activeTab === tab.id
              ? "border-b-2 border-blue-600 text-blue-700 bg-white"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
