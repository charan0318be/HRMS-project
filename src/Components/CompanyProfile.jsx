import React, { useState, useEffect } from "react";
import axios from "axios";

const CompanyProfile = ({ isAdmin = false }) => {
  const [company, setCompany] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    description: "",
    logo: "",
    images: [],
  });
  const [logoFile, setLogoFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(isAdmin);

  // Fetch company data
  const fetchCompany = async () => {
    try {
      const res = await axios.get("http://localhost:3001/company");
      const data = res.data || {};
      setCompany({
        name: data.name || "",
        address: data.address || "",
        email: data.email || "",
        phone: data.phone || "",
        description: data.description || "",
        logo: data.logo || "",
        images: data.images || [],
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching company:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  // Form handlers
  const handleChange = (e) => setCompany({ ...company, [e.target.name]: e.target.value });
  const handleLogoChange = (e) => setLogoFile(e.target.files[0]);
  const handleImagesChange = (e) => setImageFiles(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all text fields
    Object.keys(company).forEach((key) => {
      if (key !== "logo" && key !== "images") formData.append(key, company[key]);
    });

    if (logoFile) formData.append("logo", logoFile);
    imageFiles.forEach((file) => formData.append("images", file));

    try {
      await axios.post("http://localhost:3001/company", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Company profile saved!");
      setLogoFile(null);
      setImageFiles([]);
      setEditMode(false);
      fetchCompany();
    } catch (err) {
      console.error("Error saving company:", err);
    }
  };

  if (loading) return <p className="p-6 text-center">Loading company profile...</p>;

  // Split images into main and thumbnails
  const mainImage = company.images[0];
  const otherImages = company.images.slice(1);

  // Display Mode
  if (!editMode)
    return (
      <div className="max-w-7xl mx-auto mt-15 p-6 bg-white shadow-md rounded space-y-6 relative">
        <div className="text-3xl text-shadow-black text-bold text-center">
          <h1>Company Profile</h1>
        </div>
        {isAdmin && (
          <button
            onClick={() => setEditMode(true)}
            className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </button>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Left: Info */}
          <div className="md:w-1/2 w-full space-y-4">
            {company.logo && (
              <img
                src={company.logo.startsWith("blob") ? company.logo : `http://localhost:3001${company.logo}`}
                alt="Company Logo"
                className="w-28 h-28 object-cover rounded-full shadow"
              />
            )}
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p><strong>📍 Address:</strong> {company.address}</p>
            <p><strong>📧 Email:</strong> {company.email}</p>
            <p><strong>📞 Phone:</strong> {company.phone}</p>
            <p><strong>📝 Description:</strong> {company.description}</p>
          </div>

          {/* Right: Image gallery */}
          <div className="md:w-1/2 w-full flex flex-col gap-4">
            {/* Main Image */}
            {mainImage && (
              <img
                src={mainImage.startsWith("blob") ? mainImage : `http://localhost:3001${mainImage}`}
                alt="Main"
                className="w-full h-64 md:h-80 object-cover rounded shadow"
              />
            )}
            {/* Thumbnails */}
            <div className="flex flex-wrap gap-2 mt-2">
              {otherImages.map((img, index) => (
                <img
                  key={index}
                  src={img.startsWith("blob") ? img : `http://localhost:3001${img}`}
                  alt={`Thumbnail ${index}`}
                  className="w-24 h-24 object-cover rounded shadow cursor-pointer"
                  onClick={() => {
                    const newImages = [img, ...otherImages.filter((_, i) => i !== index)];
                    setCompany({ ...company, images: newImages });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );

  // Edit Mode
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded space-y-6">
      <h2 className="text-3xl font-bold text-center">Edit Company Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={company.name}
          onChange={handleChange}
          placeholder="Company Name"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="address"
          value={company.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          value={company.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="phone"
          value={company.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          name="description"
          value={company.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />

        <div>
          <label className="block mb-1 font-medium">Upload Logo</label>
          <input type="file" onChange={handleLogoChange} className="w-full p-2 border rounded" />
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Images</label>
          <input type="file" multiple onChange={handleImagesChange} className="w-full p-2 border rounded" />
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {imageFiles.map((file, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(file)}
              alt={`Preview ${idx}`}
              className="w-24 h-24 object-cover rounded shadow"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompanyProfile;
