import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import '../styles/Crud.css'
import TablaHojas from "../components/TablaHojas";

function ClientPageClinic() {
  
  return (
    <div className="Principal">
      <div className="Barra">
        <BarraLateral />
      </div>
      <div className="Head">
        <HeadC />
      </div>
      <div className="Tabla">
        <TablaHojas />
      </div>
    
    </div>
  );
}

export default ClientPageClinic;
