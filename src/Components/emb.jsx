import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

function EmbassyJobs() {
  const embassies = [
    {
      id: 1,
      name: 'Embassy of Brazil',
      url: 'https://www.gov.br',
      logo: 'https://i.ibb.co/9k4XkfTC/1.png'
    },
    {
      id: 2,
      name: 'Embassy of Japan',
      url: 'https://www.bd.emb-japan.go.jp/itpr_en/11_000001_00635.html',
      logo: 'https://i.ibb.co/FkfSpzcf/2.png'
    },
    {
      id: 3,
      name: 'Embassy of Sweden',
      url: 'https://www.swedenabroad.se/en/embassies/bangladesh-dhaka/about-us/vacancies/#',
      logo: 'https://i.ibb.co/s9PMmbQG/3.png'
    },
    {
      id: 4,
      name: 'Embassy of Switzerland',
      url: 'https://www.eda.admin.ch/countries/bangladesh/en/home/news/open-job-vacancies.html',
      logo: 'https://i.ibb.co/Pst4QK0j/4.png'
    },
    {
      id: 5,
      name: 'Embassy of China',
      url: 'http://bd.china-embassy.gov.cn/eng/sgxx/',
      logo: 'https://i.ibb.co/TBh8sHNc/5.png'
    },
    {
      id: 6,
      name: 'Embassy of France',
      url: 'https://bd.ambafrance.org/Job-Offer-at-Agence-francaise-de-developpement-AFD',
      logo: 'https://i.ibb.co/hxpT4922/6.png'
    },
    {
      id: 7,
      name: 'Embassy of Indonesia',
      url: 'https://kemlu.go.id/dhaka',
      logo: 'https://i.ibb.co/2Q8cSKR/7.png'
    },
    {
      id: 8,
      name: 'Embassy of Italy',
      url: 'https://ambdhaka.esteri.it/en/news/dall_ambasciata/2024/02/recruitment-notice/',
      logo: 'https://i.ibb.co/bgf9ZvHf/8.png'
    },
    {
      id: 9,
      name: 'Embassy of Korea',
      url: 'https://overseas.mofa.go.kr/bd-en/brd/m_2124/view.do?seq=760021',
      logo: 'https://i.ibb.co/9mFQv4qZ/9.png'
    },
    {
      id: 10,
      name: 'Embassy of Philippines',
      url: 'https://dhakape.dfa.gov.ph/advisories',
      logo: 'https://i.ibb.co/qF22HfPJ/10.jpg'
    },
    {
      id: 11,
      name: 'Australian High Commission',
      url: 'https://bangladesh.embassy.gov.au/daca/JobVacancies.html',
      logo: 'https://i.ibb.co/60p2RWYc/11.png'
    },
    {
      id: 12,
      name: 'Embassy of United States',
      url: 'https://bd.usembassy.gov/jobs/',
      logo: 'https://i.ibb.co/chXRGX1m/12.png'
    },
    {
      id: 13,
      name: 'Royal Bhutanese Embassy',
      url: 'https://www.mfa.gov.bt/rbedhaka/vacancy-announcement/',
      logo: 'https://i.ibb.co/39z0NbMF/13.png'
    },
    {
      id: 14,
      name: 'Embassy of Nepal',
      url: 'https://bd.nepalembassy.gov.np/',
      logo: 'https://giwmscdnone.gov.np/static/assets/image/Emblem_of_Nepal.png'
    },
    {
      id: 15,
      name: 'Embassy of Denmark',
      url: 'https://bangladesh.um.dk/en/about-us/job-opportunities',
      logo: 'https://i.ibb.co/mVnz7JVM/14.jpg'
    },
    {
      id: 16,
      name: 'Embassy of Netherlands',
      url: 'https://www.netherlandsandyou.nl/web/bangladesh/about-us',
      logo: 'https://i.ibb.co/LDjx1sjP/15.jpg'
    },
    {
      id: 17,
      name: 'Royal Norwegian Embassy',
      url: 'https://www.norway.no/en/bangladesh/norway-bangladesh/vacancies/',
      logo: 'https://i.ibb.co/gMRFRfRK/16.png'
    },
    {
      id: 18,
      name: 'Royal Thai Embassy',
      url: 'https://dhaka.thaiembassy.org/en/page/cate-7842-annoucements?menu=5d83296215e39c2540006a0e',
      logo: 'https://i.ibb.co/dshVZRF1/17.png'
    },
    {
      id: 19,
      name: 'Embassy of South Korea',
      url: 'https://overseas.mofa.go.kr/bd-en/brd/m_2124/view.do?seq=760021',
      logo: 'https://i.ibb.co/b5C7Zfsp/18.jpg'
    },
    {
      id: 20,
      name: 'Embassy of Vietnam',
      url: 'https://vnembassy-dhaka.mofa.gov.vn/en-us/embassy/Notice%20from%20the%20Embassy/Pages/default.aspx',
      logo: 'https://i.ibb.co/W4Lgvxx6/19.png'
    },
    {
      id: 21,
      name: 'Embassy of Argentina',
      url: 'https://ebang.cancilleria.gob.ar/es/job-opportunity-embassy',
      logo: 'https://i.ibb.co/67rc57q8/20.jpg'
    },
    {
      id: 22,
      name: 'Embassy of Canada',
      url: 'https://www.jobbank.gc.ca/jobsearch/',
      logo: 'https://i.ibb.co/p6wmNpTb/21.png'
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-6 text-white mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Embassy Jobs in Bangladesh
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Explore career opportunities with foreign embassies and high commissions in Bangladesh
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {embassies.map((embassy) => (
            <div 
              key={embassy.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6 flex flex-col items-center h-full">
                {/* Logo Container */}
                <div className="h-32 w-full flex items-center justify-center mb-4 p-4">
                  <img 
                    src={embassy.logo} 
                    alt={embassy.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                {/* Embassy Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  {embassy.name}
                </h3>
                
                {/* Visit Button */}
                <div className="mt-auto w-full">
                  <a 
                    href={embassy.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors duration-300"
                  >
                    View Opportunities
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

export default EmbassyJobs;