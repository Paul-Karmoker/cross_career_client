// src/pages/Dashboard.js
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/templates');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">My Documents</h1>
      <div className="flex space-x-4 mb-6 border-b">
        <button className="pb-2 border-b-2 border-red-500">Resumes</button>
        <button className="pb-2">Cover Letters</button>
        <button className="pb-2">Resignation Letters</button>
        <button className="pb-2">Websites</button>
      </div>
      <button onClick={handleCreateNew} className="bg-red-500 text-white px-4 py-2 rounded-full mb-6">Create New</button>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sample Resume Cards */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="h-40 bg-gray-200 mb-2"></div> {/* Thumbnail */}
          <h2 className="text-lg font-semibold">Naria Group Resume</h2>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-6 rounded-lg">
          <h2 className="text-xl font-bold">Land a better job with PREMIUM</h2>
          <p>Unlock all templates and AI tools, from USD 4 / month</p>
          <button className="bg-white text-purple-600 px-4 py-2 rounded mt-4">Go Premium</button>
        </div>
        {/* Add more cards as needed */}
      </div>
      <div className="mt-6 border-l-4 border-red-500 pl-4 space-y-2">
        <button className="block text-blue-600">+ New Resume</button>
        <button className="block text-blue-600">+ New Resume with AI</button>
        <button className="block text-blue-600">Import from LinkedIn</button>
        <button className="block text-blue-600">Use Example</button>
      </div>
    </div>
  );
};

export default Dashboard;