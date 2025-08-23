import { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import * as mammoth from "mammoth";

// Set up the PDF.js worker
GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const Cover = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [coverLetterStyle, setCoverLetterStyle] = useState("USA"); // Default to USA per Postman request

  // Robust PDF text extraction
  const extractTextFromPDF = async (file) => {
    try {
      if (!file || file.type !== "application/pdf") {
        throw new Error("Please upload a valid PDF file");
      }
      if (file.size > 10 * 1024 * 1024) {
        throw new Error("PDF file too large (max 10MB)");
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({
        data: arrayBuffer,
        disableAutoFetch: true,
        disableStream: true,
      }).promise;

      let fullText = "";
      const pageTextPromises = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        pageTextPromises.push(
          pdf.getPage(i).then(async (page) => {
            const content = await page.getTextContent();
            return content.items.map((item) => item.str).join(" ") + "\n\n";
          })
        );
      }

      const pagesText = await Promise.all(pageTextPromises);
      fullText = pagesText.join("");
      if (!fullText.trim()) {
        throw new Error("No text found - PDF may be image-based");
      }

      return fullText;
    } catch (error) {
      console.error("PDF Extraction Error:", {
        error: error.message,
        fileName: file?.name,
        size: file?.size,
      });
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  };

  // DOCX text extraction
  const extractTextFromDOCX = async (file) => {
    try {
      if (!file || file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        throw new Error("Please upload a valid DOCX file");
      }

      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (!result.value.trim()) {
        throw new Error("No text found in DOCX file");
      }
      return result.value;
    } catch (error) {
      console.error("DOCX Extraction Error:", error);
      throw new Error(`DOCX extraction failed: ${error.message}`);
    }
  };

  // Unified file handler
  const handleFileInput = async (file, setText) => {
    try {
      let text = "";
      if (file.type === "application/pdf") {
        text = await extractTextFromPDF(file);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        text = await extractTextFromDOCX(file);
      } else if (file.type === "text/plain") {
        text = await file.text();
      } else {
        throw new Error("Unsupported file type. Please upload PDF, DOCX, or TXT");
      }
      setText(text);
      setError("");
      setSuccess("File uploaded and text extracted successfully!");
      setTimeout(() => setSuccess(""), 3000); // Clear success message after 3s
    } catch (error) {
      console.error("File Processing Error:", error);
      setError(error.message);
    }
  };

  const handleJobDescriptionInput = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileInput(file, setJobDescription);
    } else {
      setJobDescription(e.target.value);
      setError("");
    }
  };

  const handleResumeInput = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileInput(file, setResumeText);
    } else {
      setResumeText(e.target.value);
      setError("");
    }
  };

  const generateCoverLetter = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please provide both job description and resume.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "api/v1/cover/generate-cover-letter",
        {
          jobDescription,
          resumeText,
          style: coverLetterStyle,
        },
        {
          timeout: 30000,
        }
      );

      if (response.data?.coverLetter) {
        setCoverLetter(response.data.coverLetter);
        setSuccess("Cover letter generated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        throw new Error("No cover letter received from server");
      }
    } catch (error) {
      console.error("API Error:", {
        message: error.message,
        response: error.response?.data,
      });
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to generate cover letter";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const downloadDocx = async () => {
    if (!coverLetter) {
      setError("No cover letter to download.");
      return;
    }

    try {
      const response = await axios.post(
        "http://api.crosscareers.com/cover/generate-docx",
        { content: coverLetter },
        { responseType: "blob", timeout: 15000 }
      );
      saveAs(response.data, "cover_letter.docx");
      setSuccess("Cover letter downloaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("DOCX Generation Error:", error);
      setError("Failed to generate DOCX file");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Professional Cover Letter Generator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Job Description Box */}
          <div className="card bg-white shadow-xl rounded-lg transition-all duration-300 hover:shadow-2xl">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-gray-700 mb-4">
                Job Description
              </h2>
              <textarea
                className="textarea textarea-bordered w-full h-48 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Paste job description here or upload a file..."
                value={jobDescription}
                onChange={handleJobDescriptionInput}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload File (PDF, DOCX, TXT)
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                  onChange={handleJobDescriptionInput}
                  accept=".pdf,.docx,.txt"
                />
              </div>
            </div>
          </div>

          {/* Resume Box */}
          <div className="card bg-white shadow-xl rounded-lg transition-all duration-300 hover:shadow-2xl">
            <div className="card-body p-6">
              <h2 className="card-title text-xl font-semibold text-gray-700 mb-4">
                Resume
              </h2>
              <textarea
                className="textarea textarea-bordered w-full h-48 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                placeholder="Paste resume here or upload a file..."
                value={resumeText}
                onChange={handleResumeInput}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Upload File (PDF, DOCX, TXT)
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600"
                  onChange={handleResumeInput}
                  accept=".pdf,.docx,.txt"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter Style Selection */}
        <div className="card bg-white shadow-xl rounded-lg mb-10 transition-all duration-300 hover:shadow-2xl">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-semibold text-gray-700 mb-4">
              Cover Letter Style
            </h2>
            <select
              className="select select-bordered w-full bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              value={coverLetterStyle}
              onChange={(e) => setCoverLetterStyle(e.target.value)}
            >
              <option value="European">European Style</option>
              <option value="USA">USA Style</option>
              <option value="Worldwide">Worldwide Style</option>
              <option value="Academic">Academic Style</option>
              <option value="Creative">Creative Style</option>
            </select>
          </div>
        </div>

        {/* Success and Error Messages */}
        {success && (
          <div className="alert alert-success shadow-lg mb-6 animate-fade-in">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="ml-2">{success}</span>
            </div>
          </div>
        )}
        {error && (
          <div className="alert alert-error shadow-lg mb-6 animate-fade-in">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-2">{error}</span>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center mb-10">
          <button
            className={`btn btn-primary text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ${
              loading || !jobDescription.trim() || !resumeText.trim()
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:bg-blue-700"
            }`}
            onClick={generateCoverLetter}
            disabled={loading || !jobDescription.trim() || !resumeText.trim()}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Generating...
              </>
            ) : (
              "Create Cover Letter"
            )}
          </button>
        </div>

        {/* Instruction */}
        <div className="text-center mb-8">
          <p className="font-serif text-sm font-semibold text-red-500">
            After downloading your document, please review and adjust as needed.
          </p>
        </div>

        {/* Generated Cover Letter */}
        {coverLetter && (
          <div className="card bg-white shadow-xl rounded-lg mt-8 animate-fade-in transition-all duration-300 hover:shadow-2xl">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-semibold text-gray-700">
                  Generated Cover Letter
                </h2>
                <div className="flex gap-2">
                  <button
                    className="btn btn-secondary btn-sm text-white hover:bg-gray-700"
                    onClick={downloadDocx}
                  >
                    Download DOCX
                  </button>
                </div>
              </div>
              <div className="whitespace-pre-wrap bg-gray-50 p-6 rounded-lg border border-gray-200 max-h-[600px] overflow-y-auto font-serif text-gray-800 leading-relaxed">
                {coverLetter}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cover;