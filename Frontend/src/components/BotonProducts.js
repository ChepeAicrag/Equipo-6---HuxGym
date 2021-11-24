import React from "react";
import "../styles/BotonProducts.css";
import { NavLink } from "react-router-dom";

export default function BotonProducts() {
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
        <NavLink className="texto" to="/ProductsPage">
          Productos
        </NavLink>
      </div>
      <div class="esp"></div>
      <div className="btn contenedor">
        <NavLink className="texto" to="/CategoriesPage">
          Categorías
        </NavLink>
      </div>
      <div class="esp"></div>
      <div className="btn contenedor">
        <NavLink className="texto" to="/ProvidersPage">
          Proveedores
        </NavLink>
      </div>
    </>
  );
}
