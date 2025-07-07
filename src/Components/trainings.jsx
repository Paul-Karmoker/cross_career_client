import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

function Trainings() {
  const trainingWebsites = [
    {
      id: 1,
      name: 'Coursera',
      url: 'https://www.coursera.org/',
      logo: 'https://i.ibb.co/0jFf2MhR/course.png',
      description: 'Professional certificates and degrees from top universities'
    },
    {
      id: 2,
      name: 'edX',
      url: 'https://www.edx.org/',
      logo: 'https://www.edx.org/trademark-logos/edx-logo-elm.svg',
      description: 'Online courses from the world\'s best universities'
    },
    {
      id: 3,
      name: 'Kaya',
      url: 'https://kayaconnect.org/',
      logo: 'https://kayaconnect.org/theme/image.php/humanitarian_academy/theme_humanitarian_academy/1731568967/logo',
      description: 'Humanitarian learning platform with free courses'
    },
    {
      id: 4,
      name: 'InterAction',
      url: 'https://www.interaction.org/training/',
      logo: 'https://translatorswithoutborders.org/wp-content/uploads/2020/10/Interaction-logo.png',
      description: 'Training for humanitarian and development professionals'
    },
    {
      id: 5,
      name: 'HL Academy',
      url: 'https://www.humanitarianleadershipacademy.org/',
      logo: 'https://www.humanitarianleadershipacademy.org/wp-content/uploads/2023/03/HLA-logo.png',
      description: 'Humanitarian leadership and capacity building'
    },
    {
      id: 6,
      name: 'UNITAR',
      url: 'https://www.unitar.org/free-and-open-courses',
      logo: 'https://www.unitar.org/themes/custom/unitar_2018/logo.png',
      description: 'United Nations Institute for Training and Research'
    },
    {
      id: 7,
      name: 'BDR',
      url: 'https://buildingabetterresponse.org/',
      logo: 'https://buildingabetterresponse.org/wp-content/uploads/2022/05/BBR_Logo_Color_RGB.svg',
      description: 'Building a Better Response training'
    },
    {
      id: 8,
      name: 'NLA',
      url: 'https://nla1.org/',
      logo: 'https://nla1.org/wp-content/uploads/2023/10/75th-19-600x600.png.webp',
      description: 'Norwegian Learning Academy'
    },
    {
      id: 9,
      name: 'Humanitarian U',
      url: 'https://humanitarianu.org/prof-dev-courses/',
      logo: 'https://humanitarianu.org/wp-content/uploads/2021/06/HU-logo-no-bg-1024x1024.png',
      description: 'Professional development courses for humanitarians'
    },
    {
      id: 10,
      name: 'DisasterReady',
      url: 'https://www.disasterready.org/',
      logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAentUgp5Ji5w4X6otC3bC6sVHPZ90HMLkXg&s',
      description: 'Free humanitarian and development training'
    },
    {
      id: 11,
      name: 'ReliefWeb',
      url: 'https://reliefweb.int/training',
      logo: 'https://reliefweb.int/themes/custom/common_design_subtheme/img/logos/rw-logo-desktop.svg',
      description: 'Training opportunities in humanitarian sector'
    },
    {
      id: 12,
      name: 'CALP Network',
      url: 'https://www.calpnetwork.org/capacity-building/online-learning/',
      logo: '../train/calp.png',
      description: 'Cash transfer programming training'
    },
    {
      id: 13,
      name: 'ACFID',
      url: 'https://acfid.asn.au/learning/',
      logo: 'https://acfid.asn.au/wp-content/uploads/2022/02/ACFID-logo.svg',
      description: 'Australian Council for International Development'
    },
    {
      id: 14,
      name: 'AHA Trainings',
      url: 'https://aha-trainings.de/certificates/certificate-locally-led-humanitarian-action',
      logo: 'https://aha-trainings.de/images/AHA_Logo_web_rgb.svg',
      description: 'Locally-led humanitarian action training'
    },
    {
      id: 15,
      name: 'Global Institute',
      url: 'https://globalhumanitarianinstitute.org/',
      logo: 'https://globalhumanitarianinstitute.org/wp-content/uploads/2023/04/final-logo.png',
      description: 'Professional humanitarian training'
    },
    {
      id: 16,
      name: 'IDS',
      url: 'https://www.ids.ac.uk/learn-at-ids/',
      logo: 'https://www.ids.ac.uk/wp-content/themes/ids/assets/img/project/logo.svg',
      description: 'Institute of Development Studies'
    },
    {
      id: 17,
      name: 'NPTEL',
      url: 'https://nptel.ac.in/courses',
      logo: 'https://nptel.ac.in/assets/shared/logo-m.jpg',
      description: 'Free online courses from Indian institutions'
    },
    {
      id: 18,
      name: 'Mind Luster',
      url: 'https://www.mindluster.com/',
      logo: 'https://www.mindluster.com/resources/main_logo.png?d',
      description: 'Free online courses and certifications'
    },
    {
      id: 19,
      name: 'OpenLearn Create',
      url: 'https://www.open.edu/openlearncreate/local/ocwfreecourses/freecourse.php',
      logo: '../train/OL.png',
      description: 'Free courses from The Open University'
    },
    {
      id: 20,
      name: 'CASH-Hub',
      url: 'https://cash-hub.org/training-and-development/online-courses/',
      logo: '../train/CH.png',
      description: 'Cash and voucher assistance training'
    },
    {
      id: 21,
      name: 'Tools4Dev',
      url: 'https://tools4dev.org/online-courses/',
      logo: '../train/td.png',
      description: 'Practical resources for development workers'
    },
    {
      id: 22,
      name: 'FutureLearn',
      url: 'https://www.futurelearn.com/',
      logo: '../train/FL.png',
      description: 'Online courses from top universities'
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-6 text-white mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Professional Training Resources
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Explore our curated collection of professional development and training platforms
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {trainingWebsites.map((training) => (
            <div 
              key={training.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6 flex flex-col items-center h-full">
                {/* Logo Container */}
                <div className="h-32 w-full flex items-center justify-center mb-4 p-4">
                  <img 
                    src={training.logo} 
                    alt={training.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                {/* Training Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {training.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 text-center">
                  {training.description}
                </p>
                
                {/* Visit Button */}
                <div className="mt-auto w-full">
                  <a 
                    href={training.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors duration-300"
                  >
                    Explore Courses
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Trainings;