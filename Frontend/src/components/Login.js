import React, { Component } from "react";
import "../styles/Logi.css";
import axios from "axios";
import swal from "sweetalert";
import { isEmpty } from "../helpers/methods";
/* const url_login = process.env.REACT_APP_url_login */
const url_login ="https://www.huxgym.codes/login/";

const validate = (values) => {
  const errors = {};
  if (!values.email) {
    errors.nombre = "Este campo es obligatorio";
  }
  if (!values.password) {
    errors.password = "Este campo es obligatorio";
  }
  return errors;
};
class Login extends Component {
  /* constructor(props) {
    super(props);
  } */

  state = {
    errors: {},
    form: {
      email: "",
      password: "",
    },
    error: false,
    errorMsg: "",
  };

  manejadorSubmit = (e) => {
    e.preventDefault();
    const { errors, ...sinErrors } = this.state;
    const result = validate(sinErrors);

    this.setState({ errors: result });
    if (!Object.keys(result).length) {
      console.log("formulario valido");
    }
  };

  manejadorChange = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };

  validar = (email, password) => {
    if (isEmpty(password) && isEmpty(email)) {
      return { error: true, msj: "Los campos no pueden estar vacío" };
    }
    if (isEmpty(email)) {
      return { error: true, msj: "El campo de correo no puede estar vacío" };
    }
    if (isEmpty(password)) {
      return { error: true, msj: "El campo de password no puede estar vacío" };
    }
    return { error: false };
  };

  manejadorBoton = async () => {
    try {
      const email = this.state.form.email;
      const password = this.state.form.password;
      console.log("url:"+url_login)
      const validate = this.validar(email, password);
      if (validate.error) {
        swal({
          text: validate.msj,
          icon: "info",
          button: "Aceptar",
          timer: "3000",
        });
      } else {
        const res = await axios.post(url_login, {
          /* method: "post", */
          email: this.state.form.email,
          password: this.state.form.password,
        });

        if (res.status === 200 || res.status === 201) {
          console.log(res);
          const { token, user } = res.data;
          localStorage.setItem("token", token);
          localStorage.setItem("email", user.email);
          localStorage.setItem("id", user.id);
          localStorage.setItem("name", user.name);
          localStorage.setItem("role", user.role);
          localStorage.setItem("image", user.image);
          const rol = user.role;
          if (rol === 1) {
            localStorage.setItem("rol", "Administrador");
          } else if (rol === 2) {
            localStorage.setItem("rol", "Encargado");
          } else if (rol === 3) {
            localStorage.setItem("rol", "Instructor");
          }
          window.location.href = "/Dashboard";
        }
      }
    } catch (error) {
      console.log(error);
      var msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if(msj === 'Credentials incorrects')
        msj = 'Contraseña incorrecta'
      else if(msj === 'User not found' )
        msj = 'No hay usuario con email dado'
      else if (msj === 'User not activated')
        msj = 'Usuario no activado, active su cuenta previamente por favor'
      swal({
        text: msj,
        icon: "error",
        button: "Aceptar",
        timer: "3000",
      }); 
    }
  };

  render() {
    return (
      <div className="blanco">
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <div className="fadeIn first">Bienvenido a Gym Huatulco</div>
            <div className="color">
              <form onSubmit={this.manejadorSubmit}>
                Correo electrónico:
                <input
                  type="text"
                  className="fadeIn second"
                  name="email"
                  required=""
                  leyendaError="El correo electrónico debe pertenecer a un dominio"
                  placeholder="Correro electrónico"
                  onChange={this.manejadorChange}
                />
                Contraseña:
                <input
                  type="password"
                  className="fadeIn third"
                  name="password"
                  required=""
                  placeholder="Contraseña"
                  onChange={this.manejadorChange}
                />
                <input
                  type="submit"
                  className="fadeIn fourth"
                  value="Iniciar sesión"
                  onClick={this.manejadorBoton}
                />
              </form>
            </div>
            <div className="color">
              <div id="formFooter">
                <a
                  className="underlineHover"
                  href="/password_reset"
                >
                  ¿Olvidó su contraseña?
                </a>
                {this.state.error === true && (
                  <div className="alert alert-danger" role="alert">
                    ({this.state.errorMsg})
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
