import { FaLinkedin, FaYoutube, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
    { icon: <img src="https://i.ibb.co/M5NmvgDZ/bkash-logo-png-seeklogo-382709.png" alt="bKash" className="w-16 h-auto" /> },
    { icon: <img src="https://i.ibb.co/VYt0Cxpb/Nagad-Logo-wine-1.png" alt="Nagad" className="w-16 h-auto" /> },
    { icon: <img src="https://i.ibb.co/GX5WMnv/dutch-bangla-rocket-logo-png-seeklogo-317692-1.png" alt="Rocket" className="w-16 h-auto" /> },
  ];

  const footerLinks = [
    { label: "About", path: "/about" },
    { label: "Terms & Conditions", path: "/terms" },
    { label: "Privacy & Payment Policy", path: "/privacy" },
    { label: "Contact", path: "/contact" },
    { label: "Membership", path: "/membership" },
    { label: "Payment Methods", path: "/payment-methods" },
    { label: "Refund Policy", path: "/terms" }
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Organization Info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Cross Careers</h2>
            <p className="text-sm leading-relaxed">Empowering Future Leaders in the Development & Humanitarian Sector.</p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-indigo-600 hover:text-white transition-colors duration-300 ease-in-out"
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
                <Link 
                  key={index} 
                  to={link.path} 
                  className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 ease-in-out"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Contact Us</h3>
            <address className="not-italic space-y-2 text-sm">
              <p>32/2, Senpara Porbota, Mirpur-10</p>
              <p>Dhaka 1216, Bangladesh</p>
              <p>Email: <a href="mailto:info@crosscareers.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">info@crosscareers.com</a></p>
              <p>Phone: <a href="tel:+8801841994979" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">+880 1841 994979</a></p>
              <p className="hidden">Helpline: 16XXX (9AM-6PM)</p>
            </address>
          </div>

          {/* Payment Methods */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Payment Methods</h3>
            <div className="mb-4">
              <p className="text-sm mb-3">We accept the following payment methods: <br/> bKash: 01886795620 (Personal)</p>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className="p-2 bg-white dark:bg-gray-800 rounded-md shadow-md flex items-center justify-center h-16 w-20 overflow-hidden">
                      {method.icon}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                All transactions are secured with SSL encryption. Your payment information is processed securely.
              </p>
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {currentYear} CrossCareers. All rights reserved.</p>
            <div className="flex flex-wrap justify-center space-x-4">
              <Link to="/about" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">About</Link>
              <Link to="/privacy" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Privacy Policy</Link>
              <Link to="/terms" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Terms of Service</Link>
              <Link to="/contact" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Contact Us</Link>
              <Link to="/earn" className="hover:underline hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300">Earn Money</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;