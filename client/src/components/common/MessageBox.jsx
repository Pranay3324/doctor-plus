import React from "react";

export default function MessageBox({ message, type = "info" }) {
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
