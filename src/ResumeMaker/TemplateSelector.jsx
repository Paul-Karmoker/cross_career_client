// src/pages/TemplateSelector.jsx
import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setTemplate } from '../context/resumeSlice';

const templates = [
  { name: 'Smart', class: 'bg-white font-sans text-gray-800 shadow-inner', preview: 'bg-gradient-to-br from-gray-100 to-white' },
  { name: 'Sharp', class: 'bg-gray-100 font-serif border-l-4 border-gray-300', preview: 'bg-gray-200 border-l-4' },
  { name: 'OATS', class: 'bg-white grid-cols-2 gap-4', preview: 'bg-white grid grid-cols-2 gap-2' },
  { name: 'Classy', class: 'bg-ivory font-serif text-brown-700', preview: 'bg-ivory text-brown-700' },
  { name: 'Bubbles', class: 'bg-blue-50 rounded-full p-2', preview: 'bg-blue-50 rounded-full' },
  { name: 'Ladder', class: 'bg-white border-t-2 border-gray-200', preview: 'bg-white border-t-2' },
  { name: 'White', class: 'bg-white text-black', preview: 'bg-white' },
  { name: 'Imessage', class: 'bg-gray-100 text-blue-600', preview: 'bg-gray-100 text-blue-600' },
  { name: 'Puddle', class: 'bg-gradient-to-r from-blue-400 to-purple-500', preview: 'bg-gradient-to-r from-blue-400 to-purple-500' },
  { name: 'Themis', class: 'bg-gray-800 text-white', preview: 'bg-gray-800 text-white' },
  { name: 'Traditional', class: 'bg-white font-serif', preview: 'bg-white font-serif' },
  { name: 'Minimalist', class: 'bg-white text-sm', preview: 'bg-white text-sm' },
  { name: 'Combined', class: 'bg-gray-50 flex flex-col', preview: 'bg-gray-50 flex flex-col' },
  { name: 'Harry Hanson', class: 'bg-yellow-50 text-gray-800', preview: 'bg-yellow-50' },
  { name: 'Ella Elmer', class: 'bg-white text-indigo-600', preview: 'bg-white text-indigo-600' },
  { name: 'Martha Valer', class: 'bg-gray-200 text-purple-700', preview: 'bg-gray-200 text-purple-700' },
];

const TemplateSelector = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentTemplate = useSelector((state) => state.resume.template);

  // Sync local state with Redux state on mount
  useEffect(() => {
    if (currentTemplate && !selectedTemplate) {
      setSelectedTemplate(currentTemplate);
    }
  }, [currentTemplate, selectedTemplate]);

  const handleSelect = (template) => {
    setSelectedTemplate(template.name);
    dispatch(setTemplate(template.name));
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      navigate('/editor'); // Navigate with a sample resumeId
    } else {
      alert('Please select a template before proceeding!');
    }
  };

  const handleSkip = () => {
    navigate('/editor'); // Skip to editor with default template
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Choose Your Resume Template</h1>
      <p className="text-gray-600 mb-6">Select a modern design to showcase your skills and experience.</p>

      {/* Filter Dropdown */}
      <select
        aria-label="Filter templates by profession"
        className="w-full md:w-1/3 mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => handleSelect(templates.find(t => t.name === e.target.value) || null)}
        value={selectedTemplate || ''}
      >
        <option value="">Filter by Profession or Select Template</option>
        {templates.map((temp) => (
          <option key={temp.name} value={temp.name}>
            {temp.name}
          </option>
        ))}
      </select>

      {/* Template Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {templates.map((temp) => (
          <div
            key={temp.name}
            className={`border-2 ${selectedTemplate === temp.name ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'} rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md`}
            onClick={() => handleSelect(temp)}
            onKeyPress={(e) => e.key === 'Enter' && handleSelect(temp)} // Keyboard accessibility
            tabIndex={0}
            role="button"
            aria-label={`Select ${temp.name} template`}
          >
            <div className={`h-48 mb-4 ${temp.preview} flex items-center justify-center text-center rounded-md`}>
              <span className="text-lg font-medium text-gray-700">{temp.name} Preview</span>
            </div>
            <h3 className="text-center font-semibold text-gray-800">{temp.name}</h3>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 flex justify-between items-center">
        <button
          className="text-gray-500 hover:text-gray-700 underline transition-colors"
          onClick={handleSkip}
          aria-label="Skip template selection"
        >
          Skip for Now
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-gray-400"
          onClick={handleConfirm}
          disabled={!selectedTemplate}
          aria-label="Confirm selected template"
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;