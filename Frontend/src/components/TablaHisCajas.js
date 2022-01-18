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
import TablaVV from "../components/TablaVV";
import TablaCC from "../components/TablaCC";
const urlCash = "https://www.api.huxgym.codes/user/cash-register/open/";
const url_close = "https://www.api.huxgym.codes/user/cash-register/close/";
const urlVentas ="https://www.api.huxgym.codes/sales/";
const url_caja = "https://www.api.huxgym.codes/user/cash-register/"

const url = "https://www.api.huxgym.codes/sales/"; /* Aqui va la url principal */
const urlC = "https://www.api.huxgym.codes/customers/customers/";
const urlP = "https://www.api.huxgym.codes/products/products/";
const urlM = "https://www.api.huxgym.codes/memberships/memberships/";
class TablaHisCajas extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    data_purchase: this.props.compras,
    data_sales: this.props.ventas,
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


componentDidMount() {
  /* Este metodo se ejecuta inmediatamente despues del renderizado */
  
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
          <TablaCC compras = {this.state.data_purchase}/>
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
          <TablaVV ventas = {this.state.data_sales}/>
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

export default TablaHisCajas;
