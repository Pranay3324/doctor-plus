import React from "react";

export default function Header({ user, onSignOut }) {
  return (
    <header className="w-full max-w-4xl flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-4">
      <div className="text-center md:text-left flex-grow">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2">
          Doctor Plus
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Your AI-Powered Personal Health Partner
        </p>
      </div>

      {user && (
        <div className="flex items-center gap-4 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-gray-700">
              {user.displayName || "Guest User"}
            </p>
            <p className="text-xs text-gray-500">
              {user.isAnonymous ? "Anonymous" : user.email}
            </p>
          </div>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-full border border-gray-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {user.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : "G"}
            </div>
          )}
          <button
            onClick={onSignOut}
            className="ml-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-2 px-4 rounded transition duration-300 text-sm whitespace-nowrap"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}
