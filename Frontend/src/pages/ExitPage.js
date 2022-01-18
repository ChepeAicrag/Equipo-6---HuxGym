import React from "react";

import Header from "../components/Header";

export default function ExitPage() {
  const handleLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    window.location.href = "/";
  };
  return (
    <div>
      <Header />
      {/*  {<BarraLateral />} */}

      <br float="right" />
      <button onClick={handleLogin}>Cerrar Sesión</button>
    </div>
  );
}
