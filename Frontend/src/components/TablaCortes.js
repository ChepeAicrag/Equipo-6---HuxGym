import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import BotonContabilidad from "../components/BotonContabilidad";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { isEmpty } from '../helpers/methods';
import TablaVV from "../components/TablaVV";
import TablaCC from "../components/TablaCC";
const url = "https://www.huxgym.codes/user/cash-closings/";
const url2 = "https://www.huxgym.codes/user/cash-closings/";
class TablaCortes extends Component {
  state = {
    data_purchase: [],
    data_sales: [],
    busqueda: "",
    modalCaja: false,
    modalCaja2: false,
    modalCaja3: false,
    modalCaja4: false,
    modalCaja5: false,
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalEditar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      idcaja: "",
      efeInicial: "",
      efeVentas: "",
      gasCompras: "",
      efeIngresado: "",
      efeFinal: "",
      cambio: "",
      observations: "",
      date: "",
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
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      console.log(res.data);
      const datoss = res.data;
      await this.setState({
        data: datoss,
      });
      console.log(res.data);
    } catch (error) {
      alert(error);
    }
  };

  abrir = async() =>{
    this.setState({ modalCaja2: false, modalCaja3: false, modalCaja4: false });
    this.setState({ modalCaja: !this.state.modalCaja });
  }

  peticionGet2 = async () => {
    try {
      const res = await axios.get(
        url2 + "/" + this.state.form.id + "/" + this.state.form.idcaja,
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      console.log(res);
      const { data } = res;
      this.setState({
        data_purchase: data.purchases,
        data_sales: data.sales,
      });
      console.log(this.state.data_purchase);
      console.log(this.state.data_sales);

    } catch (error) {
      alert(error);
    }
  };


  handleChangeInput = (e) => {
    console.log(this.state.form);
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

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      
        const res = await axios.put(
          url + this.state.form.id + "/" + this.state.form.idcaja + "/",
          {
            observations: this.state.form.observations
          },
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        if (res.status === 200 || res.status === 201) {
/* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          this.peticionGet();
          swal({
            text: "Corte de caja actualizada correctamente",
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
  seleccionarUsuario = async (cajas) => {
    /* Para obtener los datos del usuario a eliminar */
    await this.setState({
      ...this.state.form,
      form: {
        id: cajas.user.id,
        idcaja: cajas.id,
        efeInicial: cajas.cash_init,
        efeVentas: cajas.amount_sell,
        gasCompras: cajas.amount_purchase,
        efeIngresado: cajas.amount_total,
        efeFinal: cajas.cash_end,
        cambio: cajas.cambio,
        observations: cajas.observations,
        employee: cajas.user.name,
        date: cajas.date,
      },
    });
    console.log(cajas);
    console.log(this.state.form.id);
    await this.peticionGet2();
  };

  modalEditar = () => {
    this.setState({
      modalEditar: !this.state.modalEditar,
    });
  };
  modalCaja5 = () => {
    this.setState({ 
      modalCaja5: !this.state.modalCaja5,
    });
  };
  modalCaja = () => {
    
    this.setState({ modalCaja2: false, modalCaja3: false, modalCaja4: false });
    this.setState({ modalCaja: !this.state.modalCaja });
  };
  

  render() {
    const { form } = this.state;
    const { formCash } = this.state;
    return (
      <div className="table-responsiveMain">
        <br />
        <div className="Barra_opciones">
          <BotonContabilidad />
        </div>
        <br />
        <div className="table-wrapper">
          <table className="tab-pane  table table-dark mt-2 mb-5">
            <thead>
              <tr>
                <th>Id</th>
                <th>Fecha de registro</th>
                <th>Nombre del personal</th>
                <th>Inicio de caja</th>
                <th>Terminación de caja</th>
                <th>Observaciones</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map((cajas) => {
                /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                return (
                  <tr>
                    <td>{cajas.id}</td>
                    <td>{cajas.date}</td>
                    <td>{cajas.user.name}</td>
                    <td>{cajas.cash_init}</td>
                    <td>{cajas.cash_end}</td>
                    <td>{cajas.observations}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => {
                          this.seleccionarUsuario(cajas);
                          this.setState({
                            modalCaja: false,
                            modalCaja3: true,
                          })
                          
                        }}
                      >
                        Ver detalles
                      </Button>{" "}
                      <Button
                        className="btn btn-primary"
                        onClick={() => {
                          this.seleccionarUsuario(cajas);
                          this.modalCaja5();
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <Modal size="lg" isOpen={this.state.modalCaja}>
          <ModalHeader style={{ display: "block" }}>
            Previsualización de cierre de caja
            <span style={{ float: "right" }}></span>
            <br />
            <br />
            <button className="btn btn-outline-primary btn-lg " disabled>
              Visualizar Compras
            </button>{" "}
            <button
              className="btn btn-primary btn-lg"
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
              Regresar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalCaja: false })}
            >
              Cerrar ventana
            </button>
          </ModalFooter>
        </Modal>
        <Modal size="lg" isOpen={this.state.modalCaja2}>
          <ModalHeader style={{ display: "block" }}>
            Previsualización de cierre de caja
            <span style={{ float: "right" }}></span>
            <br />
            <br />
            <button
              className="btn btn-primary btn-lg"
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
              className="btn btn-outline-primary btn-lg"
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
              Regresar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalCaja2: false })}
            >
              Cerrar ventana
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
              value={form ? form.efeInicial : ""}
            />
            <label htmlFor="efeVentas">Efectivo de ventas:</label>
            <input
              class="form-control"
              id="efeVentas"
              type="text"
              name="efeVentas"
              readOnly
              onChange={this.handleChange}
              value={form ? form.efeVentas : ""}
            />
            <label htmlfor="gasCompras">Gastos de compras:</label>
            <input
              class="form-control"
              id="gasCompras"
              type="text"
              name="gasCompras"
              readOnly
              onChange={this.handleChange}
              value={form ? form.gasCompras : ""}
            />
            <label htmlfor="nombre">Efectivo total ingresado:</label>
            <input
              class="efeIngresado"
              id="efeIngresado"
              type="text"
              name="efeIngresado"
              readOnly
              onChange={this.handleChange}
              value={form ? form.efeIngresado : ""}
            />
            <label htmlfor="efeFinal">Efectivo final:</label>
            <input
              class="form-control"
              id="efeFinal"
              type="text"
              name="efeFinal"
              readOnly
              onChange={this.handleChange}
              value={form ? form.efeFinal : ""}
            />
            <label htmlfor="observationess">Observaciones:</label>
            <input
              class="form-control"
              id="observationess"
              type="text"
              name="observationess"
              readOnly
              onChange={this.handleChange}
              value={form ? form.observations : ""}
            />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-primary"
              onClick={() =>
                this.setState({
                  modalCaja: true,
                  modalCaja3: false,
                })
              }
            >
              Ver datos de ventas y compras
            </button>
            <button
              className="btn btn-danger"
              onClick={() =>
                this.setState({
                  modalCaja: false,
                  modalCaja3: false,
                })
              }
            >
              Regresar
            </button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={this.state.modalCaja5}>
          <ModalHeader style={{ display: "block" }}>
            Editar cortes de caja
            <span style={{ float: "right" }}></span>
          </ModalHeader>
          <ModalBody>
            <label htmlFor="efeInicial">ID de corte de caja:</label>
            <input
              className="form-control"
              type="text"
              name="efeInicial"
              id="efeInicial"
              readOnly
              onChange={this.handleChange}
              value={form ? form.idcaja : ""}
            />
            <label htmlFor="efeVentas">Fecha de registro:</label>
            <input
              class="form-control"
              id="efeVentas"
              type="text"
              name="efeVentas"
              readOnly
              onChange={this.handleChange}
              value={form ? form.date : ""}
            />
            <label htmlfor="gasCompras">Nombre del empleado:</label>
            <input
              class="form-control"
              id="gasCompras"
              type="text"
              name="gasCompras"
              readOnly
              onChange={this.handleChange}
              value={form ? form.employee : ""}
            />
            <label htmlfor="observations">Observaciones:</label>
            <input
              class="form-control"
              id="observations"
              type="text"
              name="observations"
              maxLength="40"
              placeholder="Observaciones"
              onChange={this.handleChangeInput}
              value={form ? form.observations : ""}
            />
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() =>
                this.setState({
                  modalCaja5: false,
                })
              }
            >
              Cancelar
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                this.peticionPut();
                this.setState({
                  modalCaja5: false,
                })}
              }
            >
              Actualizar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TablaCortes;
