import Navbar from './navbar';
import Footer from './footer';

function DonorOrganizations() {
  const organizations = [
    {
      id: 1,
      name: 'ECHO',
      url: 'https://civil-protection-humanitarian-aid.ec.europa.eu/who/jobs-and-opportunities_en',
      logo: 'https://i.ibb.co/s4DZWnr/1.png'
    },
    {
      id: 2,
      name: 'FCDO',
      url: 'https://fco.tal.net/vx/lang-en-GB/mobile-0/appcentre-ext/brand-2/xf-ba80fc1e6921/candidate/jobboard/vacancy/1/adv/?f_Item_Opportunity_15689_lk=1739',
      logo: 'https://i.ibb.co/yczFfgvs/2.png'
    },
    {
      id: 3,
      name: 'Australian Government - DFAT',
      url: 'https://www.dfat.gov.au/careers',
      logo: 'https://i.ibb.co/fdKXtZbR/3.png'
    },
    {
      id: 4,
      name: 'Australian Council for International Development',
      url: 'https://acfid.asn.au/jobsa',
      logo: 'https://i.ibb.co/CKHrVfbw/4.png'
    },
    {
      id: 5,
      name: 'Norwegian Aid - NORAD',
      url: 'https://www.norad.no/en/careers/careers/',
      logo: 'https://i.ibb.co/ynfwTrgv/5.png'
    },
    {
      id: 6,
      name: 'DANIDA',
      url: 'https://bangladesh.um.dk/en/about-us/job-opportunities/job-vacancy',
      logo: '../public/donor/6.jpg'
    },
    {
      id: 7,
      name: 'Global Affairs Canada (GAC)',
      url: 'https://staffing-les.international.gc.ca/en/search/',
      logo: '../public/donor/7.png'
    },
    {
      id: 8,
      name: 'European Union External Actions (EEAS)',
      url: 'https://www.eeas.europa.eu/eeas/vacancies_en',
      logo: 'https://i.ibb.co/FLWWMJD8/8.png'
    },
    {
      id: 9,
      name: 'Green Climate Fund',
      url: 'https://jobs.greenclimate.fund/?_gl=1*pcx20g*_ga*OTYyODYwNS4xNzM5OTc2Mzc2*_ga_1G93H3NSBL*MTc0MTYyMzc0My4xLjEuMTc0MTYyMzgxOS4wLjAuMA..',
      logo: 'https://i.ibb.co/CKxVtgQW/9.png'
    },
    {
      id: 10,
      name: 'Luxembourg Development Agency',
      url: 'https://luxdev.lu/en/recruitment/definitions',
      logo: 'https://i.ibb.co/N2kBxjtk/10.png'
    },
    {
      id: 11,
      name: 'Agency for Agricultural Development of Morocco',
      url: 'https://www.ada.gov.ma/en/recruitment/Appel%20%C3%A0%20candidature',
      logo: 'https://i.ibb.co/WNTg4wJk/11.png'
    },
    {
      id: 12,
      name: 'Asian Development Bank',
      url: 'https://www.adb.org/work-with-us/careers/current-opportunities',
      logo: 'https://i.ibb.co/5grkDcGp/12.pn'
    },
    {
      id: 13,
      name: 'Asian Infrastructure Investment Bank',
      url: 'https://www.aiib.org/en/opportunities/career/job-vacancies/staff/index.html',
      logo: 'https://i.ibb.co/60HCXXBQ/13.png'
    },
    {
      id: 14,
      name: 'Bhutan Trust Fund',
      url: 'https://www.bhutantrustfund.bt/public_page/announcement_details/27',
      logo: 'https://i.ibb.co/7cBwnY2/14.png'
    },
    {
      id: 15,
      name: 'Conservation International Fund',
      url: 'https://www.conservation.org/about/conservation-international-jobs',
      logo: 'https://i.ibb.co/Q7GmTX9N/15.png'
    },
    {
      id: 16,
      name: 'GIZ Bangladesh',
      url: 'https://www.giz.de/en/jobs/giz_job_opportunities.html',
      logo: 'https://i.ibb.co/S7wmdCR4/16.png'
    },
    {
      id: 17,
      name: 'European Investment Bank',
      url: 'https://www.eib.org/en/about/careers/index',
      logo: 'https://i.ibb.co/kg1W0ZsD/17.png'
    },
    {
      id: 18,
      name: 'Enabel - Belgian Development Agency',
      url: 'https://www.enabel.be/work-with-us/',
      logo: 'https://i.ibb.co/08vWdLz/18.png'
    },
    {
      id: 19,
      name: 'European Bank for Reconstruction and Development',
      url: 'https://www.ebrd.com/careers-at-the-ebrd.html',
      logo: 'https://i.ibb.co/BHSLBcBf/19.png'
    },
    {
      id: 20,
      name: 'World Bank Group',
      url: 'https://worldbankgroup.csod.com/ux/ats/careersite/1/home?c=worldbankgroup',
      logo: 'https://i.ibb.co/zWfXx9qN/20.png'
    },
    {
      id: 21,
      name: 'International Finance Corporation',
      url: 'https://www.ifc.org/en/about/careers',
      logo: 'https://i.ibb.co/dshFzzcn/21.png'
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-900 py-4 text-white mt-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Donor Organizations Jobs in Bangladesh
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Explore career opportunities with international donor organizations operating in Bangladesh
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {organizations.map((org) => (
            <div 
              key={org.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
            >
              <div className="p-6 flex flex-col items-center h-full">
                {/* Logo Container */}
                <div className="h-32 w-full flex items-center justify-center mb-4 p-4">
                  <img 
                    src={org.logo} 
                    alt={org.name} 
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                {/* Organization Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  {org.name}
                </h3>
                
                {/* Visit Button */}
                <div className="mt-auto w-full">
                  <a 
                    href={org.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors duration-300"
                  >
                    Visit Website
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

export default DonorOrganizations;