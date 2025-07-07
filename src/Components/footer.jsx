import { FaLinkedin, FaYoutube, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <FaLinkedin size={20} />, url: "https://linkedin.com/company/youth-in-development" },
    { icon: <FaYoutube size={20} />, url: "https://youtube.com/youth-in-development" },
    { icon: <FaFacebook size={20} />, url: "https://facebook.com/youth-in-development" },
    { icon: <FaTwitter size={20} />, url: "https://twitter.com/youthindev" },
    { icon: <FaInstagram size={20} />, url: "https://instagram.com/youth_in_development" }
  ];

  const paymentMethods = [
    
    { icon: <img src="https://i.ibb.co/M5NmvgDZ/bkash-logo-png-seeklogo-382709.png" alt="Nagad"  /> },
    { icon: <img src="https://i.ibb.co/VYt0Cxpb/Nagad-Logo-wine-1.png" alt="Rocket"  />},
    { icon: <img src="https://i.ibb.co/GX5WMnv/dutch-bangla-rocket-logo-png-seeklogo-317692-1.png" alt="Visa"  /> },
  
  ];

  const footerLinks = [
    { label: "About", path: "/about" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy & Payment Policy", path: "/privacy" },
    { label: "Contact", path: "/contact" },
    { label: "Membership", path: "/membership" },
    { label: "Payment Methods", path: "/payment-methods" },
    { label: "Refund Policy", path: "/refund-policy" }
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Youth in Development</h2>
            <p className="text-sm mb-4">Empowering youth for sustainable development through education and opportunity.</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary-500 hover:text-white transition-colors"
                  aria-label={social.icon.type.displayName}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Links</h3>
            <nav className="grid grid-cols-1 gap-2">
              {footerLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.path} 
                  className="text-sm hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Us</h3>
            <address className="not-italic">
              <p className="text-sm mb-2">123 Development Street</p>
              <p className="text-sm mb-2">Dhaka 1212, Bangladesh</p>
              <p className="text-sm mb-2">Email: info@youthindev.org</p>
              <p className="text-sm mb-2">Phone: +880 2XXXX-XXXXX</p>
              <p className="text-sm">Helpline: 16XXX (9AM-6PM)</p>
            </address>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Payment Methods</h3>
            <div className="mb-2">
              <p className="text-sm mb-3">We accept the following payment methods:</p>
              <div className="grid grid-cols-3 gap-1">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm flex items-center justify-center h-16  w-24">
                      {method.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                All transactions are secured with SSL encryption. Your payment information is processed securely.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} Youth in Development. All rights reserved.</p>
            <div className="mt-2 md:mt-0 flex flex-wrap justify-center space-x-4">
              <a href="/privacy" className="hover:underline">Privacy Policy</a>
              <a href="/terms" className="hover:underline">Terms of Service</a>
              <a href="/payment-policy" className="hover:underline">Payment Policy</a>
              <a href="/refund-policy" className="hover:underline">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;