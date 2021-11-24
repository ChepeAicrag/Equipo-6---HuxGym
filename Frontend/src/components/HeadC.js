import React from "react";
import "../styles/Header.css";
import MenuDesplegable from "./MenuDesplegable";


function HeadC() {
  return (
    <div className="HeaderOficial">
      <div className="logo_content">
            <div className="logo_name">Gym Huatulco</div>
      </div>

      <div className="info-config">
            <div className="Correo">
              <div>{localStorage.getItem("email")}</div>
            </div>
            
            <div className="Perfil ">
              <div className="imagenP mr-2">
                <img className="imgPerfil" src={`https://www.huxgym.codes/${localStorage.getItem("image")}`} width="50" height="50" align="center"/>
              </div>
              <div className="NombreRol">
                {/* <div className="Nombre"> {localStorage.getItem("name")}</div> */}
                <div className="Rol"> {localStorage.getItem("rol")} </div>
              </div>
              <div className="menuD ml-2">
                <MenuDesplegable></MenuDesplegable>
              </div>
              
            </div>
      </div>
      
    </div>
  );
}

export default HeadC;
