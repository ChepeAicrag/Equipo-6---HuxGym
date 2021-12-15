import React from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import BtnLogout from "./BtnLogout";
import VerEditarPerfil from "./VerEditarPerfil";
import CambiarContra from "./CambiarContra";
import '../styles/menu.css';
import MenuIcon from '@material-ui/icons/Menu';


export default function MenuDesplegable() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    
      <div className="dropdown hamburg">
        <button className="btn btn-light  dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <MenuIcon className="colorIcon " ></MenuIcon>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <VerEditarPerfil accion="Ver perfil" tipo="ver" />
          <VerEditarPerfil accion="Editar perfil" tipo="editar" />
          <CambiarContra />
          <BtnLogout />
        </div>
      </div>
    
  );
}
