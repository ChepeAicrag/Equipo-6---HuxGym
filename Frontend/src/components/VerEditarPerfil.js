import React, { Component } from "react";
import "../styles/Crud.css";
import "../styles/verEditarPerfil.css";
import axios from "axios";
import swal from "sweetalert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { isEmpty } from "../helpers/methods";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

const url = "https://www.api.huxgym.codes/user/";
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
class VerEditarPerfil extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    empleados: [],
    estados: [],
    tipo: "",
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      name: null,
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

  handleChange = (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    e.persist();
    this.setState({
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
      const res = await axios.get(url + localStorage.getItem("id") + "/", {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      if (res.status === 200 || res.status === 201) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */
          data: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
        await this.seleccionarUsuario(res.data);
        localStorage.setItem("image", res.data.image);
        console.log(res);
      }
    } catch (error) {
      console.log("hay un errorVErEditarPErfin")
      try { 
        const msj = JSON.parse(error.request.response).message;
        if (msj === "Credenciales invalidas") {
              this.Expulsado();
        }
        console.log(msj);
          
        
      }catch(error2){
          console.log(error2)
      }
      //const msj = JSON.parse(error.request.response).message;
      //console.log(error);
      /* if (msj === "Credenciales invalidas") {
        this.Expulsado();
      } else {
        swal({
          text: msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      } */
    }
  };

  perticionState = async () => {
    axios
      .get("https://www.api.huxgym.codes/state/")
      .then((response) => {
        console.log(response);
        this.setState({ estados: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
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
    delete this.state.form.id;
    try {
      const res =
        await axios /* a post de parametros le pasamos la url y los datos */
          .post(url, this.state.form, {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          });
      if (res.status === 200 || res.status === 201) {
        /* cambiamos el estado de modalInsertar y volvemos a pedir los datos*/
        this.modalInsertar();
        this.peticionGet();
      }
    } catch (error) {
      try {
        //const msj = JSON.parse(error.request.response).message;
        console.log(error);
        /* if (msj === "Credenciales invalidas") {
          this.Expulsado();
        } else {
          swal({
            text: msj,
            icon: "error",
            button: "Aceptar",
            timer: "5000",
          });
        } */
      }catch(error2){
             swal({
                  text: "Error en el servidor",
                  icon: "error",
                  button: "Aceptar",
                  timer: "3000",
                }); 
      }
      
    }
  };

  validar = (form) => {
    if (form === null) {
      return { error: true, msj: "Rellene los campos" };
    }
    const name = form.name;
    const gender = form.gender;
    const phone = form.phone;
    const age = form.age;

    if (isEmpty(name))
      return { error: true, msj: "El campo de nombre no puede estar vacío" };
    if (isEmpty(age))
      return { error: true, msj: "El campo de edad no puede estar vacío" };
    const edad = parseInt(age)
    if(edad < 18)
      return { error: true, msj: "La edad debe ser mayor a 18 años" }; 
    if (isEmpty(phone))
      return { error: true, msj: "El campo de telefono no puede estar vacío" };
    if (isEmpty(gender))
      return { error: true, msj: "El campo de genero no puede estar vacío" };
    return { error: false };
  };

  peticionPut = async () => {
    try {
      const form = this.state.form;
      const validar = this.validar(form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "3000",
        });
      } else {
        let formData = new FormData();
        console.log(this.state.form.image);
        if (typeof this.state.form.image !== "string")
          formData.append("image", form.image);
        formData.append("name", form.name);
        formData.append("gender", form.gender);
        formData.append("phone", form.phone);
        formData.append("age", form.age);
        const res = await axios.put(
          url + localStorage.getItem("id") + "/",
          formData,
          {
            headers: {
              Authorization: "Token " + localStorage.getItem("token"),
            },
          }
        );
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          const { name } = res.data;
          localStorage.setItem("name", name);
          await this.componentDidMount()
          swal({
            text: "Información de perfil actualizada correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "3000",
          });
          window.location.href = "/Dashboard";
        }
      }
    } catch (error) {
      //const msj = JSON.parse(error.request.response).message;
      console.log(error);
      /* if (msj === "Credenciales invalidas") {
        this.Expulsado();
      } else {
        swal({
          text: msj,
          icon: "error",
          button: "Aceptar",
          timer: "5000",
        });
      } */
    }
  };

  async componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    await this.peticionGet();
    this.perticionState();
  }

  modalInsertar = () => {
    /* Con este metodo cambiamos el estado de la variable modal insertar */
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  Expulsado = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("email");
    localStorage.removeItem("rol");
    localStorage.removeItem("role");
    swal({
      text: "Sesión expirada",
      icon: "error",
      button: "Aceptar",
      timer: "5000",
    });
    window.location.href = "/";
  };

  seleccionarUsuario =  (empleados) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: this.state.tipo,
      modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
      modalEliminar: false,
      total: 0,
      empleados: [],
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

  handleChangeInput = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");

    if (regex.test(value) || isEmpty(value)) {
      console.log(name, value);
      this.setState({
        form: {
          ...this.state.form,
          [name]: value,
        },
      });
    } else {
      swal({
        text: "No se permiten números",
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
      <>
        <button
          className="btn btn-deplegable"
          onClick={() => {
            /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
            this.setState({ tipoModal: this.props.tipo });
            this.modalInsertar();
          }}
        >
          {this.props.accion}
        </button>
        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            {this.props.accion} Empleado
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
            {this.state.tipoModal === "ver" ? (
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
                  
                  {this.state.errors && <p  className="errores mt-2">{this.state.errors.curp}</p>}
                  <button
                    type="submit"
                    className="btn btn-light mb-3"
                    onClick={this.peticionBuscarCurp}
                  >
                    Buscar Datos
                  </button>
                  <br></br>
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
              {form &&
              <>
              {this.state.tipoModal === "ver" ? (
                this.state.form.name &&
                <>
                 {/*  <label htmlFor="name">Nombre completo:</label> */}
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
              {this.state.tipoModal === "ver" ? (
                this.state.form.paternal_surname &&
                <>
                  {/* <label htmlFor="name">Apellido Paterno*:</label> */}
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
              {this.state.tipoModal === "ver" ? (
                this.state.form.mothers_maiden_name &&
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
                {this.state.tipoModal === "ver" ? (
                  this.state.form.birthdate &&
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
              {this.state.tipoModal === "ver" ? (
                this.state.form.entity_birth &&
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
              {this.state.tipoModal === "ver" ? (
                this.state.form.gender &&
                <>
                <label className=" mt-3 " htmlFor="gender">Género*:</label>
                 
                  <div className="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="gender"
                        value="H"
                        autocomplete="off"
                        disabled
                        //onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "H" ? "checked" : "") : "ff"
                          
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
                        //onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "M" ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      M
                    </label>
                  </div>
                  <br />
                </>
              ) : (
                <>
                  <label className=" mt-3 " htmlFor="gender">Género*:</label>
                  <br />
                  <div className="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="gender"
                        value="H"
                        autocomplete="off"
                        disabled
                        //onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "H" ? "checked" : "") : "ff"
                          
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
                        //onChange={this.handleChange}
                        checked={
                          form ? (form.gender === "M" ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      M
                    </label>
                  </div>
                  <br />
                </>
              )}
              
              {this.state.form.gender &&
               <>
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
                </>
              }
              

              {this.state.tipoModal === "ver" ? (
                this.state.form.gender &&
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
                    onBlur={this.manejadorCorreo}
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
              {this.state.form.gender &&
               <>
                <br />
                <label htmlFor="image">Imagen:</label>
                <input
                  className="form-control"
                  type="file"
                  name="image"
                  ref="file"
                  id="image"
                  placeholder="Seleccione su imagen"
                  accept="image/png, image/jpeg, image/jpg, image/ico"
                  onChange={this.handleChangeInputImage}
                />
              </>
              }

              {this.state.tipoModal === "ver" ? (
                this.state.form.gender &&
                <>
                  <label htmlFor="role">Rol*: </label>
                  <br />
                  <div class="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="2"
                        autocomplete="off"
                        onChange={this.handleChange}
                        
                      />{" "}
                      Encargado
                    </label>
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="3"
                        autocomplete="on"
                        onChange={this.handleChange}
                        
                      />{" "}
                      Instructor
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label htmlFor="role">Rol*: </label>
                  <br />
                  <div class="" >
                    <label class="btn botonesForm m-1">
                      <input
                        type="radio"
                        name="role"
                        value="2"
                        disabled
                        autocomplete="off"
                        onChange={this.handleChange}
                        checked={
                          form ? (form.role === 2 ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      Encargado
                    </label>
                    <label class="btn botonesForm m-1 ">
                      <input
                        type="radio"
                        name="role"
                        value="3"
                        disabled
                        autocomplete="on"
                        onChange={this.handleChange}
                        checked={
                          form ? (form.role === 3 ? "checked" : "") : "ff"
                          
                        }
                      />{" "}
                      Instructor
                    </label>
                  </div>
                </>
              )}
              </>
              }
              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal === "ver" ? (
              <button
                className="btn btn-cerrarV"
                onClick={() => {
                  this.peticionGet();
                  this.modalInsertar();
                }}
              >
                Cerrar
              </button>
            ) : (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => this.peticionPut()}
                >
                  Actualizar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    this.peticionGet();
                    this.modalInsertar();
                  }}
                >
                  Cancelar
                </button>
              </>
            )}
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
export default VerEditarPerfil;
