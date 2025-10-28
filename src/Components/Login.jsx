import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({
    email: '',
    password: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormdata({
      ...formdata,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post('https://hrms-project-1-eca3.onrender.com
/login', formdata);
    const data = response.data;

    console.log("Login response:", data); // ADD THIS

    if (data.message === 'success') {
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('userName', data.name);

      console.log("Stored in localStorage:", {
        userId: data.userId,
        role: data.role,
        userName: data.name
      }); // ADD THIS

      alert('Login successful!');
      if (data.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert('Login failed. Please try again.');
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-white to-blue-50 p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            value={formdata.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            required
          />
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            name="agreed"
            checked={formdata.agreed}
            onChange={handleChange}
            className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="text-sm text-gray-700">Remember me</span>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 rounded-lg font-semibold shadow-lg hover:from-indigo-500 hover:to-blue-500 transition duration-300"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm text-gray-700">
          Don't have an account?{' '}
          <NavLink to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;
