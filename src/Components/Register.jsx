import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  let navigate=useNavigate()
  const [formdata, setFormdata] = useState({
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    confirmpassword: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormdata({
      ...formdata,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { password, confirmpassword } = formdata;

    if (password !== confirmpassword) {
      alert('Passwords do not match!');
      return;
    }

    axios.post('http://localhost:3001/register', formdata)
      .then((res) => {
        alert('Registered successfully!');
        navigate('/')
        setFormdata({
          name: '',
          email: '',
          phonenumber: '',
          password: '',
          confirmpassword: '',
          agreed: false,
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Registration failed. Please try again.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 p-4 sm:p-6 md:p-6 rounded-2xl shadow-2xl w-full max-w-sm"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-purple-800">
          Create Account
        </h2>

        {/** Name */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-purple-700">Name</label>
          <input
            type="text"
            name="name"
            value={formdata.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            required
          />
        </div>

        {/** Email */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-purple-700">Email</label>
          <input
            type="email"
            name="email"
            value={formdata.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            required
          />
        </div>

        {/** Phone Number */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-purple-700">Phone Number</label>
          <input
            type="tel"
            name="phonenumber"
            value={formdata.phonenumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            required
          />
        </div>

        {/** Password */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-purple-700">Password</label>
          <input
            type="password"
            name="password"
            value={formdata.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            required
          />
        </div>

        {/** Confirm Password */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-purple-700">Confirm Password</label>
          <input
            type="password"
            name="confirmpassword"
            value={formdata.confirmpassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            required
          />
        </div>

        {/** Terms & Conditions */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="agreed"
            checked={formdata.agreed}
            onChange={handleChange}
            className="mr-2 w-4 h-4 text-purple-600 focus:ring-purple-500 border-purple-300 rounded shadow-sm"
            required
          />
          <span className="text-sm text-purple-700">
            I agree to all the <a href="#" className="text-purple-600 underline">terms and conditions</a>
          </span>
        </div>

        {/** Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300 font-semibold shadow-lg"
        >
          Create Account
        </button>

        {/** Login Link */}
        <p className="text-center mt-4 text-sm text-purple-700">
          Already have an account?{' '}
          <NavLink to="/login" className="text-purple-800 font-semibold hover:underline">
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Register;
