import React from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ import useNavigate

const LandingpageNavbar = () => {
  const navigate = useNavigate(); // ✅ initialize navigate

  let handlenavigate = () => {
    navigate("/login"); // ✅ go to login page
  };

  return (
    <div className="sticky top-0 z-50 bg-white">
      <nav className="shadow-md px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">HRMSaaS</div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700">
          <li className="hover:text-blue-600 cursor-pointer">Home</li>
          <li className="hover:text-blue-600 cursor-pointer">About Us</li>
          <li className="hover:text-blue-600 cursor-pointer">Privacy Policy</li>
          <li className="hover:text-blue-600 cursor-pointer">Terms of Service</li>
          <li className="hover:text-blue-600 cursor-pointer">Contact Us</li>
          <li className="hover:text-blue-600 cursor-pointer">FAQ</li>
          <li className="hover:text-blue-600 cursor-pointer">Refund Policy</li>
        </ul>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-4">
          <div>
            <button
              onClick={handlenavigate}
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              Login
            </button>
          </div>
          <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded">
            Get Started
          </button>
        </div>
      </nav>
    </div>
  );
};

export default LandingpageNavbar;
