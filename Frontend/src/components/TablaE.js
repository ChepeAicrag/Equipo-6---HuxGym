import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { isEmpty } from "../helpers/methods";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
const url = "https://www.huxgym.codes/user/";

function obtnerDate(date) {
  let fecha = new Date(date);
  console.log(fecha);
  let year = fecha.getFullYear();
  let mounth = fecha.getUTCMonth() + 1;
  let day = fecha.getDate();
  if (mounth < 10) {
    mounth = "0" + mounth;
  }
  console.log(mounth + "aqui es");
  return year + "-" + mounth + "-" + day;
}
class TablaE extends Component {
  campos = {
    name: "nombre",
    age: "edad",
    gender: "genero",
    image: "imagen",
    phone: "télefono",
    image: "imagen",
  };

  state = {
    busqueda: "",
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    empleados: [],
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: "",
      folio: "",
      paternal_surname: "",
      mothers_maiden_name: "",
      birthdate: obtnerDate(new Date()),
      entity_birth: "",
      curp: "",
      gender: "",
      image: "",
      phone: "",
      email: "",
      rol: 2,
      role: "",
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

  state = {
    estados: [],
  };
  perticionState = async () => {
    axios
      .get("https://www.huxgym.codes/state/")
      .then((response) => {
        console.log(response);
        this.setState({ estados: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  peticionGet = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      this.setState({
        /* Con esto accedemos a las variables de state y modificamos */
        data: res.data,
      }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
    } catch (error) {
      console.log("hay un error en TablaE en la peticion Get");
      try {
        const msj = JSON.parse(error.request.response).message;
        if (msj === "Credenciales invalidas") {
          this.Expulsado();
        }
        console.log(msj);
      } catch (error2) {
        console.log(error2);
      }
    }
  };

  validar = (form) => {
    if (isEmpty(form))
      return { error: true, msj: "Debe rellenar los campos obligatorios" };

    const name = form.name;
    const gender = form.gender;
    const email = form.email;
    const phone = form.phone;
    const role = form.role;
    const curp = form.curp;

    if (
      isEmpty(name) &&
      isEmpty(phone) &&
      isEmpty(gender) &&
      isEmpty(role) &&
      isEmpty(email)
    )
      return {
        error: true,
        msj: "Los campos de nombre, telefono, género, son obligatorios",
      };
    if (isEmpty(name))
      return {
        error: true,
        msj: "El campo de nombre no puede estar vacío",
      };

    if (isEmpty(phone))
      return { error: true, msj: "El campo de telefono no puede estar vacío" };
    if (phone.length < 10)
      return { error: true, msj: "El campo de telefono debe tener 10 dígitos" };
    if (isEmpty(email))
      return {
        error: true,
        msj: "El campo de email no puede estar vacío",
      };
    if (isEmpty(gender))
      return { error: true, msj: "El campo de género no puede estar vacío" };
    if (isEmpty(role))
      return {
        error: true,
        msj: "El campo de role no puede estar vacío",
      };

    return { error: false };
  };
  crearFecha = (data) => {
    let dia = data.split("-")[2];
    let mes = data.split("-")[1] - 1;
    let anio = data.split("-")[0];
    let fecha = new Date(anio, mes, dia, 0, 0, 0);
    console.log("Fechaaa " + dia + "-" + mes + "-" + anio);
    return fecha;
  };
  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    try {
      const { form } = this.state;
      const validar = this.validar(form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        let formData = new FormData();
        if (
          typeof this.state.form.image !== "string" &&
          !isEmpty(this.state.form.image)
        )
          formData.append("image", form.image);
        formData.append("name", form.name.toUpperCase());

        formData.append("birthdate", obtnerDate(this.state.form.birthdate));
        formData.append("entity_birth", this.state.form.entity_birth);
        formData.append(
          "paternal_surname",
          this.state.form.paternal_surname.toUpperCase()
        );
        formData.append(
          "mothers_maiden_name",
          this.state.form.mothers_maiden_name.toUpperCase()
        );

        formData.append("curp", this.state.form.curp.toUpperCase());
        formData.append("gender", this.state.form.gender.toUpperCase());
        formData.append("email", this.state.form.email);
        formData.append("phone", this.state.form.phone);
        formData.append("role", this.state.form.role);

        const res = await axios.post(url, formData, {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
        /* cambiamos el estado de modalInsertar y volvemos a pedir los datos*/
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar();
          this.peticionGet();
          swal({
            text: "Empleado agregado satisfactoriamente",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
        }
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
        swal({
          text: msj, //Array.isArray(msj) ? msj[0] : msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      } else if (msj === "Credenciales invalidas") this.Expulsado();
      else
        swal({
          text: msj, //Array.isArray(msj) ? msj[0] : msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
    }
  };

  peticionPut = async () => {
    /* con put enviamos informacion al endpoint para modificar*/
    try {
      const { form } = this.state;
      const validar = this.validar(form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        let formData = new FormData();
        console.log(this.state.form.image);

        if (
          typeof this.state.form.image !== "string" &&
          !isEmpty(this.state.form.image)
        )
          formData.append("image", this.state.form.image);
        formData.append("name", this.state.form.name);
        formData.append("curp", this.state.form.curp.toUpperCase());
        formData.append(
          "paternal_surname",
          this.state.form.paternal_surname.toUpperCase()
        );
        formData.append(
          "mothers_maiden_name",
          this.state.form.mothers_maiden_name.toUpperCase()
        );
        formData.append("entity_birth", this.state.form.entity_birth);
        formData.append("gender", form.gender);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        // formData.append("role", parseInt(form.role));
        console.log(formData);
        const res = await axios.put(url + this.state.form.id + "/", formData, {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        });
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          this.peticionGet();
          swal({
            text: "Empleado actualizado correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
        }
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      if (msj === "Credenciales invalidas") this.Expulsado();
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
      const res = await axios.delete(url + this.state.form.id + "/", {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          modalEliminar: false,
        }); /* Cambiamos el estado de la variable modalEliminar */
        this.peticionGet(); /* Volvemos a pedir los datos */
        swal({
          text: "Empleado eliminado correctamente",
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
      if (msj === "Credenciales invalidas") this.Expulsado();
    }
  };

  componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    this.peticionGet();
    this.perticionState();
  }

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  seleccionarUsuario = (empleados) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: empleados.id,
        name: empleados.name,
        folio: empleados.folio,
        birthdate: this.crearFecha(empleados.birthdate),
        mothers_maiden_name: empleados.mothers_maiden_name,
        paternal_surname: empleados.paternal_surname,
        curp: empleados.curp,
        entity_birth: empleados.entity_birth,
        gender: empleados.gender,
        image: empleados.image,
        phone: empleados.phone,
        email: empleados.email,
        role: empleados.role,
      },
    });
  };

  Expulsado = () => {
    swal({
      text: "Credenciales invalidas, serás conducido al formulario de acceso",
      icon: "info",
      button: "Aceptar",
    }).then((respuesta) => {
      if (respuesta) {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("email");
        localStorage.removeItem("rol");
        localStorage.removeItem("role");
        window.location.href = "/";
      }
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
        if (
          item.name
            .toLocaleLowerCase()
            .includes(this.state.busqueda.toLocaleLowerCase())
        ) {
          i = 1;
          return item;
        }
      });
      this.setState({ empleados: search });
      this.setState({ data: this.state.empleados });
    } else {
      this.peticionGet();
    }
  };
  handleChangeInputCURP = (e) => {
    const { name, value } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
    // let regex = new RegExp("^[a-zA-Z ]+$");
    /* let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");
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
    } */
  };
  changeEstado = (e) => {
    const { name, value } = e.target;
    this.setState({
      form: {
        ...this.state.form,
        [name]: value,
      },
    });
  };

  handleChangeInput = (e) => {
    const { name, value } = e.target;
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
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  handleDateChange = (e) => {
    this.setState({
      form: {
        ...this.state.form,
        birthdate: e,
      },
    });
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

  render() {
    const { form } = this.state;
    return (
      <div className="table-responsiveMain">
        <br />
        <div className="Busqueda">
          <button
            className="btn botones"
            onClick={() => {
              /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
              this.setState({ form: null, tipoModal: "insertar" });
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
            <AddCircleOutlineIcon fontSize="large"></AddCircleOutlineIcon> Nuevo
            Empleado
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
        <div className="table-wrapper">
          <table className="tab-pane  table">
            <thead className="tablaHeader">
              <tr className="encabezado">
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Edad</th>
                <th>Género</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Foto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="cuerpoTabla base">
              {this.state.data &&
                this.state.data.map((empleados) => {
                  /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                  return (
                    <tr>
                      <td>{empleados.curp}</td>
                      <td>{empleados.name}</td>
                      <td>{empleados.age}</td>
                      <td>{empleados.gender}</td>
                      <td>{empleados.phone}</td>
                      <td>{empleados.email}</td>
                      <td>
                        {empleados.role === 2 ? "Encargado" : "Instructor"}
                      </td>
                      <td>
                        <img
                          src={`https://www.huxgym.codes/${empleados.image}`}
                          width="170"
                          height="150"
                          align="center"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-editar"
                          onClick={() => {
                            this.seleccionarUsuario(empleados);
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
                              this.seleccionarUsuario(empleados);
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
        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Empleado
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">Nombre completo*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    maxlength="150"
                    placeholder="Nombre del empleado"
                    onChange={this.handleChangeInput}
                    value={form ? form.name : ""}
                  />
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="name">Nombre completo*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="name"
                    id="name"
                    disabled
                    maxlength="150"
                    placeholder="Nombre del empleado"
                    onChange={this.handleChangeInput}
                    value={form ? form.name : ""}
                  />
                  <br />
                </>
              )}
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">Apellido Paterno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="paternal_surname"
                    id="paternal_surname"
                    maxlength="150"
                    placeholder="Apellido Paterno"
                    onChange={this.handleChangeInput}
                    value={form ? form.paternal_surname : ""}
                  />
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="name">Apellido Paterno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="paternal_surname"
                    id="paternal_surname"
                    maxlength="150"
                    disabled
                    placeholder="Apellido Paterno"
                    onChange={this.handleChangeInput}
                    value={form ? form.paternal_surname : ""}
                  />
                  <br />
                </>
              )}
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">Apellido Materno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="mothers_maiden_name"
                    id="mothers_maiden_name"
                    maxlength="150"
                    placeholder="Apellido Materno"
                    onChange={this.handleChangeInput}
                    value={form ? form.mothers_maiden_name : ""}
                  />
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="name">Apellido Materno*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="mothers_maiden_name"
                    id="mothers_maiden_name"
                    maxlength="150"
                    disabled
                    placeholder="Apellido Materno"
                    onChange={this.handleChangeInput}
                    value={form ? form.mothers_maiden_name : ""}
                  />
                  <br />
                </>
              )}

              {/* <br />
              <label htmlFor="age">Edad*:</label>
              
              <input
                className="form-control"
                type="number"
                name="age"
                id="age"
                min="18"
                max="99"
                placeholder="Edad en años"
                onChange={this.handleChangeInputNumber}
                value={form ? form.age : ""}
              /> */}

              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {this.state.tipoModal === "insertar" ? (
                  <>
                    <label className="articulo mt-3">Fecha de Nacimiento</label>
                    <br />
                    <KeyboardDatePicker
                      className="fecha"
                      allowKeyboardControl={true}
                      id="birthdate"
                      format="yyyy-MM-dd"
                      value={form ? form.birthdate : new Date()}
                      onChange={this.handleDateChange}
                      animateYearScrolling={true}
                    />
                  </>
                ) : (
                  <>
                    <label className="articulo mt-3">Fecha de Nacimiento</label>
                    <br />
                    <KeyboardDatePicker
                      className="fecha"
                      allowKeyboardControl={true}
                      id="birthdate"
                      format="yyyy-MM-dd"
                      disabled
                      value={form ? form.birthdate : new Date()}
                      onChange={this.handleDateChange}
                      animateYearScrolling={true}
                    />
                  </>
                )}
              </MuiPickersUtilsProvider>
              <br />
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="entity_birth">Estado*:</label>
                  <br />
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="entity_birth"
                    id="entity_birth"
                    onChange={this.changeEstado}
                    value={form ? form.entity_birth : "1"}
                  >
                    {this.state.estados.map((elemento) => (
                      <option key={elemento.num} value={elemento.num}>
                        {elemento.name}
                      </option>
                    ))}
                  </select>
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="entity_birth">Estado*:</label>
                  <br />
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="entity_birth"
                    id="entity_birth"
                    disabled
                    onChange={this.changeEstado}
                    value={form ? form.entity_birth : "1"}
                  >
                    {this.state.estados.map((elemento) => (
                      <option key={elemento.num} value={elemento.num}>
                        {elemento.name}
                      </option>
                    ))}
                  </select>
                  <br />
                </>
              )}

              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="name">CURP*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="curp"
                    id="curp"
                    maxlength="150"
                    placeholder="CURP"
                    onChange={this.handleChangeInputCURP}
                    value={form ? form.curp : ""}
                  />
                </>
              ) : (
                <>
                  <label htmlFor="name">CURP*:</label>
                  <input
                    className="form-control"
                    disabled
                    type="text"
                    name="curp"
                    id="curp"
                    maxlength="150"
                    placeholder="CURP"
                    onChange={this.handleChangeInputCURP}
                    value={form ? form.curp : ""}
                  />
                </>
              )}

              <label htmlFor="phone">Teléfono*:</label>
              <input
                className="form-control"
                type="text"
                name="phone"
                id="phone"
                size="10"
                maxLength="10"
                placeholder="Teléfono"
                onChange={this.handleChangeInputNumber}
                value={form ? form.phone : ""}
              />
              <br />

              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="email">Email*:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    id="email"
                    maxlength="200"
                    placeholder="Email"
                    onChange={this.handleChange}
                    value={form ? form.email : ""}
                  />
                </>
              ) : (
                <>
                  <label htmlFor="email">Email:</label>
                  <input
                    className="form-control"
                    type="text"
                    name="email"
                    id="email"
                    disabled
                    onChange={this.handleChange}
                    value={form ? form.email : ""}
                  />
                </>
              )}

              <br />
              <label htmlFor="image">Foto:</label>
              <input
                className="form-control"
                type="file"
                name="image"
                ref="file"
                id="image"
                placeholder="Seleccione su foto"
                accept="image/png, image/jpeg, image/jpg, image/ico"
                onChange={this.handleChangeInputImage}
              />
              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="gender">Género*:</label>
                  <br />
                  <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="gender"
                        value="H"
                        autocomplete="off"
                        onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "H" ? true : false) : true
                        }
                      />{" "}
                      H
                    </label>
                    <label class="btn botonesForm m-1 ">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        autocomplete="on"
                        onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "M" ? true : false) : true
                        }
                      />{" "}
                      M
                    </label>
                  </div>
                  <br />
                </>
              ) : (
                <>
                  <label htmlFor="gender">Género*:</label>
                  <br />
                  <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="gender"
                        value="H"
                        autocomplete="off"
                        disabled
                        onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "H" ? true : false) : true
                        }
                      />{" "}
                      H
                    </label>
                    <label class="btn botonesForm m-1 ">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        disabled
                        autocomplete="on"
                        onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "M" ? true : false) : true
                        }
                      />{" "}
                      M
                    </label>
                  </div>
                  <br />
                </>
              )}

