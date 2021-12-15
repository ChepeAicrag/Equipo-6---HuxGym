import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import Checkin from "../components/Checkin";
import "../styles/Dashboard.css";
import Botones from "../components/Botones";
import Monto from "../components/Monto";
import Check_Client from "../components/Check_Client";
import Grafica_Barras from "../components/Grafica_Barras";

function Dashboard() {
  return (
    <>
      <div className="principalBoxDash">
        <div className="barraLateral">
          <BarraLateral />
        </div>

        <div className="principalDashboard">
          <div className="Cabecera">
            <HeadC />
          </div>
          <div className="checkinand">

            
            {<div className="agrupacion">
              <Check_Client />
            </div>}
            
            {<div className="agrupacion">
              <Checkin />
            </div>}
            
          </div>
          
          {/* <div className="graficasandcheck ">
            <div className="graficas">
              {<Grafica_Barras />}
              </div>
              <h1>Grafica</h1>
            <div className="caja">
               <Monto />
            </div>
          </div> */}
          
        </div>
      </div>

      {/* <div className="principalDashboard">
        <div className="Barra">
          <BarraLateral />
        </div>
          <div className="Head">
            <HeadC />
          </div>
          <div className="parteinicial">
          <Botones />
           
          </div>
          <br />
            <Checkin />
            <br />
          <Check_Client />
           
          <Monto />
          <Grafica_Barras />
      </div> */}
    </>
  );
}

export default Dashboard;
