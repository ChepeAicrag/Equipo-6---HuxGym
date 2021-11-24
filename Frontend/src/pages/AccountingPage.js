import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import "../styles/Crud.css";
import TablaCortes from "../components/TablaCortes";
import BotonContabilidad from "../components/BotonContabilidad";

function AccountingPage() {
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
      {/* <div className="Barra_opciones">
        <BotonContabilidad />
      </div> */}
        <TablaCortes />
      </div>
    </div>
</div>
  );
}

export default AccountingPage;
