import React, { Component } from "react";
import "../styles/Crud.css";
import axios from "axios";
import swal from 'sweetalert';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { isEmpty } from '../helpers/methods';
const url = "https://www.api.huxgym.codes/change-password/";

class CambiarContra extends Component {
  state = {
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      email: "",
      password_old: "",
      newpassword: "",
      newpasswordC: "",
    },
  };

  limpiar = () => {
    this.setState({
      form: {
        password_old: "",
        newpassword: "",
        newpasswordC: "",
      },
    });
  };

  handleChange = (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    e.persist();
    this.setState({
      form: {
        ...this.state
          .form /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });
    console.log(this.state.form);
  };


  validar = (password_old, password, password_2) => {
    if(isEmpty(password_old) && isEmpty(password) && isEmpty(password_2)){
      return { error: true, msj: "Los campos no pueden estar vacío"} 
    }
    if(isEmpty(password_old)){
      return { error: true, msj: "La contraseña actual es requerida"} 
    }
    if(isEmpty(password)){
      return { error: true, msj: "La nueva contraseña es requerida"} 
    }
    if(isEmpty(password_2)){
      return { error: true, msj: "La contraseña de confirmación es requerida"} 
    }
    if (password !== password_2) {
      return { error: true, msj: "La nueva contraseña y la confirmación de contraseña no coinciden"} 
    }
    return { error: false }
  }

  peticionPost = async () => {
    const password_old = this.state.form.password_old;
    const password = this.state.form.newpassword;
    const password_2 = this.state.form.newpasswordC;
    
    const validate = this.validar(password_old, password, password_2);
    if (validate.error){
      swal({
        text: validate.msj,
        icon: "info",
        button: "Aceptar",
        timer: "3000",
      });
    } else {
      try {
        const res = await axios.post(
          url,
          {
            email: localStorage.getItem("email"),
            password_old,
            password,
          },
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        if (res.status === 200 || res.status === 201) {
          console.log(res);
          this.modalInsertar();
          swal({
            text: "Contraseña actualizada correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "3000",
          });
        }
      } catch (error) {
        const msj = JSON.parse(error.request.response).message;
        console.log(msj);
        swal({
          text: msj,
          icon: "error",
          button: "Aceptar",
          timer: "3000",
        });
      
      }
    }
  };

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  render() {
    const { form } = this.state;
    return (
      <>
        <button
          className="btn btn-deplegable"
          onClick={() => {
            /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
            /* this.setState({ tipoModal: this.props.tipo }); */
            this.modalInsertar();
          }}
        >
          Cambiar contraseña
        </button>
        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Cambiar 
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody className="pass-body">
            <div className="form-group">
              <label htmlFor="password">Introducir contraseña actual:</label>
              <input
                className="form-control"
                type="password"
                name="password_old"
                id="password_old"
                onChange={this.handleChange}
                value={form ? form.password_old : ""}
                /* form ? form.id : this.state.data.length + 1 */
              />
              <br />
              <label htmlFor="newPassword">Nueva contraseña:</label>
              <input
                className="form-control"
                type="password"
                name="newpassword"
                id="newpassword"
                minLength="8"
                onChange={this.handleChange}
                value={form ? form.newpassword : ""}
              />
              <br />
              <label htmlFor="newPassworC">Confirmar contraseña:</label>
              <input
                className="form-control"
                type="password"
                name="newpasswordC"
                id="newpasswordC"
                onChange={this.handleChange}
                value={form ? form.newpasswordC : ""}
              />
              <br />
            </div>
          </ModalBody>

          <ModalFooter className="actualizar-pass">
            <button
              className="btn btn-primary"
              onClick={() => this.peticionPost()}
            >
              Actualizar
            </button>

            <button
              className="btn btn-danger"
              onClick={() => {
                this.modalInsertar();
                this.limpiar();
              }}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default CambiarContra;
