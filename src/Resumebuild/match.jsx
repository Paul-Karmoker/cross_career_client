import React, { useState } from "react";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import axios from "axios";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import * as mammoth from "mammoth";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

// Set up the PDF.js worker from CDN
GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

const Match = () => {
  const [jobText, setJobText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Extract text from a PDF file
  const extractTextFromPDF = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        try {
          const pdf = await getDocument({
            data: arrayBuffer,
            disableAutoFetch: true,
            disableStream: true
          }).promise;
          let text = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map((item) => item.str).join(" ");
          }
          resolve(text);
        } catch (error) {
          console.error("PDF extraction error:", error);
          reject(new Error("Failed to extract text from PDF"));
        }
      };
      reader.onerror = (error) => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Extract text from a DOCX file
  const extractTextFromDOCX = async (file) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;
        try {
          const result = await mammoth.extractRawText({ arrayBuffer });
          resolve(result.value);
        } catch (error) {
          console.error("DOCX extraction error:", error);
          reject(new Error("Failed to extract text from DOCX"));
        }
      };
      reader.onerror = (error) => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsArrayBuffer(file);
    });
  };

  // Handle file upload or text input for job description
  const handleJobInput = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let text = "";
        if (file.type === "application/pdf") {
          text = await extractTextFromPDF(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          text = await extractTextFromDOCX(file);
        } else {
          text = await file.text();
        }
        setJobText(text);
        setError("");
      } catch (error) {
        console.error("File processing error:", error);
        setError(error.message);
      }
    } else {
      setJobText(e.target.value);
      setError("");
    }
  };

  // Handle file upload or text input for resume
  const handleResumeInput = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        let text = "";
        if (file.type === "application/pdf") {
          text = await extractTextFromPDF(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          text = await extractTextFromDOCX(file);
        } else {
          text = await file.text();
        }
        setResumeText(text);
        setError("");
      } catch (error) {
        console.error("File processing error:", error);
        setError(error.message);
      }
    } else {
      setResumeText(e.target.value);
      setError("");
    }
  };

  // Submit data to backend for AI analysis
  const handleSubmit = async () => {
    if (!jobText || !resumeText) {
      setError("Please provide both job description and resume.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "https://backend-server-deploy.onrender.com/ai/get-review",
        {
          prompt: `Job Description: ${jobText}\nResume: ${resumeText}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 30000
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.error || "Failed to fetch analysis.");
      }

      setAnalysisResult(response.data.message);
    } catch (error) {
      console.error("API error:", error);
      setError(error.message || "An error occurred while analyzing the documents.");
    } finally {
      setLoading(false);
    }
  };

  // Function to download analysis report as PDF
  const downloadPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(12);
      
      // Split text into multiple lines to prevent overflow
      const lines = doc.splitTextToSize(analysisResult, 180);
      doc.text(lines, 10, 10);
      doc.save("analysis_report.pdf");
    } catch (error) {
      console.error("PDF generation error:", error);
      setError("Failed to generate PDF");
    }
  };

  // Function to download analysis report as DOCX
  const downloadDocx = () => {
    try {
      const blob = new Blob([analysisResult], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      saveAs(blob, "analysis_report.docx");
    } catch (error) {
      console.error("DOCX generation error:", error);
      setError("Failed to generate DOCX");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen mt-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl -mt-4 font-bold text-center text-gray-800 mb-8">
          Match & Insights (Job Vs Resume)  
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Job Description Box */}
          <div className="card bg-white shadow-lg rounded-lg">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-gray-700 mb-4">
                Job Description
              </h2>
              <textarea
                className="textarea textarea-bordered w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste job description here..."
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
              />
              <input
                type="file"
                className="file-input file-input-bordered w-full mt-4 bg-white border border-gray-300 rounded-lg"
                onChange={handleJobInput}
                accept=".txt,.pdf,.docx"
              />
            </div>
          </div>

          {/* Resume Box */}
          <div className="card bg-white shadow-lg rounded-lg">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-gray-700 mb-4">
                Resume
              </h2>
              <textarea
                className="textarea textarea-bordered w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste resume here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <input
                type="file"
                className="file-input file-input-bordered w-full mt-4 bg-white border border-gray-300 rounded-lg"
                onChange={handleResumeInput}
                accept=".txt,.pdf,.docx"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex justify-center mt-4">
            <div className="text-red-500 bg-red-100 px-4 py-2 rounded-lg">
              {error}
            </div>
          </div>
        )}

        <div className="flex justify-center">
          <button
            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            onClick={handleSubmit}
            disabled={loading || !jobText || !resumeText}
          >
            {loading ? (
              <span className="flex items-center">
                <span className="animate-spin mr-2">🌀</span>
                Analyzing...
              </span>
            ) : (
              "Analyze"
            )}
          </button>
        </div>

        {analysisResult && (
          <div className="card bg-white shadow-lg rounded-lg mt-8">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-gray-700 mb-4">
                Analysis Result
              </h2>
              <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-200">
                <Markdown rehypePlugins={[rehypeHighlight]}>
                  {analysisResult}
                </Markdown>
              </div>

              <div className="flex gap-4 justify-center mt-6">
                <button
                  className="btn bg-pink-200 hover:bg-pink-300 text-black font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={downloadPdf}
                >
                  Download as PDF
                </button>
                <button
                  className="btn bg-blue-200 hover:bg-blue-300 text-black font-semibold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                  onClick={downloadDocx}
                >
                  Download as DOCX
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Match;