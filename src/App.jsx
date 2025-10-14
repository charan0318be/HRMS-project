import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingLayout from "./Components/LandingLayout"; 
import DashboardLayout from "./Components/DashboardLayout"; 
import Home from "./Components/Home";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";
import Register from "./Components/Register";
import ApplyLeave from "./Components/ApplyLeave";
import Goals from "./Components/Goals";
import AdminSection from "./Components/AdminSection";
import CompanyProfile from "./Components/CompanyProfile";
import Calender from "./Components/Calender";
import TakeAppraisal from "./Components/TakeAppraisal";
import ViewPaySlip from "./Components/ViewPaySlip";
import UpdateProfile from "./Components/UpdateProfile";




const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      {path:'/register',element:<Register/>}
      // Add other landing page routes
    ],
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/applyleave", element: <ApplyLeave /> },
      { path: "/goals", element: <Goals /> },
      { path: "/payslips", element: <ViewPaySlip /> },
      { path: "/appraisal", element: <TakeAppraisal /> },
      { path: "/company", element: <CompanyProfile /> },
      { path: "/profile", element: <UpdateProfile /> },
       { path: "/calender", element: <Calender /> },
      
   
    ],
  },
   {
      path: '/admin',
      element: <AdminSection/>,
      children: [
        // Add admin-specific children routes here if needed
      ],
    },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
