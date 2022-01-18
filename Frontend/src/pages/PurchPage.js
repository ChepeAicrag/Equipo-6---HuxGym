import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import TablaCompras from "../components/TablaCompras";

import "../styles/Crud.css";

function PurchPage() {
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
      <TablaCompras />
      </div>
    </div>
  </div>
  );
}

export default PurchPage;
