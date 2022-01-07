import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BotonProducts from "../components/BotonProducts";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
  faCalculator,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

import { isEmpty } from "../helpers/methods";

/* import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons"; */
const url = "https://www.huxgym.codes/products/products/";
const urlC = "https://www.huxgym.codes/products/category/";
const urlP = "https://www.huxgym.codes/products/provider/";
const urlA = "https://www.huxgym.codes/products/anadirStock/";
const urlE = "https://www.huxgym.codes/products/restarStock/";
const urlStock = "https://www.huxgym.codes/products/stockDeProducto/";
class TablaP extends Component {
  state = {
    busqueda: "",
    dataStock: [],
    dataP: [],
    dataC: [],
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    modalSeleccionarCategoria: false,
    modalSeleccionarProveedor: false,
    modalStock: false,
    productos: [],
    name_category: "",
    name_provider: "",
    stock_editar: 0,
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: "",
      description: "",
      price_s: 0,
      price_c: "0",
      image: "",
      category_id: "",
      provider_id: "",
      stock: 0,
      id_stock: 0,
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
      const productos = res.data;
      productos.forEach(async (p) => {
        const pet_amount = await axios.get(urlStock + p.id);
        p.stock = pet_amount.data.amount;
        p.id_stock = pet_amount.data.id;
      });
      this.setState({
        data: productos,
      });
      console.log(this.state.data);
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  };

