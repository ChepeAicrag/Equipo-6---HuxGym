import React from "react";
import "../styles/BotonProducts.css";
import { NavLink } from "react-router-dom";

export default function BotonContabilidad() {
  /* const handleOut = async () => {
    if (tipo == "Productos") {
      window.location.href = "/ProductsPage";
    } else if (tipo == "Proveedores") {
      window.location.href = "/ProvidersPage";
    } else if (tipo == "Categorias") {
      window.location.href = "/CategoriesPage";
    }
  }; */

  return (
    <>
      <div className="btn contenedor">
        <NavLink className="texto" to="/AccountingPage">
          Cortes Caja
        </NavLink>
      </div>
      <div className="btn contenedor">
        <NavLink className="texto" to="/ExpensePage">
          Gastos
        </NavLink>
      </div>
      <div className="btn contenedor">
        <NavLink className="texto" to="/IncomePage">
          Ingresos
        </NavLink>
      </div>
    </>
  );
}
