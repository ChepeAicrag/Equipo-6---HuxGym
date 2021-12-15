import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import swal from "sweetalert";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import BtnModalHoja from "../components/BtnModalHoja";
import ModalHojas from "../components/ModalHojas";
import "../styles/Crud.css";
import "../styles/clientes.css";
import { isEmpty } from "../helpers/methods";
import BtnMembresia from "./CambioMembresia";

const url = "https://www.huxgym.codes/customers/customers/";
const urlMembresias = "https://www.huxgym.codes/memberships/memberships";
class Tabla extends Component {
  campos = { 'phone': 'teléfono', 'gender': 'género', 'isStudiant': 'si es estudiante', 'name': 'nombre' };

  state = {
    busqueda: "",
    membresia:"",
    //membresiasList:[],
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    clientes: [],
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: "",
      dateJoined: "",
      gender: "",
      phone: "",
      isStudiant: true,
      image: "",
      membershipActivate: false,
    },
  };

  handleChange = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    console.log(this.state.form);
    e.persist();
    await this.setState({
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
      const res = await axios.get(url);
      if (res.status === 200 || res.status === 201) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */

          data: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      if (msj === "Credenciales invalidas") {
        this.Expulsado();
      }
      console.log(msj);
    }

    try {
      const res = await axios.get(urlMembresias);
      if (res.status === 200 || res.status === 201) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */

          membresiasList: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
    } catch (error) {
      
    }



  };

  validar = (form) => {
    if (isEmpty(form))
      return { error: true, msj: "Debe rellenar los campos obligatorios" };
    const name = form.name;
    const gender = form.gender;
    const isStudiant = form.isStudiant;
    const phone = form.phone;

    if (isEmpty(name) && isEmpty(phone) && isEmpty(gender) && isEmpty(isStudiant))
      return {
        error: true,
        msj: "Los campos de nombre, teléfono, género y si es estudiante son obligatorios",
      };
    if (isEmpty(name))
      return {
        error: true,
        msj: "El campo de nombre no puede estar vacío",
      };
    if (isEmpty(phone))
      return { error: true, msj: "El campo de teléfono no puede estar vacío" };
    if (phone.length < 10)
      return { error: true, msj: "El campo de teléfono debe tener 10 dígitos" };
    if (isEmpty(gender))
      return { error: true, msj: "El campo de género no puede estar vacío" };
    if (isEmpty(isStudiant))
      return { error: true, msj: "Debe seleccionar si es estudiante o no" };
    return { error: false };
  };

  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    try {
      const { form } = this.state;
      const validar = this.validar(form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        let formData = new FormData();
        console.log(form.image)
        console.log(isEmpty(this.state.form.image))
        if (typeof form.image !== "string" && !isEmpty(this.state.form.image))
          formData.append("image", form.image);
        formData.append("name", form.name);
        formData.append("gender", form.gender);
        formData.append("isStudiant", form.isStudiant);
        formData.append("phone", form.phone);
        const res =
          await axios /* a post de parametros le pasamos la url y los datos */
            .post(url, formData);
        if ((res.status === 200) | (res.status === 201)) {
          this.modalInsertar();
          this.peticionGet();
          swal({
            text: "Cliente registrado con éxito",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
        }
      }
    } catch (error) {
      var msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (isEmpty(msj)) {
        const res = JSON.parse(error.request.response)
        const c = Object.keys(res)[0]
        console.log()
        msj = res[c].toString().replace('Este campo', 'El campo ' + this.campos[c])
      }
      swal({
        text: msj,//Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      let formData = new FormData();
      console.log(typeof this.state.form.image);
      console.log(isEmpty(this.state.form.image))
      if (
        typeof this.state.form.image !== "string" &&
        !isEmpty(this.state.form.image)
      )
        formData.append("image", this.state.form.image);
      formData.append("name", this.state.form.name);
      formData.append("gender", this.state.form.gender);
      formData.append("isStudiant", this.state.form.isStudiant);
      formData.append("phone", this.state.form.phone);
      console.log(formData);
      const validar = this.validar(this.state.form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        const res = await axios.put(
          url + this.state.form.id + "/",
          formData /* {
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            } */
        );
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          this.peticionGet();
          swal({
            text: "Cliente actualizado con éxito",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
        }
      }
    } catch (error) {
      var msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (isEmpty(msj)) {
        const res = JSON.parse(error.request.response)
        const c = Object.keys(res)[0]
        console.log()
        msj = res[c].toString().replace('Este campo', 'El campo ' + this.campos[c])
      }
      swal({
        text: msj,//Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  peticionDelete = async () => {
    /* Para eliminar, le pasamos la url */
    try {
      const res = await axios.delete(url + this.state.form.id);

      if ((res.status === 200) | (res.status === 201)) {
        this.setState({
          modalEliminar: false,
        }); /* Cambiamos el estado de la variable modalEliminar */
        this.peticionGet(); /* Volvemos a pedir los datos */
        swal({
          text: "Cliente eliminado con éxito",
          icon: "success",
          button: "Aceptar",
          timer: "5000",
        });
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };
  componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    this.peticionGet();
  }

  Expulsado = () => {
    swal({
      text: "Credenciales Invalidas, Adiosito",
      icon: "info",
      button: "Aceptar",
    }).then((respuesta) => {
      if (respuesta) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("rol");
        localStorage.removeItem("role");
        window.location.href = "/";
      }
    });
  };

  seleccionarUsuario = (clientes) => {
    /* Para obtener los datos del usuario a eliminar */
    var student = String(clientes.isStudiant);
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: clientes.id,
        name: clientes.name,
        dateJoined: clientes.dateJoined,
        gender: clientes.gender,
        phone: clientes.phone,
        isStudiant: student,
        image: clientes.image,
        membershipActivate: clientes.membershipActivate,
      },
    });
  };

  buscador = async (e) => {
    await e.persist();
    this.setState({ busqueda: e.target.value });
    console.log(this.state.busqueda);
    this.filtrarElementos();
  };

  filtrarElementos = () => {
    var i = 0;
    if (this.state.busqueda != "") {
      var search = this.state.data.filter((item) => {
        if (item.name.toLowerCase().includes(this.state.busqueda.toLowerCase())) {
          i = 1;
          return item;
        }
      });
      this.setState({ clientes: search });
      this.setState({ data: this.state.clientes });
    } else {
      this.peticionGet();
    }
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  handleChangeInput = (e) => {
    const { name, value } = e.target;
    // let regex = new RegExp("^[a-zA-Z ]+$");
    let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");

    if (regex.test(value) || isEmpty(value)) {
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      e.target.value = ""
      swal({
        text: "Solo se permiten letras y acentos",
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
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      e.target.value = ""
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
  handleChangeMembresia = (event) => {
    this.setState({
       membresia: event.target.value
    });
  };

  render() {
    const { form } = this.state;

    return (
      <div className="table-responsiveMain">
        <br />
        <div className="opciones">
          <button
            className="btn botones"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              this.setState({ form: null, tipoModal: "insertar" });
              this.modalInsertar();
            }}
          >
            <AddCircleOutlineIcon fontSize="large"></AddCircleOutlineIcon> Nuevo Cliente
          </button>


          <div className="buscarBox"> 
            <input
              type="text"
              className="textField"
              name="busqueda"
              id="busqueda"
              placeholder="Buscar"
              onChange={this.buscador}
              value={form ? form.busqueda : ""}
            />
            <button type="submit" className=" btn botonesBusqueda add-on" onClick={() => { }}>
              <i className="bx bxs-user">
                <box-icon name="search-alt-2" color="#fff"></box-icon>
              </i>
            </button>

          </div>

        </div>
        <br></br>
        <br></br>
        <br />
        <div className="table-wrapper">
          <table className=" tab-pane table ">
            <thead className="tablaHeader">
              <tr className="encabezado">
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Fecha de registro</th>
                <th>Género</th>
                <th>Teléfono</th>
                <th>Estudiante</th>
                <th>Foto</th>
                <th>Estado de la membresía</th>
                <th>Acciones</th>
                <th>Hojas clínicas</th>
              </tr>
            </thead>
            <tbody className="cuerpoTabla base">
              {this.state.data.map((clientes) => {
                return (
                  <tr className="cuerpoT">
                    <td>{clientes.id}</td>
                    <td>{clientes.name}</td>
                    <td>{clientes.dateJoined}</td>
                    <td>{clientes.gender}</td>
                    <td>{clientes.phone}</td>
                    <td>{clientes.isStudiant ? "Si" : "No"}</td>
                    <td>
                        <img
                          src={`https://www.huxgym.codes/${clientes.image}`}
                          width="180"
                          height="150"
                          align="center"
                        />
                    </td>
                    <td>
                       {/*  <BtnMembresia></BtnMembresia> */}
                      {clientes.membershipActivate ? "Activada" : "No Activada"}
                    </td>

                    <td className="">
                      <button
                        className="btn editarHoja"
                        onClick={() => {
                          this.seleccionarUsuario(clientes);
                          this.modalInsertar();
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"  "}
                      {localStorage.getItem("rol") == "Administrador" ? (
                        <button
                          className="btn btn-danger mt-2"
                          onClick={() => {
                            this.seleccionarUsuario(clientes);
                            this.setState({ modalEliminar: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <></>
                      )}
                    </td>
                    <td>
                      <BtnModalHoja id_cliente={clientes.id} /> <br />
                      <ModalHojas
                        id_cliente={clientes.id}
                        name_cliente={clientes.name}
                      />{" "}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Cliente
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Nombre completo*:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                placeholder="Nombre del cliente"
                onChange={this.handleChangeInput}
                value={form ? form.name : ""}
              />
              <br />
              <br />
              <label htmlFor="phone">Teléfono*:</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                size="10"
                placeholder="Teléfono"
                maxLength="10"
                placeholder="Teléfono"
                onChange={this.handleChangeInputNumber}
                value={form ? form.phone : ""}
              />
              <br />
              <br />
              {/* <label htmlFor="phone">Membresia*:</label>
              <br />
              <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-filled-label">Membresia</InputLabel>
                <Select
                  labelId="demo-simple-select-filled-label"
                  id="demo-simple-select-filled"
                  name="membresia"
                  value={this.state.membresia}
                  onChange={this.handleChangeMembresia}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"No activa"}>Sin membresia</MenuItem>
                  {this.state.membresiasList.map((memebresia) => {
                    return (
                      <MenuItem value={" jj"}>{memebresia.name}</MenuItem>
                      
                    );})}
                  
                  
                </Select>
              </FormControl> */}
              <br />
              <label htmlFor="image">Foto:</label>
              <input
                className="form-control"
                type="file"
                name="image"
                ref="file"
                id="image"
                accept="image/png, image/jpeg, image/jpg, image/ico"
                onChange={this.handleChangeInputImage}
              />
              <br />

              <label htmlFor="gender">Género*: </label>
              <br />
              <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn botonesForm m-1">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    autocomplete="off"
                    onChange={this.handleChange}
                    checked={
                      form ? (form.gender === "M" ? true : false) : true
                      // (this.state.tipoModal == "insertar" && form == null) ||
                      // form.gender === undefined
                      //   ? true
                      //   : form.gender === "M"
                      //   ? true
                      //   : false
                    }
                  />{" "}
                  M
                </label>
                <label class="btn botonesForm m-1 ">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    autocomplete="on"
                    onChange={this.handleChange}
                    checked={
                      form ? (form.gender === "F" ? true : false) : true
                      // (this.state.tipoModal === "insertar" && form == null) ||
                      // form.gender === undefined
                      //   ? false
                      //   : form.gender === "F"
                      //   ? true
                      //   : false
                    }
                  />{" "}
                  F
                </label>
              </div>
              <br />

              <br />
              <label htmlFor="isStudiant">Estudiante*:</label>
              <br />
              <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn botonesForm m-1">
                  <input
                    type="radio"
                    name="isStudiant"
                    value={true}
                    autocomplete="on"
                    onChange={this.handleChange}
                    checked={
                      form ? (form.isStudiant === "true" ? true : false) : true
                    }
                  />{" "}
                  Sí
                </label>
                <label class="btn botonesForm m-1">
                  <input
                    type="radio"
                    name="isStudiant"
                    value={false}
                    autocomplete="off"
                    onChange={this.handleChange}
                    checked={
                      form
                        ? form.isStudiant === "false"
                          ? true
                          : false
                        : false
                    }
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === "insertar" ? (
              <button
                className="btn btn-success"
                onClick={() => this.peticionPost()}
              >
                Agregar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}

            <button
              className="btn btn-danger"
              onClick={() => {
                this.modalInsertar();
              }}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Nombre completo</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                readOnly
                onChange={this.handleChangeInput}
                value={form ? form.name : ""}
              />
              <br />
              <label htmlFor="telefono">Teléfono</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                readOnly
                onChange={this.handleChangeInputNumber}
                value={form ? form.phone : ""}
              />
              <br />
              <label htmlFor="genero">Género</label>
              <input
                className="form-control"
                type="text"
                name="gender"
                id="gender"
                readOnly
                onChange={this.handleChange}
                value={form ? form.gender : ""}
              />
              <br />
              ¿Seguro de eliminar este cliente?
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => this.peticionDelete()}
            >
              Sí
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalEliminar: false })}
            >
              No
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Tabla;
