import React, { useState, useEffect } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { motion } from "framer-motion";

function JobTrainingPortals() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.645, 0.045, 0.355, 1)",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false
        }
      }
    ]
  };

  const nationalJobSites = [
    {
      id: 1,
      name: 'BDJOBS',
      url: 'https://bdjobs.com/',
      logo: 'https://bdjobs.com/images/logo.png',
      category: 'National'
    },
    {
      id: 2,
      name: 'Skill Jobs',
      url: 'https://skill.jobs/',
      logo: 'https://skill.jobs/images/logo-01-01-01-01.png',
      category: 'National'
    },
    {
      id: 3,
      name: 'MyJobs',
      url: 'https://www.myjobs.com.bd/',
      logo: 'https://www.myjobs.com.bd/media/front-end/img/main-logo.png',
      category: 'National'
    },
    {
      id: 4,
      name: 'eJobs',
      url: 'https://www.ejobs.com.bd/',
      logo: 'https://www.ejobs.com.bd/images/logo.png',
      category: 'National'
    },
    {
      id: 5,
      name: 'Teletalk All Jobs',
      url: 'https://alljobs.teletalk.com.bd/',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRFUgbjYu-gsviQMoecCi60uUXXXF9anBrAA&s',
      category: 'National'
    },
    {
      id: 6,
      name: 'Jobs.com.bd',
      url: 'http://www.job.com.bd/',
      logo: 'http://job.com.bd/images/logo.gif',
      category: 'National'
    },
    {
      id: 7,
      name: 'CrossCareers',
      url: '/bdjobs',
      logo: 'https://i.ibb.co/Y75Y5NSb/banner.gif',
      category: 'National'
    }
  ];

  const internationalJobSites = [
    {
      id: 1,
      name: 'ReliefWeb',
      url: 'https://reliefweb.int/jobs',
      logo: 'https://reliefweb.int/themes/custom/common_design_subtheme/img/logos/rw-logo-desktop.svg',
      category: 'International'
    },
    {
      id: 2,
      name: 'Idealist',
      url: 'https://www.idealist.org/en',
      logo: 'https://www.idealist.org/assets/b8509b56fd9bdacd8b367a86fa5a1481ab19099f/images/logos/logo-idealist.svg',
      category: 'International'
    },
    {
      id: 3,
      name: 'Impactpool',
      url: 'https://www.impactpool.org/',
      logo: 'https://i.ibb.co/DHvsmtqQ/2.png',
      category: 'International'
    },
    {
      id: 4,
      name: 'Devex',
      url: 'https://www.devex.com/jobs/search',
      logo: 'https://i.ibb.co/N85f06w/dev.png',
      category: 'International'
    },
    {
      id: 5,
      name: 'DevNetJOBS',
      url: 'https://devnetjobs.org/',
      logo: 'https://i.ibb.co/cKvPr0B4/DJ.png',
      category: 'International'
    },
    {
      id: 6,
      name: 'CrossCareers',
      url: '/intjobs',
      logo: 'https://i.ibb.co/Y75Y5NSb/banner.gif',
      category: 'International'
    }
  ];

  const trainingSites = [
    {
      id: 1,
      name: 'Coursera',
      url: 'https://www.coursera.org/',
      logo: 'https://i.ibb.co/1GjPmFww/course.png',
      category: 'Training'
    },
    {
      id: 2,
      name: 'Kaya',
      url: 'https://kayaconnect.org/',
      logo: 'https://kayaconnect.org/theme/image.php/humanitarian_academy/theme_humanitarian_academy/1731568967/logo',
      category: 'Training'
    },
    {
      id: 3,
      name: 'EdX',
      url: 'https://www.edx.org/',
      logo: 'https://www.edx.org/trademark-logos/edx-logo-elm.svg',
      category: 'Training'
    },
    {
      id: 4,
      name: 'Tools4Dev',
      url: 'https://tools4dev.org/online-courses/',
      logo: 'https://tools4dev.org/wp-content/uploads/Header-image-long3_psd.png.webp',
      category: 'Training'
    },
    {
      id: 5,
      name: 'Udemy',
      url: 'https://www.udemy.com/',
      logo: 'https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg',
      category: 'Training'
    },
    {
      id: 6,
      name: 'CrossCareers',
      url: '/paid',
      logo: 'https://i.ibb.co/Y75Y5NSb/banner.gif',
      category: 'Training'
    }
  ];

  const Card = ({ site, buttonText = "Visit Site" }) => (
    <motion.div 
      className="px-2 py-4"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col border border-gray-100 overflow-hidden">
        <div className="p-4 flex-grow flex flex-col items-center">
          <div className="h-20 w-full flex items-center justify-center mb-4 p-2">
            <img 
              src={site.logo} 
              alt={site.name} 
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150x75?text=Logo+Not+Found";
              }}
            />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2 text-center">
            {site.name}
          </h3>
          <p className="text-xs text-gray-500 mb-4">{site.category}</p>
        </div>
        <div className="px-4 pb-4 w-full">
          <a 
            href={site.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-md text-center transition-all duration-300 shadow-sm hover:shadow-md"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </motion.div>
  );

  const SectionTitle = ({ children }) => (
    <motion.h2 
      className="text-3xl font-bold text-gray-800 mb-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
      <div className="w-20 h-1 bg-blue-500 mx-auto mt-4 rounded-full"></div>
    </motion.h2>
  );

  const LoadingSkeleton = () => (
    <div className="px-2 py-4">
      <div className="bg-gray-100 rounded-lg h-64 animate-pulse"></div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* National Job Portals Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 -mt-8 -mb-4">
          <SectionTitle>National Job Portals</SectionTitle>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Slider {...settings}>
              {nationalJobSites.map((site) => (
                <Card key={site.id} site={site} buttonText="Browse Jobs" />
              ))}
            </Slider>
          </motion.div>
        </div>
      </section>

      {/* International Job Portals Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 -mt-8 -mb-4">
          <SectionTitle>International Job Portals</SectionTitle>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Slider {...settings}>
              {internationalJobSites.map((site) => (
                <Card key={site.id} site={site} buttonText="Explore Opportunities" />
              ))}
            </Slider>
          </motion.div>
        </div>
      </section>

      {/* Training Portals Section */}
      <section className="py-12">
        <div className="container mx-auto px-4 -mt-8 -mb-4">
          <SectionTitle>Training Opportunities</SectionTitle>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Slider {...settings}>
              {trainingSites.map((site) => (
                <Card key={site.id} site={site} buttonText="View Courses" />
              ))}
            </Slider>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default JobTrainingPortals;