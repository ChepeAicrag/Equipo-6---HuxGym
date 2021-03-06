import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import "../styles/Crud.css";
import GraficaVentaP from "../components/GraficaVentaP";
//import "../styles/GraficaTotal.css";

function Grafics(){
    return(
        <div className="App">
        <div className="principalBoxDash">
          <div className="barraLateral">
            <BarraLateral />
          </div>

          <div className="principalDashboard">
            <div className="Cabecera">
              <HeadC />
            </div>
            <div classname="Graficas" style={{width: "90%", height: "70%"}}>
              <GraficaVentaP />
            </div>
          </div>
        </div>
      </div>

    )
}

export default Grafics;