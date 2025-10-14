import React from 'react';
import { FaVolumeUp } from "react-icons/fa";
import { Outlet, useNavigate } from 'react-router-dom';


const Home = () => {
  let navigate=useNavigate()

  const client=[{
    Review:'HRM has made managing employee records and attendance effortless. Our HR team saves hours every week!',
    Name:'Alice Johnson',
    designation:'HR Manager • GlobalTech Ltd.'
  },
  {
    Review:"The payroll automation is incredibly accurate and easy to use. No more manual calculations or errors!",
    Name:'Robert Smith',
    designation:'Operations Head • Innovate Solutions'
  },
  {
    Review:"From recruitment to performance management, HRM covers everything we need in one platform.",
    Name:'Maria Davis',
    designation:'CEO • BrightFuture Corp.'
  },
  {
    Review:"Recruitment and onboarding have never been smoother. HRM platform is intuitive and efficient.",
    Name:'David Lee',
    designation:'Talent Acquisition Lead • NextGen Enterprises'
  },
  {
    Review:"Payroll processing is now quick and error-free thanks to HRM. It has transformed our monthly workflow.",
    Name:'Samantha Green',
    designation:'Payroll Specialist • BrightSolutions Inc.'
  }
  
]
  return (
    <>
      <section className="bg-gray-50 min-h-screen px-6 md:px-16  py-10 flex flex-col justify-center">
        {/* Notification Banner */}
        <div className="flex items-center gap-4 mt-15 ml-20 bg-blue-100 text-blue-800 text-sm font-medium px-4 py-3 rounded-3xl mb-10 w-fit">
          <FaVolumeUp className="text-base" />
          <span>New: Smart Leave & Attendance Tracking Launched</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col-reverse ml-20 md:flex-row items-center justify-between gap-10 mb-25">
          <div className="max-w-xl space-y-10">
            <h1 className="text-4xl md:text-5xl  font-bold text-gray-800 leading-snug">
              Simplify HR ,<br />Management <br/> Effortlessly
            </h1>
            <p className="text-lg text-black-600 font-serif leading-relaxed">
              Manage employees, payroll, attendance, and more in one <br/> powerful platform.
            </p>
            <div className="flex gap-4 pt-2">
              <button className="bg-green-800 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md">
                Start Free Trial 
              </button>
               <button
      onClick={() => navigate('/login')}
      className="border border-gray-300 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 rounded-md"
    >
      Login
    </button>
            </div>
          </div>
          <div className="w-full md:w-[500px] h-[300px] bg-gray-200 rounded-lg shadow-md flex items-center justify-center">
            <span className="text-gray-500">[Dashboard Screenshot]</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 grid md:grid-cols-3 ">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">10K+</h2>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">50+</h2>
            <p className="text-sm text-gray-600">Countries</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">99%</h2>
            <p className="text-sm text-gray-600">Satisfaction</p>
          </div>
        </div>

        {/* Smart HR Solutions Section */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 transition duration-300 hover:text-blue-600 hover:scale-105 inline-block">
            Empowering Businesses with Smart HR Solutions
          </h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            All-in-one platform to manage employees, payroll, attendance, and performance with ease.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Employee Management',
                desc: 'Centralized profiles with personal, job, and document details.',
                icon: '👥',
              },
              {
                title: 'Payroll Automation',
                desc: 'Generate accurate payslips with tax, allowances, and deductions.',
                icon: '💰',
              },
              {
                title: 'Leave & Attendance',
                desc: 'Management of leave, shifts, and attendance logs.',
                icon: '📅',
              },
              {
                title: 'Recruitment & Onboarding',
                desc: 'Streamline hiring with applicant tracking and digital onboarding.',
                icon: '📝',
              },
              {
                title: 'Performance Management',
                desc: 'Set goals, run evaluations, and track employee performance.',
                icon: '🎯',
              },
              {
                title: 'Reports & Analytics',
                desc: 'Get actionable insights with productivity and HR metrics.',
                icon: '📊',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition text-left"
              >
                {/* Icon */}
                <div className="bg-green-100 text-green-600 w-12 h-12 flex items-center justify-center rounded-md mb-4 text-xl">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* HRM SaaS in Action Section */}
        <div className="mb-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 transition duration-300 hover:text-blue-600 hover:scale-105 inline-block">
            See HRM SaaS in Action
          </h2>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Discover how our modern HRM SaaS platform helps you manage employees, payroll, attendance, and performance — all in one place.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                label: '[Dashboard Overview Image]',
                desc: 'Get a complete overview of employee data, payroll, and HR activities in one unified dashboard.',
              },
              {
                label: '[Employee Management Image]',
                desc: 'Centralized employee information with personal details, documents, and job history.',
              },
              {
                label: '[Payroll & Payslips Image]',
                desc: 'Automated payroll processing with tax calculations, allowances, and downloadable payslips.',
              },
              {
                label: '[Leave Management Image]',
                desc: 'Easily apply, approve, and track employee leave requests with proper workflows and policies.',
              },
              {
                label: '[Attendance Tracking Image]',
                desc: 'Monitor employee check-ins, check-outs, and shifts with automated attendance logs.',
              },
              {
                label: '[Recruitment & Onboarding Image]',
                desc: 'Streamline hiring with applicant tracking and digital onboarding.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded-lg shadow-md p-4"
              >
                <div className="h-[200px] bg-gray-300 rounded mb-4 flex items-center justify-center">
                  <span className="text-gray-500">{item.label}</span>
                </div>
                <p className="text-sm text-gray-700">{item.desc}</p>
              </div>
            ))}

            {/* Final CTA Message */}
            <div className="col-span-full text-center mt-10">
              <p className="text-lg font-semibold text-blue-700 hover:text-green-600 transition">
                And many more features to discover.
              </p>
            </div>
          </div>
        </div>

        {/* Trusted Benefits Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left: Benefits List */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 transition duration-300 hover:text-blue-600 hover:scale-105 inline-block">
                Why Businesses Choose HRM SaaS
              </h2>
              <ul className="space-y-4 text-gray-700 text-base leading-relaxed">
                <li className="hover:text-green-600 transition">✅ <strong>All-in-One HR Solution:</strong> Manage employee, payroll, attendance, recruitment, and performance from a single platform.</li>
                <li className="hover:text-green-600 transition">✅ <strong>Time-Saving Automation:</strong> Automate repetitive HR tasks and focus on strategic decisions.</li>
                <li className="hover:text-green-600 transition">✅ <strong>Data-Driven Insights:</strong> Get advanced analytics and reports for smarter decisions.</li>
                <li className="hover:text-green-600 transition">✅ <strong>Secure & Reliable:</strong> Enterprise-grade security for sensitive HR data.</li>
              </ul>
            </div>

            {/* Right: Trust Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Trusted by Industry Leaders</h3>
              <div className="space-y-4 text-gray-700 text-base">
                <p><span className="text-2xl font-bold text-green-600">500+</span> Companies Using HRM</p>
                <p><span className="text-2xl font-bold text-green-600">20K+</span> Employees Managed</p>
                <p><span className="text-2xl font-bold text-green-600">98%</span> Customer Satisfaction</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= About HRM SaaS Section ================= */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            About HRM SaaS
          </h2>
          <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            We are passionate about simplifying HR management for businesses of all sizes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                We are passionate about simplifying HR management for businesses of all sizes.
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Founded by HR and tech enthusiasts, HRM SaaS was created to replace cumbersome spreadsheets 
                and manual processes with a modern, all-in-one HR platform.
              </p>

              <div className="flex gap-10">
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">3+ Years</h4>
                  <p className="text-sm text-gray-600">Experience</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">500+</h4>
                  <p className="text-sm text-gray-600">Companies Served</p>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800">20K+</h4>
                  <p className="text-sm text-gray-600">Employees Managed</p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="bg-white shadow-md rounded-lg p-10 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-lg font-semibold text-gray-800">Innovation Driven</h4>
              <p className="text-sm text-gray-600">Building the future of networking</p>
            </div>
          </div>
        </div>

        {/* ================= Mission, Values, Commitment, Vision ================= */}
        <div className="mb-20 grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl mb-4">🎯</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Mission</h4>
            <p className="text-sm text-gray-600">
              To empower businesses with smart HR solutions that simplify employee management, payroll, 
              attendance, and performance tracking.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl mb-4">💚</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Values</h4>
            <p className="text-sm text-gray-600">
              We prioritize innovation, efficiency, and creating a workplace ecosystem that nurtures growth 
              and collaboration.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl mb-4">🏅</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Commitment</h4>
            <p className="text-sm text-gray-600">
              Providing reliable, intuitive HR tools backed by exceptional support to help organizations optimize 
              their workforce.
            </p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="text-3xl mb-4">💡</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Vision</h4>
            <p className="text-sm text-gray-600">
              A future where HR management is fully automated, transparent, and enables organizations to focus on 
              people, not paperwork.
            </p>
          </div>
        </div>
        <div>
           <div className="mb-20 text-center">
          <p className="text-sm uppercase text-green-600 font-semibold">What Our Clients Say</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            Hear from HR leaders who trust our platform
          </h2>
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {
                client.map((elem,index)=>{
                  const{Review,Name,designation}=elem
                  return(
                    <>
                    <li key={index} className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center text-center hover:shadow-lg transition">
                      <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                    {Name.split(' ').map(n => n[0]).join('')}
                  </div>
                       <p className="text-gray-600 text-sm italic mb-4">“{Review}”</p>
                     <h4 className="text-lg font-semibold text-gray-800">{Name}</h4>
                  <p className="text-sm text-gray-500">{designation}</p> </li>
                  </>)})
              }
            </div>
          </div>
        </div>
       <div className=" rounded-2xl p-8 text-center shadow-2xl bg-white">
          <p className="text-lg font-semibold text-gray-800 mb-6">Trusted by HR Professionals Worldwide</p>
           <div className="grid grid-cols-2 ">
            <div>
              <p className="text-2xl font-bold text-green-600">4.9/5</p>
              <p className="text-gray-600">Average Rating</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">500+</p>
              <p className="text-gray-600">Companies Served</p>
            </div>
           </div>
        </div>
      </section>
       <Outlet/>
    </>
  );
};

export default Home;
