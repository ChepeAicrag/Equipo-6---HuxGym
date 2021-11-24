import React, { Component } from "react";
import "../styles/Crud.css";
import "../styles/verEditarPerfil.css";
import axios from "axios";
import swal from "sweetalert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { isEmpty } from "../helpers/methods";

const url = "https://www.huxgym.codes/user/";
class VerEditarPerfil extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    empleados: [],
    tipo: "",
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: "",
      age: "",
      gender: "",
      image: "",
      phone: "",
      email: "",
      //password: "",
      rol: "",
    },
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

  peticionGet = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(url + localStorage.getItem("id") + "/", {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */
          data: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
        await this.seleccionarUsuario(res.data);
        localStorage.setItem("image", res.data.image);
        console.log(res);
      }
    } catch (error) {
      //const msj = JSON.parse(error.request.response).message;
      console.log(error);
      /* if (msj === "Credenciales invalidas") {
        this.Expulsado();
      } else {
        swal({
          text: msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      } */
    }
  };

  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    delete this.state.form.id;
    try {
      const res =
        await axios /* a post de parametros le pasamos la url y los datos */
          .post(url, this.state.form, {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          });
      if (res.status === 200 || res.status === 201) {
        /* cambiamos el estado de modalInsertar y volvemos a pedir los datos*/
        this.modalInsertar();
        this.peticionGet();
      }
    } catch (error) {
      //const msj = JSON.parse(error.request.response).message;
      console.log(error);
      /* if (msj === "Credenciales invalidas") {
        this.Expulsado();
      } else {
        swal({
          text: msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      } */
    }
  };

  validar = (form) => {
    if (form === null) {
      return { error: true, msj: "Rellene los campos" };
    }
    const name = form.name;
    const gender = form.gender;
    const phone = form.phone;
    const age = form.age;

    if (isEmpty(name))
      return { error: true, msj: "El campo de nombre no puede estar vacío" };
    if (isEmpty(age))
      return { error: true, msj: "El campo de edad no puede estar vacío" };
    const edad = parseInt(age)
    if(edad < 18)
      return { error: true, msj: "La edad debe ser mayor a 18 años" }; 
    if (isEmpty(phone))
      return { error: true, msj: "El campo de telefono no puede estar vacío" };
    if (isEmpty(gender))
      return { error: true, msj: "El campo de genero no puede estar vacío" };
    return { error: false };
  };

  peticionPut = async () => {
    try {
      const form = this.state.form;
      const validar = this.validar(form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "3000",
        });
      } else {
        let formData = new FormData();
        console.log(this.state.form.image);
        if (typeof this.state.form.image !== "string")
          formData.append("image", form.image);
        formData.append("name", form.name);
        formData.append("gender", form.gender);
        formData.append("phone", form.phone);
        formData.append("age", form.age);
        const res = await axios.put(
          url + localStorage.getItem("id") + "/",
          formData,
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          const { name } = res.data;
          localStorage.setItem("name", name);
          await this.componentDidMount()
          swal({
            text: "Información de perfil actualizada correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "3000",
          });
          window.location.href = "/Dashboard";
        }
      }
    } catch (error) {
      //const msj = JSON.parse(error.request.response).message;
      console.log(error);
      /* if (msj === "Credenciales invalidas") {
        this.Expulsado();
      } else {
        swal({
          text: msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      } */
    }
  };

  async componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    await this.peticionGet();
  }

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  Expulsado = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("rol");
    localStorage.removeItem("role");
    swal({
      text: "Sesión expirada",
      icon: "error",
      button: "Aceptar",
      timer: "5000",
    });
    window.location.href = "/";
  };

  seleccionarUsuario =  (empleados) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: this.state.tipo,
      modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
      modalEliminar: false,
      total: 0,
      empleados: [],
      form: {
        id: empleados.id,
        name: empleados.name,
        age: empleados.age,
        gender: empleados.gender,
        image: empleados.image,
        phone: empleados.phone,
        email: empleados.email,
        role: empleados.role,
      },
    });
  };

  handleChangeInput = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");

    if (regex.test(value) || isEmpty(value)) {
      console.log(name, value);
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      swal({
        text: "No se permiten números",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  handleChangeInputNumber = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value) || isEmpty(value)) {
      console.log(name, value);
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      swal({
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  handleChangeInputImage = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    let regex = ["image/png", "image/jpeg", "image/jpg", "image/ico"];
    if (typeof file !== undefined)
      if (regex.includes(file.type)) {
        this.setState({
          form: {
            ...this.state.form,
            [name]: file,
          },
        });
      } else {
        this.setState({
          form: {
            ...this.state.form,
            [name]: "",
          },
        });
        swal({
          text: "Formato de imágen invalido",
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      }
  };

  render() {
    const { form } = this.state;
    return (
      <>
        <button
          className="btn btn-deplegable"
          onClick={() => {
            /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
            this.setState({ tipoModal: this.props.tipo });
            this.modalInsertar();
          }}
        >
          {this.props.accion}
        </button>
        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            {this.props.accion} Empleado
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {this.state.tipoModal === "ver" ? (
                <>
                  <label htmlFor="foto">Foto</label>
                  <div className="form-control foto" align="center">
                    <img
                      src={`https://www.huxgym.codes/${localStorage.getItem(
                        "image"
                      )}`}
                      width="200"
                      height="200"
                      align="center"
                    />
                  </div>
                  <br />
                  <label className="campo" htmlFor="name">Nombre Completo:</label>
                  <p className="dato">{form.name}</p>
                 
                  <label className="campo" htmlFor="age">Edad:</label>
                  <h6 className="dato">{" "+form.age}</h6>
                  
                  <label className="campo" htmlFor="gender">Genero: </label>
                  <br />
                  <h6 className="dato">{form.gender}</h6>
                  

                  <label className="campo" htmlFor="phone">Telefono:</label>
                  <h6 className="dato">{form.phone}</h6>
                 
                </>
              ) : (
                <>
                  <label htmlFor="name">Nombre Completo:</label>
                  <input
                    className="form-control"
                    maxLength="50"
                    type="text"
                    name="name"
                    id="name"
                    onChange={this.handleChangeInput}
                    value={form.name}
                  />
                  <br />
                  <label htmlFor="age">Edad</label>
                  <input
                    className="form-control"
                    type="text"
                    name="age"
                    id="age"
                    maxlength="2"
                    onChange={this.handleChangeInputNumber}
                    value={form.age}
                  />
                  <br />
                  <label htmlFor="phone">Telefono</label>
                  <input
                    className="form-control"
                    type="text"
                    name="phone"
                    id="phone"
                    size="10"
                    maxLength="10"
                    onChange={this.handleChangeInputNumber}
                    value={form.phone}
                  />
                  <br />
                  <label htmlFor="gender">Genero </label>
                  <br />
                  <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn btn-info">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        autocomplete="off"
                        onChange={this.handleChange}
                        checked={
                          (this.state.tipoModal === "insertar" &&
                            form == null) ||
                          form.gender === undefined
                            ? true
                            : form.gender === "M"
                            ? true
                            : false
                        }
                      />{" "}
                      M
                    </label>
                    <label class="btn btn-info ">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        autocomplete="on"
                        onChange={this.handleChange}
                        checked={
                          (this.state.tipoModal === "insertar" &&
                            form == null) ||
                          form.gender === undefined
                            ? false
                            : form.gender === "F"
                            ? true
                            : false
                        }
                      />{" "}
                      F
                    </label>
                  </div>{" "}
                  <br />
                  <label htmlFor="foto">Foto</label>
                  <input
                    className="form-control"
                    type="file"
                    name="image"
                    ref="file"
                    id="image"
                    onChange={
                      this.handleChangeInputImage
                      // (e) => {
                      // this.setState({
                      //   form: {
                      //     ...this.state.form,
                      //     image: e.target.files[0],
                      //   },
                      // });
                      // }
                    }
                    //value={form ? form.image : ""}
                  />
                </>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === "ver" ? (
              <button
                className="btn btn-cerrarV"
                onClick={() => {
                  this.peticionGet();
                  this.modalInsertar();
                }}
              >
                Cerrar
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => this.peticionPut()}
                >
                  Actualizar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    this.peticionGet();
                    this.modalInsertar();
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default VerEditarPerfil;
