import React from "react";

import Login from "../components/Login";
import { AuthProvider } from "../components/AuthContext";

const Auth = () => {
  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
};

export default Auth;
