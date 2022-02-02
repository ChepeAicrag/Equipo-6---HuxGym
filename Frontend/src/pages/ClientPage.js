import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import '../styles/Crud.css'
import '../styles/Dashboard.css'
import '../App.css'
import Tabla from "../components/Tabla";
import TablaCliente from "../components/NuevoComponentes/TablaCliente.js";


function ClientPage() {
  return (
    <>
      <div className="App">
        <div className="principalBoxDash">
          <div className="barraLateral">
            <BarraLateral />
          </div>

          <div className="principalDashboard">
            <div className="Cabecera">
              <HeadC />
            </div>
            <div className="Tabla">
              <Tabla />
            </div>
          </div>
        </div>
      </div>
      

      {/* <div className="principalBox">
        <div className="Barraa">
          <BarraLateral />
        </div>
     
      <div className="Principal">
        <div className="Head">
              <HeadC />
        </div>
        <div className="Tabla">
          <Tabla />
        </div>
      
      </div>
    </div> */}

    </>
  );
}

export default ClientPage;
