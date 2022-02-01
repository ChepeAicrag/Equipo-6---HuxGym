import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import swal from "sweetalert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import BtnModalHoja from "../components/BtnModalHoja";
import ModalHojas from "../components/ModalHojas";
import ModalHojaClinica from "../components/ModalHojaClinica";
import "../styles/Crud.css";
import "../styles/clientes.css";
import { isEmpty } from "../helpers/methods";

//Agreagra DataTable
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import "datatables.net-dt/js/dataTables.dataTables"
import "datatables.net-dt/css/jquery.dataTables.min.css"

import { withStyles } from '@material-ui/core/styles';
import { 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
  Typography,
  TablePagination,
  TableFooter
} from '@material-ui/core';



const url = "https://www.api.huxgym.codes/customers/customers/";
const urlMembresias = "https://www.api.huxgym.codes/memberships/memberships";
const urlCurp = "https://www.api.huxgym.codes/data_curp/";
/* const [selectedDate, setSelectedDate] = useState; */
/* const handleDateChange = (date) => {
  setSelectedDate(date);
}; */

function obtenerMes(date) {
  let fecha = new Date(date);
  let mounth = fecha.getUTCMonth() + 1;
  if (mounth < 10) {
    mounth = "0" + mounth;
  }

  return mounth;
}
function entidades(abre) {
  let res = "--"
  if (abre === "1") res = "AS";
  if (abre === "2") res = "BC";
  if (abre === "3") res = "BS";
  if (abre === "4") res = "CC";
  if (abre === "5") res = "CL";
  if (abre === "6") res = "CM";
  if (abre === "7") res = "CS";
  if (abre === "8") res = "CH";
  if (abre === "9") res = "DF";
  if (abre === "10") res = "DG";
  if (abre === "11") res = "GT";
  if (abre === "12") res = "GR";
  if (abre === "13") res = "HG";
  if (abre === "14") res = "JC";
  if (abre === "15") res = "MC";
  if (abre === "16") res = "MN";
  if (abre === "17") res = "MS";
  if (abre === "18") res = "NT";
  if (abre === "19") res = "NL";
  if (abre === "20") res = "OC";
  if (abre === "21") res = "PL";
  if (abre === "22") res = "QQ";
  if (abre === "23") res = "QR";
  if (abre === "24") res = "SP";
  if (abre === "25") res = "SL";
  if (abre === "26") res = "SR";
  if (abre === "27") res = "TC";
  if (abre === "28") res = "TS";
  if (abre === "29") res = "TL";
  if (abre === "30") res = "VZ";
  if (abre === "31") res = "YN";
  if (abre === "32") res = "ZS";

  return res;
}

function obtenerDia(date) {
  let fecha = new Date(date);
  let day = fecha.getDate();
  if (day < 10) {
    day = "0" + day;
  }

  return day;
}

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
const useStyles = (theme) => ({
  table: {
    
    height:'100%',
    width:'100%'
  },
  tableContainer: {
      borderRadius: 15,
      display:'flex',
      flexDireccion:'center',
      paddig: '10px 10px',
      maxWidth: '100%',
      height:'100%',
  },
  tableHeaderCell: {
      fontWeight: 'bold',
      backgroundColor: '#144983',
      color: theme.palette.getContrastText(theme.palette.primary.dark)
  },
  avatar: {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.getContrastText(theme.palette.primary.light),
      marginRight:'50px'
  },
  name: {
      fontWeight: 'bold',
      color: 'black'
      
  },
  paginacion:{
    width: '50%',
    backgroundColor: '#e9f1f3',
    
  },
  status: {
    fontWeight: 'bold',
    fontSize: '5rem',
    color: 'black',
    //backgroundColor: 'grey',
    borderRadius: 0,
    padding: '3px 10px',
    display: 'inline-block'
},
 
});


