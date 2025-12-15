import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 text-center text-gray-500 text-sm max-w-4xl mx-auto">
      <p className="font-semibold text-red-600">
        **Disclaimer:** Doctor Plus is for informational purposes only. Consult
        a professional for medical advice.
      </p>
      <p className="mt-2">
        &copy; {new Date().getFullYear()} Doctor Plus. All rights reserved.
      </p>
    </footer>
  );
}
