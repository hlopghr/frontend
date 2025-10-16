import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer"; // ✅ Import Footer
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import HostelPage from "./pages/HostelPage";
import Popup from "./components/Popup";
import RoleSelection from "./components/RoleSelection";

// Student Auth
import StudentLogin from "./components/StudentLogin";
import StudentSignup from "./components/StudentSignup";
import StudentForgetPassword from "./components/StudentForgetPassword";

// Owner Auth
import OwnerLogin from "./components/OwnerLogin";
import OwnerSignup from "./components/OwnerSignup";
import OwnerForgetPassword from "./components/OwnerForgetPassword";

// City Hostel Pages
import HyderabadHostels from "./pages/cities/HyderabadHostels";
import ChennaiHostels from "./pages/cities/ChennaiHostels";
import MumbaiHostels from "./pages/cities/MumbaiHostels";
import BangaloreHostels from "./pages/cities/BangaloreHostels";

import UserProfile from "./pages/UserPanel";
// Contact Page
import Contact from "./pages/Contact";

function App() {
  return (
   <div className="app-container">
      {/* Global Header */}
      <Header />

      {/* Main Content */}
      <main className="content">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/hostel/:hostelId" element={<HostelPage />} />

          
          <Route path="/popup" element={<Popup />} />
          <Route path="/RoleSelection" element={<RoleSelection />} />






          {/* City Hostel Pages */}
          <Route path="/hyderabad" element={<HyderabadHostels />} />
          <Route path="/chennai" element={<ChennaiHostels />} />
          <Route path="/mumbai" element={<MumbaiHostels />} />
          <Route path="/bangalore" element={<BangaloreHostels />} />

          {/* Student Auth */}
          <Route path="/StudentLogin" element={<StudentLogin />} />
          <Route path="/student-signup" element={<StudentSignup />} />
          <Route path="/student-forgot-password" element={<StudentForgetPassword />} />

          {/* Owner Auth */}
          <Route path="/ownerLogin" element={<OwnerLogin />} />
          <Route path="/ownersignup" element={<OwnerSignup />} />
          <Route path="/owner-forgot-password" element={<OwnerForgetPassword />} />


          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/owner-profile" element={<h2>Owner Profile</h2>} />

        </Routes>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default App;
