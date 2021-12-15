import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import swal from "sweetalert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"; */
import { isEmpty } from "../helpers/methods";
import BotonProducts from "../components/BotonProducts";

const url = "https://www.huxgym.codes/products/category/";

class TablaC extends Component {
  state = {
    busqueda: "",
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    categorias: [],
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: "",
      description: "",
    },
  };

  handleChange = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
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
    try {
      const res = await axios.get(url, {
        headers: {},
      });
      console.log(res);
      this.setState({
        data: res.data,
      });
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  };

  validar = (form) => {
    if (form === null) {
      return { error: true, msj: "Rellene los campos" };
    }
    const description = form.description;
    const name = form.name;
    if (isEmpty(name))
      return { error: true, msj: "El campo de nombre no puede estar vacío" };
    if (isEmpty(description))
      return {
        error: true,
        msj: "El campo de descripción no puede estar vacío",
      };
    return { error: false };
  };

  peticionPost = async () => {
    try {
      const validar = this.validar(this.state.form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      } else {
        delete this.state.form.id;
        const res = await axios.post(url, this.state.form, {
          headers: {},
        });
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar();
          this.peticionGet();
          swal({
            text: "Categoría agregada correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "4000",
          });
        }
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

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      delete this.state.form.image;
      const validar = this.validar(this.state.form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      } else {
        const res = await axios.put(url + this.state.form.id, this.state.form, {
          headers: {},
        });
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos con get*/
          this.peticionGet();
          swal({
            text: "Categoría actualizada correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "4000",
          });
        }
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

  peticionDelete = async () => {
    try {
      const res = await axios.delete(url + this.state.form.id, {
        headers: {},
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          modalEliminar: false,
        });
        this.peticionGet();
        swal({
          text: "Categoría eliminada correctamente",
          icon: "success",
          button: "Aceptar",
          timer: "4000",
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

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarUsuario = (categorias) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: categorias.id,
        name: categorias.name,
        description: categorias.description,
      },
    });
  };

  buscador = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
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
      this.setState({ categorias: search });
      this.setState({ data: this.state.categorias });
    } else {
      this.peticionGet();
    }
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

  render() {
    const { form } = this.state;
    return (
      <div className="table-responsiveMain">
        <br />
        <div className="Barra_opciones">
          <BotonProducts />
        </div>
        <br />
        <div className="Busqueda">
          <button
            className="btn botones"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              this.setState({ form: null, tipoModal: "insertar" });
              this.modalInsertar();
            }}
          >
            {/* <i className="bx bxs-user">
              <box-icon
                type="solid"
                name="user"
                color="#fff"
                animation="tada"
              ></box-icon>
            </i> */}
            <AddCircleOutlineIcon fontSize="large"></AddCircleOutlineIcon>
          </button>
          <div className="esp"></div>
          <input
            type="text"
            className="textField"
            name="busqueda"
            id="busqueda"
            placeholder="Buscar"
            onChange={this.buscador}
            value={this.state.busqueda}
          />
          <button type="submit" className="add-on" onClick={() => {}}>
            <i className="bx bxs-user">
              <box-icon name="search-alt-2" color="#fff"></box-icon>
            </i>
          </button>
        </div>
        <br></br>
        <div className="table-wrapper">
          <table className="tab-pane  table">
            <thead className="tablaHeader">
              <tr className="encabezado">
                <th>Id</th>
                <th>Nombre de la categoría</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="cuerpoTabla base">
              {this.state.data.map((categorias) => {
                /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                return (
                  <tr>
                    <td>{categorias.id}</td>
                    <td>{categorias.name}</td>
                    <td>{categorias.description}</td>
                    <td>
                      <button
                        className="btn btn-editar"
                        onClick={() => {
                          this.seleccionarUsuario(categorias);
                          this.modalInsertar();
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"  "}
                      {localStorage.getItem("rol") === "Administrador" ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.seleccionarUsuario(categorias);
                            this.setState({ modalEliminar: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <></>
                      )}
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
            CATEGORIA
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {this.state.tipoModal == "insertar" ? (
                <></>
              ) : (
                <>
                  <label htmlFor="id">Id:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="id"
                    id="id"
                    readOnly
                    onChange={this.handleChange}
                    value={form ? form.id : ""}
                  />
                </>
              )}

              <br />
              <label htmlFor="name">Nombre de la categoría*:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                placeholder="Nombre de la categoría"
                id="name"
                pattern="^[a-zA-Z]+"
                maxLength="40"
                onChange={this.handleChangeInput}
                value={form ? form.name : ""}
              />
              <br />
              <label htmlFor="description">Descripción*:</label>
              <input
                className="form-control"
                type="text"
                name="description"
                id="description"
                placeholder="Descripción de la categoría"
                pattern="^[a-zA-Z]+"
                maxLength="100"
                onChange={this.handleChangeInput}
                value={form ? form.description : ""}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == "insertar" ? (
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
              <label htmlFor="name">Nombre de la categoría:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                readOnly
                onChange={this.handleChange}
                value={form ? form.name : ""}
              />
              <br />
              <label htmlFor="description">Descripción:</label>
              <input
                className="form-control"
                type="text"
                name="description"
                id="description"
                readOnly
                onChange={this.handleChange}
                value={form ? form.description : ""}
              />
              <br />
              <br />
              ¿Seguro de eliminar esta categoría?
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

export default TablaC;
