import React from "react";
import BarraLateral from "../components/BarraLateral";
import HeadC from "../components/HeadC";
import TablaM from "../components/TablaM";

function MembershipsPage() {
  return (
    <div className="principalBoxDash">
        <div>
          <BarraLateral />
        </div>

        <div className="principalDashboard">
          <div className="Cabecera">
            <HeadC />
          </div>
          <div className="Tabla">
            <TablaM />
          </div>
        </div>
      </div>
  );
}

export default MembershipsPage;
