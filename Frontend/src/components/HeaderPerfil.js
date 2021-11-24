import Image from "react-bootstrap/Image";
import MenuDesplegable from "./MenuDesplegable";
import "../styles/HeaderPerfil.css";
const HeaderPerfil = () => {
  return (
    <div className="Hp">
      <div className="Correo">Correo: {localStorage.getItem("email")}</div>
      <div className="Rol">Rol: {localStorage.getItem("rol")}</div>
      <div className="Imagen"></div>
      <div className="opciones">
        <MenuDesplegable />
      </div>
    </div>
  );
};
export default HeaderPerfil;
