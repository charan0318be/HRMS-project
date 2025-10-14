import React, { useState } from 'react';

const UpdateProfile = () => {
  const [activeSection, setActiveSection] = useState('Personal Details');
  const [educationTab, setEducationTab] = useState('Academic Records');

  const sections = [
    'Personal Details',
    'Contact Details',
    'Education Qualification',
    'Family Details',
    'Job Details',
    'Financials details',
    'Guaranter Details'
  ];

  // -------------------- STATES --------------------
  const [personal, setPersonal] = useState({ name: 'John Doe', dob: '1990-01-01', job: 'Software Engineer' });
  const [personalEdit, setPersonalEdit] = useState(false);

  const [contact, setContact] = useState({ phone: '1234567890', email: 'john@example.com', city: 'New York', address: '123 Main St, New York, NY' });
  const [contactEdit, setContactEdit] = useState(false);

  const [nextOfKin, setNextOfKin] = useState({ name: 'Jane Doe', job: 'Teacher', phone: '9876543210', relationship: 'Sister', address: '456 Park Ave, New York, NY' });
  const [nextOfKinEdit, setNextOfKinEdit] = useState(false);

  const [academic, setAcademic] = useState({ institution: 'ABC University', course: 'B.Sc Computer Science', department: 'Science', location: 'New York', startDate: '2010-09-01', endDate: '2014-06-30' });
  const [academicEdit, setAcademicEdit] = useState(false);

  const [professional, setProfessional] = useState({ certificate: 'Web Technologies' });
  const [professionalEdit, setProfessionalEdit] = useState(false);

  const [family, setFamily] = useState({ fullName: 'Alice Smith', relation: 'Mother', phone: '5551234567', address: '789 Elm St, New York, NY' });
  const [familyEdit, setFamilyEdit] = useState(false);

  const [guaranter, setGuaranter] = useState({ name: 'Robert Smith', job: 'Accountant', relationship: 'Uncle', phone: '4445556666', address: '321 Oak St, New York, NY' });
  const [guaranterEdit, setGuaranterEdit] = useState(false);

  const [jobDetails, setJobDetails] = useState({ designation: 'Software Engineer', department: 'IT', dateOfJoining: '2015-06-01', reportingManager: 'Jane Smith' });
  const [jobEdit, setJobEdit] = useState(false);

  const [financials, setFinancials] = useState({ bankName: 'ABC Bank', accountNumber: '1234567890', ifsc: 'ABC123456', salary: '50000' });
  const [financialEdit, setFinancialEdit] = useState(false);

  // -------------------- HANDLERS --------------------
  const handlePersonalChange = (e) => setPersonal({ ...personal, [e.target.name]: e.target.value });
  const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });
  const handleNextOfKinChange = (e) => setNextOfKin({ ...nextOfKin, [e.target.name]: e.target.value });
  const handleAcademicChange = (e) => setAcademic({ ...academic, [e.target.name]: e.target.value });
  const handleProfessionalChange = (e) => setProfessional({ ...professional, [e.target.name]: e.target.value });
  const handleFamilyChange = (e) => setFamily({ ...family, [e.target.name]: e.target.value });
  const handleGuaranterChange = (e) => setGuaranter({ ...guaranter, [e.target.name]: e.target.value });
  const handleJobChange = (e) => setJobDetails({ ...jobDetails, [e.target.name]: e.target.value });
  const handleFinancialChange = (e) => setFinancials({ ...financials, [e.target.name]: e.target.value });

  // -------------------- EDUCATION RENDER --------------------
  const renderEducation = () => (
    <div className="rounded shadow-md p-6 bg-white max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Education Qualification</h1>

      <div className="flex space-x-4 mb-4">
        {['Academic Records', 'Professional Qualification'].map((tab) => (
          <button
            key={tab}
            onClick={() => setEducationTab(tab)}
            className={`px-4 py-2 rounded border ${
              educationTab === tab ? 'bg-yellow-400 text-black border-yellow-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {educationTab === 'Academic Records' && (
        <div className="space-y-4">
          {['institution','course','department','location','startDate','endDate'].map((field) => (
            <div key={field} className="flex items-center space-x-4">
              <label className="w-48 text-gray-700 font-medium">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {academicEdit ? (
                <input
                  type={field.includes('Date') ? 'date' : 'text'}
                  name={field}
                  value={academic[field]}
                  onChange={handleAcademicChange}
                  className="flex-1 border rounded p-2"
                />
              ) : <span className="flex-1">{academic[field]}</span>}
            </div>
          ))}
          <div className="flex justify-end space-x-2">
            {academicEdit ? (
              <button onClick={() => setAcademicEdit(false)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Update</button>
            ) : (
              <button onClick={() => setAcademicEdit(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
            )}
          </div>
        </div>
      )}

      {educationTab === 'Professional Qualification' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="w-48 text-gray-700 font-medium">Certificate</label>
            {professionalEdit ? (
              <input
                type="text"
                name="certificate"
                value={professional.certificate}
                onChange={handleProfessionalChange}
                className="flex-1 border rounded p-2"
              />
            ) : <span className="flex-1">{professional.certificate}</span>}
          </div>
          <div className="flex justify-end space-x-2">
            {professionalEdit ? (
              <button onClick={() => setProfessionalEdit(false)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Update</button>
            ) : (
              <button onClick={() => setProfessionalEdit(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // -------------------- RENDER SECTION --------------------
  const renderSection = () => {
    switch(activeSection) {
      case 'Personal Details':
        return renderEditableSection(personal, handlePersonalChange, personalEdit, setPersonalEdit, ['name','dob','job']);
      case 'Contact Details':
        return renderEditableSection(contact, handleContactChange, contactEdit, setContactEdit, ['phone','email','city','address']);
      case 'Next of kin Details':
        return renderEditableSection(nextOfKin, handleNextOfKinChange, nextOfKinEdit, setNextOfKinEdit, ['name','job','phone','relationship','address']);
      case 'Education Qualification':
        return renderEducation();
      case 'Family Details':
        return renderEditableSection(family, handleFamilyChange, familyEdit, setFamilyEdit, ['fullName','relation','phone','address']);
      case 'Guaranter Details':
        return renderEditableSection(guaranter, handleGuaranterChange, guaranterEdit, setGuaranterEdit, ['name','job','relationship','phone','address']);
      case 'Job Details':
        return renderEditableSection(jobDetails, handleJobChange, jobEdit, setJobEdit, ['designation','department','dateOfJoining','reportingManager'], ['dateOfJoining']);
      case 'Financials details':
        return renderEditableSection(financials, handleFinancialChange, financialEdit, setFinancialEdit, ['bankName','accountNumber','ifsc','salary'], [], {salary: 'number'});
      default:
        return <p>No details available.</p>;
    }
  };

  // -------------------- GENERIC EDITABLE RENDER FUNCTION --------------------
  const renderEditableSection = (data, handleChange, editState, setEditState, fields, dateFields=[], types={}) => (
    <div className="rounded shadow-md p-6 bg-white max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">{activeSection}</h1>
      {editState ? (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field} className="flex items-center space-x-4">
              <label className="w-48 text-gray-700 font-medium">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                type={dateFields.includes(field) ? 'date' : types[field] || 'text'}
                name={field}
                value={data[field]}
                onChange={handleChange}
                className="flex-1 border rounded p-2"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button onClick={() => setEditState(false)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Update</button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field} className="flex items-center space-x-4">
              <label className="w-48 text-gray-700 font-medium">{field.replace(/([A-Z])/g, ' $1')}:</label>
              <span className="flex-1">{data[field]}</span>
            </div>
          ))}
          <div className="flex justify-end">
            <button onClick={() => setEditState(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Edit</button>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------- MAIN RENDER --------------------
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-5 border-r border-gray-300">
        <h2 className="text-xl font-bold mb-6 text-center">Profile</h2>
        <ul className="space-y-4">
          {sections.map((section) => (
            <li
              key={section}
              className={`p-3 rounded cursor-pointer border ${activeSection === section ? 'bg-yellow-400 text-black font-semibold border-yellow-500' : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-200'}`}
              onClick={() => setActiveSection(section)}
            >
              {section}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {renderSection()}
      </div>
    </div>
  );
};

export default UpdateProfile;
