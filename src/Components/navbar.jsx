import { useEffect, useState, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useGetprofileQuery } from "../context/authApi";
import { motion, AnimatePresence } from "framer-motion";
import { RiShieldStarLine } from "react-icons/ri";
import { FiLogOut, FiLayout, FiLogIn } from "react-icons/fi";
import { logout } from "../context/authApi";
import { MdKeyboardArrowDown } from "react-icons/md";

function Navbar() {
  const { data, isLoading } = useGetprofileQuery();
  const user = data?.user;

  const [sticky, setSticky] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRefs = useRef({});
  const mobileRef = useRef(null);
  const mobileButtonRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location]);

  // Handle sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle clicking outside dropdowns and mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close sub-dropdowns
      if (
        openDropdown &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
      // Close mobile menu
      if (
        mobileOpen &&
        mobileRef.current &&
        mobileButtonRef.current &&
        !mobileRef.current.contains(event.target) &&
        !mobileButtonRef.current.contains(event.target)
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown, mobileOpen]);

  const handleDropdownToggle = (key) => {
    setOpenDropdown(openDropdown === key ? null : key);
  };

  const handleLogin = () => {
    const currentPath = window.location.pathname;
    navigate("/signin", { state: { from: currentPath } });
  };

  const handleRestrictedClick = (event, path) => {
    event.preventDefault();
    navigate("/signin", { state: { from: path } });
  };

  const isRestricted = (path) => {
    const restrictedPaths = [
      "/matchhome",
      "/resume",
      "/un",
      "/emb",
      "/donor",
      "/qahome",
      "/careercoach",
      "/InterviewSimulator",
      "/ppthome",
      "/dochome",
      "/excelhome",
      "/consult",
    ];
    return restrictedPaths.includes(path) && !user;
  };

  // UserDropdown Component
  const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const getInitials = () => {
      const fi = user.firstName?.[0] ?? "";
      const li = user.lastName?.[0] ?? "";
      return (fi + li).toUpperCase() || "U";
    };

    return (
      <div className="relative">
        <div className="relative inline-block">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md"
          >
            {getInitials()}
          </motion.button>

          {(user.subscriptionType === "premium" || user.subscriptionType === "freeTrial") && (
            <span
              className={`
                absolute top-0 right-0 
                transform translate-x-1/2 -translate-y-1/2 
                bg-gradient-to-r ${user.subscriptionType === "premium" ? "from-yellow-400 to-orange-400" : "from-green-400 to-teal-400"} 
                text-xs font-bold px-2.5 py-1 rounded-full shadow-lg text-white
                border ${user.subscriptionType === "premium" ? "border-yellow-300" : "border-green-300"}
              `}
            >
              {user.subscriptionType === "premium" ? "PLUS" : "TRIAL"}
            </span>
          )}
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-60 rounded-lg shadow-2xl bg-white ring-1 ring-black ring-opacity-5 z-50 overflow-hidden"
            >
              <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
                <p className="text-sm font-semibold text-gray-800">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
                <p className="text-xs font-medium text-gray-600">
                  Referral Code: <span className="font-bold text-purple-600">{user.referralCode}</span>
                </p>
                <p className="text-xs font-medium text-gray-600">
                  Subscription Plan: <span className="font-bold text-purple-600">{user.subscriptionPlan}</span>
                </p>
              </div>
              <div className="py-1 border-t border-gray-100">
                <motion.button
                  whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                  onClick={() => {
                    navigate("/dbhome");
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <FiLayout className="mr-3 text-gray-500" />
                  Dashboard
                </motion.button>
                <motion.button
                  whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                  onClick={() => {
                    navigate("/priceing");
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <RiShieldStarLine className="mr-3 text-gray-500" />
                  Upgrade your plan
                </motion.button>
                <motion.button
                  whileHover={{ x: 5, backgroundColor: "#f3f4f6" }}
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  <FiLogOut className="mr-3 text-gray-500" />
                  Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const navItems = (
    <>
      <li>
        <Link to="/" className="hover:text-purple-400 text-[17px] transition duration-300 font-medium block py-2 px-4 md:py-0 md:px-0">
          Home
        </Link>
      </li>

      {/* Jobs Here Dropdown */}
      <li className="relative group" ref={(el) => (dropdownRefs.current["jobs"] = el)}>
        <div
          className="hover:text-purple-400 text-[17px] transition duration-300 cursor-pointer font-medium flex items-center justify-between py-2 px-4 md:py-0 md:px-0 md:justify-start"
          onClick={() => handleDropdownToggle("jobs")}
        >
          Jobs Here
          <span className="md:hidden ml-auto"><MdKeyboardArrowDown /></span>
        </div>
        <ul className={`bg-white shadow-2xl rounded-lg min-w-[220px] z-50 ${openDropdown === "jobs" ? 'block' : 'hidden'} md:hidden group-hover:block absolute left-0 md:left-auto top-full md:top-auto p-3 md:absolute`}>
          <li>
            <Link to="/bdjobs" className="hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200">
              BDjobs Sites
            </Link>
          </li>
          <li>
            <Link to="/intjobs" className="hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200">
              Int. Jobs Sites
            </Link>
          </li>
          <li>
            <Link to="/ngo" className="hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200">
              NGO Jobs
            </Link>
          </li>
          <li>
            <Link to="/ingo" className="hover:bg-gray-100 p-2 text-[17px] rounded-md block text-gray-700 transition duration-200">
              INGO Jobs
            </Link>
          </li>
          <li>
            <Link
              to="/un"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-800 transition duration-200 ${
                isRestricted("/un") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRestricted("/un") ? (e) => handleRestrictedClick(e, "/un") : undefined}
            >
              UN-Jobs {isRestricted("/un") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
          <li>
            <Link
              to="/emb"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/emb") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRestricted("/emb") ? (e) => handleRestrictedClick(e, "/emb") : undefined}
            >
              Embassy Jobs {isRestricted("/emb") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
          <li>
            <Link
              to="/donor"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/donor") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRestricted("/donor") ? (e) => handleRestrictedClick(e, "/donor") : undefined}
            >
              Donor Jobs {isRestricted("/donor") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
        </ul>
      </li>

      {/* Resume Kit Dropdown */}
      <li className="relative group" ref={(el) => (dropdownRefs.current["resume"] = el)}>
        <div
          className="hover:text-purple-400 text-[17px] transition duration-300 cursor-pointer font-medium flex items-center justify-between py-2 px-4 md:py-0 md:px-0 md:justify-start"
          onClick={() => handleDropdownToggle("resume")}
        >
          Resume Kit
          <span className="md:hidden ml-auto"><MdKeyboardArrowDown /></span>
        </div>
        <ul className={`bg-white shadow-2xl rounded-lg min-w-[220px] z-50 ${openDropdown === "resume" ? 'block' : 'hidden'} md:hidden group-hover:block absolute left-0 md:left-auto top-full md:top-auto p-3 md:absolute`}>
          <li>
            <Link
              to="/resume"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/resume") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={
                isRestricted("/resume")
                  ? (e) => handleRestrictedClick(e, "/resume")
                  : undefined
              }
            >
              Resume Maker {isRestricted("/resume") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
          <li>
            <Link to="/coverhome" className="hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200">
              Cover Letter Maker
            </Link>
          </li>
          <li>
            <Link
              to="/matchhome"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/matchhome") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={
                isRestricted("/matchhome") ? (e) => handleRestrictedClick(e, "/matchhome") : undefined
              }
            >
              Match & Insights {isRestricted("/matchhome") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
        </ul>
      </li>

      {/* Candidate Kit Dropdown */}
      <li className="relative group" ref={(el) => (dropdownRefs.current["Candidate"] = el)}>
        <div
          className="hover:text-purple-400 text-[17px] transition duration-300 cursor-pointer font-medium flex items-center justify-between py-2 px-4 md:py-0 md:px-0 md:justify-start"
          onClick={() => handleDropdownToggle("Candidate")}
        >
          Candidate Kit
          <span className="md:hidden ml-auto"><MdKeyboardArrowDown /></span>
        </div>
        <ul className={`bg-white shadow-2xl rounded-lg min-w-[220px] z-50 ${openDropdown === "Candidate" ? 'block' : 'hidden'} md:hidden group-hover:block absolute left-0 md:left-auto top-full md:top-auto p-3 md:absolute`}>
          <li>
            <Link to="/trainings" className="hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200">
              Training Sites
            </Link>
          </li>
          <li>
            <Link to="/writtenTest" className="hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200">
              Written Test
            </Link>
          </li>
          <li>
            <Link
              to="/InterviewSimulator"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/InterviewSimulator") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={
                isRestricted("/InterviewSimulator")
                  ? (e) => handleRestrictedClick(e, "/InterviewSimulator")
                  : undefined
              }
            >
              Interview Practice {isRestricted("/InterviewSimulator") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
          <li>
            <Link
              to="/qahome"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/qahome") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRestricted("/qahome") ? (e) => handleRestrictedClick(e, "/qahome") : undefined}
            >
              Interview Questions {isRestricted("/qahome") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
        </ul>
      </li>

      {/* Services Kit Dropdown */}
      <li className="relative group" ref={(el) => (dropdownRefs.current["services"] = el)}>
        <div
          className="hover:text-purple-400 text-[17px] transition duration-300 cursor-pointer font-medium flex items-center justify-between py-2 px-4 md:py-0 md:px-0 md:justify-start"
          onClick={() => handleDropdownToggle("services")}
        >
          Services Kit
          <span className="md:hidden ml-auto"><MdKeyboardArrowDown /></span>
        </div>
        <ul className={`bg-white shadow-2xl rounded-lg min-w-[220px] z-50 ${openDropdown === "services" ? 'block' : 'hidden'} md:hidden group-hover:block absolute left-0 md:left-auto top-full md:top-auto p-3 md:absolute`}>
          <li>
            <Link
              to="/ppthome"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/ppthome") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRestricted("/ppthome") ? (e) => handleRestrictedClick(e, "/ppthome") : undefined}
            >
              PowerPoint Maker {isRestricted("/ppthome") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
          <li>
            <Link
              to="/dochome"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/dochome") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={isRestricted("/dochome") ? (e) => handleRestrictedClick(e, "/dochome") : undefined}
            >
              Document Maker {isRestricted("/dochome") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
          <li className="hidden">
            <Link
              to="/excelhome"
              className={`hover:bg-gray-100 text-[17px] p-2 rounded-md block text-gray-700 transition duration-200 ${
                isRestricted("/excelhome") ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={
                isRestricted("/excelhome") ? (e) => handleRestrictedClick(e, "/excelhome") : undefined
              }
            >
              Excel Format Maker {isRestricted("/excelhome") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
            </Link>
          </li>
        </ul>
      </li>

      {/* Career Coach Link (hidden as per original) */}
      <li className="hidden">
        <Link
          to="/consult"
          className={`hover:text-purple-400 text-[17px] transition duration-300 font-medium block py-2 px-4 md:py-0 md:px-0 ${
            isRestricted("/consult") ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={isRestricted("/consult") ? (e) => handleRestrictedClick(e, "/consult") : undefined}
        >
          Career Coach {isRestricted("/consult") && <RiShieldStarLine className="inline w-7 h-7 text-orange-500 ml-2" />}
        </Link>
      </li>
    </>
  );

  return (
    <div
      className={`max-w-screen-2xl z-50 container mx-auto md:px-20 px-4 fixed top-0 left-0 right-0 transition-all duration-300 ${
        sticky
          ? "shadow-lg bg-white/95 backdrop-blur-md"
          : "bg-gradient-to-r from-indigo-50 to-purple-50"
      }`}
    >
      <div className="navbar py-3 flex justify-between items-center">
        {/* Mobile Menu Button and Logo */}
        <div className="navbar-start flex items-center">
          <div className="lg:hidden mr-2">
            <button
              ref={mobileButtonRef}
              className="btn btn-ghost text-gray-700"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </button>
          </div>
          <Link to="/" className="text-3xl font-bold text-indigo-600 flex-shrink-0">
            <img src="https://i.ibb.co/Y75Y5NSb/banner.gif" className="w-48 h-10 object-contain" alt="Logo" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-6 text-gray-700">{navItems}</ul>
        </div>

        {/* Auth Section */}
        <div className="navbar-end flex-shrink-0">
          {isLoading ? (
            <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
          ) : user ? (
            <UserDropdown />
          ) : (
            <motion.button
              onClick={handleLogin}
              className="relative overflow-hidden px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(99, 102, 241, 0.6)",
              }}
              whileTap={{ scale: 0.98 }}
              initial={{
                boxShadow: "0 0 0 0 rgba(99, 102, 241, 0.4)",
              }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(99, 102, 241, 0.4)",
                  "0 0 12px 6px rgba(99, 102, 241, 0.4)",
                  "0 0 0 0 rgba(99, 102, 241, 0)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
            >
              <div className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{
                    y: [0, -3, 0, 3, 0],
                    transition: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <FiLogIn className="text-lg" />
                </motion.span>
                <motion.span
                  animate={{
                    opacity: [1, 0.8, 1],
                    transition: {
                      repeat: Infinity,
                      duration: 2,
                      ease: "easeInOut",
                    },
                  }}
                >
                  Sign In
                </motion.span>
              </div>
              <motion.span
                className="absolute inset-0 bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10"
              />
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.ul
          ref={mobileRef}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden menu menu-sm z-[1] p-3 shadow-2xl bg-white rounded-box w-full md:w-64 absolute left-0 top-full"
        >
          {navItems}
        </motion.ul>
      )}
    </div>
  );
}

export default Navbar;