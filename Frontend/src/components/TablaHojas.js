import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import TimeField from "react-simple-timefield";
import BtnModalHoja from "../components/BtnModalHoja";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

const url = "https://www.api.huxgym.codes/customers/historyClinic/5/";


class TablaHojas extends Component {
  state = {
    busqueda: "",
    data: [] /* Aqui se almacena toda la informacion axios */,
    sintomas: [],
    list: [],
    sintomasSelect: {},
    modalAgregar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalAgregar2: false,
    modalAgregar3: false,
    tipoModal: "Agregar",
    modalEliminar: false,
    clientes: [],
    customer_id: this.props.id_cliente,
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario modal 1*/
      date: "",
      height: "",
      weight: "",
      bloody: "",
      hour_breakfast: "",
      hour_collation: "",
      hour_lunch: "",
      hour_snack: "",
      hour_dinner: "",

      /* Aqui guardaremos los datos que el usuario introduce en el formulario modal 2*/
      // },

      // formbodyattribute: {
      //   name: "",
      //   descripcion: "",
      //   status: "",
      // }
    },
    formcorps: {
      uno: "",
      dos: "",
      tres: "",
      cuatro: "",
      cinco: "",
      seis: "",
      siete: "",
      ocho: "",
      nueve: "",
      diez: "",
      once: "",
      doce: "",
      trece: "",
      catorce: "",
      quince: "",
      dieciseis: "",
      diecisiete: "",

    },
    formextra: {
      id: "",
      namee: "",
      descriptione: "",
      statuse: "",
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
      if (res.status === 200) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */

          data: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      this.setState({
        error: true,
        errorMsg: msj,
      });
    }
  };

  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    delete this.state.form.id;
    try {
      const res =
        await axios /* a post de parametros le pasamos la url y los datos */
          .post(url, this.state.form);
      if ((res.status === 200) | (res.status === 201)) {
        this.modalInsertar();
        this.peticionGet();
        alert("Cliente registrado con éxito");
      } else {
        alert("Error al registrar cliente");
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
      this.setState({
        error: true,
        errorMsg: msj,
      });
    }
  };

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      const res = await axios.put(
        url + this.state.form.id + "/",
        this.state.form /* {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          } */
      );
      if (res.status === 200 || res.status === 201) {
        this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
        this.peticionGet();
        alert("Cliente actualizado con éxito");
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
    /* Para eliminar, le pasamos la url */
    try {
      const res = await axios.delete(url + this.state.form.id);

      if ((res.status === 200) | (res.status === 201)) {
        this.setState({
          modalEliminar: false,
        }); /* Cambiamos el estado de la variable modalEliminar */
        this.peticionGet(); /* Volvemos a pedir los datos */
        alert("Cliente eliminado con éxito");
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

  seleccionarUsuario = (hojas) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: hojas.id,
        date: hojas.date,
        weight: hojas.weight,
        height: hojas.height,
        bloodyType: hojas.bloodyType,
        customer_id: hojas.customer_id,
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
        if (item.name.includes(this.state.busqueda)) {
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

  render() {
    const { form } = this.state;
    const { formcorps} = this.state;

    return (
      <div className="table-responsive">
        <br />
        <div className="Busqueda">
          <button
            className="btn btn-success"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              // this.setState({ form: null, tipoModal: "insertar" });
              // this.modalInsertar();
            }}
          >
            <i className="bx bxs-user">
              <box-icon
                type="solid"
                name="user"
                color="#fff"
                animation="tada"
              ></box-icon>
            </i>
            Nombre del cliente: 
          </button>

          <div className="esp"></div>
          <input
            type="text"
            className="textField"
            name="busqueda"
            id="busqueda"
            placeholder="Buscar"
            onChange={this.buscador}
            value={form ? form.busqueda : ""}
          />
          <button type="submit" className="add-on" onClick={() => {}}>
            <i className="bx bxs-user">
              <box-icon name="search-alt-2" color="#fff"></box-icon>
            </i>
          </button>
        </div>
        <br></br>
        <br></br>
        <br />
        <div className="table-responsive">
          <table className="table table-striped table-bordered ">
            <thead>
              <tr>
                <th>ID hoja clinica</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th>Edad</th>
                <th>Altura</th>
                <th>Peso</th>
                <th>Tipo de sangre</th>
                <th>ID del cliente</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((hojas) => {
                return (
                  <tr>
                    <td>{hojas.id}</td>
                    <td>{hojas.date}</td>
                    <td>{hojas.weight}</td>
                    <td>{hojas.height}</td>
                    <td>{hojas.bloodyType}</td>
                    <td>{hojas.customer_id}</td>
                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          this.seleccionarUsuario(hojas);
                          this.modalInsertar();
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      {"  "}
                      {localStorage.getItem("rol") == "Administrador" ? (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.seleccionarUsuario(hojas);
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
        <Modal isOpen={this.state.modalAgregar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Registrar Hoja Clinica Situacion Nutricional
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">Id</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.customer_id : ""}
              />
              <br />
              <label htmlFor="height">Estatura: </label>
              <input
                className="form-control"
                type="text"
                name="height"
                id="height"
                onChange={this.handleChange}
                value={form ? form.height : ""}
              />
              <br />
              <label htmlFor="weight">Peso: </label>
              <input
                className="form-control"
                type="text"
                name="weight"
                id="weight"
                onChange={this.handleChange}
                value={form ? form.weight : ""}
              />
              <br />
              <label htmlFor="bloody">Tipo de sangre: </label>
              <input
                className="form-control"
                type="text"
                name="bloody"
                id="bloody"
                onChange={this.handleChange}
                value={form ? form.bloody : ""}
              />
              <br />
              <label htmlFor="hour_breakfast">Hora de desayuno: </label>
              <TimeField
                name="hour_breakfast"
                id="hour_breakfast"
                onChange={this.handleChange} // {Function} required
                input={<input type="text" />}
                // {String}   default: ":"
                value={form ? form.hour_breakfast : ""}
              />
              <br />
              <label htmlFor="hour_lunch">Hora de comida: </label>
              <TimeField
                name="hour_lunch"
                id="hour_lunch"
                onChange={this.handleChange} // {Function} required
                input={<input type="text" />}
                // {String}   default: ":"
                value={form ? form.hour_lunch : ""}
              />

              <br />
              <label htmlFor="hour_snack">Hora de bocadillo: </label>
              <TimeField
                name="hour_snack"
                id="hour_snack"
                onChange={this.handleChange} // {Function} required
                input={<input type="text" />}
                // {String}   default: ":"
                value={form ? form.hour_snack : ""}
              />
              <br />
              <label htmlFor="hour_dinner">Hora de cena: </label>
              <TimeField
                name="hour_dinner"
                id="hour_dinner"
                onChange={this.handleChange} // {Function} required
                input={<input type="text" />}
                // {String}   default: ":"
                value={form ? form.hour_dinner : ""}
              />
              <br />
              <label htmlFor="hour_collation">Hora de colacion: </label>
              <TimeField
                name="hour_collation"
                id="hour_collation"
                onChange={this.handleChange} // {Function} required
                input={<input type="text" />}
                // {String}   default: ":"
                value={form ? form.hour_collation : ""}
              />
              <br />
              <label htmlFor="">Información extra: </label>
              <input
                className="form-control"
                type="text"
                name="membershipActivate"
                id="membershipActivate"
                onChange={this.handleChange}
                value={form ? form.membershipActivate : ""}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={
                /* this.setState({ form: null, tipoModal: "Agregar" }); */
                this.modalAgregar
              }
            >
              Cancelar
            </button>
            {this.state.tipoModal == "Agregar" ? (
              <button
                className="btn btn-success"
                onClick={/* this.peticionPut */ this.modalAgregar2}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                SiguienteSe
              </button>
            )}
          </ModalFooter>
        </Modal>

        {/* Aqui comienza la segunda ventana modal */}
        <Modal isOpen={this.state.modalAgregar2}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Registrar Hoja Clinica Estructura Corporal
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-groupp">
              <label htmlFor="uno">Estructura corporal: </label>
              <input
                className="form-control"
                type="text"
                name="uno"
                id="uno"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.uno : ""}
              />
              <br />
              <label htmlFor="dos">Tensión arterial: </label>
              <input
                className="form-control"
                type="text"
                name="dos"
                id="dos"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.dos : ""}
              />
              <br />
              <label htmlFor="tres">Indice de masa corporal actual: </label>
              <input
                className="form-control"
                type="text"
                name="tres"
                id="tres"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.tres : ""}
              />
              <br />
              <label htmlFor="cuatro">% de Grasa: </label>
              <input
                className="form-control"
                type="text"
                name="cuatro"
                id="cuatro"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.cuatro : ""}
              />
              <br />
              <label htmlFor="cinco">% MM: </label>
              <input
                className="form-control"
                type="text"
                name="cinco"
                id="cinco"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.cinco : ""}
              />
              <br />
              <label htmlFor="seis">KC CORRESPONDIENTES: </label>
              <input
                className="form-control"
                type="text"
                name="seis"
                id="seis"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.seis : ""}
              />
              <br />
              <label htmlFor="siete">Edad de acuerdo al peso: </label>
              <input
                className="form-control"
                type="text"
                name="siete"
                id="siete"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.siete : ""}
              />
              <br />
              <label htmlFor="ocho">Grasa viceral: </label>
              <input
                className="form-control"
                type="text"
                name="ocho"
                id="ocho"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.ocho : ""}
              />
              <br />
              <label htmlFor="nueve">Situacion Nutricional: </label>
              <input
                className="form-control"
                type="text"
                name="nueve"
                id="nueve"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.nueve : ""}
              />
              <br />
              <label htmlFor="diez">
                Gasto calorico por horas de oficina:{" "}
              </label>
              <input
                className="form-control"
                type="text"
                name="diez"
                id="diez"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.diez : ""}
              />
              <br />
              <label htmlFor="once">
                Gasto calorico por horas de movimiento:{" "}
              </label>
              <input
                className="form-control"
                type="text"
                name="once"
                id="once"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.once : ""}
              />
              <br />
              <label htmlFor="doce">
                Gasto calorico por horas de entrenamiento:{" "}
              </label>
              <input
                className="form-control"
                type="text"
                name="doce"
                id="doce"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.doce : ""}
              />
              <br />
              <label htmlFor="trece">
                Gasto calorico por horas de dormir:{" "}
              </label>
              <input
                className="form-control"
                type="text"
                name="trece"
                id="trece"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.trece : ""}
              />
              <br />
              <label htmlFor="catorce">Total de gasto calorico: </label>
              <input
                className="form-control"
                type="text"
                name="catorce"
                id="catorce"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.catorce : ""}
              />
              <br />
              <label htmlFor="quince">
                Total de calorías correspondientes de acuerdo a su peso
                corporal:{" "}
              </label>
              <input
                className="form-control"
                type="text"
                name="quince"
                id="quince"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.quince : ""}
              />
              <br />
              <label htmlFor="dieciseis">Metabolismo basal (I CB): </label>
              <input
                className="form-control"
                type="text"
                name="dieciseis"
                id="dieciseis"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.dieciseis : ""}
              />
              <br />
              <label htmlFor="diecisiete">Consumo calorico (C C): </label>
              <input
                className="form-control"
                type="text"
                name="diecisiete"
                id="diecisiete"
                onChange={this.handleChange2}
                value={formcorps ? formcorps.diecisiete : ""}
              />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={
                /* this.setState({ form: null, tipoModal: "Agregar" }); */
                this.modalAgregar
              }
            >
              Regresar
            </button>
            {this.state.tipoModal == "Agregar" ? (
              <button
                className="btn btn-success"
                onClick={/* () => this.peticionPut() */ this.modalAgregar3}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}
          </ModalFooter>
        </Modal>

        {/* Esta es la tercera ventana modal */}
        <Modal isOpen={this.state.modalAgregar3}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Registrar Hoja Clinica Información Extra
            <span style={{ float: "right" }}></span>
          </ModalHeader>

              <ModalBody >
            <div className="form-group">
              <label htmlFor="namee">Seleccione el tipo: </label>
              <select name="namee" className="form-control" onChange={this.handleChangeCombo}>
                {this.state.sintomas.map((elemento, index)=>(
                  <option key={elemento.id} value={index}>{elemento.name}</option>
                )
                )}
                </select>
              <br />
              <label htmlFor="descriptione">Nombre: </label>
              <input
                className="form-control"
                type="text"
                name="descriptione"
                id="descriptione"
                onChange={this.handleChangelabel}
                value={form ? form.descriptione : ""}
              />
              <button
                className="btn btn-success"
                onClick={() => this.handleInputChange()}
              >
                Agregar
              </button>
              <br />
              <label htmlFor="statuse"> ¿Lo posee? </label>
              <br />
              <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-info">
                  <input
                    type="radio"
                    name="statuse"
                    value="true"
                    autocomplete="off"
                    onChange={this.handleChangeSwitch}
                    checked={
                      (this.state.tipoModal === "Agregar" && this.state.formextra == null) ||
                      this.state.formextra.statuse === undefined
                        ? true
                        : this.state.formextra.statuse === "true"
                        ? true
                        : false
                    }
                  />{" "}
                  Si
                </label>
                <label class="btn btn-info ">
                  <input
                    type="radio"
                    name="statuse"
                    value="false"
                    autocomplete="on"
                    onChange={this.handleChangeSwitch}
                    checked={
                      (this.state.tipoModal === "insertar" && this.state.formextra == null) ||
                      this.state.formextra.statuse === undefined
                        ? false
                        : this.state.formextra.statuse === "false"
                        ? true
                        : false
                    }
                  />{" "}
                  No
                </label>
              </div>
              <br />

              <div  className="Sintomas">
              <div className="table-responsive">
              <table className="table table-striped table-bordered ">
                <thead>
                  <tr>
                  <th>ID</th>
                <th>Tipo de información</th>
                <th>Nombre</th>
                <th>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {this.state.list.map((list) => {
                /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                return (
                  <tr>
                    <td>{list.id}</td>
                    <td>{list.namee}</td>
                    <td>{list.descriptione}</td>
                    <td>{list.statuse}</td>
                  </tr>
                );
                  })}
                </tbody>
              </table>
              </div>
            </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={
                /* this.setState({ form: null, tipoModal: "Agregar" }); */
                this.modalAgregar2
              }
            >
              Regresar
            </button>
            {this.state.tipoModal == "Agregar" ? (
              <button
                className="btn btn-success"
                onClick={/* () => this.peticionPut() */ this.modalAgregar3}
              >
                Guardar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
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
              <label htmlFor="telefono">Telefono</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                readOnly
                onChange={this.handleChange}
                value={form ? form.phone : ""}
              />
              <br />
              <label htmlFor="genero">Genero</label>
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
              ¿Seguro de eliminar al cliente?
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => this.peticionDelete()}
            >
              Si
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

export default TablaHojas;
