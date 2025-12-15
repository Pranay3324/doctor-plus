import React, { useState } from "react";
import { API_BASE_URL } from "../../config/api";
import { LoadingSpinner } from "../common/LoadingSpinner";
import MessageBox from "../common/MessageBox";

export default function MultimodalAnalysis() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysisType, setAnalysisType] = useState("food");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setResult("");
    setError(null);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      if (selectedFile) setError("Please select a valid image file.");
      setFile(null);
      setPreview(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image file first.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult("");
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64Image = reader.result.includes(",")
          ? reader.result.split(",")[1]
          : reader.result;
        const prompt =
          analysisType === "food"
            ? "Analyze food image..."
            : "Analyze skin condition...";
        const response = await fetch(`${API_BASE_URL}/api/analyze-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt,
            imageData: base64Image,
            mimeType: file.type,
          }),
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setResult(data.analysis);
      } catch (err) {
        setError(`Analysis failed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Image Analysis (Food/Skin)
      </h2>
      {error && <MessageBox message={error} type="error" />}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Analysis Type:
        </label>
        <select
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg bg-white"
          disabled={isLoading}
        >
          <option value="food">Food Nutrition Analysis</option>
          <option value="skin">Skin Condition Information (Beta)</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Image:
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
          disabled={isLoading}
        />
      </div>
      {preview && (
        <div className="mb-4 text-center border p-2 rounded-lg bg-gray-50">
          <img src={preview} alt="Preview" className="max-h-60 rounded" />
        </div>
      )}
      <button
        onClick={handleAnalyze}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50 min-h-[48px]"
        disabled={isLoading || !file}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          `Analyze ${analysisType === "food" ? "Food" : "Skin Image"}`
        )}
      </button>
      {result && (
        <div className="mt-6 p-4 bg-gray-50 border rounded-lg whitespace-pre-wrap">
          <h3 className="font-semibold mb-2">AI Analysis Result:</h3>
          {result}
        </div>
      )}
    </div>
  );
}
