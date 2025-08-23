import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { FiUpload, FiCopy, FiDownload } from 'react-icons/fi';
import { FaYoutube, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import mammoth from 'mammoth';

const PPTGenerator = () => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [presentationId, setPresentationId] = useState(null);
  const [activeTab, setActiveTab] = useState('text');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const fileInputRef = useRef(null);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      slideCount: 10,
      design: 'modern',
      includeCharts: true,
      includeTables: true,
      includeIcons: true
    }
  });


  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    if (file.type === 'application/pdf') {
      extractTextFromPDF(file);
      setActiveTab('pdf');
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractTextFromDocx(file);
      setActiveTab('docx');
    } else if (file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContent(event.target.result);
        toast.success('Text file uploaded successfully!');
      };
      reader.readAsText(file);
    } else {
      toast.error('Unsupported file type');
    }
  };

  const extractTextFromPDF = async (file) => {
    const toastId = toast.loading('Extracting text from PDF...');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      // eslint-disable-next-line no-undef
      const pdfData = await pdf(data);
      setContent(pdfData.text);
      toast.dismiss(toastId);
      toast.success('PDF content extracted!');
    } catch (error) {
      console.error('PDF extraction error:', error);
      toast.dismiss(toastId);
      toast.error('Failed to extract PDF content');
    }
  };
  
  const extractTextFromDocx = async (file) => {
    const toastId = toast.loading('Extracting text from Word document...');
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      setContent(result.value);
      toast.dismiss(toastId);
      toast.success('Word content extracted!');
    } catch (error) {
      console.error('DOCX extraction error:', error);
      toast.dismiss(toastId);
      toast.error('Failed to extract Word document content');
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text/plain');
    if (pastedText) {
      setContent(pastedText);
      toast.success('Content pasted successfully!');
    }
  };

  const handleYoutubeSubmit = (e) => {
    e.preventDefault();
    if (!youtubeUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    toast.loading('Extracting transcript from YouTube video...');
    setTimeout(() => {
      setContent("Transcript from YouTube video would appear here");
      toast.dismiss();
      toast.success('YouTube transcript extracted!');
    }, 3000);
  };

  const onSubmit = async (data) => {
    if (!content.trim()) {
      toast.error('Please upload content or paste text');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating your presentation...');

    try {
      const response = await axios.post('http://api.crosscareers.com/api/v1/ppt/generate', {
        content,
        slideCount: data.slideCount,
        design: data.design,
        generateNarrative: true,
        includeVisuals: true,
        includeCharts: data.includeCharts,
        includeTables: data.includeTables,
        includeIcons: data.includeIcons,
        chartTypes: ['bar', 'pie', 'line'], // Specify chart types to include
        tableStyles: ['modern', 'colorful'], // Specify table styles
        iconSets: ['business', 'technology', 'finance'] // Specify icon categories
      });

      setPresentationId(response.data.id);
      toast.dismiss(toastId);
      toast.success('Presentation generated successfully!');
    } catch (error) {
      console.error('Error generating PPT:', error);
      toast.dismiss(toastId);
      toast.error('Failed to generate presentation');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPPT = async () => {
    if (!presentationId) return;
    
    const toastId = toast.loading('Preparing PPTX download...');
    try {
      const response = await axios.get(
        `http://api.crosscareers.com/api/v1/ppt/download/pptx/${presentationId}`,
        { responseType: 'blob' }
      );
      
      const url = URL.createObjectURL(response.data);
      saveAs(url, `presentation.pptx`);
      toast.dismiss(toastId);
      toast.success('Downloading PPTX...');
    } catch (error) {
      console.error('Error downloading PPTX:', error);
      toast.dismiss(toastId);
      toast.error('Failed to download PPTX');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 -mt-8">
        <div className="text-center mb-8 -mt-2">
          <h1 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            PowerPoint Presentation Generator
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Transform any content into stunning presentations with charts, tables, and visuals
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* Enhanced Input Source Tabs */}
            <div className="border-b border-gray-200">
              <nav className="grid grid-cols-4 gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('text')}
                  className={`flex items-center justify-center py-3 px-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
                    activeTab === 'text'
                      ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FiCopy className="mr-2" />
                  Text
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('youtube')}
                  className={`flex items-center justify-center py-3 px-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
                    activeTab === 'youtube'
                      ? 'bg-red-100 text-red-700 border-b-2 border-red-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaYoutube className="mr-2" />
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('docx');
                    fileInputRef.current?.click();
                  }}
                  className={`flex items-center justify-center py-3 px-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
                    activeTab === 'docx'
                      ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaFileWord className="mr-2" />
                  Word
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    accept=".docx"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('pdf');
                    fileInputRef.current?.click();
                  }}
                  className={`flex items-center justify-center py-3 px-2 text-sm font-medium rounded-t-lg transition-all duration-300 ${
                    activeTab === 'pdf'
                      ? 'bg-red-100 text-red-700 border-b-2 border-red-500 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaFilePdf className="mr-2" />
                  PDF
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    accept=".pdf"
                  />
                </button>
              </nav>
            </div>

            {/* Content Input Areas */}
            {activeTab === 'text' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-300">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Paste your content below
                </label>
                <textarea
                  id="content"
                  name="content"
                  rows={8}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-3 border transition duration-150 ease-in-out"
                  placeholder="Paste your presentation content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onPaste={handlePaste}
                />
              </div>
            )}

            {activeTab === 'youtube' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-300">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Video URL
                </label>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Paste YouTube video URL (e.g., https://youtube.com/watch?v=...)"
                    className="flex-1 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border transition duration-150 ease-in-out"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleYoutubeSubmit}
                    className="ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                  >
                    Extract
                  </button>
                </div>
                {content && (
                  <div className="mt-4 p-3 bg-white rounded-md border border-gray-200 transition duration-150 ease-in-out">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Content:</h4>
                    <p className="text-sm text-gray-600">{content}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'docx' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center transition-all duration-300">
                <FaFileWord className="mx-auto h-12 w-12 text-blue-600 mb-4 transition duration-150 ease-in-out" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Word Document</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your .docx file here, or click to browse
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  <FiUpload className="mr-2" />
                  Select Word File
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    accept=".docx"
                  />
                </button>
                {content && (
                  <div className="mt-4 p-3 bg-white rounded-md border border-gray-200 transition duration-150 ease-in-out">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Content:</h4>
                    <p className="text-sm text-gray-600">{content}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pdf' && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center transition-all duration-300">
                <FaFilePdf className="mx-auto h-12 w-12 text-red-500 mb-4 transition duration-150 ease-in-out" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload PDF Document</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drag and drop your .pdf file here, or click to browse
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
                >
                  <FiUpload className="mr-2" />
                  Select PDF File
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                    accept=".pdf"
                  />
                </button>
                {content && (
                  <div className="mt-4 p-3 bg-white rounded-md border border-gray-200 transition duration-150 ease-in-out">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Extracted Content:</h4>
                    <p className="text-sm text-gray-600">{content}</p>
                  </div>
                )}
              </div>
            )}

            {/* Presentation Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="slideCount" className="block text-sm font-medium text-gray-700">
                  Number of Slides
                </label>
                <select
                  id="slideCount"
                  name="slideCount"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition duration-150 ease-in-out"
                  {...register('slideCount', { min: 3, max: 45 })}
                >
                  {[...Array(43)].map((_, i) => (
                    <option key={i + 3} value={i + 3}>
                      {i + 3}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="design" className="block text-sm font-medium text-gray-700">
                  Design Style
                </label>
                <select
                  id="design"
                  name="design"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md transition duration-150 ease-in-out"
                  {...register('design')}
                >
                  <option value="modern">Modern</option>
                  <option value="professional">Professional</option>
                  <option value="creative">Creative</option>
                  <option value="minimalist">Minimalist</option>
                </select>
              </div>
            </div>

            {/* Visual Elements Options */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Visual Elements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeCharts"
                      name="includeCharts"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      {...register('includeCharts')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeCharts" className="font-medium text-gray-700">
                      Include Charts
                    </label>
                    <p className="text-gray-500">Bar, pie, and line charts</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeTables"
                      name="includeTables"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      {...register('includeTables')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeTables" className="font-medium text-gray-700">
                      Include Tables
                    </label>
                    <p className="text-gray-500">Colorful, formatted tables</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="includeIcons"
                      name="includeIcons"
                      type="checkbox"
                      className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      {...register('includeIcons')}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="includeIcons" className="font-medium text-gray-700">
                      Include Icons & Shapes
                    </label>
                    <p className="text-gray-500">Modern symbols and visuals</p>
                  </div>
                </div>
              </div>
            </div>

            {content && (
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 transition duration-150 ease-in-out">
                <h3 className="text-sm font-medium text-indigo-800 mb-2">Presentation Features</h3>
                <ul className="list-disc pl-5 text-sm text-indigo-700 space-y-1">
                  <li>Bullet points with concise AI-generated narratives</li>
                  <li>Automatically generated slide designs based on content</li>
                  <li>Consistent color schemes and typography</li>
                  <li>Data visualization with charts and graphs</li>
                  <li>Colorful, formatted tables for data presentation</li>
                  <li>Modern icons and shapes to enhance visual appeal</li>
                </ul>
              </div>
            )}
        {/* instruction*/ }
        <div>
          <p className='-mt-2 -mb-2 font-serif text-sm font-bold text-red-500 text-center'> After download your document, please check and adjust as per your need.</p>
        </div>
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isGenerating || !content.trim()}
                className={`inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${
                  (isGenerating || !content.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : 'Generate Presentation'}
              </button>
            </div>
          </div>
        </form>

        {presentationId && (
          <div className="mt-8 border-t pt-6 transition duration-150 ease-in-out">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your presentation is ready!</h3>
            <div className="flex justify-center">
              <button
                onClick={downloadPPT}
                className="relative inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150 ease-in-out"
              >
                <FiDownload className="mr-2" />
                Download PPT
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500 transition duration-150 ease-in-out">
        <p>This presentation includes bullet points with supporting narratives, charts, tables, and visual elements.</p>
      </div>
    </div>
  );
};

export default PPTGenerator;