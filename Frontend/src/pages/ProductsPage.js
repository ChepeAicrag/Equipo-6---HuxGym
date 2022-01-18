import React from "react";
import BarraLateral from "../components/BarraLateral";
import BotonProducts from "../components/BotonProducts";
import HeadC from "../components/HeadC";
import "../styles/Crud.css";
import TablaP from "../components/TablaP";

function ProductsPage() {
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
            {/* <div className="Barra_opciones">
              <BotonProducts />
            </div> */}
              <TablaP />
            </div>
          </div>
        </div>
      </div>
     /*  <div className="principalBoxDash">
        <div>
          <BarraLateral />
        </div>

        <div className="principalDashboard">
          <div className="Cabecera">
            <HeadC />
          </div>
          <div className="Tabla">
          <div className="Barra_opciones">
          <BotonProducts />
        </div>
            <TablaP />
          </div>
        </div>
    </div> */
  );
}

export default ProductsPage;
