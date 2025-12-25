import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";

const Login = () => {
  const { user } = useContext(AuthContext);

  console.log("Current User:", user);
  return <div>Login Page</div>;
};

export default Login;
