import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";


import ForgotPassword from "views/auth/forgetpassword";
import EnterCode from "views/auth/entercode"; 
import ResetPassword from "views/auth/resetpassword"; 
import SignUp from "views/auth/signup";
import SendRegistrationEmail from 'views/auth/SendRegistrationEmail';
import Welcome from "views/auth/welcome";
import Dashboard from "views/superadmin/dashboardsuper";
import AdminSignIn from "views/auth/adminsignin";
import AddUserForm from './views/auth/AddUserForm';
import AdminHistory from './views/superadmin/AdminHistory';
import ProductPage from './views/superadmin/ProductPage';
import ProductDetail from "./views/superadmin/productlist";
import ProductDetailPage from "./views/superadmin/productdetails";
import ProductHistory from "./views/superadmin/ProductHistory";
import SignIn from "views/auth/SignIn";


const App = () => {
  return (
    <Routes>
    
      <Route path="/" element={<Navigate to="/super-signin" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/enter-code" element={<EnterCode />} />
      <Route path="/sign-up/*" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/send-registration-email" element={<SendRegistrationEmail />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/dashboard/*" element={<Dashboard />} />
      <Route path="/admin-sign-in" element={<AdminSignIn />} />
      <Route path="/add-user" element={<AddUserForm />} />
      <Route path="/history" element={<AdminHistory />} />
      <Route path="/product" element={< ProductPage/>} />
      <Route path="/productDetail" element={<ProductDetail/>} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="/producthistory" element={<ProductHistory />} />
      <Route path="/super-signin" element={<SignIn />} />




    </Routes>
  );
};

export default App;
