import React, { Component } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import md5 from "md5";
import Cookies from "universal-cookie";
import '../styles/Logi.css';
import Visible from '../components/Visible';

const baseUrl = "http://localhost:3001/usuarios/";
const cookies = new Cookies(); /* para almacenar los datos de sesion */
class LoginPage extends Component {
  state = {
    form: {
      mail: "",
      password: "",
    },
  };

  handleChange = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  iniciarsesion = async () => {
    await axios
      .post(baseUrl, {
        mail: this.state.form.mail,
        password: md5(this.state.form.password),
      })
      .then((response) => {
        console.log(response);
        return response.data;
      })
      .then((response) => {
        if (response.length > 0) {
          var respuesta = response[0];
          cookies.set("id", respuesta.id, { path: "/" });
          cookies.set("apellido_paterno", respuesta.apellido_paterno, {
            path: "/",
          });
          cookies.set("apellido_materno", respuesta.apellido_materno, {
            path: "/",
          });
          cookies.set("nombre", respuesta.nombre, { path: "/" });
          cookies.set("email", respuesta.mail, { path: "/" });
          alert(`Bienvenido ${respuesta.nombre} ${respuesta.apellido_paterno}`);
          window.location.href = "./Dashboard";
        } else {
          alert(response.status);
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  componentDidMount() {
    if (cookies.get("email")) {
      window.location.href = "/Dashboard";
    }
  }

  render() {
    return (
      <div className="containerPrincipal">
        <div className="containerSecundario">
          
          <div className="form-group">
          <h1>Bienvenidos a HuxGym</h1>
            <label className="correo">Correo Electronico: </label>
            <br />
            <input
              type="text"
              className="form-control"
              name="mail"
              onChange={this.handleChange}
            />
            
            <br />
            <label>Contraseña: </label>
            <br />
            <input
              type="password"
              className="form-control"
              name="password"
              onChange={this.handleChange}
            />
            <br />
            <button
              className="btn btn-primary"
              onClick={() => this.iniciarsesion()}
            >
              Iniciar Sesion
            </button>
          </div>
          <br></br>
          <a href="/password_reset">¿Olvidó su contrasdasdasdseña?</a>
          
        </div>
        
      </div>
    );
  }
}

export default LoginPage;
