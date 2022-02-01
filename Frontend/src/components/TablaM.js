import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import "../styles/tablaStyle.css";
import swal from "sweetalert";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TextField from "@material-ui/core/TextField";
import { isEmpty } from "../helpers/methods";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import { withStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
  Typography,
  TablePagination,
  TableFooter,
} from "@material-ui/core";
const url = "https://www.api.huxgym.codes/memberships/memberships/";

const useStyles = (theme) => ({
  table: {
    height: "100%",
    width: "100%",
  },
  tableContainer: {
    borderRadius: 15,
    display: "flex",
    flexDireccion: "center",
    paddig: "10px 10px",
    maxWidth: "100%",
    height: "100%",
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: "#144983",
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
    marginRight: "50px",
  },
  name: {
    fontWeight: "bold",
    color: "black",
  },
  paginacion: {
    width: "50%",
    backgroundColor: "#e9f1f3",
  },
  status: {
    fontWeight: "bold",
    fontSize: "5rem",
    color: "black",
    //backgroundColor: 'grey',
    borderRadius: 0,
    padding: "3px 10px",
    display: "inline-block",
  },
});
const columnas = [
  "Folio",
  "Nombre de la membresía",
  "Descripción",
  "Precio",
  "Duración (Días)",
  "Acciones",
];
class TablaM extends Component {
  state = {
    page: 0,
    rowsPerPage: 3,
    busqueda: "",
    dataBuscar: [],
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    membresias: [],

    errors: {},
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      folio: "",
      name: "",
      price: "",
      description: "",
      day: 7,
      folio: "",
    },
  };
  //PAginacion
  handleChangePage = (event, newPage) => {
    this.setState({
      page: newPage,
    });
  };
  handleChangeRowsPerPage = async (event) => {
    console.log(event.target);
    await this.setState({
      page: 0,
      rowsPerPage: event.target.value,
    });
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
        dataBuscar: res.data,
      });
    } catch (error) {
      try {
        const msj = JSON.parse(error.request.response).message;
        console.log(msj);
      } catch (error2) {
        swal({
          text: "Error en el servidor",
          icon: "error",
          button: "Aceptar",
          timer: "3000",
        });
      }
    }
  };

  validar = () => {
    const { form } = this.state;
    if (isEmpty(form))
      return { error: true, msj: "Rellene los campos obligatorios" };
    const name = form.name;
    const price = form.price;
    const description = form.description;
    const day = form.day;
    const folio = form.folio;
    if (isEmpty(name)) {
      return { error: true, msj: "El campo nombre no puede estar vacío" };
    }
    if (isEmpty(price))
      return {
        error: true,
        msj: "El campo precio no puede estar vacío",
      };
    if (price <= 0) {
      return {
        error: true,
        msj: "El campo precio no puede ser menor o igual a cero",
      };
    }
    if (isEmpty(description)) {
      return { error: true, msj: "El campo descripción no puede estar vacío" };
    }
    if (isEmpty(day))
      return {
        error: true,
        msj: "El campo cantidad de días no puede ser menor o igual a cero",
      };
    if (day <= 6) {
      return {
        error: true,
        msj: "La duración de días no puede ser menor a 7 días",
      };
    }
    return { error: false };
  };

  peticionPost = async () => {
    try {
      // Validaciones
      const validate = this.validar();
      if (validate.error) {
        swal({
          text: validate.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        delete this.state.form.id;
        this.state.form.price = parseFloat(this.state.form.price);
        const res = await axios.post(url, this.state.form, {
          headers: {},
        });

        if (res.status === 200 || res.status === 201) {
          this.modalInsertar();
          this.peticionGet();
          swal({
            text: "Membresia agregada satisfactoriamente",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
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

    console.log("ddddd");
    try {
      const validate = this.validar();
      if (validate.error) {
        swal({
          text: validate.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        this.state.form.price = parseFloat(this.state.form.price);
        const res = await axios.put(
          url + this.state.form.id + "/",
          this.state.form,
          {
            headers: {},
          }
        );

        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          this.peticionGet();
          swal({
            text: "Membresia actualizada correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
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
      const res = await axios.delete(url + this.state.form.id + "/", {
        headers: {},
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          modalEliminar: false,
        });
        this.peticionGet();
        swal({
          text: "Membresia eliminada correctamente",
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

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarUsuario = (membresias) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: membresias.id,
        name: membresias.name,
        description: membresias.description,
        price: membresias.price,
        day: membresias.day,
        folio: membresias.folio,
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
    this.setState({ data: this.state.dataBuscar });
    if (this.state.busqueda != "") {
      var search = this.state.data.filter((item) => {
        if (
          item.name.toLowerCase().includes(this.state.busqueda.toLowerCase()) |
          item.description
            .toLowerCase()
            .includes(this.state.busqueda.toLowerCase()) |
          item.folio.toLowerCase().includes(this.state.busqueda.toLowerCase()) |
          item.price
            .toString()
            .toLowerCase()
            .includes(this.state.busqueda.toLowerCase()) |
          item.day
            .toString()
            .toLowerCase()
            .includes(this.state.busqueda.toLowerCase())
        ) {
          return item;
        }
      });

      this.setState({ data: search });
    } else {
      this.setState({ data: this.state.dataBuscar });
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
      e.target.value = "";
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
    console.log(regex.test(value));
    if (regex.test(value)) {
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

  handleChangeInputNumberDecimal = (e) => {
    let val = e.target.value;
    const name = e.target.name;
    if (val.toString().includes("-")) {
      swal({
        text: "No se permiten negativos",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    } else {
      val = val.replace(/([^0-9.]+)/, "");
      val = val.replace(/^(0|\.)/, "");
      const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
      const value = match[1] + match[2];
      e.target.value = value;
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
      if (val.length > 0) {
        e.target.value = Number(value).toFixed(2);
        this.setState({
          form: {
            ...this.state.form,
            [name]: Number(value).toFixed(2),
          },
        });
      }
    }
  };

  render() {
    const { form } = this.state;
    const { classes } = this.props;
    return (
      <div className="my-custom-scrollbar2">
        <br />

        <div className="opciones mt-3 mb-4">
          <button
            className="btn botones"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              this.setState({ form: null, tipoModal: "insertar" });
              this.modalInsertar();
            }}
            title="Agregar nueva membresía"
          >
            <AddCircleOutlineIcon fontSize="large"></AddCircleOutlineIcon> Nueva
            Membresia
          </button>
          <div className="buscarBox">
            <input
              type="text"
              className="textField"
              name="busqueda"
              id="busqueda"
              placeholder="Buscar"
              onChange={this.buscador}
              value={this.state.busqueda}
              title="Buscar membresía"
            />
            <button
              type="submit"
              className="btn botonesBusqueda add-on"
              onClick={() => {}}
            >
              <i className="bx bxs-user">
                <box-icon name="search-alt-2" color="#fff"></box-icon>
              </i>
            </button>
          </div>
        </div>
        <br />
        <div className="tablaNueva">
          {
          this.state.data.length <= 0 ? <p className="mt-4 sinClientes">Ninguna membresía encontrada</p>
            : 

            <TableContainer component={Paper} className={classes.tableContainer} >
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableHeaderCell}>
                      Folio
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      Nombre del membresía
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      Descripción
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      Precio
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      Duración (Días)
                    </TableCell>
                    <TableCell className={classes.tableHeaderCell}>
                      Acciones
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.data.slice( this.state.page * this.state.rowsPerPage,this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => (
                      <TableRow key={row.name}>
                        <TableCell>{row.folio}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{"$" + row.price}</TableCell>
                        <TableCell>{row.day}</TableCell>
                        <TableCell>
                        <button
                        className="btn btn-editar"
                        onClick={() => {
                          this.seleccionarUsuario(row);
                          this.modalInsertar();
                        }}
                        title="Editar membresía"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"  "}
                      {localStorage.getItem("rol") == "Administrador" ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.seleccionarUsuario(row);
                            this.setState({ modalEliminar: true });
                          }}
                          title="Dar de baja"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <></>
                      )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
                <TableFooter className={classes.paginacion}>
                <TablePagination
                  className={classes.paginacion}
                  rowsPerPageOptions={[3, 10, 15]}
                  //component="div"
                  count={this.state.data.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={
                              this.handleChangeRowsPerPage
                            }
              />       
                </TableFooter>
              </Table>
            </TableContainer>
          }
        </div>

        {/* {<div className="table-wrapper">
          <table className="tab-pane  table ">
            <thead className="tablaHeader">
              <tr className="encabezado">
                <th>Folio</th>
                <th>Nombre del membresía</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Duración (Días)</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="cuerpoTabla base">
              {this.state.data.map((membresias) => {
                Con esto recorremos todo nuestro arreglo data para rellenar filas
                return (
                  <tr>
                    <td>{membresias.folio}</td>
                    <td>{membresias.name}</td>
                    <td>{membresias.description}</td>
                    <td>{"$ " + membresias.price}</td>
                    <td>{membresias.day}</td>
                    <td>
                      <button
                        className="btn btn-editar"
                        onClick={() => {
                          this.seleccionarUsuario(membresias);
                          this.modalInsertar();
                        }}
                        title="Editar membresía"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"  "}
                      {localStorage.getItem("rol") == "Administrador" ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.seleccionarUsuario(membresias);
                            this.setState({ modalEliminar: true });
                          }}
                          title="Dar de baja"
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
        </div>} */}

        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            <p className="titulo">Membresia</p>
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {this.state.tipoModal == "insertar" ? (
                <></>
              ) : (
                <>
                  {/*  <label htmlFor="id">Id</label>
                  <input
                    className="form-control"
                    type="text"
                    name="id"
                    id="id"
                    readOnly
                    onChange={this.handleChange}
                    value={form ? form.id : this.state.data.length + 1}
                  /> */}
                </>
              )}
              <label htmlFor="name">Nombre de la membresía (*):</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                placeholder="Nombre de la membresía"
                maxLength="50"
                onChange={this.handleChangeInput}
                value={form ? form.name : ""}
              />
              <br />
              <br />
              <label htmlFor="description">Descripción (*):</label>
              <input
                className="form-control"
                type="text"
                name="description"
                id="description"
                placeholder="Descripción"
                maxLength="100"
                onChange={this.handleChangeInput}
                value={form ? form.description : ""}
              />
              <br />
              <br />
              <InputLabel
                htmlFor="standard-adornment-amount"
                style={{ color: "white" }}
              >
                Precio (*):
              </InputLabel>
              <div className="signo ">
                <h4 className="mr-2" style={{ color: "white" }}>
                  $
                </h4>

                <TextField
                  id="outlined-number"
                  name="price"
                  onChange={this.handleChangeInputNumber}
                  value={form ? form.price : 0}
                  InputProps={{ inputProps: { min: 0 } }}
                  type="number"
                  style={{ borderRadius: "0px" }}
                  placeholder="Precio de venta"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
              </div>

              {/* <label htmlFor="price">Precio (*):</label> */}

              {/* <input
                className="form-control"
                type="text"
                name="price"
                id="price"
                min="0"
                placeholder="Precio de venta"
                onChange={this.handleChangeInputNumber}
                value={form ? form.price : ""}
              /> */}

              <br />
              <br />
              <label htmlFor="price">Duración (cantidad de días) (*):</label>
              <br />
              {/* <input
                className="form-control"
                type="text"
                name="day"
                id="day"
                min="7"
                placeholder="Duración en días"
                onChange={this.handleChangeInputNumber}
                value={form ? form.day : ""}
              /> */}
              <TextField
                id="outlined-number"
                name="day"
                onChange={this.handleChangeInputNumber}
                value={form ? form.day : 0}
                type="number"
                InputProps={{ inputProps: { min: 7 } }}
                placeholder="Duración en días"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <br />
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
              <label htmlFor="name">Nombre de la membresía:</label>
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
              <label htmlFor="price">Precio:</label>
              <input
                className="form-control"
                type="text"
                name="price"
                id="price"
                readOnly
                onChange={this.handleChange}
                value={form ? form.price : ""}
              />
              <br />
              ¿Seguro de eliminar esta membresía?
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

export default withStyles(useStyles, { withTheme: true })(TablaM);
