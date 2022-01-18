import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";

import TablaV from "../components/TablaV";

import "../styles/Crud.css";

function SalesPage() {
  return (
    <div className="principalBoxDash">
        <div className="barraLateral">
          <BarraLateral />
        </div>

        <div className="principalDashboard">
          <div className="Cabecera">
            <HeadC />
          </div>
          <div className="Tabla">
            <TablaV />
          </div>
        </div>
      </div>
  );
}

export default SalesPage;
