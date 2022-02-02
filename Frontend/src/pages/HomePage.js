import React, { Component } from "react";
import Cookies from "universal-cookie";
import "fontsource-roboto";
import "../styles/Dashboard.css";
import Header from "../components/Header";

const cookies = new Cookies();

class HomePage extends Component {
  cerrarSesion = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };
  /* componentDidMount() {
    if (!cookies.get("email")) {
      window.location.href = "/";
    }
  } */
  componentDidMount() {
    const token = localStorage.getItem("token") || "";
    if (token == "") {
      window.location.href = "/";
    } else {
    }
  }
  render() {
    console.log(cookies.get("id"));
    return (
      <div>
        <Header />
        {/*  {<BarraLateral />} */}

        <br float="right" />
        <button onClick={() => this.cerrarSesion()}>Cerrar Sesión</button>
      </div>
    );
  }
}
export default HomePage;
