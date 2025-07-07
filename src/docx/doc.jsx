import React, { useState, useRef } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ContentGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [previewContent, setPreviewContent] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const fileInputRef = useRef(null);
  const pasteAreaRef = useRef(null);

  const { register, handleSubmit, control, watch, reset } = useForm({
    defaultValues: {
      contentType: 'blog',
      tone: 'professional',
      wordCount: 500,
      pageCount: 1,
      includeCharts: true,
      includeImages: true,
      userInput: '',
    },
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // File size validation (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }

    setLoading(true);
    try {
      let content = '';
      
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            content += textContent.items.map(item => item.str).join(' ') + '\n';
          }
        } catch (pdfError) {
          console.error('PDF.js extraction failed:', pdfError);
          throw new Error('Failed to extract text from PDF');
        }
      } 
      else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        content = result.value;
      } 
      else if (file.type === 'application/vnd.ms-excel' || 
               file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        content = workbook.SheetNames.map(name => {
          const worksheet = workbook.Sheets[name];
          return XLSX.utils.sheet_to_csv(worksheet);
        }).join('\n\n');
      } 
      else if (file.type === 'text/plain') {
        content = await file.text();
      } else {
        throw new Error('Unsupported file type');
      }

      setFileContent(content);
      toast.success('File processed successfully!');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(`Error processing file: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text/plain');
    setFileContent(prev => prev + pastedText);
    toast.success('Text pasted successfully!');
  };

  const formatContentForDisplay = (content) => {
    if (!content) return null;
    
    return {
      title: content.title || 'Generated Document',
      subtitle: content.subtitle || '',
      sections: content.sections?.map(section => ({
        type: section.type || 'text',
        title: section.title || '',
        content: section.content || '',
        bullets: section.bullets || [],
        style: section.style || 'normal'
      })) || [],
      metadata: content.metadata || {}
    };
  };

  const generateContent = async (data) => {
    if (!fileContent && !data.userInput) {
      toast.error('Please provide input text or upload a file');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://backend-server-deploy.onrender.com/doc/generate-content', {
        ...data,
        sourceText: fileContent || data.userInput,
      });

      const formattedContent = formatContentForDisplay(response.data.content);
      setPreviewContent(formattedContent);
      setActiveTab('preview');
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error(error.response?.data?.error || 'Error generating content');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocx = async () => {
    if (!previewContent) {
      toast.error('No content to download');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://backend-server-deploy.onrender.com/doc/generate-docx', {
        content: previewContent,
        documentType: watch('contentType'),
        style: watch('tone')
      }, { responseType: 'blob' });

      saveAs(response.data, 'generated-content.docx');
      toast.success('Document downloaded successfully!');
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error(error.response?.data?.error || 'Error downloading document');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFileContent('');
    setPreviewContent(null);
    reset();
    setActiveTab('input');
  };

  const renderContentPreview = () => {
    if (!previewContent) return <p>No content available</p>;

    return (
      <div className="space-y-6">
        {previewContent.title && <h1 className="text-2xl font-bold">{previewContent.title}</h1>}
        {previewContent.subtitle && <h2 className="text-xl text-gray-600">{previewContent.subtitle}</h2>}
        
        {previewContent.sections.map((section, index) => (
          <div key={index} className="space-y-3">
            {section.title && (
              <h3 className={
                section.style === 'heading1' ? 'text-xl font-bold' :
                section.style === 'heading2' ? 'text-lg font-semibold' :
                'text-md font-medium'
              }>
                {section.title}
              </h3>
            )}
            
            {section.content && (
              <p className="whitespace-pre-line">{section.content}</p>
            )}
            
            {section.bullets.length > 0 && (
              <ul className="list-disc pl-5">
                {section.bullets.map((bullet, i) => (
                  <li key={i}>{bullet}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Create Your Content
          </h1>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('input')}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'input' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Input
              </button>
              <button
                onClick={() => previewContent && setActiveTab('preview')}
                disabled={!previewContent}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'preview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} ${!previewContent ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Preview
              </button>
            </nav>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'input' ? (
              <form onSubmit={handleSubmit(generateContent)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <select 
                      {...register('contentType')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General Post</option>
                      <option value="concept">Concept Note</option>
                      <option value="project_proposal">Project Proposal</option>
                      <option value="blog">Blog Post</option>
                      <option value="report">Report</option>
                      <option value="article">Article</option>
                      <option value="essay">Essay</option>
                      <option value="summary">Summary</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                    <select 
                      {...register('tone')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="academic">Academic</option>
                      <option value="persuasive">Persuasive</option>
                      <option value="creative">Creative</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Word Count</label>
                    <input 
                      type="number" 
                      {...register('wordCount', { min: 100, max: 5000 })} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Count</label>
                    <input 
                      type="number" 
                      {...register('pageCount', { min: 1, max: 20 })} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input 
                      id="includeCharts"
                      type="checkbox" 
                      {...register('includeCharts')} 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeCharts" className="ml-2 block text-sm text-gray-700">
                      Include Charts/Graphs
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input 
                      id="includeImages"
                      type="checkbox" 
                      {...register('includeImages')} 
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="includeImages" className="ml-2 block text-sm text-gray-700">
                      Include Relevant Images
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Document</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload a file</span>
                          <input 
                            id="file-upload" 
                            name="file-upload" 
                            type="file" 
                            ref={fileInputRef}
                            onChange={handleFileUpload}
                            accept=".docx,.pdf,.xlsx,.xls,.txt"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        DOCX, PDF, Excel, TXT up to 10MB
                      </p>
                    </div>
                  </div>
                  {fileContent && (
                    <div className="mt-2 text-sm text-gray-500">
                      File loaded successfully ({fileContent.length} characters)
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Or Paste Text Here</label>
                  <textarea
                    ref={pasteAreaRef}
                    onPaste={handlePaste}
                    {...register('userInput')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 h-32"
                    placeholder="Type or Paste your content here..."
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Reset Form
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : 'Generate Content'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className='text-center text-red-500 font-bold -mt-4'>Remeber, after Downloading- Please check, update and format as per you need</div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Generated Content Preview</h2>
                  <div className="space-x-2">
                    <button 
                      onClick={downloadDocx}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download DOCX
                    </button>
                    <button
                      onClick={() => setActiveTab('input')}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Back to Input
                    </button>
                  </div>
                </div>
                
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  {renderContentPreview()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGenerator;