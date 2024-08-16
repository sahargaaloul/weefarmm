import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import RtlLayout from "layouts/rtl";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import ForgotPassword from "views/auth/forgetpassword";
import EnterCode from "views/auth/entercode"; 
import ResetPassword from "views/auth/resetpassword"; 
import SignUp from "views/auth/signup";
import SendRegistrationEmail from 'views/auth/SendRegistrationEmail';
import Welcome from "views/auth/welcome";
import Dashboard from "views/superadmin/dashboardsuper";
import SignIn from "views/auth/adminsignin";
import AddUserForm from './views/auth/AddUserForm';
import AdminHistory from './views/superadmin/AdminHistory';



const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="rtl/*" element={<RtlLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/enter-code" element={<EnterCode />} />
      <Route path="/sign-up/*" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/send-registration-email" element={<SendRegistrationEmail />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/admin-sign-in" element={<SignIn />} />
      <Route path="/add-user" element={<AddUserForm />} />
      <Route path="/history" element={<AdminHistory />} />


    </Routes>
  );
};

export default App;
