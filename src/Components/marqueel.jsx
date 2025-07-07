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
    <div className="bg-gray-50 dark:bg-gray-900 shadow-inner">
      <div className="container mx-auto px-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-50 to-transparent dark:from-gray-900 z-10" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 z-10" />
          
          <Marquee 
            direction="right" 
            pauseOnHover 
            speed={50}
            gradient={false}
            className="py-4"
          >
            {jobPortals.map((portal) => (
              <div 
                key={portal.id}
                className="mx-6 flex items-center justify-center transition-all hover:scale-105"
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
                      className="h-12 object-contain max-w-[180px] transition-all"
                    />
                  ) : (
                    <span className={`text-2xl font-bold px-4 py-2 rounded-lg ${portal.style}`}>
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
  );
};

export default JobPortalMarquee;