const columnas = [
  'Folio',
  'Nombre',
  'Fecha de registro',
  'Género',
  'Telefono',
  'Estudiante',
  'Foto',
  'Membresía',
  'Acciones',
  'Hojas',
]
class Tabla extends Component {
  campos = {
    phone: "teléfono",
    gender: "género",
    isStudiant: "si es estudiante",
    name: "nombre",
  };

  state = {
    page:0,
    rowsPerPage:3,
    busqueda: "",
    membresia: "",
    modalHojaclinica: false,
    dataBuscar: [],
    ultimo: {},
    errors: { curp: null },
    //membresiasList:[],
    data: [] /* Aqui se almacena toda la informacion axios */,
    modalInsertar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalEliminar: false,
    clientes: [],
    estados: [],
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario */
      id: "",
      folio: "",
      name: "",
      paternal_surname: "",
      mothers_maiden_name: "",
      //dateJoined: "",
      gender: "",
      birthdate: new Date(),
      phone: "",
      curp: "",
      entity_birth: "",
      isStudiant: true,
      image: "",
      membershipActivate: false,
    },
  };


  //PAginacion
  handleChangePage = (event, newPage) => {
    this.setState({
        page:newPage
    });
};
handleChangeRowsPerPage = async(event) => {
  console.log(event.target)
    await this.setState({
        page:0,
        rowsPerPage:event.target.value
    });
  };
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

  async validarCurp(valor) {
    let p = "XVXX999999SXXCCC??";
    let digitos = " 0123456789";
    let lyn = " ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890";
    let letras = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let sexo = " HM";
    let l = p.length;;
    let v = valor;
    let m = v.length;
    let c = "A";
    let exe = 0;
    let e = 0;
    let q;
    await this.setState(prevState => ({
      errors: {
        ...prevState.errors,
        curp: null,
      }
    }));
    let consonantes = " BCDFGHJKLMNPQRSTUVWXYZ";
    let vocales = " AEIOUX";
    if (v.charAt(0) !== "*") {
      for (let i = 0; i < m; i++) {

        c = "" + v.charAt(i);
        q = p.charAt(i);
        if (q === "?" && lyn.indexOf(c) < 1) {
          await this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              curp: 'La posición ' + (i + 1) + "debe ser una letra o dígito (0-9)",
            }
          }));
          i = l + 1;
          if (exe === 0) e = e + 1;
        }
        if (q === "X" && letras.indexOf(c) < 1) {
          console.log("i " + i)
          await this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              curp: "La posición " + (i + 1) + " debe ser una letra",
            }
          }));
          i = l + 1;
          if (exe === 0) e = e + 1;
        }
        if (q === "V" && vocales.indexOf(c) < 1) {
          /* console.log("i "+i) */
          await this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              curp: "La posición " + (i + 1) + " debe ser una vocal",
            }
          }))

          i = l + 1;
          if (exe === 0) e = e + 1;
        }
        if (q === "C" && consonantes.indexOf(c) < 1) {
          await this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              curp: "La posición " + (i + 1) + " debe ser una consonante",
            }
          }))

          i = l + 1;
          if (exe === 0) e = e + 1;
        }
        if (q === "9" && digitos.indexOf(c) < 1) {
          console.log("i " + i)
          await this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              curp: "La posición " + (i + 1) + " debe ser un número (0-9)",
            }
          }))

          i = l + 1;
          if (exe === 0) e = e + 1;
        }
        if (q === "S" && sexo.indexOf(c) < 1) {
          await this.setState((prevState) => ({
            errors: {
              ...prevState.errors,
              curp: "La posición " + (i + 1) + " debe ser H(ombre) o M(ujer)",
            }
          }))

          i = l + 1;
          if (exe === 0) e = e + 1;
        }


      }
    } else {

    }


    if (v.length == 2) {
      try {
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.paternal_surname)) {
            let contenido = this.state.form.paternal_surname.toString().substring(0, 2).toUpperCase()
            if (v !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "Lo correcto seria " + contenido,
                }
              }))
            }
          }
          //console.log()
        }
      } catch (error) { }
    }

    if (v.length == 3) {
      try {
        let contenido = this.state.form.mothers_maiden_name.toString().substring(0, 1).toUpperCase()
        console.log(contenido)
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.mothers_maiden_name)) {

            if (v.toString().substring(2, 3) !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "En la posicion 3 seria " + contenido,
                }
              }))
            }
          }
          //console.log()
        }
      } catch (error) { }
    }

    if (v.length === 4) {
      try {
        let contenido = this.state.form.name.toString().substring(0, 1).toUpperCase()
        console.log(contenido)
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.name)) {

            if (v.toString().substring(3, 4) !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "En la posicion 4 seria " + contenido,
                }
              }))
            }
          }
          //console.log()
        }
      } catch (error) { }
    }

    if (v.length === 6) {
      try {
        let contenido = this.state.form.birthdate.getFullYear().toString().substring(1, 3).toUpperCase()
        console.log(contenido)
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.birthdate)) {

            if (v.toString().substring(4, 6) !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "En la posicion 5 y 6 seria " + contenido,
                }
              }))
            }
          }
        }
      } catch (error) { }
    }

    if (v.length === 8) {
      try {
        let contenido = obtenerMes(this.state.form.birthdate).toString()
        console.log(contenido)
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.birthdate)) {

            if (v.toString().substring(6, 8) !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "En la posicion 7 y 8 seria " + contenido,
                }
              }))
            }
          }
        }
      } catch (error) { }
    }

    if (v.length === 10) {
      try {
        let contenido = obtenerDia(this.state.form.birthdate).toString()
        console.log(contenido)
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.birthdate)) {

            if (v.toString().substring(8, 10) !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "En la posicion 9 y 10 seria " + contenido,
                }
              }))
            }
          }
        }
      } catch (error) { }
    }

    if (v.length === 11) {
      try {
        let contenido = this.state.form.gender.toString()
        console.log(contenido)
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.gender)) {

            if (v.toString().substring(10, 11) !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "En la posicion 11 seria " + contenido,
                }
              }))
            }
          }
        }
      } catch (error) { }
    }
    //-----------------Estadossss----------------------------------------------------
    if (v.length === 13) {
      try {
        let contenido = entidades(this.state.form.entity_birth.toString())
        console.log(contenido)
        if (this.state.errors.curp == null | this.state.errors.curp === "Deben ser 18 posiciones") {
          if (!isEmpty(this.state.form.entity_birth)) {

            if (v.toString().substring(11, 13) !== contenido) {
              await this.setState(prevState => ({
                errors: {
                  ...prevState.errors,
                  curp: "En la posicion 12 y 13 tu entidad federativa es incorrecta debe ser " + contenido,
                }
              }))
            }
          }
        }
      } catch (error) { }
    }


    if (v.length >= 1 && v.length < 18) {
      try {
        /* console.log(this.state.errors.curp) */
        if (!this.state.errors.curp) {
          await this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              curp: "Deben ser " + l + " posiciones",
            }
          }))
        }
      } catch (error) {

      }




      if (exe === 0) e = e + 1;
    }
    if (e < 1) {

    }
  }

  peticionGet = async () => {
    console.log("entre a petition get");
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(url);
      if (res.status === 200 || res.status === 201) {
        console.log("peticion enter");
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */

          data: res.data,
          ultimo: res.data[res.data.length - 1],
          dataBuscar: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
    } catch (error) {
      console.log("hay un error en la peticion XD");
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

    try {
      const res = await axios.get(urlMembresias);
      if (res.status === 200 || res.status === 201) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */

          membresiasList: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
    } catch (error) { }
  };

  peticionBuscarCurp = async () => {
    
    try {
     /*  await this.setState({
       
        form: {
          name: "ALTAGRACIA",
          birthdate: this.crearFecha("1941-06-01"),
          mothers_maiden_name:"GARCIA",
          paternal_surname: "CRUZ",
          entity_birth: "20",
          gender: "M",
          curp:"GACA410601MOCRRL08"
        },
      });   */
      const res = await axios.get(urlCurp+this.state.form.curp);
      console.log("buscando curp")
      console.log(res)
      await this.setState({
        form: {
          name: res.data.names,
          birthdate: this.crearFecha(res.data.birthdate),
          mothers_maiden_name: res.data.mothers_maiden_name,
          paternal_surname: res.data.paternal_surname,
          entity_birth: res.data.entity_birth,
          gender: res.data.sex,
          curp:this.state.form.curp
        },
      }); 
    } catch (error) {
     
      try {
        const msj = JSON.parse(error.request.response).message;
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
    const isStudiant = form.isStudiant;
    const phone = form.phone;
    const paternal_surname = form.paternal_surname;
    const maiden_name = form.mothers_maiden_name;

    if (
      isEmpty(name) &&
      isEmpty(phone) &&
      isEmpty(gender) &&
      isEmpty(isStudiant)
    )
      return {
        error: true,
        msj: "Los campos de nombre, teléfono, género y si es estudiante son obligatorios",
      };
    if (isEmpty(name))
      return {
        error: true,
        msj: "El campo de nombre no puede estar vacío",
      };
    if (isEmpty(paternal_surname))
      return {
        error: true,
        msj: "El apellido paterno no puede estar vacío",
      };

    if (isEmpty(maiden_name))
      return {
        error: true,
        msj: "El apellido materno no puede estar vacío",
      };
    if (isEmpty(phone))
      return { error: true, msj: "El campo de teléfono no puede estar vacío" };
    if (phone.length < 10)
      return { error: true, msj: "El campo de teléfono debe tener 10 dígitos" };
    if (isEmpty(gender))
      return { error: true, msj: "El campo de género no puede estar vacío" };
    if (isEmpty(isStudiant))
      return { error: true, msj: "Debe seleccionar si es estudiante o no" };

    if (this.state.errors.curp) {
      return {
        error: true,
        msj: "La curp esta incorrecta",
      };
    }

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

  getIdUltimo = (data) => {
    console.log("entree a get ultimo");
    let id = data[data.length - 1];
    console.log(id);
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
        /* console.log(form.image)
        console.log(isEmpty(this.state.form.image)) */
        if (typeof form.image !== "string" && !isEmpty(this.state.form.image))
          formData.append("image", this.state.form.image);
        formData.append("name", this.state.form.name.toUpperCase());
        formData.append("curp", this.state.form.curp.toUpperCase());
        formData.append(
          "paternal_surname",
          this.state.form.paternal_surname.toUpperCase()
        );
        formData.append(
          "mothers_maiden_name",
          this.state.form.mothers_maiden_name.toUpperCase()
        );
        formData.append("gender", this.state.form.gender.toUpperCase());
        formData.append("isStudiant", this.state.form.isStudiant);
        formData.append("birthdate", obtnerDate(this.state.form.birthdate));
        formData.append("phone", this.state.form.phone);
        formData.append("entity_birth", this.state.form.entity_birth);
        const res =
          await axios /* a post de parametros le pasamos la url y los datos */
            .post(url, formData);
        if ((res.status === 200) | (res.status === 201)) {
          this.modalInsertar();
          console.log("Antes d ela promesa");
          var p3 = Promise.resolve("Éxito").then(this.peticionGet());

          p3.then((successMessage) => {
            console.log("hoja clinica modal " + this.state.modalHojaclinica);
            this.modalHoja();
            this.setState({ modalHojaclinica: !this.state.modalHojaclinica });
            this.setState({
              modalHojaclinica: true,
            });
          });

          {
            /* <ModalHojaClinica id_cliente={this.state.ultimo}></ModalHojaClinica>  */
          }
          /*  swal({
            text: "Cliente registrado con éxito",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          }); */
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
      }
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
      let formData = new FormData();
      /* console.log(typeof this.state.form.image);
      console.log(isEmpty(this.state.form.image)) */
      if (
        typeof this.state.form.image !== "string" &&
        !isEmpty(this.state.form.image)
      )
        formData.append("image", this.state.form.image);
      formData.append("name", this.state.form.name.toUpperCase());
      formData.append("folio", this.state.form.folio);
      formData.append("curp", this.state.form.curp.toUpperCase());
      formData.append(
        "paternal_surname",
        this.state.form.paternal_surname.toUpperCase()
      );
      formData.append(
        "mothers_maiden_name",
        this.state.form.mothers_maiden_name.toUpperCase()
      );
      formData.append("gender", this.state.form.gender.toUpperCase());
      formData.append("isStudiant", this.state.form.isStudiant);
      formData.append("birthdate", obtnerDate(this.state.form.birthdate));
      formData.append("phone", this.state.form.phone);
      formData.append("entity_birth", this.state.form.entity_birth);
      console.log(formData.toString);
      const validar = this.validar(this.state.form);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        const res = await axios.put(
          url + this.state.form.id + "/",
          formData /* {
              headers: {
                Authorization: "Token " + localStorage.getItem("token"),
              },
            } */
        );
        if (res.status === 200 || res.status === 201) {
          this.modalInsertar(); /* Cambiamos el estado de modalInsertar y solicitamos de nuevo los datos */
          this.peticionGet();
          console.log(res);
          swal({
            text: "Cliente actualizado con éxito",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
        }
      }
    } catch (error) {
      try {
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
      } catch (erro2) {
        console.log(erro2);
      }
    }
  };

  peticionDelete = async () => {
    /* Para eliminar, le pasamos la url */
    try {
      const res = await axios.delete(url + this.state.form.id);

      if ((res.status === 200) | (res.status === 201)) {
        this.setState({
          modalEliminar: false,
        }); /* Cambiamos el estado de la variable modalEliminar */
        this.peticionGet(); /* Volvemos a pedir los datos */
        swal({
          text: "Cliente eliminado con éxito",
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
    this.perticionState();
    
  }

  Expulsado = () => {
    swal({
      text: "Credenciales Invalidas, Adiosito",
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

  seleccionarUsuario = (clientes) => {
    /* Para obtener los datos del usuario a eliminar */
    var student = String(clientes.isStudiant);
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: clientes.id,
        name: clientes.name,
        paternal_surname: clientes.paternal_surname,
        mothers_maiden_name: clientes.mothers_maiden_name,
        curp: clientes.curp,
        birthdate: this.crearFecha(clientes.birthdate),
        entity_birth: clientes.entity_birth,
        gender: clientes.gender,
        phone: clientes.phone,
        isStudiant: student,
        image: clientes.image,
        folio: clientes.folio,
        membershipActivate: clientes.membershipActivate,
      },
    });
  };

  buscador = async (e) => {
    e.persist();
    await this.setState({ busqueda: e.target.value });
    this.filtrarElementos();
  };

  filtrarElementos = () => {
    this.setState({ data: this.state.dataBuscar });
    if (this.state.busqueda != "") {
      var search = this.state.data.filter((item) => {
        if (item.name.toLowerCase().includes(this.state.busqueda.toLowerCase())
          | item.folio.toLowerCase().includes(this.state.busqueda.toLowerCase())
          | item.phone.toLowerCase().includes(this.state.busqueda.toLowerCase())
          | item.dateJoined.toLowerCase().includes(this.state.busqueda.toLowerCase())) {

          return item;
        }
      });

      this.setState({ data: search });
    } else {
      this.setState({ data: this.state.dataBuscar });
    }
  };

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  modalHoja = () => {
    this.setState({ modalHojaclinica: !this.state.modalHojaclinica });
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

  handleChangeCurp = (e) => {
    const { name, value } = e.target;
    let value2 = value.toUpperCase();
    this.validarCurp(value2);
    this.setState({
      form: {
        ...this.state.form,
        [name]: value2,
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

  handleChangeMembresia = (event) => {
    this.setState({
      membresia: event.target.value,
    });
  };
  
  render() {
    const { form } = this.state;
    const { classes } = this.props;
    return (
      <>
        <div className="my-custom-scrollbar2">
          <br />
          <div className="opciones mt-2 mb-4">
            <button
              className="btn botones"
              onClick={() => {
                /* Cuando se presione el boton insertar se limpia el objeto form y se cambia el estado de la variable modalInsertar */
                this.setState({ form: null, tipoModal: "insertar" });
                this.modalInsertar();
              }}
            >
              <AddCircleOutlineIcon fontSize="large"></AddCircleOutlineIcon> Nuevo
              Cliente
            </button>

            <div className="buscarBox">
              <input
                type="text"
                className="textField"
                name="busqueda"
                id="busqueda"
                placeholder="Buscar"
                onChange={this.buscador}
                value={this.state.busqueda}
                title="Buscar Cliente"
              />
              <button
                type="submit"
                className=" btn botonesBusqueda add-on"
                onClick={() => { }}
              >
                <i className="bx bxs-user">
                  <box-icon name="search-alt-2" color="#fff"></box-icon>
                </i>
              </button>
            </div>
          </div>
         
          <br />
          <div className="tablaNueva">
          {
            this.state.data.length<=0 ? <p className="mt-4 sinClientes">Ningun cliente encontrado</p>
            :
          
          <TableContainer component={Paper} className={classes.tableContainer}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  
                  <TableCell className={classes.tableHeaderCell}>Nombre completo</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Folio</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Fecha de registro</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Género</TableCell>
                  {/* <TableCell className={classes.tableHeaderCell}>Teléfono</TableCell> */}
                  <TableCell className={classes.tableHeaderCell}>Estudiante</TableCell>
                  {/* <TableCell className={classes.tableHeaderCell}>Foto</TableCell> */}
                  <TableCell className={classes.tableHeaderCell}>Estado de la membresía</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Acciones</TableCell>
                  <TableCell className={classes.tableHeaderCell}>Hojas clínicas</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>
                        <Grid container>
                            <Grid item lg={3}>
                                <Avatar alt={row.name} src={`https://www.api.huxgym.codes/${row.image}`} className={classes.avatar}/>
                            </Grid>
                            <Grid item lg={10}>
                                <Typography className={classes.name}>{row.name}</Typography>
                                <Typography color="textSecondary" variant="body2">{row.phone}</Typography>
                            </Grid>
                        </Grid>
                      </TableCell>
                    <TableCell>
                        {row.folio}
                    </TableCell>
                   
                    <TableCell>{row.dateJoined}</TableCell>
                    <TableCell>{row.gender}</TableCell>
                    <TableCell>
                    {row.isStudiant ? "Si" : "No"}
                      </TableCell>
                   {/*  <TableCell>{row.isStudiant}</TableCell> */}
                    <TableCell>{row.membershipActivate
                          ? "Activada"
                          : "No Activada"}</TableCell> 
                    <TableCell><button
                          className="btn btn-editar"
                          onClick={() => {
                            this.seleccionarUsuario(row);
                            this.modalInsertar();
                          }}
                          title="Editar Cliente"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        {"  "}
                        {localStorage.getItem("rol") == "Administrador" ? (
                          <button
                            className="btn btn-danger"
                            onClick={() => {
                              this.seleccionarUsuario(row);
                              this.setState({ modalEliminar: true });
                            }}
                            title="Dar de baja"
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        ) : (
                          <></>
                        )}</TableCell> 

                    <TableCell>
                    <BtnModalHoja
                          id_cliente={row.id}
                          nacimiento_cliente={row.birthdate}
                        />{" "}
                        <br />
                        <ModalHojas
                          id_cliente={row.id}
                          name_cliente={row.name}
                          nacimiento_cliente={row.birthdate}
                        />{" "}
                      </TableCell> 
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter className={classes.paginacion}>
              <TablePagination
                  className={classes.paginacion}
                  rowsPerPageOptions={[3, 10, 15]}
                  //component="div"
                  count={this.state.data.length}
                  rowsPerPage={this.state.rowsPerPage}
                  page={this.state.page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={
                              this.handleChangeRowsPerPage
                            }
              />
              </TableFooter>
            </Table>
          </TableContainer>
             
          }
          </div> 
          
          {this.state.modalHojaclinica && (
            <ModalHojaClinica
              id_cliente={this.state.ultimo.id}
              nacimiento_cliente={this.state.ultimo.birthdate}
              activo={this.state.modalHojaclinica}
            ></ModalHojaClinica>
          )}

          <Modal isOpen={this.state.modalInsertar}>
            {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
            <ModalHeader style={{ display: "block" }}>
              Cliente
              <span style={{ float: "right" }}></span>
            </ModalHeader>

            <ModalBody>
              <div className="form-group">
              <label htmlFor="name">CURP*:</label>
                {this.state.tipoModal === "insertar" ? (
                  <>
                    <input
                      className="form-control"
                      type="text"
                      name="curp"
                      id="curp"
                      placeholder="CURP"
                      onChange={this.handleChangeCurp}
                      value={form ? form.curp : ""}
                    />
                    {this.state.errors && <p className="errores mt-2">{this.state.errors.curp}</p>}
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
                    
                  </>
                )}
                {form &&
                <>
                
                
                </>
                }
                <label htmlFor="name">Nombre completo*:</label>
                {this.state.tipoModal === "insertar" ? (
                  <>

                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      id="name"
                      placeholder="Nombre del cliente"
                      onChange={this.handleChangeInput}
                      value={form ? form.name : ""}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      id="name"
                      disabled
                      placeholder="Nombre del cliente"
                      onChange={this.handleChangeInput}
                      value={form ? form.name : ""}
                    />
                  </>
                )}

                <br />
                <label htmlFor="name">Apellido Paterno*:</label>
                {this.state.tipoModal === "insertar" ? (
                  <>
                    <input
                      className="form-control"
                      type="text"
                      name="paternal_surname"
                      id="paternal_surname"
                      placeholder="Apellido Paterno"
                      onChange={this.handleChangeInput}
                      value={form ? form.paternal_surname : ""}
                    />
                  </>
                ) : (
                  <>
                    <input
                      className="form-control"
                      type="text"
                      name="paternal_surname"
                      id="paternal_surname"
                      disabled
                      placeholder="Apellido Paterno"
                      onChange={this.handleChangeInput}
                      value={form ? form.paternal_surname : ""}
                    />
                  </>
                )}

                <br />
                <br />
                <label htmlFor="name">Apellido Materno*:</label>
                {this.state.tipoModal === "insertar" ? (
                  <>
                    <input
                      className="form-control"
                      type="text"
                      name="mothers_maiden_name"
                      id="mothers_maiden_name"
                      placeholder="Apellido Materno"
                      onChange={this.handleChangeInput}
                      value={form ? form.mothers_maiden_name : ""}
                    />
                  </>
                ) : (
                  <>
                    {" "}
                    <input
                      className="form-control"
                      type="text"
                      name="mothers_maiden_name"
                      id="mothers_maiden_name"
                      placeholder="Apellido Materno"
                      disabled
                      onChange={this.handleChangeInput}
                      value={form ? form.mothers_maiden_name : ""}
                    />
                  </>
                )}



                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <label className="articulo mt-3">Fecha de Nacimiento</label>
                  <br />
                  {this.state.tipoModal === "insertar" ? (
                    <>
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
                <label htmlFor="name">Estado*:</label>
                <br />
                {this.state.tipoModal === "insertar" ? (
                  <>
                    <select
                      name="entity_birth"
                      id="entity_birth"
                      className="form-select"
                      onChange={this.changeEstado}
                      value={form ? form.entity_birth : "1"}
                      aria-label="Default select example"
                    >
                      {this.state.estados.map((elemento) => (
                        <option key={elemento.num} value={elemento.num}>
                          {elemento.name}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <>
                    <select
                      name="entity_birth"
                      id="entity_birth"
                      className="form-select"
                      disabled
                      onChange={this.changeEstado}
                      value={form ? form.entity_birth : "1"}
                      aria-label="Default select example"
                    >
                      {this.state.estados.map((elemento) => (
                        <option key={elemento.num} value={elemento.num}>
                          {elemento.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
                <label htmlFor="gender">Género*: </label>
                <br />

                <div class="" >
                  {this.state.tipoModal === "insertar" ? (
                    <>
                      <label class="btn botonesForm m-1">
                        <input
                          type="radio"
                          name="gender"
                          value="H"
                          autocomplete="off"
                          onChange={this.handleChange}
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
                          autocomplete="on"
                          onChange={this.handleChange}
                          checked={
                            form ? (form.gender === "M" ? "checked" : "") : "ff"
                            
                          }
                        />{" "}
                        M
                      </label>
                    </>
                  ) : (
                    <>
                      <label class="btn botonesForm m-1">
                        <input
                          type="radio"
                          name="gender"
                          value="H"
                          autocomplete="off"

                          //onChange={this.handleChange}
                          checked={
                            form ? (form.gender === "H" ? "checked" : "") : "ff"
                            
                          }

                        />{" "}
                        H
                      </label>
                      <label class="btn botonesForm m-1 ">
                        <input
                          type="checkbox"
                          name="gender"
                          value="M"
                          autocomplete="on"

                          //onChange={this.handleChange}
                          checked={
                            form ? (form.gender === "M" ? "checked" : "") : "ff"
                            
                          }

                        />{" "}
                        M
                      </label>
                    </>
                  )}
                </div>
                <br />
                
                <label htmlFor="phone">Teléfono*:</label>
                <input
                  className="form-control"
                  type="text"
                  name="phone"
                  id="phone"
                  size="10"
                  placeholder="Teléfono"
                  maxLength="10"
                  placeholder="Teléfono"
                  onChange={this.handleChangeInputNumber}
                  value={form ? form.phone : ""}
                />
                <br />

                <br />
                <label htmlFor="image">Foto:</label>
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
                <label htmlFor="isStudiant">Estudiante*:</label>
                <br />
                <div class="" >
                  <label class="btn botonesForm m-1">
                    <input
                      type="radio"
                      name="isStudiant"
                      value={true}
                      autocomplete="on"
                      onChange={this.handleChange}
                      checked={
                        form ? (form.isStudiant === "true" ? "checked" : "") : ""

                      }

                    />{" "}
                    Sí
                  </label>
                  <label class="btn botonesForm m-1">
                    <input
                      type="radio"
                      name="isStudiant"
                      value={false}
                      autocomplete="off"
                      onChange={this.handleChange}
                      checked={
                        form ? (form.isStudiant === "false" ? "checked" : "") : ""

                      }
                    />{" "}
                    No
                  </label>
                </div>
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
                <label htmlFor="name">Nombre completo</label>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  id="name"
                  readOnly
                  onChange={this.handleChangeInput}
                  value={form ? form.name : ""}
                />
                <br />
                <label htmlFor="telefono">Teléfono</label>
                <input
                  className="form-control"
                  type="text"
                  name="phone"
                  id="phone"
                  readOnly
                  onChange={this.handleChangeInputNumber}
                  value={form ? form.phone : ""}
                />
                <br />
                <label htmlFor="genero">Género</label>
                <input
                  className="form-control"
                  type="text"
                  name="gender"
                  id="gender"
                  readOnly
                  onChange={this.handleChange}
                  value={form ? form.gender : ""}
                />
                <br />
                ¿Seguro de eliminar este cliente?
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
        
      </>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Tabla);
