import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./config/firebase";

// --- Import Common Components ---
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import TabBar from "./components/common/TabBar";
import { InlineLoadingSpinner } from "./components/common/LoadingSpinner";

// --- Import Auth Component ---
import Login from "./components/auth/Login";

// --- Import Feature Components ---
import Chatbot from "./components/features/Chatbot";
import HealthTracker from "./components/features/HealthTracker";
import WellnessTools from "./components/features/WellnessTools";
import HospitalLocator from "./components/features/HospitalLocator";
import MultimodalAnalysis from "./components/features/MultimodalAnalysis";

function App() {
  const [user, setUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Handle user logout
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setActiveTab("chat"); // Reset to default tab on logout
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  // Show loading spinner while checking auth status
  if (!isAuthReady) {
    return (
      <div className="flex justify-center items-center h-screen">
        <InlineLoadingSpinner />{" "}
        <span className="ml-2 text-gray-500">Initializing...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans flex flex-col items-center p-4 md:p-8">
      {/* Header handles the title and the sign-out button */}
      <Header user={user} onSignOut={handleSignOut} />

      {!user ? (
        // Show Login component if no user is signed in
        <Login />
      ) : (
        // Show the main app interface if user is signed in
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden mt-8">
          <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6 md:p-8">
            {activeTab === "chat" && <Chatbot user={user} />}
            {activeTab === "tracker" && <HealthTracker user={user} />}
            {activeTab === "wellness" && <WellnessTools user={user} />}
            {activeTab === "locate" && <HospitalLocator />}
            {activeTab === "multimodal" && <MultimodalAnalysis />}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
