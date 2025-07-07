// ExcelGenerator.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { toast } from 'react-hot-toast';

const ExcelGenerator = () => {
  const [inputText, setInputText] = useState('');
  const [formatInstructions, setFormatInstructions] = useState('');
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success(`File "${acceptedFiles[0].name}" ready for upload`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: () => {
      toast.error('File rejected. Please check type (PDF, DOCX, XLSX, TXT) and size (<10MB)');
    }
  });

  const generateExcel = async () => {
    if (!inputText.trim() && !file) {
      toast.error('Please provide input text or upload a file');
      return;
    }
    
    if (!formatInstructions.trim()) {
      toast.error('Please provide format instructions for the AI');
      return;
    }
  
    setIsLoading(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      }
      formData.append('inputText', inputText);
      formData.append('formatInstructions', formatInstructions);

      // Using environment variable for API base URL with fallback
      const apiBaseUrl = process.env.REACT_APP_API_URL || 'https://backend-server-deploy.onrender.com';
      const response = await axios.post(
        `${apiBaseUrl}/excel/generate-excel`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          responseType: 'blob',
          timeout: 30000 // 30 seconds timeout
        }
      );

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(response.data, `ai-generated-template-${timestamp}.xlsx`);
      toast.success('AI has generated your Excel template!');
    } catch (error) {
      let errorMessage = 'Failed to generate Excel file';
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 413) {
          errorMessage = 'File too large (max 10MB)';
        } else if (error.response.status === 400) {
          errorMessage = error.response.data.error || 'Invalid request';
        } else if (error.response.data && error.response.data instanceof Blob) {
          // Handle blob errors (might contain error message)
          const errorText = await error.response.data.text();
          try {
            const errorJson = JSON.parse(errorText);
            errorMessage = errorJson.error || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
        }
      } else if (error.request) {
        // Request was made but no response
        errorMessage = 'No response from server. Please try again.';
      } else {
        // Other errors
        errorMessage = error.message || errorMessage;
      }

      toast.error(`Error: ${errorMessage}`);
      console.error('API Error Details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setInputText('');
    setFormatInstructions('');
    setFile(null);
    toast.success('All inputs cleared');
  };

  const removeFile = () => {
    setFile(null);
    toast.success('File removed');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 mb-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered Excel Template Generator</h1>
      <p className="text-gray-600 mb-6">
        Describe your needs or upload a file, and our AI will create a professional Excel template for you.
      </p>

      <div className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload File (Optional)
          </label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-700 mb-2">{file.name}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove File
                </button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600">
                  {isDragActive ? 'Drop the file here' : 'Drag & drop a file here, or click to select'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Supports: PDF, DOCX, XLSX, TXT (Max 10MB)
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
          </div>
        </div>

        {/* Input Text */}
        <div>
          <label htmlFor="inputText" className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Needs
          </label>
          <textarea
            id="inputText"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Paste your text here or describe the data you want to organize..."
            disabled={isLoading}
          />
        </div>

        {/* Format Instructions */}
        <div>
          <label htmlFor="formatInstructions" className="block text-sm font-medium text-gray-700 mb-2">
            Format Instructions (Required)
          </label>
          <textarea
            id="formatInstructions"
            value={formatInstructions}
            onChange={(e) => setFormatInstructions(e.target.value)}
            className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Describe exactly how you want the Excel file formatted (columns, formulas, colors, etc.)"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Example: "Create a monitoring report with columns for Date, Subject, Area, Male, Female, Total and Trainer. 
            Add formulas to calculate Total (Male + Female) and a summary row at the bottom. Use blue headers with white text."
          </p>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 pt-2">
          <button
            onClick={generateExcel}
            disabled={isLoading || (!inputText && !file) || !formatInstructions}
            className={`px-6 py-3 rounded-md text-white font-medium flex items-center justify-center ${
              isLoading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 transition-colors'
            } ${
              (!inputText && !file) || !formatInstructions 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                AI is generating...
              </>
            ) : (
              'Generate Excel with AI'
            )}
          </button>
          <button
            onClick={clearAll}
            disabled={isLoading}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>

        {/* Status Message */}
        <div className="pt-2">
          <p className='font-serif text-sm font-bold text-red-500 text-center'>
            After downloading, please review and adjust the AI-generated template as needed.
          </p>
        </div>

        {/* Tips */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-medium text-blue-800 mb-2">Tips for Best AI Results:</h3>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            <li><strong>Be specific:</strong> Clearly describe columns, data types, and relationships</li>
            <li><strong>Formulas matter:</strong> Specify calculations like "Total = Male + Female"</li>
            <li><strong>Formatting:</strong> Request colors, fonts, borders, and styles</li>
            <li><strong>Structure:</strong> Mention if you need headers, footers, or multiple sheets</li>
            <li><strong>Validation:</strong> Ask for dropdown menus or data validation rules if needed</li>
          </ul>
        </div>

        {/* AI Notice */}
        <div className="text-xs text-gray-500 text-center mt-4">
          <p>This tool uses Gemini AI to analyze your input and create customized Excel templates.</p>
          <p>Results may vary based on the clarity of your instructions.</p>
        </div>
      </div>
    </div>
  );
};

export default ExcelGenerator;