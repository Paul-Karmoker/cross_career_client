import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import * as mammoth from "mammoth";

// Set up the PDF.js worker
GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

const InterviewQuestionsGenerator = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState({
    technical: [],
    situational: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-Level");

  // PDF text extraction
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
        disableStream: true
      }).promise;

      let fullText = "";
      const pageTextPromises = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        pageTextPromises.push(
          pdf.getPage(i).then(async (page) => {
            const content = await page.getTextContent();
            return content.items.map(item => item.str).join(" ") + "\n\n";
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
      console.error("PDF Extraction Error:", error);
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

  // Handle file input
  const handleFileInput = async (file) => {
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
      
      setJobDescription(text);
      setError("");
    } catch (error) {
      console.error("File Processing Error:", error);
      setError(error.message);
    }
  };

  const handleJobDescriptionInput = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileInput(file);
    } else {
      setJobDescription(e.target.value);
    }
  };

  const generateQuestions = async () => {
    if (!jobDescription.trim()) {
      setError("Please provide a job description.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post("https://backend-server-deploy.onrender.com/qa/generate", {
        jobDescription,
        jobTitle,
        experienceLevel,
        requirements: {
          technicalCount: 7,
          situationalCount: 3
        }
      }, {
        timeout: 30000
      });

      if (response.data?.questions) {
        setQuestions(response.data.questions);
      } else {
        throw new Error("No questions received from server");
      }
    } catch (error) {
      console.error("API Error:", {
        message: error.message,
        response: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to generate questions";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Download questions as PDF
  const downloadPdf = () => {
    try {
      const doc = new jsPDF();
      doc.setFont("helvetica");
      
      // Add title
      doc.setFontSize(18);
      doc.text(`Interview Questions for ${jobTitle || "the Position"}`, 105, 20, { align: 'center' });
      
      // Add experience level
      doc.setFontSize(12);
      doc.text(`Experience Level: ${experienceLevel}`, 105, 30, { align: 'center' });
      
      let yPosition = 45;
      
      // Add technical questions section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128); // Navy blue
      doc.text("Technical Questions", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black
      questions.technical.forEach((q, i) => {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${i + 1}. ${q.question}`, 20, yPosition);
        yPosition += 7;
        
        // Split answer into multiple lines if needed
        const answerLines = doc.splitTextToSize(`Answer: ${q.answer}`, 170);
        doc.text(answerLines, 25, yPosition);
        yPosition += (answerLines.length * 7) + 10;
      });
      
      // Add situational questions section
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128); // Navy blue
      doc.text("Situational Questions", 20, yPosition);
      yPosition += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black
      questions.situational.forEach((q, i) => {
        // Check if we need a new page
        if (yPosition > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${i + 1}. ${q.question}`, 20, yPosition);
        yPosition += 7;
        
        // Split answer into multiple lines if needed
        const answerLines = doc.splitTextToSize(`Answer: ${q.answer}`, 170);
        doc.text(answerLines, 25, yPosition);
        yPosition += (answerLines.length * 7) + 10;
      });
      
      doc.save(`Interview_Questions_${jobTitle || ''}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      setError("Failed to generate PDF file");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen mt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl -mt-6 font-bold text-center text-gray-800 mb-8">
          Interview Questions Generator
        </h1>

        <div className="card bg-white shadow-lg rounded-lg mb-8">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-semibold text-gray-700 mb-4">
              Job Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title (Optional)
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Senior Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience Level
                </label>
                <select
                  className="select select-bordered w-full bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                >
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior-Level">Senior-Level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Job Description
            </h3>
            <textarea
              className="textarea textarea-bordered w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Paste job description here or upload your file..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload File (PDF, DOCX, TXT)
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full bg-white border border-gray-300 rounded-lg"
                onChange={handleJobDescriptionInput}
                accept=".pdf,.docx,.txt"
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error shadow-lg mb-6 animate-fade-in">
            <div>
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center mb-8">
          <button
            className={`btn btn-primary text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 ${
              loading ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
            }`}
            onClick={generateQuestions}
            disabled={loading || !jobDescription.trim()}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Generating Questions...
              </>
            ) : (
              "Generate Questions"
            )}
          </button>
        </div>

        {/* Generated Questions */}
        {questions.technical.length > 0 && (
          <div className="card bg-white shadow-lg rounded-lg mt-8 animate-fade-in">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="card-title text-xl font-semibold text-gray-700">
                  Generated Interview Questions
                </h2>
                <button
                  className="btn btn-accent"
                  onClick={downloadPdf}
                >
                  Download PDF
                </button>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Technical Questions (7)</h3>
                <div className="space-y-4">
                  {questions.technical.map((q, i) => (
                    <div key={`tech-${i}`} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-800">{i + 1}. {q.question}</p>
                      <p className="mt-2 text-gray-600"><span className="font-semibold">Answer:</span> {q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Situational Questions (3)</h3>
                <div className="space-y-4">
                  {questions.situational.map((q, i) => (
                    <div key={`sit-${i}`} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="font-medium text-gray-800">{i + 1}. {q.question}</p>
                      <p className="mt-2 text-gray-600"><span className="font-semibold">Answer:</span> {q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestionsGenerator;