import React, { Component } from "react";
import "../styles/PasswordReset.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { isEmpty } from '../helpers/methods';
import swal from 'sweetalert';

const url = "https://www.api.huxgym.codes/restore-password/";
class PasswordResetPage extends Component {
  state = {
    form: {
      email: "",
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

  manejadorBoton = async() => {
    try {
      const email = this.state.form.email;
      if(isEmpty(email)){
        swal({
          text: "El campo no puede estar vacío",
          icon: "info",
          button: "Aceptar",
          timer: "3000",
        });
      }else{
        const res = await axios.post(url, {
          email: email,
        });
        if (res.status === 200) {
          swal({
            text: "Solicitud enviada correctamente. Revise su bandeja de correo electrónico",
            icon: "success",
            button: "Aceptar",
            timer: "6000",
          });
          window.location.href = "/";
        }
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message
      console.log(msj);
      this.setState({
        error: true,
        errorMsg: msj,
      });
      swal({
        text: msj === 'User not found' ? 'No existe un usuario registrado con este correo' : msj,
        icon: "error",
        button: "Aceptar",
        timer: "3000",
      });
    }
  };

  volverLogin = () => {
    window.location.href = "/";
  };

  render() {
    return (
      <div className="PrincipalReset">
      <div className="containerPrincipalR">
        <div className="containerSecundarioR">
          <div className="form-group">
            <label>Ingrese la dirección de correo electrónico verificada de su cuenta de usuario y le enviaremos un enlace para restablecer la contraseña. </label>
            <br />
            <br />
            <input
              type="text"
              className="textField"
              name="email"
              placeholder="Correro Electrónico"
              onChange={this.handleChange}
            />
            <br />
            <button
              className="btn btn-primary"
              onClick={() => this.manejadorBoton()}
            >
              Enviar enlace de recuperación
            </button>
            <br />
            <br />
            <button className="btn btn-danger" onClick={this.volverLogin}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
export default PasswordResetPage;
