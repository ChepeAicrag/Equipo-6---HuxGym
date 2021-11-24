import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import "../styles/Ventas.css";
import swal from "sweetalert";
import axios from "axios";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"; */
const url =
  "https://www.huxgym.codes/purchases/obtenerCompras/"; /* Aqui va la url principal */

const url_rc = "https://www.huxgym.codes/purchases/realizarCompra/";
const url_ec = "https://www.huxgym.codes/purchases/purchase/";

const urlC = "https://www.huxgym.codes/products/provider/";
const urlP = "https://www.huxgym.codes/products/products/";
const urlM = "https://www.huxgym.codes/memberships/memberships/";
class TablaCC extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    busqueda: "",
    dataP: [],
    dataC: [],
    dataS: [],
    dataM: [],
    data: this.props
      .compras /* Aqui se almacena toda la informacion axios de ventas */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalMembresia: false,
    modalEliminar: false,
    modalSeleccionarProveedor: false,
    modalSeleccionarProducto: false,
    productos: [],
    id_proveedor: "",
    id_producto: "",
    name_proveedor: "",
    name_producto: "",
    clientesBA: [],
    productosBA: [],
    cantidades: [],
    membresiasBA: [],
    total: 0,
    cambio: 0,
    pago: 0,
    form: {
      id: "",
      name: "",
      observation: "",
      total: "",
      date: "",
      purchase_detail: [],
    },
    form2: {
      id: "",
      cantidad: 1,
      precio: "",
    },
    form3: {
      provider_id: "",
      products: [],
      cash: 0,
      observation: "",
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
    /* console.log(this.state.form); */
  };

  handleChange2 = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    e.persist();
    await this.setState({
      form2: {
        ...this.state
          .form2 /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });
    /* console.log(this.state.form2); */
  };

  handleChange3 = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    e.persist();
    await this.setState({
      ...this.state,
      pago: e.target.value,
    });
    this.calcularCambio();
    /* console.log(this.state.pago); */
  };

  nuevaCantidad = (Producto) => {
    var p = 0;
    if (this.state.modalMembresia) {
      p = parseInt(Producto.price, 10);
    } else {
      p = parseInt(Producto.price_c, 10);
    }
    const c = {
      id: Producto.id,
      cantidad: 1,
      precio: p,
    };
    let a = [c.id, c.cantidad, c.precio];
    this.state.cantidades.push(a);
    console.log(this.state.cantidades);
    /* console.log(this.state.cantidades); */
  };

  calcularCambio = async () => {
    var r = 0;
    r = this.state.pago - this.total();
    /* console.log(r); */
    await this.setState({ cambio: r });
    return r;
  };

  eliminar = (producto) => {
    var i = 0;
    if (this.state.dataS.length > 0) {
      /* console.log(this.state.dataS.length); */
      this.state.dataS.map((dato) => {
        if (dato.id == producto.id) {
          this.state.dataS.splice(i, 1);
          /* console.log(this.state.dataS); */
          this.peticionGetP();
          return true;
        } else {
          console.log("No encontrado");
        }
        i++;
      });
    } else {
      console.log("No hay nada que eliminar");
      return false;
    }
  };

  eliminarCantidad = (producto) => {
    var i = 0;
    if (this.state.cantidades.length > 0) {
      /* console.log(this.state.cantidades.length); */
      this.state.cantidades.map((dato) => {
        if (dato[0] == producto.id) {
          this.state.cantidades.splice(i, 1);
          /* console.log(this.state.cantidades); */
          this.peticionGetP();
          return true;
        }
        i++;
      });
    } else {
      console.log("No hay nada que eliminar");
      return false;
    }
  };

  buscar = (producto) => {
    var res = false;
    if (this.state.dataS.length == 0) {
      console.log("Puede Agregarlo");
      res = false;
    } else {
      this.state.dataS.map((dato) => {
        if (dato.id == producto.id) {
          console.log("Ese producto ya se encuentra seleccionado");
          res = true;
        }
      });
    }
    return res;
  };

  arregloCantidad = (form) => {
    var r = false;
    console.log(this.state.cantidades);
    if (this.state.cantidades.length == 0) {
      let a = [form.id, form.cantidad, form.precio];
      this.state.cantidades.push(a);

      console.log("Se agrego a las cantidades");
      console.log(this.state.cantidades);
      return;
    }
    this.state.cantidades.map((dato) => {
      console.log(dato[0]);
      console.log(form.id);
      if (dato[0] === form.id) {
        console.log("Entre papu");
        dato[1] = parseInt(form.cantidad, 10);
        console.log(this.state.cantidades);
        /*  console.log("Se ha modificado la cantidad");
        console.log(this.state.cantidades); */
        r = true;
        return;
      }
    });
    if (r) {
      return;
    }
    let a = [form.id, form.cantidad, form.precio];
    this.state.cantidades.push(a);
    console.log("Se agrego a las cantidades2");
    /* console.log(this.state.cantidades); */
    return;
  };

  devolverCantidad = (producto) => {
    var r = 1;
    if (this.state.cantidades.length == 0) {
      /*  console.log("No hay nada en cantidades");
      console.log(this.state.cantidades); */
      return r;
    }
    this.state.cantidades.map((dato) => {
      /* console.log(dato); */
      if (dato[0] == producto.id) {
        /* console.log("Se ha encontrado la cantidad");
        console.log(dato.cantidad); */
        r = parseInt(dato[1], 10);
      }
    });
    return r;
  };
  total = () => {
    var t = 0;
    if (this.state.cantidades.length == 0) {
      this.setState({ total: t });
      return t;
    }
    this.state.cantidades.map((cantidad) => {
      t += parseInt(cantidad[1], 10) * parseInt(cantidad[2], 10);
    });
    this.setState({ total: t });
    return t;
  };

  // peticionGet = async () => {
  //   try {
  //     const res = await axios.get(url, {
  //       headers: {
  //         Authorization: "Token " + localStorage.getItem("token"),
  //       },
  //     });
  //     console.log(res);
  //     this.setState({
  //       data: res.data,
  //     });
  //   } catch (error) {
  //     const msj = JSON.parse(error.request.response).message;
  //     console.log(msj);
  //     swal({
  //       text: msj,
  //       icon: "error",
  //       button: "Aceptar",
  //       timer: "5000",
  //     });
  //   }
  // };

  peticionGetC = async () => {
    try {
      const res = await axios.get(urlC, {
        headers: {},
      });
      /* console.log(res); */
      this.setState({
        dataC: res.data,
      });
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  };
  peticionGetP = async () => {
    try {
      const res = await axios.get(urlP, {
        headers: {},
      });
      console.log(res);
      this.setState({
        dataP: res.data,
      });
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  };
  peticionGetM = async () => {
    try {
      const res = await axios.get(urlM, {
        headers: {},
      });
      console.log(res);
      this.setState({
        dataM: res.data,
      });
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  };

  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    try {
      delete this.state.form.id;
      const res = await axios.post(url_rc, this.state.form3, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      /* cambiamos el estado de modalInsertar y volvemos a pedir los datos*/
      if (res.status === 200 || res.status === 201) {
        this.modalInsertar();
        this.peticionGet();
        swal({
          text: "Compra realizada satisfactoriamente",
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
        /*  alert(); */
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: msj,
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      delete this.state.form.image;
      const res = await axios.put(
        url_ec + this.state.form.id,
        this.state.form,
        {
          headers: { Authorization: "Token " + localStorage.getItem("token") },
        }
      );
      if (res.status === 200 || res.status === 201) {
        this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
        this.peticionGet();
        swal({
          text: "Compra actualizada correctamente",
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
        /* alert("Compra actualizado correctamente"); */
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);

      swal({
        text: msj,
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
      /* alert(msj); */
    }
  };

  peticionDelete = async () => {
    try {
      const res = await axios.delete(url_ec + this.state.form.id, {
        headers: { Authorization: "Token " + localStorage.getItem("token") },
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          modalEliminar: false,
        });
        this.peticionGet();
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      this.setState({
        error: true,
        errorMsg: msj,
      });
      swal({
        text: msj,
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };
  limpiarTablaS = () => {
    this.setState({
      total: 0,
      cambio: 0,
      pago: 0,
      name_proveedor: "",
      proveedor_id: "",
      form3: { provider_id: "", products: [], cash: 0 },
    });
    this.state.dataS = [];
    this.state.cantidades = [];
  };

  async componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    // await this.peticionGet();
    // this.state.data = data.
    /* this.peticionGetC();
    this.peticionGetP(); */
  }

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({
      /* modalSeleccionarCategoria: false,
      modalSeleccionarProveedor: false, */
      modalInsertar: !this.state.modalInsertar,
    });
  };
  opcionMembresia = () => {
    this.setState({
      modalMembresia: !this.state.modalMembresia,
    });
    console.log(this.state.modalMembresia);
  };

  modalCliente = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({
      /* modalInsertar: false,
      modalSeleccionarProveedor: false, */
      modalSeleccionarCliente: !this.state.modalSeleccionarCliente,
    });
  };

  modalProducto = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({
      /* modalInsertar: false,
      modalSeleccionarCategoria: false, */
      modalSeleccionarProducto: !this.state.modalSeleccionarProducto,
    });
  };

  seleccionarUsuario = (compra) => {
    /* Para obtener los datos del usuario a eliminar */

    /* Para obtener los datos del usuario a eliminar */
    console.log(compra.purchase_detail.length);

    var info = [];

    if (compra.purchase_detail.length >= 1) {
      compra.purchase_detail.map((o) => {
        info.push({
          id: o.id,
          name: o.product.name,
          cantidad: o.amount,
          price_c: o.product.price_c,
          total: o.total,
        });
      });
      this.setState({
        ...this.state.form,
        tipoModal: "actualizar",
        dataS: info,
        busqueda: "",
        user_id: compra.Purchase.user.id,
        /* pago: compra.sale.cash, */
        /* cambio: compra.sale.cash - compra.sale.total, */
        total: compra.Purchase.total,
        name_proveedor: compra.purchase_detail[0].product.provider.name,
        form: {
          id: compra.Purchase.id,
          name_employee: compra.Purchase.user.name,
          observation: compra.Purchase.observation,
          total: compra.Purchase.total,

          /* cash: compra.sale.cash, */
          /*  provider: compra.sale.customer.name, */
          date: compra.Purchase.date,
        },
      });
    }
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
        if (item.name.includes(this.state.busqueda)) {
          i = 1;
          return item;
        }
      });
      this.setState({ productosBA: search });
      this.setState({ dataP: this.state.productosBA });
    } else {
      this.peticionGetP();
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
      var search = this.state.dataC.filter((item) => {
        if (item.name.includes(this.state.busqueda)) {
          i = 1;
          return item;
        }
      });
      this.setState({ clientesBA: search });
      this.setState({ dataC: this.state.clientesBA });
    } else {
      this.peticionGetC();
    }
  };

  render() {
    const { form } = this.state;
    const { form2 } = this.state;
    return (
      <div className="table-responsiveMain">
        <div className="table-responsiveV">
          <table className="table table-striped table-bordered ">
            <thead>
              <tr>
                <th>Id de compra</th>
                <th>Nombre del proveedor</th>
                <th>Precio de la compra</th>
                {/* <th>Precio de compra</th> */}
                <th>Fecha de registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((compra) => {
                /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                return (
                  <tr>
                    <td>{compra.Purchase.id}</td>
                    <td>{compra.purchase_detail[0].product.provider.name}</td>
                    <td>{compra.Purchase.total}</td>
                    <td>{compra.Purchase.date.split("T")[0]}</td>

                    <td>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          this.seleccionarUsuario(compra);
                          this.modalInsertar();
                        }}
                      >
                        Ver detalles
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal className="ModalVenta" isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader className="HeadVenta" style={{ display: "block" }}>
            Realizar Compra de productos
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody className="SVentaP">
            <div className="form-groupD">
              {this.state.tipoModal == "insertar" ? (
                <>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      this.peticionGetC();
                      this.modalCliente();
                    }}
                  >
                    Seleccionar Proveedor
                  </button>
                  <br />
                  <br />

                  <label htmlFor="name">Proveedor Seleccionado:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    readOnly
                    onChange={this.handleChange}
                    value={form ? this.state.name_proveedor : ""}
                  />
                  <br />
                  <br />

                  {this.state.proveedor_id != "" ? (
                    <button
                      className="btn btn-success"
                      onClick={() => {
                        this.peticionGetP();
                        this.peticionGetM();
                        this.modalProducto();
                      }}
                    >
                      Seleccionar Productos
                    </button>
                  ) : (
                    <button className="btn btn-success" disabled="true">
                      Seleccionar Productos
                    </button>
                  )}
                </>
              ) : (
                <>
                  <label htmlFor="id">Id</label>
                  <input
                    className="form-control"
                    type="text"
                    name="id"
                    id="id"
                    readOnly
                    onChange={this.handleChange}
                    value={form ? form.id : ""}
                  />
                  <br />
                  <br />
                  <label htmlFor="name">Proveedor Seleccionado:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    readOnly
                    onChange={this.handleChange}
                    value={form ? this.state.name_proveedor : ""}
                  />
                  <br />
                </>
              )}

              <br />

              <label htmlFor="price_c">Observaciones:</label>
              <input
                className="form-control"
                type="text"
                name="observation"
                id="observation"
                readOnly
                onChange={this.handleChange}
                value={form ? form.observation : ""}
              />
              <br />
              {/* <label htmlFor="description">Dinero en efectivo:</label>
              <input
                className="form-control"
                type="number"
                name="pago"
                min="0"
                pattern="^[0-9]+"
                id="pago"
                onChange={this.handleChange3}
                value={this.state.pago != 0 ? this.state.pago : ""}
              />
              <br /> */}
              <br />
              <label htmlFor="price_s">Total de venta:</label>
              <input
                className="form-control"
                type="Number"
                name="price_s"
                id="pprice_s"
                readOnly
                onChange={this.total}
                value={form2 ? this.state.total : 0}
              />
              <br />
              {/* <label htmlFor="image">Cambio:</label>
              <input
                className="form-control"
                type="Number"
                name="cambio"
                id="cambio"
                readOnly
                onChange={this.handleChange}
                value={this.state.cambio > 0 ? this.state.cambio : 0}
              />
              <br /> */}

              <br />
            </div>
            {/* Tabla Productos Seleccionados */}
            <div className="form-groupT">
              <div className="table-responsiveV">
                <table className="table table-striped table-bordered ">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                      {this.state.tipoModal == "insertar" ? (
                        <>
                          <th>Accion</th>
                        </>
                      ) : (
                        <></>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataS.map((ProductoS) => {
                      return (
                        <tr>
                          <td>{ProductoS.id}</td>
                          <td>{ProductoS.name}</td>
                          <td>{ProductoS.price_c}</td>
                          {this.state.tipoModal == "insertar" ? (
                            <>
                              <td>
                                <input
                                  className="form-control"
                                  type="Number"
                                  min="1"
                                  name="cantidad"
                                  id="cantidad"
                                  /* readOnly */
                                  onChange={async (e) => {
                                    await this.setState({
                                      form2: {
                                        ...this.state.form2,
                                        cantidad: e.target.value,
                                        id: ProductoS.id,
                                        precio: ProductoS.price_c,
                                      },
                                    });
                                    await this.arregloCantidad(
                                      this.state.form2
                                    );
                                    /* console.log(this.state.form2);
                                console.log(this.devolverCantidad(ProductoS)); */
                                    console.log(this.state.cantidades);
                                    this.total();
                                    this.calcularCambio();
                                  }}
                                  value={
                                    form2
                                      ? this.devolverCantidad(ProductoS)
                                      : this.devolverCantidad(ProductoS)
                                  }
                                />
                              </td>
                            </>
                          ) : (
                            <>
                              <td>
                                <input
                                  className="form-control"
                                  type="Number"
                                  min="1"
                                  name="cantidad"
                                  id="cantidad"
                                  readOnly
                                  value={
                                    form2
                                      ? this.devolverCantidad(ProductoS)
                                      : this.devolverCantidad(ProductoS)
                                  }
                                />
                              </td>
                            </>
                          )}
                          <td>
                            <input
                              className="form-control"
                              type="Number"
                              min="0"
                              name="total"
                              id="total"
                              readOnly
                              /* onChange={} */
                              value={
                                this.devolverCantidad(ProductoS) *
                                ProductoS.price_c
                              }
                            />
                          </td>
                          {this.state.tipoModal == "insertar" ? (
                            <>
                              <td>
                                <Button
                                  className="btn-danger"
                                  onClick={() => {
                                    this.eliminar(ProductoS);
                                    this.eliminarCantidad(ProductoS);
                                    this.total();
                                    this.calcularCambio();
                                  }}
                                >
                                  Eliminar
                                </Button>
                              </td>
                            </>
                          ) : (
                            <></>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="FooterVenta">
            <button
              className="btn btn-danger"
              onClick={() => {
                this.modalInsertar();
                this.limpiarTablaS();
              }}
            >
              Regresar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : ""}
              />
              <br />
              <label htmlFor="description">Observacion:</label>
              <input
                className="form-control"
                type="text"
                name="description"
                id="description"
                readOnly
                onChange={this.handleChange}
                value={form ? form.observation : ""}
              />
              <br />
              <br />
              ¿Seguro de eliminar la Compra?
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
        {/* Aqui va el modal para seleccionar la cliente */}
        <Modal
          className="ModalVClientes"
          isOpen={this.state.modalSeleccionarCliente}
        >
          <ModalHeader style={{ display: "block" }}>
            Seleccione Proveedor
            <span style={{ float: "right" }}></span>
          </ModalHeader>
          <ModalBody className="SCliente">
            <div className="form-group">
              <input
                type="text"
                className="textField"
                name="busqueda"
                id="busqueda"
                placeholder="Buscar"
                onChange={this.buscador2}
                value={this.state.busqueda}
              />
              <div className="table-responsiveC">
                <table className="table table-striped table-bordered ">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>
                      <th>Telefono</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataC.map((proveedor) => {
                      /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                      return (
                        <tr>
                          <td>{proveedor.id}</td>
                          <td>{proveedor.name}</td>
                          <td>{proveedor.phone}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                /* this.seleccionarCategoria(categorias); */
                                this.setState({
                                  name_proveedor: proveedor.name,
                                  proveedor_id: proveedor.id,
                                  form: {
                                    ...this.state.form,
                                    proveedor_id: proveedor.id,
                                  },
                                });
                                console.log(proveedor.id);
                                this.total();
                                this.modalCliente();
                              }}
                            >
                              Seleccionar
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
          <ModalFooter className="Cancelar-Cliente">
            <button className="btn btn-danger" onClick={this.modalCliente}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        {/* Aqui comienza el modal de Productos */}
        <Modal
          className="ModalVProductos"
          isOpen={this.state.modalSeleccionarProducto}
        >
          <ModalHeader style={{ display: "block" }}>
            Seleccionar Productos
            <span style={{ float: "right" }}></span>
          </ModalHeader>
          <ModalBody className="SProducto">
            <div className="form-group">
              <input
                type="text"
                className="textField"
                name="busqueda"
                id="busqueda"
                placeholder="Buscar"
                onChange={this.buscador}
                value={this.state.busqueda}
              />
              <div className="table-responsiveP">
                <table className="table table-striped table-bordered ">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre</th>

                      <th>Precio</th>
                      {/* <th>Stock</th> */}

                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataP
                      .filter((x) => x.provider_id === this.state.proveedor_id)
                      .map((productos) => {
                        /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                        return (
                          <tr>
                            <td>{productos.id}</td>
                            <td>{productos.name}</td>
                            <td>{parseInt(productos.price_c, 10)}</td>
                            {/* <td>Nose xd </td> */}
                            <td>
                              <button
                                className="btn btn-primary"
                                onClick={() => {
                                  /* this.setState({
                                name_producto: productos.name,
                                form: {
                                  ...this.state.form,
                                  producto_id: productos.id,
                                },
                              }); */
                                  if (this.buscar(productos)) {
                                    alert("Ya esta seleccionado");
                                  } else {
                                    this.state.dataS.push(productos);
                                    this.state.form2.id = productos.id;
                                    this.state.form2.precio = productos.price_c;
                                    this.modalProducto();
                                    this.nuevaCantidad(productos);
                                    this.total();
                                    this.calcularCambio();
                                    /* console.log(this.state.form2); */
                                  }
                                  /* console.log(this.state.cantidades); */

                                  /* this.seleccionarUsuario(proveedores); */

                                  /* console.log(this.state.dataS); */
                                }}
                              >
                                Seleccionar
                              </button>
                              {"  "}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="Cancelar-Categoria">
            <button className="btn btn-danger" onClick={this.modalProducto}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TablaCC;
