import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import TablaE from "../components/TablaE";

const rol = localStorage.getItem("rol");
function EmployeePage() {
  return (

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
              <TablaE />
            </div>
          </div>
        </div>
      </div>

  );
}

export default EmployeePage;
