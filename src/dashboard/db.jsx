import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  useGetprofileQuery,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useWithdrawMutation,
  useGetWithdrawalsQuery,
} from "../context/authApi";
import {
  FiUser,
  FiCreditCard,
  FiDollarSign,
  FiClock,
  FiLogOut,
  FiHome,
  FiSettings,
  FiPieChart,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowUp,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiEye,
  FiEyeOff
} from "react-icons/fi";

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Logout function
export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading: isUserLoading, error: userError, refetch: refetchProfile } = useGetprofileQuery();
  const user = data?.user;
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [withdraw, { isLoading: isWithdrawing }] = useWithdrawMutation();
  const { data: withdrawalHistory, isLoading: isHistoryLoading, refetch: refetchWithdrawals } = useGetWithdrawalsQuery();
 
  // Form states
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    address: "",
    photo: "",
  });
  const [withdrawForm, setWithdrawForm] = useState({
    points: "",
    paymentProvider: "bkash",
    paymentNumber: "",
  });

  // Debounced form states
  
  const debouncedWithdrawForm = useDebounce(withdrawForm, 300);

  // Tab state
  const [tab, setTab] = useState("dashboard");

  // Redirect to /signin if not authenticated
  useEffect(() => {
    if (userError && userError.status === 401) {
      toast.error("Please sign in to access the dashboard");
      navigate("/signin");
    }
  }, [userError, navigate]);

  // Initialize profile form
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        mobileNumber: user.mobileNumber || "",
        address: user.address || "",
        photo: user.photo || "",
      });
    }
  }, [user]);

  // Form validation


  const validateWithdrawForm = useCallback(() => {
    const pts = parseInt(debouncedWithdrawForm.points, 10);
    if (!pts || pts <= 0 || pts > (user?.points || 0)) {
      toast.error(`Invalid withdrawal amount. Available: ${user?.points || 0} points`);
      return false;
    }
    if (debouncedWithdrawForm.paymentNumber.length < 10) {
      toast.error("Payment number must be at least 10 digits");
      return false;
    }
    return true;
  }, [debouncedWithdrawForm, user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      }).unwrap();
      toast.success("Password updated successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.data?.message || "Failed to change password");
    }
  };

   const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Add basic validation
    if (!profileForm.firstName || !profileForm.lastName || !profileForm.email || !profileForm.mobileNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (profileForm.mobileNumber.length !== 11) {
      toast.error("Mobile number must be 11 digits");
      return;
    }

    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        mobileNumber: profileForm.mobileNumber,
        address: profileForm.address || '',
        photo: profileForm.photo || ''
      }).unwrap();
      
      toast.success("Profile updated successfully");
      refetchProfile();
    } catch (err) {
      console.error("Full Error:", err);
      toast.error(err.data?.message || "Failed to update profile");
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!validateWithdrawForm()) return;
    try {
      await withdraw({
        points: parseInt(debouncedWithdrawForm.points, 10),
        paymentProvider: debouncedWithdrawForm.paymentProvider,
        paymentNumber: debouncedWithdrawForm.paymentNumber,
      }).unwrap();
      toast.success("Withdrawal requested successfully");
      setWithdrawForm({ points: "", paymentProvider: "bkash", paymentNumber: "" });
      refetchWithdrawals();
    } catch (err) {
      toast.error(err.data?.message || "Failed to process withdrawal");
    }
  };

  // Loading skeleton
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled in useEffect
  }

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row gap-6"
        >
          {/* Sidebar */}
          <div className="md:w-1/3 bg-white shadow-2xl rounded-2xl p-8">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="relative mb-4"
              >
                <img
                  src={user.photo || "https://i.ibb.co/m5nKkk5z/avatar-profile-icon-in-flat-style-male-user-profile-illustration-on-isolated-background-man-profile.jpg"}
                  alt="User avatar"
                  className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-indigo-100"
                />
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 rounded-full p-2 shadow-md">
                  <FiUser className="text-white text-sm" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800">
                {user.firstName} {user.lastName}
              </h2>
              <div className="flex items-center text-gray-500 mb-2 text-sm">
                <FiMail className="mr-1" /> {user.email}
              </div>
              <div className="flex items-center text-gray-600 mb-2 text-sm">
                <FiPhone className="mr-1" /> {user.mobileNumber}
              </div>
              {user.address && (
                <div className="flex items-center text-gray-600 text-sm text-center">
                  <FiMapPin className="mr-1" /> {user.address}
                </div>
              )}
              <span className="mt-4 inline-flex items-center px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-sm font-semibold shadow-md">
                {user.subscriptionType === "premium" ? (
                  <>
                    <FiCheckCircle className="mr-1" /> Premium User
                  </>
                ) : (
                  user.subscriptionPlan.toUpperCase()
                )}
              </span>
              <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-sm flex items-center justify-center">
                    <FiDollarSign className="mr-1" /> Points
                  </p>
                  <p className="text-2xl font-bold text-indigo-600">{user.points}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <p className="text-gray-500 text-sm flex items-center justify-center">
                    <FiUser className="mr-1" /> Referrals
                  </p>
                  <p className="text-2xl font-bold text-purple-600">{Math.floor(user.points / 26)}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  logout();
                  toast.success("Logged out successfully");
                }}
                className="mt-6 px-6 py-2 flex items-center bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold shadow-lg hover:from-red-600 hover:to-red-700 transition"
                aria-label="Log out"
              >
                <FiLogOut className="mr-2" /> Logout
              </motion.button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-2/3">
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 bg-white rounded-xl shadow-lg p-2">
              {[
                { key: "dashboard", icon: <FiHome /> },
                { key: "profile", icon: <FiUser /> },
                { key: "withdraw", icon: <FiDollarSign /> },
                { key: "history", icon: <FiClock /> }
              ].map(({ key, icon }) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setTab(key)}
                  className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 ${
                    tab === key
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label={`Switch to ${key} tab`}
                >
                  {icon}
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </motion.button>
              ))}
            </div>

            {/* Panels */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-gray-500 font-medium flex items-center">
                      <FiDollarSign className="mr-2" /> Current Points
                    </h3>
                    <p className="text-3xl font-bold text-indigo-600">{user.points}</p>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-xl shadow-lg"
                  >
                    <h3 className="text-gray-500 font-medium flex items-center">
                      <FiUser className="mr-2" /> Active Referrals
                    </h3>
                    <p className="text-3xl font-bold text-purple-600">{Math.floor(user.points / 26)}</p>
                  </motion.div>
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-xl shadow-lg"
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FiPieChart className="mr-2" /> Monthly Activity
                  </h3>
                  <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                    <div className="relative w-full h-64">
                      {/* Simple bar chart visualization */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end h-48">
                        {[30, 60, 45, 80, 65, 90, 70].map((height, index) => (
                          <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={`w-8 rounded-t-lg ${
                              index % 2 === 0 ? "bg-indigo-500" : "bg-purple-500"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-around pt-2 text-xs text-gray-500">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, index) => (
                          <div key={index} className="w-8 text-center">
                            {month}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {tab === "profile" && (
              <div className="space-y-6">
                {/* Update Profile */}
                {/* Update Profile */}
<motion.form
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  onSubmit={handleUpdateProfile}
  className="bg-white p-8 rounded-xl shadow-lg space-y-6"
  aria-label="Update profile form"
>
  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
    <FiSettings className="mr-2" /> Update Profile
  </h3>
  <div className="grid sm:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
      <input
        type="text"
        placeholder="First Name"
        value={profileForm.firstName}
        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="First name"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
      <input
        type="text"
        placeholder="Last Name"
        value={profileForm.lastName}
        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="Last name"
      />
    </div>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
    <input
      type="email"
      placeholder="Email"
      value={profileForm.email}
      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
      required
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      aria-label="Email address"
    />
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
    <div className="relative">
      <input
        type="tel"
        placeholder="Mobile Number (11 digits)"
        value={profileForm.mobileNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 11);
          setProfileForm({ ...profileForm, mobileNumber: value });
        }}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="Mobile number"
      />
      {profileForm.mobileNumber.length === 11 && (
        <FiCheckCircle className="absolute right-3 top-3.5 text-green-500" />
      )}
    </div>
  </div>
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
    <textarea
      placeholder="Address"
      value={profileForm.address}
      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
      rows={4}
      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      aria-label="Address"
    />
  </div>
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    type="submit"
    disabled={isUpdatingProfile}
    className="px-8 py-3 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
    aria-label="Update profile"
  >
    {isUpdatingProfile ? (
      "Updating..."
    ) : (
      <>
        <FiCheckCircle className="mr-2" /> Update Profile
      </>
    )}
  </motion.button>
</motion.form>

                {/* Change Password */}
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleChangePassword}
                  className="bg-white p-8 rounded-xl shadow-lg space-y-6"
                  aria-label="Change password form"
                >
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FiLock className="mr-2" /> Change Password
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.old ? "text" : "password"}
                        placeholder="Current Password"
                        value={passwordForm.oldPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                        aria-label="Current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword.old ? "Hide password" : "Show password"}
                      >
                        {showPassword.old ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        placeholder="New Password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                        aria-label="New password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword.new ? "Hide password" : "Show password"}
                      >
                        {showPassword.new ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        placeholder="Confirm New Password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition pr-10"
                        aria-label="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                        aria-label={showPassword.confirm ? "Hide password" : "Show password"}
                      >
                        {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isChangingPassword}
                    className="px-8 py-3 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50"
                    aria-label="Change password"
                  >
                    {isChangingPassword ? (
                      "Changing..."
                    ) : (
                      <>
                        <FiLock className="mr-2" /> Change Password
                      </>
                    )}
                  </motion.button>
                </motion.form>
              </div>
            )}

           {tab === "withdraw" && (
  <motion.form
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    onSubmit={handleWithdraw}
    className="bg-white p-8 rounded-xl shadow-lg space-y-6"
    aria-label="Withdraw points form"
  >
    <h3 className="text-xl font-semibold text-gray-800 flex items-center">
      <FiDollarSign className="mr-2" /> Withdraw Points
    </h3>
    <div className="bg-indigo-50 p-4 rounded-lg">
      <p className="text-gray-600 font-medium flex items-center">
        <FiCreditCard className="mr-2" /> Available: {user.points} points
      </p>
      {user.points < 50 && (
        <p className="text-red-500 text-sm mt-2 flex items-center">
          <FiAlertCircle className="mr-2" /> Minimum 50 points required for withdrawal
        </p>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Points to withdraw</label>
      <input
        type="number"
        placeholder="Points to withdraw"
        value={withdrawForm.points}
        onChange={(e) => {
          const value = e.target.value;
          setWithdrawForm({ ...withdrawForm, points: value });
        }}
        required
        min="50"
        max={user.points}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="Points to withdraw"
      />
      {withdrawForm.points && Number(withdrawForm.points) < 50 && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <FiAlertCircle className="mr-2" /> Enter at least 50 points
        </p>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
      <select
        value={withdrawForm.paymentProvider}
        onChange={(e) => setWithdrawForm({ ...withdrawForm, paymentProvider: e.target.value })}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="Payment provider"
      >
        <option value="bkash">bKash</option>
        <option value="nagad">Nagad</option>
        <option value="rocket">Rocket</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Payment Number</label>
      <input
        type="text"
        placeholder="Payment Number"
        value={withdrawForm.paymentNumber}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '');
          setWithdrawForm({ ...withdrawForm, paymentNumber: value });
        }}
        required
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        aria-label="Payment number"
      />
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={isWithdrawing || user.points < 50 || Number(withdrawForm.points) < 50}
      className="px-8 py-3 flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Submit withdrawal"
    >
      {isWithdrawing ? (
        "Processing..."
      ) : (
        <>
          <FiArrowUp className="mr-2" /> Submit Withdrawal
        </>
      )}
    </motion.button>
  </motion.form>
)}
            {tab === "history" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <FiClock className="mr-2" /> Withdrawal History
                </h3>
                {isHistoryLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-14 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : withdrawalHistory?.withdrawals?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-700">
                      
                      <tbody>
                        {withdrawalHistory?.withdrawals?.length > 0 ? (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-700">
      <thead className="text-xs text-gray-500 uppercase bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-3">Date</th>
          <th scope="col" className="px-6 py-3">Points</th>
          <th scope="col" className="px-6 py-3">Provider</th>
          <th scope="col" className="px-6 py-3">Number</th>
          <th scope="col" className="px-6 py-3">Status</th>
        </tr>
      </thead>
      <tbody>
        {[...withdrawalHistory.withdrawals] // <-- এখানে কপি করে নেওয়া হয়েছে
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // <-- এখন সর্ট করা যাবে
          .map((record) => (
            <tr key={record._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4">
                {new Date(record.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 font-medium">{record.points}</td>
              <td className="px-6 py-4 capitalize">
                {record.paymentProvider}
              </td>
              <td className="px-6 py-4">{record.paymentNumber}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${
                    record.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : record.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {record.status === "pending" ? (
                    <FiAlertCircle className="mr-1" />
                  ) : record.status === "completed" ? (
                    <FiCheckCircle className="mr-1" />
                  ) : (
                    <FiXCircle className="mr-1" />
                  )}
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="text-center py-12">
    <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
    <p className="text-gray-500 text-lg">No withdrawal history available</p>
    <button
      onClick={() => setTab("withdraw")}
      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
    >
      Make a Withdrawal
    </button>
  </div>
)}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FiClock className="mx-auto text-4xl text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg">No withdrawal history available</p>
                    <button
                      onClick={() => setTab("withdraw")}
                      className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                    >
                      Make a Withdrawal
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}