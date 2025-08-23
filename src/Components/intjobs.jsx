import { useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';









function IntJobs() {
  const jobSites = [
    {
      id: 1,
      name: 'Reliefweb',
      url: 'https://reliefweb.int/jobs',
      image: 'https://reliefweb.int/themes/custom/common_design_subtheme/img/logos/rw-logo-desktop.svg',
      category: 'Humanitarian'
    },
    {
      id: 2,
      name: 'Idealist',
      url: 'https://www.idealist.org/en',
      image: 'https://www.idealist.org/assets/b8509b56fd9bdacd8b367a86fa5a1481ab19099f/images/logos/logo-idealist.svg',
      category: 'Nonprofit'
    },
    {
      id: 3,
      name: 'Impactpool',
      url: 'https://www.impactpool.org/',
      image: 'https://i.ibb.co/DHvsmtqQ/2.png',
      category: 'International'
    },
    {
      id: 4,
      name: 'DEVEX',
      url: 'https://www.devex.com/jobs/search',
      image: 'https://i.ibb.co/Kp53TmHW/1.png',
      category: 'Development'
    },
    {
      id: 5,
      name: 'DevNetJOBS.org',
      url: 'https://devnetjobs.org/',
      image: 'https://i.ibb.co/8nyTjyR7/3.png',
      category: 'Development'
    },
    {
      id: 6,
      name: 'Coordination SUD',
      url: 'https://www.coordinationsud.org/espace-emploi/',
      image: 'https://i.ibb.co/GQCDCNV4/4.png',
      category: 'Humanitarian'
    },
    {
      id: 7,
      name: 'UN Careers',
      url: 'https://careers.un.org/area-of-expertise?language=en',
      image: 'https://i.ibb.co/My9kyq6V/5.png',
      category: 'UN System'
    },
    {
      id: 8,
      name: 'Inspira',
      url: 'https://inspira.un.org/psp/PUNA1J/?cmd=login&languageCd=ENG',
      image: 'https://i.ibb.co/xSzSSjP2/6.png',
      category: 'UN System'
    },
    {
      id: 9,
      name: 'UNjobs.org',
      url: 'https://unjobs.org/duty_stations/bangladesh',
      image: 'https://i.ibb.co/Ng3hbjqD/7.png',
      category: 'UN System'
    },
    {
      id: 10,
      name: 'Development Aid',
      url: 'https://www.developmentaid.org/jobs/search?sort=highlighted.desc,postedDate.desc&sectors=12',
      image: 'https://i.ibb.co/S4jLD2L9/8.png',
      category: 'Development'
    },
    {
      id: 11,
      name: 'UNjobs.net',
      url: 'https://www.unjobnet.org/',
      image: 'https://i.ibb.co/qMBhxSVm/9.png',
      category: 'UN System'
    },
    


    {
      id: 12,
      name: 'UN Talent',
      url: 'https://untalent.org/jobs',
      image: 'https://i.ibb.co/5gb1KscJ/10.png',
      category: 'UN System'
    },
    {
      id: 13,
      name: 'Humanitarian Logistics Association',
      url: 'https://www.humanitarianlogistics.org/jobs?search=&selectMatch=0&selectCat=0&selectOrg%5B%5D=Church+World+Service&inp_start=all&sel_eventtype=&sel_restrict_attend=&selectRegion=&selectCountry=&sel_delivery_mode=&sel_event_fee=&selectRegion=&post_type=jobs&formsubmit=SEARCH',
      image: 'https://i.ibb.co/Jws34q17/11.png',
      category: 'Humanitarian'
    }
  ];

  // State for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 12;

  // Extract unique categories for filter buttons
  const categories = ['All', ...new Set(jobSites.map(site => site.category))];

  // Filter job sites based on selected category and search term
  const filteredSites = jobSites.filter(site => {
    const matchesCategory = selectedCategory === 'All' || site.category === selectedCategory;
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSites = filteredSites.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle category filter
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-6 text-white mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            International Jobs Websites
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Explore career opportunities through leading international job portals
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8">
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <input
              type="text"
              placeholder="Search job sites by name..."
              className="w-full px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category, index) => (
              <button 
                key={index}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Job Sites Grid */}
        {currentSites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {currentSites.map((site) => (
                <div 
                  key={site.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="p-6 flex flex-col items-center h-full">
                    {/* Site Logo */}
                    <figure className="mb-4 w-32 h-32 flex items-center justify-center">
                      <img
                        src={site.image}
                        alt={site.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </figure>
                    
                    {/* Site Name */}
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                      {site.name}
                    </h3>
                    
                    {/* Category Badge */}
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full mb-4">
                      {site.category}
                    </span>
                    
                    {/* Visit Button */}
                    <div className="mt-auto w-full">
                      <a 
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors duration-300"
                      >
                        Visit Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 border border-gray-300 rounded-md ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === number 
                          ? 'bg-blue-600 text-white' 
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 border border-gray-300 rounded-md ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No job sites found matching your criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default IntJobs;