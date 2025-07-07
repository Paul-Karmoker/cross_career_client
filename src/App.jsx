
import { Navigate, Route, Routes } from 'react-router-dom';

import { useGetWithdrawalsQuery } from './context/authApi';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
// Public Components
import Home from '../src/home/home';
import Training from './Components/trainings';
import About from './Components/about';
import Contact from './Components/contact';
import Membership from './Membership/membership';
import Earn from './Components/earn';
import Ngo from './Components/ngo';
import Ingo from './Components/ingo';
import Bdjobs from './Components/bdjobs';
import Intjobs from './Components/intjobs';
import Marqueer from './Components/marqueer';
import Marqueel from './Components/marqueel';
import Terms from './Components/terms';
import Privacy from './Components/privacy';
import ForgotPassword from './login/forgetpassword';
import ResetPassword from './login/resetpasswordpage';

// Authentication Components
import Signin from './login/signin';
import SignUp from './login/signup';
import Signinhome from './login/signinhome';
import Signuphome from './login/signuphome';
import Logout from './login/signout';

// Protected Components
import Un from './Components/un';
import Emb from './Components/emb';
import Donor from './Components/donor';
import Dbhome from './dashboard/dbhome';
import Matchhome from './Resumebuild/matchhome';
import Qahome from './QA/qahome';
import Coverhome from './cl/coverhome';
import Ppthome from './ppt/ppthome';
import PPTmaker from './ppt/pptmaker';
import Doc from './docx/doc';
import Dochome from './docx/dochome';
import Excel from './excel/excel';
import Excelhome from './excel/excelhome';
import Consult from './consult/consult';
import Insm from './insm/InterviewSimulator';
import Payment from './Membership/paymentmodel';
import Upgradeplan from './Components/upgradeplan';


import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
  const { isError, error } = useGetWithdrawalsQuery();
  const isAuthenticated = localStorage.getItem('token') && !(isError && error?.status === 'error');

  return isAuthenticated ? children : <Navigate to="/signinhome" replace />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  const { isLoading } = useGetWithdrawalsQuery();

  if (isLoading) {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
        <div className="mb-4">
          <Skeleton height={500} width={`200%`} />
        </div>
        <div className="space-y-3">
          <Skeleton height={20} />
          <Skeleton height={20} />
          <Skeleton height={20} width="200%" />
          <Skeleton height={50} />
        </div>
      </div>
    </div>

  );
}

  return (
    <>
      <Routes>
        {/* পাবলিক রাউট */}
        <Route path="/" element={<Home />} />
        <Route path="/trainings" element={<Training />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/earn" element={<Earn />} />
        <Route path="/ngo" element={<Ngo />} />
        <Route path="/ingo" element={<Ingo />} />
        <Route path="/bdjobs" element={<Bdjobs />} />
        <Route path="/intjobs" element={<Intjobs />} />
        <Route path="/marqueer" element={<Marqueer />} />
        <Route path="/marqueel" element={<Marqueel />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/signin" element={<Signin />} />
        <Route path='/forgetPassword' element={<ForgotPassword />} />
        <Route path='/reset-password/:token' element={<ResetPassword />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signinhome" element={<Signinhome />} />
        <Route path="/signuphome" element={<Signuphome />} />
        <Route path="/coverhome" element={<Coverhome />} />
        <Route path="/pptmaker" element={<PPTmaker />} />
        <Route path="/doc" element={<Doc />} />
        <Route path="/dochome" element={<Dochome />} />
        <Route path="/excel" element={<Excel />} />
        <Route path="/excelhome" element={<Excelhome />} />
        <Route path="/consult" element={<Consult />} />
        

        {/* প্রোটেক্টেড রাউট */}
        <Route
          path="/un"
          element={
            <ProtectedRoute>
              <Un />
            </ProtectedRoute>
          }
        />
        <Route
          path="/priceing"
          element={
            <ProtectedRoute>
              <Upgradeplan />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emb"
          element={
            <ProtectedRoute>
              <Emb />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor"
          element={
            <ProtectedRoute>
              <Donor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dbhome"
          element={
            <ProtectedRoute>
              <Dbhome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matchhome"
          element={
            <ProtectedRoute>
              <Matchhome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/qahome"
          element={
            <ProtectedRoute>
              <Qahome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ppthome"
          element={
            <ProtectedRoute>
              <Ppthome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/InterviewSimulator"
          element={
            <ProtectedRoute>
              <Insm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logout"
          element={
            <ProtectedRoute>
              <Logout />
            </ProtectedRoute>
          }
        />

        {/* ক্যাচ-অল রাউট */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;