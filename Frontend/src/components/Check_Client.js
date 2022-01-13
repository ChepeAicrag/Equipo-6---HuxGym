import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import swal from "sweetalert";
import LogoutIcon from '@mui/icons-material/Logout';
import MeetingRoomOutlinedIcon from '@mui/icons-material/MeetingRoomOutlined';
import "../styles/Crud.css";

const urlC = "https://www.api.huxgym.codes/customers/customers/";
const urlCA = "https://www.api.huxgym.codes/customers/clientesActuales";
const urlIn = "https://www.api.huxgym.codes/customers/attendance/";
const urlOut = "https://www.api.huxgym.codes/customers/attendance/check_out/";
class Check_Client extends Component {
  state = {
    modalCheck: false,
    busq1:"",
    busq2:"",
    busqueda1:[],
    busqueda2:[],
    total: 0,
    errors:{},
    sinEntrar:[],
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
    
    
  }

  seEncuentra(item){
    const found =this.state.dataCA.find(element=>{
      if(element.customer_id.id===item.id)return item
      else return null
    });
    if(!found) return false
    else return true
  }

  clientesSinEntrar(){
    let filtro = this.state.dataC.filter((item) => {
        if(!this.seEncuentra(item))
        return item;
      }
    );
    this.setState({ sinEntrar: filtro });
    this.setState({ busqueda1: filtro });
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
      /* this.clientesSinEntrar(); */
      console.log(res.data);
      this.peticionGetCA();
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
          busqueda2: res.data,
        });
        this.state.total = res.data.length;
        if(res.data.length>14){
          this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                lleno: 'El cupo maximo es de 15'
            }
        }))
        }else {
          this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                lleno: null
            }
        }))
        }
        console.log(res);
        console.log(this.state.total);
        this.clientesSinEntrar();
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
    await this.setState({ busq1: e.target.value });
    console.log(this.state.busq1);
    this.filtrarElementos();
  };

  filtrarElementos = () => {
    this.setState({ sinEntrar: this.state.busqueda1 });
    if (this.state.busq1 != "") {
      var search = this.state.sinEntrar.filter((item) => {
        if (item.name.toLowerCase().includes(this.state.busq1.toLowerCase())) {
         
          return item;
        }
      });
      
      this.setState({ sinEntrar: search });
    } else {
      this.setState({ sinEntrar: this.state.busqueda1 });
    }
  };

  buscador2 = async (e) => {
    e.persist();
    await this.setState({ busq2: e.target.value });
    console.log(this.state.busq2);
    this.filtrarElementos2();
  };

  filtrarElementos2 = () => {
    this.setState({ dataCA: this.state.busqueda2 });
    if (this.state.busq2 != "") {
      var search = this.state.dataCA.filter((item) => {
        if (item.customer_id.name.toLowerCase().includes(this.state.busq2.toLowerCase())) {
         
          return item;
        }
      });
      
      this.setState({ dataCA: search });
    } else {
      this.setState({ dataCA: this.state.busqueda2 });
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
                value={form ? form.busq1 : ""}
              />
              <br />
              {this.state.errors.lleno && <p  className="errores mt-2">{this.state.errors.lleno}</p>}
              <br />
              <div className="tablita my-custom-scrollbar2">
                <table className="tab-pane table-dark table">
                  <thead>
                    <tr>
                      {/* <th>Id</th> */}
                      <th>Nombre</th>
                      <th>Entrar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.sinEntrar &&
                      this.state.sinEntrar.map((clientes) => {
                        /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                        return (
                          <tr>
                            {/* <td>{clientes.id}</td> */}
                            <td>{clientes.name}</td>
                            <td>
                            {this.state.dataCA.length<15 ?
                              <button
                                className="btn btn-dark"
                                onClick={() => {
                                  /* this.seleccionarCategoria(categorias); */
                                  this.state.form.customer_id = clientes.id;
                                  this.peticionPost();
                                  this.peticionGetCA();
                                }}
                              >
                                <MeetingRoomOutlinedIcon></MeetingRoomOutlinedIcon>
                              </button>
                              :
                              <button
                                className="btn botonesdash"
                                disabled
                              >
                                <MeetingRoomOutlinedIcon></MeetingRoomOutlinedIcon>
                              </button>
                              }
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Otra columna */}
           
            <div className=" mt-5 form-group">
              <h3 className="mt-3">Clientes entrenando</h3>
              <br />

              <input
                type="text"
                className= "entradatext"
                name="busqueda"
                placeholder="Buscar"
                onChange={this.buscador2}
                value={form ? form.busq2 : ""}
              />
              <br />
              <br />

              <div className="tablita  my-custom-scrollbar2">
                <table className="tab-pane table table-dark">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Hora de entrada</th>
                      <th>Salir</th>
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
                                className="btn btn-dark"
                                onClick={() => {
                                  /* this.seleccionarCategoria(categorias); */
                                  this.state.form.customer_id =
                                    clientesA.customer_id.id;
                                  this.peticionPut();
                                  this.peticionGetCA();
                                }}
                              >
                                <LogoutIcon></LogoutIcon>
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
