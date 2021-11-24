import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import swal from 'sweetalert';
import "../styles/Monto.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import "../styles/Ventas.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import TablaVV from "../components/TablaVV"
const urlCash = "https://www.huxgym.codes/user/cash-register/open/";
const url_close = "https://www.huxgym.codes/user/cash-register/close/";
const urlVentas ="https://www.huxgym.codes/sales/";
const url_caja = "https://www.huxgym.codes/user/cash-register/"

const url = "https://www.huxgym.codes/sales/"; /* Aqui va la url principal */
const urlC = "https://www.huxgym.codes/customers/customers/";
const urlP = "https://www.huxgym.codes/products/products/";
const urlM = "https://www.huxgym.codes/memberships/memberships/";
class TablaHistorialCorte extends Component {

  state = {
    cashInit: "",
    modalCaja: false,
    modalCaja2: false,
    modalCaja3: false,
    modalCaja4: false,
    dataCompras: [],
    dataVentas: [],
    dataForm: [],
    dataCash: [],
    formCash: {
      efeInicial: "",
      efeVentas: "",
      gasCompras: "",
      efeIngresado: "",
      efeFinal: "",
      observationess: "",
    },
    formCompra: {
      id: "",
      name: "",
      amount: "",
      dataJoined: "",
    },
    formVenta: {
      id: "",
      name: "",
      amount: "",
      dataJoined: "",
    }
  }
  openCash = async () => {
    try {

    const cash = parseInt(this.state.cashInit);      
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
        alert("La caja se abre con " + cash_init);
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
  closeCash = async () => {
    try {
      const res = await axios.post(
        url_close,
        {
          observations: "Dia correcto",
        },
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        const { cash_end } = res.data;
        alert("La caja se cerró con " + cash_end);
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
  handleChangeInicial = async (e) => {
    await this.setState({
      cashInit: e.target.value
    })
  };

  handleChangeCash = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    console.log(this.state.cashInit);
    e.persist();
    await this.setState({
      cashInit:[e.target.value],
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
    } catch (error) {
      
    }
  };


  peticionGetCash = async() => {
    try {
        const res = await axios.get(url_caja, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      /* console.log(res); */
      if(res.status === 200 || res.status === 201){
        const { data } = res;
        this.setState({
          formCash: {
            efeInicial: data.cash_init,
            efeVentas: data.amount_sell,
            gasCompras: data.amount_purchase,
            efeIngresado: data.amount_total,
            efeFinal: data.cash_end,
          },
        });
        console.log(data)
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  }
  

componentDidMount() {
  /* Este metodo se ejecuta inmediatamente despues del renderizado */
  this.peticionGetCash();
  /* this.peticionGetC();
  this.peticionGetP(); */
}

  
  render() {
    const { formCash } = this.state;
    const { form2 } = this.state;
    const { form } = this.state;
    return (
      <div >
        <Button variant="primary" onClick={() => 
          
          this.modalCaja()}>
          Ver detalles
        </Button>{" "}
        <Modal size="lg" isOpen={this.state.modalCaja}>
        <ModalHeader style={{ display: "block" }}>
            Previsualización de cierre de caja
            <span style={{ float: "right" }}></span>
            <br/>
            <br/>
            <button
              className="btn btn-outline-primary btn-lg " disabled
              
            >
              Visualizar Compras
            </button>
            {" "}
            {" "}
            <button
              className="btn btn-primary btn-lg"
              onClick={() => 
               
                this.setState({ 
                
                modalCaja: false,
                modalCaja2: true })}
            >
              Visualizar Ventas
            </button>
          </ModalHeader>
          <ModalBody>
                 <TablaVV />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => 
                // this.seleccionarCash(compras),
                this.setState({ 
                modalCaja: false, 
                modalCaja3: true })
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
        </Modal >
        <Modal size="lg" isOpen={this.state.modalCaja2}>
        <ModalHeader style={{ display: "block" }}>
            Previsualización de cierre de caja
            <span style={{ float: "right" }}></span>
            <br/>
            <br/>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => this.setState({ 
                modalCaja2: false,
                modalCaja: true })}
            >
              Visualizar Compras
            </button>
            {" "}
            {" "}
            <button
          
              className="btn btn-outline-primary btn-lg" disabled
              // onClick={() => this.setState({ modalCaja: true })}
            >
              Visualizar Ventas
            </button>
          </ModalHeader>
          <ModalBody className="SVentaP">
          <TablaVV />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => this.setState({ 
                modalCaja2: false,
                modalCaja3: true })
                // this.seleccionarCash()
              }
            >
              Siguiente
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({modalCaja2: false })}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalCaja3}>
        <ModalHeader style={{ display: "block" }}>
            Previsualización de cierre de caja
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
        <label htmlfor="efeFinal">Efectivo final:</label>
        <input
          class="form-control"
          id="efeFinal"
          type="text"
          name="efeFinal"
          readOnly
          onChange={this.handleChange}
          value={formCash ? formCash.efeFinal:""}
        />
        <label htmlfor="observationess">Observaciones:</label>
        <input
          class="form-control"
          id="observationess"
          type="text"
          name="observationess"
          readOnly
          onChange={this.handleChange}
          value={formCash ? formCash.observationess:""}
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
              onClick={() => this.setState({
                modalCaja: true,
                modalCaja3: false })}
            >
              Regresar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TablaHistorialCorte;