  peticionGetStock = async (productos) => {
    const pro = parseInt(productos, 10);
    console.log(pro);
    try {
      const res = await axios.get(urlStock + pro, {
        headers: {},
      });
      console.log(res);
      this.setState({
        dataStock: res.data,
      });
      console.log(res);
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
    }
  };

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
      /* console.log(res); */
      this.setState({
        dataP: res.data,
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
    const price_s = form.price_s;
    const price_c = form.price_c;
    const provider = form.provider_id;
    const category = form.category_id;
    const description = form.description;
    const name = form.name;
    if (isEmpty(name))
      return { error: true, msj: "El campo de nombre no puede estar vacío" };
    if (isEmpty(description))
      return {
        error: true,
        msj: "El campo de descripción no puede estar vacío",
      };
    if (isEmpty(price_c))
      return {
        error: true,
        msj: "El campo de precio de compra no puede estar vacío",
      };
    if (isEmpty(price_s))
      return {
        error: true,
        msj: "El campo de precio de venta no puede estar vacío",
      };
    const price_sale = parseFloat(form.price_s);
    const price_puchase = parseFloat(form.price_c);
    if (price_puchase > price_sale)
      return {
        error: true,
        msj: "El precio de compra no puede ser mayor al de venta",
      };
    if (isEmpty(provider))
      return { error: true, msj: "El campo de proveedor no puede estar vacío" };
    if (isEmpty(category))
      return { error: true, msj: "El campo de categoria no puede estar vacío" };
    return { error: false };
  };

  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    const validar = this.validar(this.state.form);
    if (validar.error) {
      swal({
        text: validar.msj,
        icon: "info",
        button: "Aceptar",
        timer: "4000",
      });
    } else {
      const price_s = parseFloat(this.state.form.price_s);
      const price_c = parseFloat(this.state.form.price_c);
      let formData = new FormData();
      formData.append("price_s", price_s);
      formData.append("price_c", price_c);
      formData.append("provider_id", this.state.form.provider_id);
      formData.append("category_id", this.state.form.category_id);
      formData.append("description", this.state.form.description);
      formData.append("name", this.state.form.name);
      console.log(typeof this.state.form.image);
      if (
        typeof this.state.form.image !== "string" &&
        !isEmpty(this.state.form.image)
      )
        formData.append("image", this.state.form.image);
      try {
        delete this.state.form.id;
        const res = await axios.post(url, formData, {
          headers: {},
        });
        /* cambiamos el estado de modalInsertar y volvemos a pedir los datos*/
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar();
          await this.componentDidMount();
          swal({
            text: "Producto agregado correctamente",
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
    }
  };

  peticionPostA = async () => {
    try {
      const stock_editar = parseInt(this.state.stock_editar, 10);
      const stock_actual = this.state.form.amount;
      if(isEmpty(stock_editar))
        swal({
          text: "El campo de stock es requerido",
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      else if (stock_editar < 0)
        swal({
          text: "No puede colocar una cantidad negativa",
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      else{
        const res = await axios.post(urlA + this.state.form.id_stock, {
          amount: stock_editar,
        });
        if (res.status === 200 || res.status === 201) {
          this.setState({
            modalStock: false,
          });
          this.state.stock_editar = 0;
          await this.componentDidMount();
          swal({
            text: "Stock actualizado correctamente",
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

  peticionPostB = async () => {
    try {
      const stock_editar = parseInt(this.state.stock_editar, 10);
      const stock_actual = this.state.form.stock;
      if(isEmpty(stock_editar))
        swal({
          text: "El campo de stock es requerido",
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      else if (stock_editar > stock_actual)
        swal({
          text: "No puede eliminar más de la cantidad actual de stock",
          icon: "info",
          button: "Aceptar",
          timer: "4000",
        });
      else{
        const res = await axios.post(urlE + this.state.form.id_stock, {
          amount: stock_editar,
        });
        if (res.status === 200 || res.status === 201) {
          this.setState({
            modalStock: false,
          });
          this.state.stock_editar = 0;
          await this.componentDidMount();
          swal({
            text: "Stock actualizado correctamente",
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
    const validar = this.validar(this.state.form);
    if (validar.error) {
      swal({
        text: validar.msj,
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    } else {
      const price_s = parseFloat(this.state.form.price_s);
      const price_c = parseFloat(this.state.form.price_c);
      let formData = new FormData();
      formData.append("price_s", price_s);
      formData.append("price_c", price_c);
      formData.append("provider_id", this.state.form.provider_id);
      formData.append("category_id", this.state.form.category_id);
      formData.append("description", this.state.form.description);
      formData.append("name", this.state.form.name);
      if (typeof this.state.form.image !== "string" && !isEmpty(this.state.form.image))
        formData.append("image", this.state.form.image);
      try {
        const res = await axios.put(url + this.state.form.id, formData, {
          headers: {},
        });
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          await this.componentDidMount();
          swal({
            text: "Producto actualizado correctamente",
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
          text: "Producto eliminado correctamente",
          icon: "success",
          button: "Aceptar",
          timer: "4000",
        });
      }
    } catch (error) {
      var msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (isEmpty(msj)) {
        const res = JSON.parse(error.request.response);
        const c = Object.keys(res)[0];
        console.log();
        msj = res[c]
          .toString()
          .replace("Este campo", "El campo " + this.campos[c]);
      }
      swal({
        text: msj, //Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  async componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    await this.peticionGet();
    await this.peticionGetC();
    await this.peticionGetP();
    // this.peticionGetStock();
  }

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({
      /* modalSeleccionarCategoria: false,
      modalSeleccionarProveedor: false, */
      modalInsertar: !this.state.modalInsertar,
    });
  };

  modalCategoria = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({
      /* modalInsertar: false,
      modalSeleccionarProveedor: false, */
      modalSeleccionarCategoria: !this.state.modalSeleccionarCategoria,
    });
  };

  modalProveedor = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({
      /* modalInsertar: false,
      modalSeleccionarCategoria: false, */
      modalSeleccionarProveedor: !this.state.modalSeleccionarProveedor,
    });
  };

  seleccionarProducto = async (productos) => {
    /* Para obtener los datos del usuario a eliminar */
    const pet_category = await axios.get(urlC + productos.category_id);
    const pet_provider = await axios.get(urlP + productos.provider_id);
    console.log(productos.provider_id);
    this.setState({
      ...this.state.form,
      tipoModal: "actualizar",
      busqueda: "",
      name_category: pet_category.data.name, //: productos.category_id.name,
      name_provider: pet_provider.data.name, //productos.provider_id.name,
      form: {
        id: productos.id,
        name: productos.name,
        description: productos.description,
        price_s: productos.price_s,
        price_c: productos.price_c,
        image: productos.image,
        stock: productos.stock,
        id_stock: productos.id_stock,
        category_id: pet_category.data.id,
        provider_id: pet_provider.data.id,
      },
    });
    this.peticionGetStock(this.state.form.id);
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
        if (
          item.name.toLowerCase().includes(this.state.busqueda.toLowerCase())
        ) {
          i = 1;
          return item;
        }
      });
      this.setState({ productos: search });
      this.setState({ data: this.state.productos });
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

  handleChangeInputNumberStock = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value) || isEmpty(value)) {
      console.log(name, value);
      this.setState({
          ...this.state,
          [name]: value,
        },
      );
    } else {
      e.target.value = ""
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

  handleChangeInputImage = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    let regex = ["image/png", "image/jpeg", "image/jpg", "image/ico"];
    if (typeof file !== undefined)
      if (regex.includes(file.type)) {
        this.setState({
          form: {
            ...this.state.form,
            [name]: file,
          },
        });
      } else {
        this.setState({
          form: {
            ...this.state.form,
            [name]: "",
          },
        });
        swal({
          text: "Formato de imágen invalido",
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      }
  };
  validateNumber = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let regex = new RegExp("[0-9]+(\.[0-9][0-9]?)?");

    if (regex.test(value)|| isEmpty(value)) {
      const setValue = value <= 10000 && value>=0 ? value : 0.0;
      this.setState({
        form: {
          ...this.state.form,
          [name]: setValue,
        },
      }); 

    }
    else{
    event.target.value = ""
      swal({
        text: "No se permiten letras",
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
        
        <div className="Barra_opciones mt-3">
          <BotonProducts />
        </div>
        <br />
        <div className="Busqueda">
          <button
            className="btn botones"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              this.setState({
                form: null,
                tipoModal: "insertar",
                name_category: "",
                name_provider: "",
              });
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
          <button type="submit" className="btn add-on" onClick={() => {}}>
            <i className="bx bxs-user">
              <box-icon name="search-alt-2" color="#fff"></box-icon>
            </i>
          </button>
        </div>

        <br />
        <div className="table-wrapper">
          <table className="tab-pane  table">
            <thead className="tablaHeader">
              <tr className="encabezado" >
                <th>Folio</th>
                <th>Nombre del producto</th>
                <th>Precio de venta</th>
                <th>Precio de compra</th>
                <th>Descripción</th>
                <th>Cantidad en stock</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="cuerpoTabla base">
              {this.state.data.map((productos) => {
                /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                return (
                  <tr>
                    <td>{productos.folio}</td>
                    <td>{productos.name}</td>
                    <td>{"$ " +productos.price_s}</td>
                    <td>{"$ " +productos.price_c}</td>
                    <td>{productos.description}</td>
                    <td>{productos.stock}</td>
                    <td>
                      {" "}
                      <img
                        src={`https://www.huxgym.codes/${productos.image}`}
                        width="170"
                        height="150"
                        align="center"
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-editar"
                        onClick={() => {
                          this.seleccionarProducto(productos);
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
                            this.seleccionarProducto(productos);
                            this.setState({ modalEliminar: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faTrashAlt} />
                        </button>
                      ) : (
                        <></>
                      )}
                      {"  "}
                      {localStorage.getItem("rol") == "Administrador" ? (
                        <button
                          className="btn btn-success"
                          onClick={() => {
                            this.seleccionarProducto(productos);
                            this.setState({ modalStock: true });
                          }}
                        >
                          <FontAwesomeIcon icon={faCalculator} />
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
            Producto
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {this.state.tipoModal == "insertar" ? (
                <></>
              ) : (
                <>
                  {/* <label htmlFor="id">Id</label>
                  <input
                    className="form-control"
                    type="text"
                    name="id"
                    id="id"
                    readOnly
                    onChange={this.handleChange}
                    value={form ? form.id : ""}
                  /> */}
                </>
              )}
              <label htmlFor="name">Nombre del producto*:</label>
              <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                maxlength="40"
                placeholder="Nombre del producto"
                onChange={this.handleChangeInput}
                value={form ? form.name : ""}
              />
              <br />
              <br />
              <label htmlFor="description">Descripción*:</label>
              <input
                className="form-control"
                type="text"
                name="description"
                id="description"
                maxLength="100"
                placeholder="Descripción sobre el producto"
                onChange={this.handleChangeInput}
                value={form ? form.description : ""}
              />
              <br />
              <br />
              <label htmlFor="price_c">Precio de compra*:</label>
              <br />
              <div  className="signo">
                    <h4 className="mr-2" style={{ color: "white"}}>$</h4>
                    <TextField
                              id="outlined-number"
                              
                              name="price_c"
                              onChange={this.validateNumber}
                              step="5"
                              value={form ? form.price_c : "0.00"}
                              type="number"
                              InputLabelProps={{
                                  shrink: true,
                              }}
                              variant="outlined"
                              
                          />
              </div>
             {/*  <input
                className="form-control"
                type="number"
                name="price_c"
                id="price_c"
                placeholder="Precio de compra"
                min="0.00"
                step="0.01"
                presicion={2}
                onChange={this.handleChangeInputNumberDecimal}
                value={form ? parseFloat(form.price_c) : 0}
              /> */}
              <br />
              <br />
              <label htmlFor="price_s">Precio de venta*:</label>
              <br />
              <div  className="signo">
                    <h4 className="mr-2" style={{ color: "white"}}>$</h4>
                    <TextField
                              id="outlined-number"
                              
                              name="price_s"
                              onChange={this.validateNumber}
                              step="5"
                              value={form ? form.price_s : "0.00"}
                              type="number"
                              InputLabelProps={{
                                  shrink: true,
                              }}
                              variant="outlined"
                              
                          />
              </div>
              {/* <input
                className="form-control"
                type="number"
                name="price_s"
                id="pprice_s"
                placeholder="Precio de venta"
                min="0.00"
                step="0.01"
                presicion={2}
                onChange={this.handleChangeInputNumberDecimal}
                value={form ? parseFloat(form.price_s) : 0}
              /> */}
              <br />
              <br />
              <label htmlFor="image">Adjunta tu imagen del producto:</label>
              <input
                className="form-control"
                type="file"
                name="image"
                ref="file"
                id="image"
                accept="image/png, image/jpeg, image/jpg, image/ico"
                onChange={this.handleChangeInputImage}
              />
              <br />
              <br />
              <button className="btn btn-seleccion" onClick={this.modalProveedor}>
                Selecciona el proveedor
              </button>
              <br />
              <input
                className="form-control"
                type="text"
                name="provider"
                id="provider"
                readOnly
                onChange={this.handleChange}
                value={form ? this.state.name_provider : ""}
              />
              <br />
              <button className="btn btn-seleccion" onClick={this.modalCategoria}>
                Selecciona la categoria
              </button>
              <br />
              <input
                className="form-control"
                type="text"
                name="category"
                id="category"
                readOnly
                onChange={this.handleChange}
                value={form ? this.state.name_category : ""}
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
              <label htmlFor="name">Nombre:</label>
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
              ¿Seguro de eliminar este producto?
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
        {/* Comienza stock */}
        <Modal isOpen={this.state.modalStock}>
          <ModalHeader style={{ display: "block" }}>
            Editar cantidad disponible en inventario
            <span style={{ float: "right" }}></span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              {/* <label htmlFor="id">Id:</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.id : ""}
              /> */}
              <br />
              
              {/* <label htmlFor="name">Nombre:</label> */}
              <h4>
              {form ? form.name : ""}
              </h4>
              {/* <input
                className="form-control"
                type="text"
                name="name"
                id="name"
                readOnly
                onChange={this.handleChange}
                value={form ? form.name : ""}
              /> */}
              <br />
              <label htmlFor="stock_editar">
                Cantidad a editar del producto:
              </label>
              <input
                className="form-control"
                type="number"
                min="1"
                name="stock_editar"
                id="stock_editar"
                pattern="^[0-9]+"
                max="1000"
                min="0"
                onChange={this.handleChangeInputNumberStock}
                onKeyPress={async (event) =>   
                  { var l = await this.state.stock_editar; if (l.length > 3) {
                this.setState({
                  ... this.state,
                 [event.target.name] : this.state.stock_editar.slice(0,4)
                }
                )
                swal({
                  text: "Lo máxmo son 4 digitos",
                  icon: "info",
                  button: "Aceptar",
                  timer: "1000",
                });
                return false;
              }}}
                value={this.state.stock_editar ? this.state.stock_editar : 0}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              className="btn btn-success"
              onClick={() => this.peticionPostA()}
            >
              Añadir
            </button>
            <button
              className="btn botonesdash"
              onClick={() => this.peticionPostB()}
            >
              Eliminar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.setState({ modalStock: false })}
            >
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        {/* Aqui va el modal para seleccionar la categoria */}
        <Modal isOpen={this.state.modalSeleccionarCategoria}>
          <ModalHeader style={{ display: "block" }}>
            Seleccione Categoria
            <span style={{ float: "right" }}></span>
          </ModalHeader>
          <ModalBody className="SCategoria">
            <div className="form-group">
              <div className="table-responsive">
                <table className="table table-striped table-bordered ">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre de la categoría</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.dataC.map((categorias) => {
                      /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                      return (
                        <tr>
                          <td>{categorias.id}</td>
                          <td>{categorias.name}</td>
                          <td>{categorias.description}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                /* this.seleccionarCategoria(categorias); */
                                this.setState({
                                  name_category: categorias.name,
                                  form: {
                                    ...this.state.form,
                                    category_id: categorias.id,
                                  },
                                });
                                console.log(categorias.id);
                                this.modalCategoria();
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
          <ModalFooter className="Cancelar-Categoria">
            <button className="btn btn-danger" onClick={this.modalCategoria}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
        {/* Aqui comienza el modal de Proveedores */}
        <Modal isOpen={this.state.modalSeleccionarProveedor}>
          <ModalHeader style={{ display: "block" }}>
            Seleccione Proveedor
            <span style={{ float: "right" }}></span>
          </ModalHeader>
          <ModalBody className="SCategoria">
            <div className="form-group">
              <table className="table table-striped table-bordered ">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.dataP.map((proveedores) => {
                    /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                    return (
                      <tr>
                        <td>{proveedores.id}</td>
                        <td>{proveedores.name}</td>
                        <td>{proveedores.phone}</td>
                        <td>
                          <button
                            className="btn btn-primary"
                            onClick={() => {
                              this.setState({
                                name_provider: proveedores.name,
                                form: {
                                  ...this.state.form,
                                  provider_id: proveedores.id,
                                },
                              });
                              console.log(proveedores.id);

                              /* this.seleccionarProducto(proveedores); */
                              this.modalProveedor();
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
          </ModalBody>
          <ModalFooter className="Cancelar-Categoria">
            <button className="btn btn-danger" onClick={this.modalProveedor}>
              Cancelar
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default TablaP;
