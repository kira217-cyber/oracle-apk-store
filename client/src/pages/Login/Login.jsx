import React, { useContext } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";

const Login = () => {
  const { user } = useContext(AuthContext);

  console.log("Current User:", user);
  return <div> <h1 className="text-2xl text-indigo-600 text-center min-h-screen">
        No Include Api!
      </h1></div>;
};

export default Login;
