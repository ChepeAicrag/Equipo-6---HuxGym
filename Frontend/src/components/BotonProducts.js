import React from "react";
import "../styles/BotonProducts.css";
import { NavLink, Link } from "react-router-dom";

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

  /* return (
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
  ); */

  return (
    <>
      <ul class="nav nav-tabs mt-2" id="myTab" role="tablist">
          <li class="nav-item">
            <NavLink className="letra nav-link btn contenedor" to="/ProductsPage" activeClass="btn contenedor active">
              Productos
            </NavLink>
          </li>
          <li class="nav-item">
            <NavLink className="letra nav-link btn contenedor" to="/CategoriesPage" activeClass="btn contenedor active">
              Categorías
            </NavLink>
          </li>
          <li class="nav-item">
            <NavLink className="letra nav-link btn contenedor" to="/ProvidersPage" activeClass="btn contenedor active">
              Proveedores
            </NavLink> 
          </li>
      </ul>
       {/*  <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">...</div>
          <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
          <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
        </div> */}
     {/*  <NavLink className="btn contenedor" to="/ProductsPage" activeClass="btn contenedor active">
        Productos
      </NavLink>
      <NavLink className="btn contenedor" to="/CategoriesPage" activeClass="btn contenedor active">
        Categorías
      </NavLink>
      <NavLink className="btn contenedor" to="/ProvidersPage" activeClass="btn contenedor active">
        Proveedores
      </NavLink> */}
    </>

  )
}