              {this.state.tipoModal === "insertar" ? (
                <>
                  <label htmlFor="role">Rol*: </label>
                  <br />
                  <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="2"
                        autocomplete="off"
                        onChange={this.handleChange}
                        checked={
                          (this.state.tipoModal === "insertar" &&
                            form == null) ||
                          form.role === undefined
                            ? false
                            : form.role == 2
                            ? true
                            : false
                        }
                      />{" "}
                      Empleado
                    </label>
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="3"
                        autocomplete="on"
                        onChange={this.handleChange}
                        checked={
                          (this.state.tipoModal === "insertar" &&
                            form == null) ||
                          form.role === undefined
                            ? false
                            : form.role == 3
                            ? true
                            : false
                        }
                      />{" "}
                      Instructor
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="role">Rol*: </label>
                  <br />
                  <div class="btn-group btn-group-toggle" data-toggle="buttons">
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="2"
                        disabled
                        autocomplete="off"
                        onChange={this.handleChange}
                      />{" "}
                      Empleado
                    </label>
                    <label class="btn botonesForm m-1 ">
                      <input
                        type="radio"
                        name="role"
                        value="3"
                        disabled
                        autocomplete="on"
                        onChange={this.handleChange}
                      />{" "}
                      Instructor
                    </label>
                  </div>
                </>
              )}

              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === "insertar" ? (
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
              <label htmlFor="name">Nombre completo:</label>
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
              <label htmlFor="phone">Teléfono:</label>
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
              <label htmlFor="role">Rol:</label>
              <input
                className="form-control"
                type="text"
                name="role"
                id="role"
                readOnly
                onChange={this.handleChange}
                value={form ? form.role : ""}
              />
              <br />
              ¿Seguro de eliminar este empleado?
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

export default TablaE;
