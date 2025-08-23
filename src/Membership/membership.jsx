import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navber from '../Components/navbar';
import Footer from "../Components/footer";
import { motion } from "framer-motion";

const Membership = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const pricingOptions = {
    free: { 
      title: "Free", 
      price: "0", 
      features: [
        "Basic features access",
        "Limited content",
        "Community support",
        "Ad-supported experience"
      ] 
    },
    paid: {
      title: "Premium",
      prices: { 
        monthly: "79", 
        quarterly: "230 (Save 7)", 
        halfYearly: "450 (Save 24)",
        yearly: "750 (Save 198)" 
      },
      features: [
        "Full content access",
        "Ad-free experience",
        "Premium support",
        "Exclusive content",
        "Early access to new features"
      ],
    },
  };

  const billingCycles = [
    { id: "monthly", label: "Monthly" },
    { id: "quarterly", label: "Quarterly" },
    { id: "halfYearly", label: "Half-Yearly" },
    { id: "yearly", label: "Yearly" },
  ];

  const handleSelectPlan = (key) => {
    const amount = key === "free" ? pricingOptions[key].price : pricingOptions[key].prices[billingCycle];
    navigate(`./login/signin?plan=${key}&amount=${amount}`);
  };

  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -10 }
  };

  return (
    <>
      <Navber />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8 mt-20">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 -mt-10">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto -mb-8">
              Select the option that works best for you
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {billingCycles.map((cycle) => (
              <button
                key={cycle.id}
                onClick={() => setBillingCycle(cycle.id)}
                className={`px-5 py-3 rounded-lg font-medium transition-all duration-300 ${
                  billingCycle === cycle.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {cycle.label}
              </button>
            ))}
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Object.entries(pricingOptions).map(([key, option]) => (
              <motion.div
                key={key}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                onMouseEnter={() => setHoveredCard(key)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative overflow-hidden rounded-2xl p-8 ${
                  key === "paid" 
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                    : "bg-white text-gray-800"
                } shadow-xl transition-all duration-500 ${
                  hoveredCard === key ? "shadow-2xl" : ""
                }`}
              >
                {key === "paid" && (
                  <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 text-sm font-bold rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                
                <div className="mb-6">
                  <h3 className={`text-2xl font-bold mb-1 ${
                    key === "paid" ? "text-white" : "text-gray-900"
                  }`}>
                    {option.title}
                  </h3>
                  <p className="text-sm opacity-80">
                    {key === "free" ? "Forever free" : "Billed " + billingCycle}
                  </p>
                </div>

                <div className="mb-8">
                  <p className="text-5xl font-extrabold mb-2">
                    {key === "free" ? (
                      "৳0"
                    ) : (
                      <>
                        ৳{option.prices[billingCycle].split(" ")[0]}
                        <span className="text-xl font-normal"></span>
                      </>
                    )}
                  </p>
                  {key === "paid" && option.prices[billingCycle].includes("Save") && (
                    <p className="text-sm opacity-90">
                      {option.prices[billingCycle].split("(")[1].replace(")", "")}
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-10">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                          key === "paid" ? "text-indigo-200" : "text-indigo-600"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPlan(key)}
                  className={`w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                    key === "paid"
                      ? "bg-white text-indigo-600 hover:bg-gray-100 hover:shadow-lg"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                  }`}
                >
                  Get {option.title} Plan
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Membership;