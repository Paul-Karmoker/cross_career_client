// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import {
  useInitSessionMutation,
  useStartSessionMutation,
  useGetCurrentQuery,
  useSubmitAnswerMutation,
  useGetResultQuery,
  useGetTimeLeftQuery,
  useLazyDownloadPdfQuery
} from "../context/writtenTestApi.js";

// A utility function to format time for better readability
const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined) return "00:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
};

const WrittenTest = () => {
  const [sessionId, setSessionId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    experienceYears: "",
    skills: "",
    jobDescription: "",
    durationMinutes: "",
  });
  const [formError, setFormError] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [initSession, { isLoading: isInitLoading }] = useInitSessionMutation();
  const [startSession, { isLoading: isStartLoading }] = useStartSessionMutation();
  const [submitAnswer, { isLoading: isSubmitting }] = useSubmitAnswerMutation();
  
  const [triggerDownload, { isLoading: isDownloadingPdf }] = useLazyDownloadPdfQuery();

  const { data: currentQ, isFetching: isQuestionLoading } = useGetCurrentQuery(sessionId, {
    skip: !sessionId || !isTestStarted || showResult,
    pollingInterval: 5000,
  });
  const { data: timeLeft } = useGetTimeLeftQuery(sessionId, {
    skip: !sessionId || !isTestStarted || showResult,
    pollingInterval: 1000,
  });
  const { 
    data: result, 
    isLoading: isResultLoading, 
    isError: isResultError, 
    error: resultError 
  } = useGetResultQuery(sessionId, {
    skip: !sessionId || !showResult,
  });
  console.log("result", result);

  useEffect(() => {
    if (timeLeft?.remaining <= 0 && isTestStarted && !showResult) {
      setShowResult(true);
    }
  }, [timeLeft, isTestStarted, showResult]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError("");
  };

  const handleInit = async () => {
    const { jobTitle, experienceYears, skills, jobDescription, durationMinutes } = formData;
    if (!jobTitle || !experienceYears || !skills || !jobDescription || !durationMinutes) {
      setFormError("All fields are required.");
      return;
    }
    if (isNaN(experienceYears) || experienceYears <= 0) {
      setFormError("Experience years must be a positive number.");
      return;
    }
    if (isNaN(durationMinutes) || durationMinutes <= 0) {
      setFormError("Duration must be a positive number.");
      return;
    }
    try {
      const res = await initSession({
        jobTitle,
        experienceYears: Number(experienceYears),
        skills: skills.split(",").map((skill) => skill.trim()),
        jobDescription,
        durationMinutes: Number(durationMinutes),
      }).unwrap();
      setSessionId(res.sessionId);
    } catch (error) {
      console.error("Failed to initialize session:", error);
      setFormError("Failed to initialize session. Please try again.");
    }
  };

  const handleStart = async () => {
    try {
      await startSession(sessionId).unwrap();
      setIsTestStarted(true);
    } catch (error) {
      console.error("Failed to start session:", error);
      setFormError("Failed to start session. Please try again.");
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    try {
      const res = await submitAnswer({ sessionId, answer }).unwrap();
      setAnswer("");
      if (res.nextIndex >= res.total) {
        setShowResult(true);
      }
    } catch (error) {
      console.error("Failed to submit answer:", error);
      setFormError("Failed to submit answer. Please try again.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const blob = await triggerDownload(sessionId).unwrap();
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'test_results.pdf';
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download PDF:", error);
      setFormError("Failed to download PDF. Please try again.");
    }
  };

  const preventCheating = (e) => {
    e.preventDefault();
  };

  const renderContent = () => {
    if (showResult) {
      if (isResultLoading) {
        return (
          <div className="text-center">
            <p className="text-gray-600">Loading results...</p>
          </div>
        );
      }
      if (isResultError) {
        console.error("Error loading results:", resultError);
        return (
          <div className="text-center">
            <p className="text-red-600">Error loading results: {resultError?.message || "Unknown error"}</p>
          </div>
        );
      }
      if (result) {
        return (
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Test Completed!</h2>
            <p className="text-gray-600 mb-6">Here is your performance summary.</p>
            {formError && <p className="text-red-600 mb-4">{formError}</p>}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left">
              <h3 className="font-bold text-lg text-blue-800 mb-3">Your Result</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Job Title:</span> {result.jobTitle}</p>
                <p><span className="font-semibold">Experience Years:</span> {result.experienceYears}</p>
                <p><span className="font-semibold">Skills:</span> {result.skills.join(", ")}</p>
                <p><span className="font-semibold">Job Description:</span> {result.jobDescription}</p>
                <p><span className="font-semibold">Duration:</span> {result.durationMinutes} minutes</p>
                <p><span className="font-semibold">Total Score:</span> <span className="font-bold text-2xl text-blue-700">{result.totalScore}</span></p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloadingPdf}
                className="mt-4 w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60 transition-colors"
              >
                {isDownloadingPdf ? "Downloading..." : "Download Results as PDF"}
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className="text-center">
          <p className="text-gray-600">No results available.</p>
        </div>
      );
    }

    if (isTestStarted && !showResult) {
      return (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-700">Current Question</h2>
            {timeLeft && (
              <div className="text-lg font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-md">
                ⏳ {formatTime(timeLeft.remaining)}
              </div>
            )}
          </div>
          {formError && <p className="text-red-600 mb-4">{formError}</p>}
          {isQuestionLoading && <p>Loading question...</p>}
          {currentQ && (
            <div className="p-6 border rounded-lg bg-gray-50" onCopy={preventCheating} onCut={preventCheating}>
              <p className="font-medium mb-4 text-lg text-gray-800 select-none">{currentQ.question}</p>
              <textarea
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                rows="6"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onPaste={preventCheating}
                onCut={preventCheating}
                onCopy={preventCheating}
                placeholder="Type your answer here..."
              />
              <button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !answer.trim()}
                className="mt-4 w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </button>
            </div>
          )}
        </>
      );
    }

    if (sessionId) {
      return (
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ready to Begin?</h2>
          <p className="text-gray-600 mb-6">The test is initialized. Click the button below to start.</p>
          {formError && <p className="text-red-600 mb-4">{formError}</p>}
          <button
            onClick={handleStart}
            disabled={isStartLoading}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-60"
          >
            {isStartLoading ? "Starting..." : "Start Exam"}
          </button>
        </div>
      );
    }

    return (
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Node.js Developer Test</h2>
        <p className="text-gray-600 mb-6">Fill in the details below to initialize your written test session.</p>
        {formError && <p className="text-red-600 mb-4">{formError}</p>}
        <div className="space-y-4">
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleInputChange}
            placeholder="Job Title (e.g., Node.js Backend Developer)"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            name="experienceYears"
            value={formData.experienceYears}
            onChange={handleInputChange}
            placeholder="Years of Experience"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="Skills (comma-separated, e.g., Node.js, Express, MongoDB)"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <textarea
            name="jobDescription"
            value={formData.jobDescription}
            onChange={handleInputChange}
            placeholder="Job Description"
            rows="4"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="number"
            name="durationMinutes"
            value={formData.durationMinutes}
            onChange={handleInputChange}
            placeholder="Test Duration (minutes)"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleInit}
            disabled={isInitLoading}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-60"
          >
            {isInitLoading ? "Initializing..." : "Init Exam"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center border-b pb-4">Written Assessment</h1>
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default WrittenTest;