import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import swal from "sweetalert";
import "../styles/checkin.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import "../styles/Ventas.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import TablaVV from "../components/TablaVV";
import TablaCC from "../components/TablaCC";
import { isEmpty } from "../helpers/methods";

const urlCash = "https://www.huxgym.codes/user/cash-register/open/";
const url_close = "https://www.huxgym.codes/user/cash-register/close/";
const urlVentas = "https://www.huxgym.codes/sales/";
const url_caja = "https://www.huxgym.codes/user/cash-register/";

class Monto extends Component {
  state = {
    cashInit: "",
    data_purchase: [],
    data_sales: [],
    abierta: false,
    modalCaja: false,
    modalCaja2: false,
    modalCaja3: false,
    modalCaja4: false,
    dataCompras: [],
    dataVentas: [],
    dataForm: [],
    dataCash: [],
    formCash: {
      efeInicial: 0,
      efeVentas: "",
      gasCompras: "",
      efeIngresado: "",
      efeFinal: "",
      observations: "",
      cambio: 0,
    },
  };

  openCash = async () => {
    try {
      if (this.state.abierta) {
        swal({
          text: "Ya tiene una caja abierta",
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        const dinero = this.state.cashInit;
        if (isEmpty(dinero)) {
          swal({
            text: "El campo de efectivo inicial es requerido",
            icon: "info",
            button: "Aceptar",
            timer: "5000",
          });
        } else {
          if (dinero <= 0) {
            swal({
              text: "El campo de efectivo inicial debe ser mayor a 0",
              icon: "info",
              button: "Aceptar",
              timer: "5000",
            });
          } else {
            const cash = parseFloat(this.state.cashInit);
            const res = await axios.post(
              urlCash,
              {
                cash_init: cash,
              },
              {
                headers: {
                  Authorization: "Token " + localStorage.getItem("token"),
                },
              }
            );
            if (res.status === 200 || res.status === 201) {
              const { cash_init } = res.data;
              swal({
                text: "La caja se abre con " + cash_init,
                icon: "success",
                button: "Aceptar",
                timer: "5000",
              });
              this.setState({
                abierta: true,
              });
            }
          }
        }
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  closeCash = async () => {
    try {
      const res = await axios.post(
        url_close,
        {
          observations: this.state.formCash.observations,
        },
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        const { cash_end } = res.data;
        this.state.modalCaja3 = false;
        swal({
          text: "La caja se cerró con " + cash_end,
          icon: "success",
          button: "Aceptar",
          timer: "5000",
        });
        this.setState({
          abierta: false,
        });
      }
    } catch (error) {
      console.log(error);
      const msj = JSON.parse(error.request.response).message;
      swal({
        text: msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };
  handleChangeInicial = async (e) => {
    await this.setState({
      cashInit: e.target.value,
    });
  };

  handleChangeCash = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    console.log(this.state.cashInit);
    e.persist();
    await this.setState({
      cashInit: [e.target.value],
      formCash: {
        ...this.state
          .formCash /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });

    console.log(this.state.formCash);
  };

  modalCaja = () => {
    this.setState({ modalCaja2: false, modalCaja3: false, modalCaja4: false });
    this.setState({ modalCaja: !this.state.modalCaja });
  };

  peticionGetVentas = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(urlVentas, {
        headers: {
          // Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      this.setState({
        /* Con esto accedemos a las variables de state y modificamos */
        dataVentas: res.data,
      }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
    } catch (error) {}
  };

  peticionGetCash = async () => {
    try {
      const res = await axios.get(url_caja, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      /* console.log(res); */
      if (res.status === 200 || res.status === 201) {
        const { data } = res;
        this.setState({
          data_purchase: data.purchases,
          data_sales: data.sales,
          formCash: {
            efeInicial: data.cash_register.cash_init,
            efeVentas: data.cash_register.amount_sell,
            gasCompras: data.cash_register.amount_purchase,
            efeIngresado: data.cash_register.amount_total,
            efeFinal: data.cash_register.cash_end,
            cambio: data.cash_register.cambio,
          },
        });
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  async componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    await this.peticionGetCash();
    /* this.peticionGetC();
  this.peticionGetP(); */
  }

  handleChangeInputNumberDecimal = (e) => {
    let val = e.target.value;
    const name = e.target.name;
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
  };

  render() {
    const { formCash } = this.state;
    return (
      <div className="che">
        <h3 className="lineadiv">Caja inicial:</h3>
        {this.state.abierta ? (
          <>
            <label htmlFor="cashInit">Efectivo inicial:</label>
            <input
              className="form-control entradascaja"
              type="number"
              name="efeInicial"
              id="cashInit"
              min="0"
              pattern="^[0-9]+"
              maxLength="10"
              
              readOnly
              onChange={this.handleChangeCash}
              value={formCash != 0 ? formCash.efeInicial : 0}
            />
          </>
        ) : (
          <>
            <label htmlFor="cashInit">Efectivo inicial:</label>
            <input
              className="form-control"
              type="number"
              name="efeInicial"
              id="cashInit"
              min="0"
              pattern="^[0-9]+"
              maxLength="10"
              onChange={this.handleChangeCash}
              value={formCash != 0 ? formCash.efeInicial : 0}
              onKeyPress={async (event) => {
                var l = await this.state.formCash.efeInicial;
                if (l.length > 4) {
                  this.setState({
                    ...this.state,
                    [event.target.name]: this.state.formCash.efeInicial.slice(
                      0,
                      5
                    ),
                  });
                  swal({
                    text: "Lo máxmo son 5 digitos",
                    icon: "info",
                    button: "Aceptar",
                    timer: "1000",
                  });
                  return false;
                }
              }}
            />
          </>
        )}
        <label htmlFor="nombre">Efectivo de ventas:</label>
        <h5>
          {formCash ? formCash.efeVentas : 0}
        </h5>
        <label htmlfor="nombre">Gastos de compras:</label>
        <h5>
         {formCash ? formCash.gasCompras : 0}
        </h5>
        <label htmlfor="nombre">Efectivo total ingresado:</label>
        <h5>
          {formCash ? formCash.efeIngresado : 0}
        </h5>
        <label htmlfor="nombre">Cambio dado:</label>
        <h5>
          {formCash ? formCash.cambio : 0}
        </h5>
        <label htmlfor="nombre">Efectivo final:</label>
        <h5>
          
          {formCash ? formCash.efeFinal : 0}
        </h5>
        <h3 className="lineadiv"></h3>
        <div className="botonesA">
        <Button variant="success" onClick={() => this.openCash()}>
          Abrir caja
        </Button>{" "}
        <br></br>
        <Button variant="danger" onClick={() => this.modalCaja()}>
          Cerrar caja
        </Button>{" "}
        </div>
        <Modal size="lg" isOpen={this.state.modalCaja}>
          <ModalHeader style={{ display: "block" }}>
            Cierre de caja
            <span style={{ float: "right" }}></span>
            <br />
            <br />
            <button className="btn btn-outline-light btn-lg " disabled>
              Visualizar Compras
            </button>{" "}
            <button
              className="btn btn-light btn-lg"
              onClick={() =>
                this.setState({
                  modalCaja: false,
                  modalCaja2: true,
                })
              }
            >
              Visualizar Ventas
            </button>
          </ModalHeader>
          <ModalBody>
            <TablaCC compras={this.state.data_purchase} />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() =>
                // this.seleccionarCash(compras),
                this.setState({
                  modalCaja: false,
                  modalCaja3: true,
                })
              }
            >
              Siguiente
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalCaja: false })}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        <Modal size="lg" isOpen={this.state.modalCaja2}>
          <ModalHeader style={{ display: "block" }}>
            Cierre de caja
            <span style={{ float: "right" }}></span>
            <br />
            <br />
            <button
              className="btn btn-light btn-lg"
              onClick={() =>
                this.setState({
                  modalCaja2: false,
                  modalCaja: true,
                })
              }
            >
              Visualizar Compras
            </button>{" "}
            <button
              className="btn btn-outline-light btn-lg"
              disabled
              // onClick={() => this.setState({ modalCaja: true })}
            >
              Visualizar Ventas
            </button>
          </ModalHeader>
          <ModalBody className="SVentaP">
            <TablaVV ventas={this.state.data_sales} />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={
                () =>
                  this.setState({
                    modalCaja2: false,
                    modalCaja3: true,
                  })
                // this.seleccionarCash()
              }
            >
              Siguiente
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalCaja2: false })}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalCaja3}>
          <ModalHeader style={{ display: "block" }}>
            Cierre de caja
            <span style={{ float: "right" }}></span>
          </ModalHeader>
          <ModalBody>
            <label htmlFor="efeInicial">Efectivo inicial:</label>
            <input
              className="form-control"
              type="text"
              name="efeInicial"
              id="efeInicial"
              readOnly
              onChange={this.handleChange}
              value={formCash ? formCash.efeInicial : ""}
            />
            <label htmlFor="efeVentas">Efectivo de ventas:</label>
            <input
              class="form-control"
              id="efeVentas"
              type="text"
              name="efeVentas"
              readOnly
              onChange={this.handleChange}
              value={formCash ? formCash.efeVentas : ""}
            />
            <label htmlfor="gasCompras">Gastos de compras:</label>
            <input
              class="form-control"
              id="gasCompras"
              type="text"
              name="gasCompras"
              readOnly
              onChange={this.handleChange}
              value={formCash ? formCash.gasCompras : ""}
            />
            <label htmlfor="nombre">Efectivo total ingresado:</label>
            <input
              class="efeIngresado"
              id="efeIngresado"
              type="text"
              name="efeIngresado"
              readOnly
              onChange={this.handleChange}
              value={formCash ? formCash.efeIngresado : ""}
            />
            <label htmlfor="efeFinal">Efectivo en caja:</label>
            <input
              class="form-control"
              id="efeFinal"
              type="text"
              name="efeFinal"
              readOnly
              onChange={this.handleChange}
              value={formCash ? formCash.efeFinal : ""}
            />
            <label htmlfor="nombre">Cambio dado:</label>
            <input
              class="form-control"
              id="cambio"
              type="text"
              name="cambio"
              readOnly
              onChange={this.handleChange}
              value={formCash ? formCash.cambio : 0}
            />
            <label htmlfor="observations">Observaciones:</label>
            <input
              class="form-control"
              id="observations"
              type="text"
              name="observations"
              onChange={this.handleChangeCash}
              value={formCash ? formCash.observations : ""}
            />
          </ModalBody>
          <ModalFooter>
            
            <button
              className="btn btn-success"
              onClick={() => this.closeCash()}
            >
              Aceptar cierre de caja
            </button>
            <button
              className="btn btn-danger"
              onClick={() =>
                this.setState({
                  modalCaja: true,
                  modalCaja3: false,
                })
              }
            >
              Regresar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Monto;
