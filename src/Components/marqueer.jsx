import React from 'react';
import Marquee from 'react-fast-marquee';

const JobPortalMarquee = () => {
  const jobPortals = [
    {
      id: 1,
      name: 'Open for Advertisement',
      url: '',
      logo: 'https://i.ibb.co/bgHchpx6/add.png',
      type: 'image'
    },
    {
      id: 2,
      name: 'Open for Advertisement',
      url: '',
      logo: 'https://i.ibb.co/bgHchpx6/add.png',
      type: 'image'
    }, {
      id: 3,
      name: 'Open for Advertisement',
      url: '',
      logo: 'https://i.ibb.co/bgHchpx6/add.png',
      type: 'image'
    }, {
      id: 4,
      name: 'Open for Advertisement',
      url: '',
      logo: 'https://i.ibb.co/bgHchpx6/add.png',
      type: 'image'
    }, {
      id: 5,
      name: 'Open for Advertisement',
      url: '',
      logo: 'https://i.ibb.co/bgHchpx6/add.png',
      type: 'image'
    }, {
      id: 6,
      name: 'Open for Advertisement',
      url: '',
      logo: 'https://i.ibb.co/bgHchpx6/add.png',
      type: 'image'
    },
    
  ];

  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm mt-20 -mb-20">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap mr-4 hidden md:block">
            Featured Partners:
          </span>
          
          <div className="relative flex-1 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />
            
            <Marquee 
              direction="left" 
              pauseOnHover 
              speed={50}
              gradient={false}
              className="py-2"
            >
              {jobPortals.map((portal) => (
                <div 
                  key={portal.id}
                  className="mx-6 flex items-center justify-center transition-transform duration-300 hover:scale-105"
                >
                  <a 
                    href={portal.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {portal.type === 'image' ? (
                      <img
                        src={portal.logo}
                        alt={portal.name}
                        className="h-8 md:h-10 object-contain max-w-[140px]"
                      />
                    ) : (
                      <span className={`${portal.style}`}>
                        {portal.name}
                      </span>
                    )}
                  </a>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPortalMarquee;