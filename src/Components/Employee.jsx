import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SidebarItem = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full px-4 py-2 text-gray-700 hover:text-blue-600"
      >
        <span>{title}</span>
        <span>{isOpen ? '▾' : '▸'}</span>
      </button>
      {isOpen && (
        <div className="ml-4 space-y-2">
          {links.map(({ label, to }) => (
            <Link key={to} to={to} className="block text-left text-gray-600 hover:text-blue-500">
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Employee = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">HRM Dashboard</h2>
        <nav className="space-y-4">
          <Link to="/" className="block text-left text-gray-700 hover:text-blue-600">Dashboard</Link>
          <Link to="/settings" className="block text-left text-gray-700 hover:text-blue-600">Settings</Link>

          <SidebarItem
            title="Workplace"
            links={[
              { label: 'Job Advertisements', to: '/workplace/jobs' },
              { label: 'Interview Rounds', to: '/workplace/rounds' },
              { label: 'Interviews', to: '/workplace/interviews' },
              { label: 'Candidate Feedback', to: '/workplace/feedback' },
              { label: 'Candidate Evaluations', to: '/workplace/evaluations' },
              { label: 'Candidate Onboarding', to: '/workplace/onboarding' },
            ]}
          />

          <SidebarItem
            title="Contract Management"
            links={[
              { label: 'Employee Contracts', to: '/contracts/employees' },
              { label: 'Contract Extensions', to: '/contracts/extensions' },
            ]}
          />

          <SidebarItem
            title="Document Management"
            links={[
              { label: 'HR Documents', to: '/documents/hr' },
              { label: 'Thank You Notes', to: '/documents/thanks' },
            ]}
          />

          <SidebarItem
            title="Meetings"
            links={[
              { label: 'Meeting Overview', to: '/meetings/overview' },
              { label: 'Participants', to: '/meetings/participants' },
              { label: 'Meeting Minutes', to: '/meetings/minutes' },
              { label: 'Action Items', to: '/meetings/actions' },
            ]}
          />

          <SidebarItem
            title="Leave Management"
            links={[
              { label: 'Leave Requests', to: '/leave/requests' },
              { label: 'Leave Applications', to: '/leave/applications' },
              { label: 'Leave Balances', to: '/leave/balances' },
            ]}
          />

          <SidebarItem
            title="Participation"
            links={[
              { label: 'Shifts', to: '/participation/shifts' },
              { label: 'Participation Rules', to: '/participation/rules' },
              { label: 'Attendance Data', to: '/participation/attendance' },
              { label: 'Participation Regulations', to: '/participation/regulations' },
            ]}
          />

          <SidebarItem
            title="Time Tracking"
            links={[
              { label: 'Time Points', to: '/time/points' },
            ]}
          />

          <SidebarItem
            title="Payroll Management"
            links={[
              { label: 'Employee Salaries', to: '/payroll/salaries' },
              { label: 'Payment Slips', to: '/payroll/slips' },
            ]}
          />

          <SidebarItem
            title="Performance"
            links={[
              { label: 'Review Dashboard', to: '/performance/dashboard' },
              { label: 'Employee Goals', to: '/performance/goals' },
              { label: 'Indicators', to: '/performance/indicators' },
              { label: 'Review Cycles', to: '/performance/reviews' },
              { label: 'Evaluations', to: '/performance/evaluations' },
            ]}
          />

          <SidebarItem
            title="Communication"
            links={[
              { label: 'Announcements', to: '/communication/announcements' },
              { label: 'Surveys', to: '/communication/surveys' },
            ]}
          />

          <SidebarItem
            title="Asset Management"
            links={[
              { label: 'Assets Overview', to: '/assets/overview' },
              { label: 'Depreciations', to: '/assets/depreciations' },
            ]}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-semibold mb-4">Welcome, Dr. Rowland Murphy!</h1>
        <p className="mb-6 text-gray-600">Stay updated with company announcements and meetings.</p>
        {/* Add routed content here */}
      </main>
    </div>
  );
};

export default Employee;
