import React, { useState, useEffect } from 'react';

const sections = [
  'Personal Details',
  'Contact Details',
  'Next of Kin Details',
  'Education Qualifications',
  'Guarantor Details',
  'Family Details',
  'Job Details',
  'Financial Details',
];

const initialData = {
  'Personal Details': {
    name: 'Biruk Dawit',
    department: 'Design & Marketing',
    jobTitle: 'UI/UX Designer',
    jobCategory: 'Full time',
  },
  'Contact Details': {
    phone1: '789456123',
    phone2: '789456123',
    email: 'abc@xceltoday.com',
    address: 'xyz',
  },
  'Next of Kin Details': {
    name: 'Samson Dzevi',
    occupation: 'IT Manager',
    phone: '09993222',
    relationship: 'Relative',
    address: 'AlemBank, Addis Ababa',
  },
  'Education Qualifications': {
    institution: 'Jimma University',
    department: 'Computer Dept',
    course: 'Computer Science',
    location: 'Jimma, Ethiopia',
    start: '01/09/1996',
    end: '01/09/2000',
    description: 'Collaboration with product managers and developers...',
  },
  'Guarantor Details': {
    name: 'Mr. Richard Medina',
    relationship: 'Uncle',
    contact: '+2348012345678',
  },
  'Family Details': {
    father: 'Mr. John Doe',
    contact: '9876543210',
    dob: '01/01/1960',
    occupation: 'Retired',
  },
  'Job Details': {
    role: 'UI/UX Designer',
    department: 'Design & Marketing',
    description: 'UI mockups, collaboration, storyboards...',
  },
  'Financial Details': {
    resourceName: 'Aman Admin',
    resourceCode: 'CNF',
    accountNo: '500000154134',
    accountName: 'AMAN ADMIN',
  },
};

const EmployeeManagement = () => {
  const [activeSection, setActiveSection] = useState('Personal Details');
  const [formData, setFormData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('employeeData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage on change
  const handleChange = (field, value) => {
    const updated = {
      ...formData,
      [activeSection]: {
        ...formData[activeSection],
        [field]: value,
      },
    };
    setFormData(updated);
    localStorage.setItem('employeeData', JSON.stringify(updated));
  };

  const renderFields = () => {
    const fields = formData[activeSection];
    return Object.entries(fields).map(([key, value]) => (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 capitalize mb-1">{key}</label>
        {editMode ? (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className="w-full border px-4 py-2 rounded"
          />
        ) : (
          <p className="text-gray-800">{value}</p>
        )}
      </div>
    ));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6 space-y-4">
        <h1 className="text-xl font-bold text-blue-600 mb-4">XCELTECH</h1>
        {sections.map((section) => (
          <button
            key={section}
            onClick={() => {
              setActiveSection(section);
              setEditMode(false);
            }}
            className={`w-full text-left px-4 py-2 rounded-md font-medium ${
              activeSection === section
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-yellow-400 hover:text-white'
            }`}
          >
            {section}
          </button>
        ))}
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{activeSection}</h2>
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className={`px-4 py-2 rounded font-semibold ${
              editMode
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-yellow-400 text-black hover:bg-yellow-500'
            }`}
          >
            {editMode ? 'Save' : 'Edit'}
          </button>
        </div>
        <div className="bg-white p-6 rounded shadow-md max-w-2xl">
          {renderFields()}
        </div>
      </main>
    </div>
  );
};

export default EmployeeManagement;
