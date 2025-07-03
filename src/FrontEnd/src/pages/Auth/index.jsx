import React from "react";
import Footer from "../../components/footer";
import Login from "../../components/login";

function Auth() {
  return (
    <>
      <div className="login-wrapper">
        <Login />
      </div>

      <Footer />
    </>
  );
}

export default Auth;

