import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import swal from "sweetalert";

import "../styles/Crud.css";

const urlC = "https://www.huxgym.codes/customers/customers/";
const urlCA = "https://www.huxgym.codes/customers/clientesActuales";
const urlIn = "https://www.huxgym.codes/customers/attendance/";
const urlOut = "https://www.huxgym.codes/customers/attendance/check_out/";
class Check_Client extends Component {
  state = {
    modalCheck: false,
    total: 0,
    dataC: [],
    dataCA: [],
    clientes: [],
    clientesA: [],
    form: { customer_id: "" },
    form2: {
      id: "",
      name: "",
    },
    form3: {},
  };

  componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    this.peticionGetC();
    this.peticionGetCA();
  }

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

  peticionGetC = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(urlC);
      if (res.status === 200) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */

          dataC: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
      console.log(res.data);
    } catch (error) {
      //const msj = JSON.parse(error.request.response).message;
      console.log(error);
    }
  };

  peticionGetCA = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(urlCA);

      if (res.status === 200 || res.status === 201) {
        this.setState({
          dataCA: res.data,
        });
        this.state.total = res.data.length;
        console.log(res);
        console.log(this.state.total);
        /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
    } catch (error) {
      //const msj = JSON.parse(error.request.response).message;
      console.log(error);
    }
  };

  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    try {
      if (this.state.total < 15) {
        const res =
          await axios /* a post de parametros le pasamos la url y los datos */
            .post(urlIn, this.state.form);
        if (res.status === 200 || res.status === 201) {
          this.peticionGetCA();
          swal({
            text: res.data.message,
            icon: "success",
            button: "Aceptar",
            timer: "3000",
          });
          console.log(res);
        } else {
          console.log(res);
          this.peticionGetCA();
        }
      } else {
        this.peticionGetCA();
        swal({
          text: "Has llegado al limite de clientes",
          icon: "info",
          button: "Aceptar",
          timer: "3000",
        });
      }
    } catch (error) {
      //const msj = JSON.parse(error.request.response).message;
      console.log(error);
      swal({
        text: error,
        icon: "info",
        button: "Aceptar",
        timer: "3000",
      });
    }
  };

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      const res = await axios.put(
        urlOut + this.state.form.customer_id /* ,
        this.state.form  */ /* {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          } */
      );
      if (res.status === 200 || res.status === 201) {
        /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
        this.peticionGetCA();
        /* alert("Check-out con exito"); */
        swal({
          text: res.data.message,
          icon: "success",
          button: "Aceptar",
          timer: "3000",
        });
      }
      this.peticionGetCA();
    } catch (error) {
      /*  const msj = JSON.parse(error.request.response).message;
      console.log(msj); */

      swal({
        text: error,
        icon: "info",
        button: "Aceptar",
        timer: "3000",
      });
    }
  };

  Modal = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({
      /* modalSeleccionarCategoria: false,
      modalSeleccionarProveedor: false, */
      modalCheck: !this.state.modalCheck,
    });
  };

  seleccionarUsuario = (clientes) => {
    /* Para obtener los datos del usuario a eliminar */
    console.log(clientes.name);
    this.setState({
      ...this.state.form,
      busqueda: "",
      form2: {
        id: clientes.id,
        name: clientes.name,
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
      var search = this.state.dataC.filter((item) => {
        if (
          item.name.toLowerCase().includes(this.state.busqueda.toLowerCase())
        ) {
          i = 1;
          return item;
        }
      });
      this.setState({ clientes: search });
      this.setState({ dataC: this.state.clientes });
    } else {
      this.peticionGetC();
    }
  };

  buscador2 = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
    console.log(this.state.busqueda);
    this.filtrarElementos2();
  };

  filtrarElementos2 = () => {
    var i = 0;
    if (this.state.busqueda != "") {
      var search = this.state.dataCA.filter((item) => {
        if (
          item.customer_id.name
            .toLowerCase()
            .includes(this.state.busqueda.toLowerCase())
        ) {
          i = 1;
          return item;
        }
      });
      this.setState({ clientesA: search });
      this.setState({ dataCA: this.state.clientesA });
    } else {
      this.peticionGetCA();
    }
  };

  render() {
    const { form } = this.state;
    return (
      <>
        <div className="realizarhes">
          
          <h3 className="lineadiv">Clientes</h3>
          <p className="palabra">Realizar hora de entrada y salida de clientes</p>
          <button className="btn botonesdash" onClick={this.Modal}>
            Abrir
          </button>
          <br/>
        {<h3 className="lineadiv"></h3>}

        </div>
        <Modal className="ModalCheck" isOpen={this.state.modalCheck}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader className="HeadCheck" style={{ display: "block" }}>
            <p className="titulo">Realizar hora de entrada y salida</p>
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody className="SCliente">
            <div className="form-group">
              <h3>Entrada de clientes</h3>
              <br />
              <input
                type="text"
                className="entradatext"
                name="busqueda"
                id="busqueda"
                placeholder="Buscar"
                onChange={this.buscador}
                value={form ? form.busqueda : ""}
              />
              <br />
              <br />
              <div className="tablita">
                <table className="tab-pane table table-dark mt-2 mb-5">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataC &&
                      this.state.dataC.map((clientes) => {
                        /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                        return (
                          <tr>
                            <td>{clientes.id}</td>
                            <td>{clientes.name}</td>
                            <td>
                              <button
                                className="btn botonesdash"
                                onClick={() => {
                                  /* this.seleccionarCategoria(categorias); */
                                  this.state.form.customer_id = clientes.id;
                                  this.peticionPost();
                                  this.peticionGetCA();
                                }}
                              >
                                Entrada
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Otra columna */}

            <div className="form-group">
              <h3>Clientes entrenando</h3>
              <br />

              <input
                type="text"
                className= "entradatext"
                name="busqueda"
                placeholder="Buscar"
                onChange={this.buscador2}
                value={form ? form.busqueda : ""}
              />
              <br />
              <br />

              <div className="tablita">
                <table className="tab-pane table table-dark mt-2 mb-5">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Hora de entrada</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataCA &&
                      this.state.dataCA.map((clientesA) => {
                        return (
                          <tr>
                            <td>{clientesA.customer_id.name}</td>
                            <td>{clientesA.check_in}</td>
                            <td>
                              <button
                                className="btn botonesdash"
                                onClick={() => {
                                  /* this.seleccionarCategoria(categorias); */
                                  this.state.form.customer_id =
                                    clientesA.customer_id.id;
                                  this.peticionPut();
                                  this.peticionGetCA();
                                }}
                              >
                                Salida
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>

          <ModalFooter>
            <button className="btn btn-danger" onClick={this.Modal}>
              Cerrar
            </button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

export default Check_Client;
