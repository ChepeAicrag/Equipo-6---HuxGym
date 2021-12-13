import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressBook,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import TimeField from "react-simple-timefield";
import TextField from '@material-ui/core/TextField';
import swal from "sweetalert";
import { isEmpty } from "../helpers/methods";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
const base_url = "https://www.huxgym.codes/";
const url = "https://www.huxgym.codes/customers/historiasClinicasCliente/";
const urlm = "https://www.huxgym.codes/customers/infoExtraHistoriaClinica/";
const url_delete = "https://www.huxgym.codes/customers/historyClinic/";
const url_ac = "https://www.huxgym.codes/customers/bodyAttribute_HistoryClinic/";
const url_te_hc = "https://www.huxgym.codes/customers/typeExtraInformation_HistoryClinic/"
const url_edsn = `${base_url}customers/nutritionalSituation/`;
const url_hc = "https://www.huxgym.codes/customers/historyClinic/";

const materialTheme = createMuiTheme({
    
  palette: {
      background: {
          paper: '#EDEDED',
          default: '#114e60',
      },
      text: {
        default: '#fff',
      },
      textColor: '#fff',
      primary: {
        main: '#1b1a17',
      }
  },

});



function conversionHoras(date) {
  let datos= date.split(":");
  let hr= datos[0];
  let min=datos[1];
  let sec=datos[2];
  
  let fecha=new Date();

  fecha.setHours(parseInt(hr, 10));
  fecha.setMinutes(parseInt(min, 10));
  fecha.setSeconds(parseInt(sec, 10));
   return fecha;
}

function conversionHoras2(date) {
  let fecha=new Date(date);
  
  let hr= fecha.getHours();
  let min=fecha.getMinutes();
  let sec=fecha.getSeconds();
  return hr+":"+min+":"+sec;
}


class BtnModalHoja extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    busqueda: "",
    data: [] /* Aqui se almacena toda la informacion axios */,
    body: [],
    sintomas: [],
    list: [],
    customer_id: 0,
    sintomasSelect: {},
    modalAgregar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalInsertar: false,
    modalAgregar2: false,
    modalAgregar3: false,
    modalEditarInformacionExtra: false,
    modalEliminar: false,
    tipoModal: "Agregar",
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario modal 1*/
      customer_id: this.props.id_cliente,
      id: "",
      customer_name: "",
      date: "",
      age: 0,
      height: "",
      weight: "",
      bloody: "",
      hour_breakfast: "00:00:00",
      hour_collation: "00:00:00",
      hour_lunch: "00:00:00",
      hour_snack: "00:00:00",
      hour_dinner: "00:00:00",
      situacionNutricional_id: 0,
    },
    atributosCuerpo: [],
    formcorps: {
      uno: "",
      dos: "0",
      tres: "0",
      cuatro: "0",
      cinco: "0",
      seis: "0",
      siete: "0",
      ocho: "0",
      nueve: "",
      diez: "0",
      once: "0",
      doce: "0",
      trece: "0",
      catorce: "0",
      quince: "0",
      dieciseis: "0",
      diecisiete: "0",
    },
    formextra: {
      id: "1",
      namee: "Sintomas",
      descriptione: "",
      statuse: "",
    },
    typeExtraInformation_id: 0,
  };

  peticionGet = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(url + this.state.customer_id);
      if (res.status === 200) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */
          data: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
      console.log(res.data);
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      this.setState({
        error: true,
        errorMsg: msj,
      });
    }
  };

  peticionGete = async () => {
    try {
      console.log(this.state.form.id);
      const res = await axios.get(urlm + this.state.form.id); //this.state.form.id);
      if (res.status === 200) {
        console.log(res.data);
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */
          body: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
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

  validar = (form) => {
    if (isEmpty(form))
      return { error: true, msj: "Debe rellenar los campos obligatorios" };
    const age = form.age;
    const height = form.height;
    const weight = form.weight;
    const hour_breakfast = form.hour_breakfast;
    const hour_collation = form.hour_collation;
    const hour_lunch = form.hour_lunch;
    const hour_snack = form.hour_snack;
    const hour_dinner = form.hour_dinner;

    if (isEmpty(age) && isEmpty(height) && isEmpty(weight) && isEmpty(hour_breakfast) && isEmpty(hour_collation) && isEmpty(hour_lunch) && isEmpty(hour_snack)&& isEmpty(hour_dinner))
      return {
        error: true,
        msj: "Los campos de Edad actual, Estatura en centímetro,Peso en kilogramos, Hora de desayuno, Hora de colación, Hora de comida, Hora de bocadillo y Hora de cena son obligatorios",
      };
    if (isEmpty(age))
      return {
        error: true,
        msj: "El campo de edad actual no puede estar vacío",
      };
    const edad = parseInt(age);
    if (edad <= 12)
      return { error: true, msj: "El campo de la edad debe ser mayor o igual 13" };  
    if (isEmpty(height))
      return { error: true, msj: "El campo de estatura no puede estar vacío" };
    if (height<100)
      return { error: true, msj: "La estatura no puede se menor a 100cm" };
    const altura = parseInt(height);
    if (altura <= 0)
      return { error: true, msj: "El campo de estatura debe tener un valor positivo" };
    if (isEmpty(weight))
      return { error: true, msj: "El campo de Peso en kilogramos no puede estar vacío" };
    const peso = parseInt(weight);
    if (peso <= 0)
      return { error: true, msj: "El campo de peso debe tener un valor positivo" };
    if (isEmpty(hour_breakfast))
      return { error: true, msj: "El campo de hora de desayuno no puede estar vacío" };
    if (isEmpty(hour_collation))
      return { error: true, msj: "El campo de hora de colación no puede estar vacío" };
      if (isEmpty(hour_lunch))
      return { error: true, msj: "El campo de hora de comida no puede estar vacío" };
      if (isEmpty(hour_snack))
      return { error: true, msj: "El campo de hora de bocadillo no puede estar vacío" };
      if (isEmpty(hour_dinner))
      return { error: true, msj: "El campo de hora de cena no puede estar vacío" };   
    return { error: false };
  };

  validar2 = (form2) => {
    if (isEmpty(form2))
      return { error: true, msj: "Debe rellenar los campos obligatorios" };
    const uno = form2.uno;
    const dos = form2.dos;
    const tres = form2.tres;
    const cuatro = form2.cuatro;
    const cinco = form2.cinco;
    const seis = form2.seis;
    const siete = form2.siete;
    const ocho = form2.ocho;
    const nueve = form2.nueve;
    const diez = form2.diez;
    const once = form2.once;
    const doce = form2.doce;
    const trece = form2.trece;
    const catorce = form2.catorce;
    const quince = form2.quince;
    const dieciseis = form2.dieciseis;
    const diecisiete = form2.diecisiete;

    if (isEmpty(uno) && isEmpty(dos) && isEmpty(tres) && isEmpty(cuatro) && isEmpty(cinco) && isEmpty(seis) && isEmpty(siete) && isEmpty(ocho) && isEmpty(nueve) && isEmpty(diez)&& isEmpty(once) && isEmpty(doce) && isEmpty(trece) && isEmpty(catorce) && isEmpty(quince) && isEmpty(dieciseis)&& isEmpty(diecisiete))
      return {
        error: true,
        msj: "Los campos del Estructura Corporal no pueden estar vacios",
      };
    if (isEmpty(uno))
      return {
        error: true,
        msj: "El campo de Estructura corporal no puede estar vacío",
      };
    if (isEmpty(dos))
      return { error: true, msj: "El campo de Tensión arterial en centímetro no puede estar vacío" };
    if (isEmpty(tres))
      return { error: true, msj: "El campo de Indice de masa corporal actual no puede estar vacío" };
    if (isEmpty(cuatro))
      return { error: true, msj: "El campo de % de Grasa no puede estar vacío" };
    if (isEmpty(cinco))
      return { error: true, msj: "El campo de % MM no puede estar vacío" };
      if (isEmpty(seis))
      return { error: true, msj: "El campo de KC correspondientes no puede estar vacío" };
      if (isEmpty(siete))
      return { error: true, msj: "El campo de Edad de acuerdo al peso no puede estar vacío" };
      if (isEmpty(ocho))
      return { error: true, msj: "El campo de Grasa viceral no puede estar vacío" };   
      if (isEmpty(nueve))
      return { error: true, msj: "El campo de Situación Nutricional en centímetro no puede estar vacío" };
    if (isEmpty(diez))
      return { error: true, msj: "El campo de Gasto calórico por horas de oficina no puede estar vacío" };
    if (isEmpty(once))
      return { error: true, msj: "El campo de Gasto calórico por horas de movimiento no puede estar vacío" };
    if (isEmpty(doce))
      return { error: true, msj: "El campo de Gasto calórico por horas de entrenamiento no puede estar vacío" };
      if (isEmpty(trece))
      return { error: true, msj: "El campo de Gasto calórico por horas de dormir no puede estar vacío" };
      if (isEmpty(catorce))
      return { error: true, msj: "El campo de Total de gasto calórico no puede estar vacío" };
      if (isEmpty(quince))
      return { error: true, msj: "El campo de Total de calorías correspondientes de acuerdo a su peso corporal no puede estar vacío" };  
      if (isEmpty(dieciseis))
      return { error: true, msj: "El campo de Metabolismo basal (I CB) no puede estar vacío" };
      if (isEmpty(diecisiete))
      return { error: true, msj: "El campo de Consumo calórico (C C) no puede estar vacío" };
  
    return { error: false };
  };

  peticionAtributosCuerpo = async () => {
    try {
      console.log(this.state.form.id);
      const historyClinic_id = this.state.form.id;
      const id_attribute = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
      ];
      const id_attribute_name = [
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
        "diez",
        "once",
        "doce",
        "trece",
        "catorce",
        "quince",
        "dieciseis",
        "diecisiete",
      ];
      /**{
       * "id": 1,
       *"value": false,
        "bodyAttribute_id": 3,
        "historyClinic_id": 5
        }
      */
      const res = await axios.get(url_ac); //this.state.form.id);
      if (res.status === 200) {
        console.log(res.data);
        const datos = res.data;
        const result = datos.filter(
          (ele) =>
            ele.historyClinic_id.id === historyClinic_id &&
            id_attribute.includes(ele.bodyAttribute_id.id)
        );
        this.state.atributosCuerpo = result;
        console.log("result :>> ", this.state.atributosCuerpo);
        result.forEach(
          (ele, index) =>
            (this.state.formcorps[id_attribute_name[index]] = ele.value)
        );
        await axios
          .get("https://www.huxgym.codes/customers/typeExtraInformation/")
          .then((response) => {
            console.log(response);
            this.setState({ sintomas: response.data });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      alert(msj);
    }
  };

  handleChange = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    console.log(this.state.form);
    console.log(this.state.formextra);
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
      e.target.value = ""
      swal({
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
    console.log(this.state.form)
  };

  handleChangeInput = (e) => {
    const { name, value } = e.target;
    // let regex = new RegExp("^[a-zA-Z ]+$");
    let regex = new RegExp("[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$");

    if (regex.test(value) || isEmpty(value)) {
      this.setState({
        formcorps: {
          ...this.state.formcorps,
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

  handleChangeInputNumber2 = (e) => {
    const { name, value } = e.target;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value) || isEmpty(value)) {
      this.setState({
        formcorps: {
          ...this.state.formcorps,
          [name]: value,
        },
      });
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

  peticionPut = async () => {
    try {
      const form1 = this.state.form;
      const form2 = this.state.formcorps;
      const validar = this.validar(form1);
      const validar2 = this.validar2(this.state.formcorps);
      if (validar.error) {
        swal({
          text: validar.msj,
          icon: "info",
          button: "Aceptar",
          timer: "5000",
        });
      } else {
        if (validar2.error) {
          swal({
            text: validar2.msj,
            icon: "info",
            button: "Aceptar",
            timer: "5000",
          });
        } else { 
      console.log(this.state.form.id);
      const historyClinic_id = this.state.form.id;
      const nutritionalSituation_id = this.state.form.situacionNutricional_id;
      const id_attribute_name = [
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
        "diez",
        "once",
        "doce",
        "trece",
        "catorce",
        "quince",
        "dieciseis",
        "diecisiete",
      ];
      console.log(nutritionalSituation_id);
      console.log(historyClinic_id);

      const form1 = this.state.form;

      // Editar la hoja clínica
      const res_hc = await axios.put(url_hc + historyClinic_id + "/", {
        age: form1.age,
        weigth: form1.weight,
        heigh: form1.height,
        customer_id: form1.customer_id,
        nutritionalSituation_id,
      });

      if (res_hc.status === 200 || res_hc.status === 201) {
        // Editar primera ventana modal
        const res_form1 = await axios.put(
          url_edsn + nutritionalSituation_id + "/",
          {
            hour_breakfast: form1.hour_breakfast,
            hour_collation: form1.hour_collation,
            hour_lunch: form1.hour_lunch,
            hour_snack: form1.hour_snack,
            hour_dinner: form1.hour_dinner,
            schedule: "Planeación",
          }
        );

        if (res_form1.status === 200 || res_form1.status === 201) {
          // Obtener datos a editar de la segunda modal
          this.state.atributosCuerpo.forEach(
            (ele, index) =>
              (ele.value = this.state.formcorps[id_attribute_name[index]])
          );
          // Editar los datos de la segunda modal
          this.state.atributosCuerpo.forEach(async (e) => {
            await axios.put(url_ac + e.id + "/", {
              value: e.value,
              bodyAttribute_id: e.bodyAttribute_id.id,
              historyClinic_id,
            });
          });

          // Tercera ventana modal 
          this.state.body.forEach(async (e) => {
            await axios.put(url_te_hc + "/" + historyClinic_id + "/", {
              value: e.value == "true" ? true : false,
              name: e.name,
              typeExtraInformation_id: e.typeExtraInformation_id.id, 
              historyClinic_id,
          })});
          
          this.componentDidMount()
          swal({
            text: "Hoja clínica actualizada",
            icon: "success",
            button: "Aceptar",
            timer: "3000",
          });
        }
      }}}
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: Array.isArray(msj) ? msj[0] : msj,
        icon: "error",
        button: "Aceptar 2",
        timer: "5000",
      });
    }
  };

  peticionDelete = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.delete(url_delete + this.state.form.id + "/"); //this.state.form.id);
      if (res.status === 200 || res.status === 201) {
        this.modalEliminar();
        swal({
          text: "Hoja clínica borrada correctamete",
          icon: "success",
          button: "Aceptar",
          timer: "5000",
        });
         /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
        this.peticionGet();
      }
    } catch (error) {
      this.modalEliminar();
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

  seleccionarUsuario = (hojas) => {
    /* Para obtener los datos del usuario a eliminar */
    this.setState({
      tipoModal: "actualizar",
      busqueda: "",
      form: {
        id: hojas.id,
        customer_id: hojas.customer_id.id,
        customer_name: hojas.customer_id.name,
        date: hojas.date,
        age: hojas.age,
        height: hojas.heigh,
        weight: hojas.weigth,
        bloody: hojas.bloodType,
        hour_breakfast: hojas.nutritionalSituation_id.hour_breakfast,
        hour_collation: hojas.nutritionalSituation_id.hour_collation,
        hour_lunch: hojas.nutritionalSituation_id.hour_lunch,
        hour_snack: hojas.nutritionalSituation_id.hour_snack,
        hour_dinner: hojas.nutritionalSituation_id.hour_dinner,
        situacionNutricional_id: hojas.nutritionalSituation_id.id,
      },
      // formextra: {
      //   // id: hojas.typeExtraInformation_id.id,
      //   // namee: hojas.typeExtraInformation_id.name,
      //   // statuse: hojas.value,
      // },
    });
  };

  seleccionarBody = (body) => {
    this.setState({
      tipoModal: "actualizar",
      formextra: {
              id: body.typeExtraInformation_id.id,
              namee: body.name,
              statuse: body.value ? "true" : "false",
              descriptione: body.name,
       }, 
    });
  }

  componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  };

  modalEditarInformacion = () => {
    this.setState({
      modalEditarInformacionExtra: !this.state.modalEditarInformacionExtra,
    });
  };

  modalEliminar = () => {
    this.setState({ modalEliminar: !this.state.modalEliminar });
  };

  modalAgregar = () => {
    this.setState({ modalAgregar2: false, modalAgregar3: false });
    this.setState({ modalAgregar: !this.state.modalAgregar });
    this.setState({ list: [] });
  };

  modalAgregar2 = () => {
    this.setState({ modalAgregar: false, modalAgregar3: false });
    this.setState({ modalAgregar2: !this.state.modalAgregar2 });
  };

  modalAgregar3 = () => {
    this.setState({ modalAgregar: false, modalAgregar2: false });
    this.setState({ modalAgregar3: !this.state.modalAgregar3 });
  };


  handleChange2 = async (e) => {
    /* handleChange se ejecuta cada vez que una tecla es presionada */
    console.log(this.state.formcorps);
    e.persist();
    await this.setState({
      formcorps: {
        ...this.state
          .formcorps /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });

    console.log(this.state.form);
    console.log(this.state.atributosCuerpo);
  };

  handleChangeCombo = (e) => {
    const sint = this.state.sintomas[e.target.value];
    console.log(sint.name);
    this.setState({
      formextra: {
        ...this.state
          .formextra /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        ["id"]: sint.id,
        ["namee"]: sint.name,
      },
    });
  };

  handleChangeSwitch = (e) => {
    console.log(this.state.list);
    e.persist();
    this.setState({
      formextra: {
        ...this.state
          .formextra /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });
  };

  handleChangelabel = (e) => {
    console.log(this.state.formextra);
    e.persist();
    this.setState({
      formextra: {
        ...this.state
          .formextra /* Con esto evitamos que los datos almacenados en el forma se borren */,
        /* con e.target.name seleccionamos el campo y con e.targe.value le asignamos la letra que se pulso */
        [e.target.name]: e.target.value,
      },
    });
  };

  handleHourhour_breakfast = (e) => {
    let value=conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_breakfast: value,
      },
    }); 
  };
  handleHourhour_collation = (e) => {
    let value=conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_collation: value,
      },
    }); 
  };
  handleHourhour_lunch = (e) => {
    let value=conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_lunch: value,
      },
    }); 
  };
  
  handleHourhour_snack = (e) => {
    let value=conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_snack: value,
      },
    }); 
  };
  
  handleHourhour_dinner = (e) => {
    let value=conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_dinner: value,
      },
    }); 
  };
  
validateNumber = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value)||isEmpty(value)) {
      const setValue = value <= 100 && value>=0 ? value : 13;
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

validateEstatura = (event) => {
  const name = event.target.name;
    const value = event.target.value;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value)|| isEmpty(value)) {
      const setValue = value < 4000 && value>=0 ? value : 100;
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

validatePeso = (event) => {
  const name = event.target.name;
    const value = event.target.value;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value)) {
      const setValue = value < 1000 && value>=0 ? value : 20;
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


  //comienza parte de insertar sintomas
  handleInputChange = (event) => {
    this.setState({
      list: [...this.state.list, this.state.formextra],
    });
  };

  render() {
    const { form } = this.state;
    const { formcorps } = this.state;

    return (
      <div>
        <button
          className="btn btn-outline-dark btnHojaClinica"
          onClick={() => {
            this.state.customer_id = this.props.id_cliente;
            this.modalInsertar();
            console.log(this.state.customer_id);
            this.peticionGet();
          }}
        >
          Ver historial de hojas
        </button>
        <Modal isOpen={this.state.modalInsertar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader className="HeadCheck" style={{ display: "block" }}>
            Historial de hojas clinicas
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody className="SCliente">
            <div className="form-group">
              <div className="ModalCheck">
                <table className="table table-striped table-bordered ">
                  <thead>
                    <tr>
                      <th>Id</th>
                      <th>Nombre del cliente</th>
                      <th>Fecha de registro</th>
                      <th>Tipo de sangre:</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.data.map((hojas) => {
                      return (
                        <tr>
                          <td>{hojas.id}</td>
                          <td>{hojas.customer_id.name}</td>
                          <td>{hojas.date}</td>
                          <td>{hojas.bloodType}</td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                this.state.form.id = hojas.id;
                                console.log(hojas.id);
                                this.seleccionarUsuario(hojas);
                                this.peticionGete();
                                this.peticionAtributosCuerpo();
                                this.modalAgregar();
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <br />
                            {"  "}
                            {localStorage.getItem("rol") == "Administrador" ? (
                              <button
                                className="btn btn-danger"
                                onClick={() => {
                                  this.seleccionarUsuario(hojas);
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
              <Modal isOpen={this.state.modalAgregar}>
                {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
                <ModalHeader>
                  Situacion Nutricional
                  <span style={{ float: "center" }}></span>
                </ModalHeader>

                <ModalBody>
                  <div className="form-group">
                    {/* <label htmlFor="customer_name">Nombre del Cliente:</label>
                    <input
                      className="form-control"
                      type="integer"
                      name="customer_name"
                      id="customer_name"
                      readOnly
                      onChange={this.handleChange}
                      value={form ? form.customer_name : ""}
                    /> */}

                    
                    <label htmlFor="age">Edad actual *: </label>
                      <br />
                      <TextField
                        id="outlined-number"
                        
                        name="age"
                        onChange={this.validateNumber}
                        style={{width: '200px'}}
                        InputProps={{ inputProps: { min: 13, max: 99 } }}
                        value={form ? form.age : 13}
                        type="number"
                       
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    />
                    <br />
                    <br />
                    <label htmlFor="height">Estatura en centímetros *:  </label>
                    <br />
                    <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0, max: 4000} }}
                        style ={{width: '200px'}}
                        name="height"
                        onChange={this.validateEstatura}
                        value={form? form.height: null}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
                   {/*  <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0, max: 4000} }}
                        style ={{width: '200px'}}
                        name="height"
                        onChange={this.validateEstatura}
                        value={form.heigh}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    /> */}
                      <br />
                      <br />
                      <label htmlFor="weight">Peso en kilogramos *: </label>
                    <br />
                    <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0, max: 1000} }}
                        style ={{width: '200px'}}
                        name="weight"
                        onChange={this.validatePeso}
                        value={form.weight}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    />
                    <br />
                   
                    {/* <label htmlFor="age">Edad actual *: </label>
                    <input
                      className="form-control"
                      type="float"
                      name="age"
                      id="age"
                      placeholder="Edad actual"
                      maxlength="2"
                      onChange={this.handleChangeInputNumber}
                      value={form ? form.age : ""}
                    /> */}
                    <br />
                   {/*  <label htmlFor="heigh">Estatura en centímetros *: </label>
                    <input
                      className="form-control"
                      type="float"
                      name="heigh"
                      id="heigh"
                      placeholder="Estatura en centímetros"
                      maxlength="3"
                      onChange={this.handleChangeInputNumber}
                      value={form ? form.heigh : ""}
                    /> */}
                    
                    {/* <label htmlFor="weight">Peso en kilogramos *: </label>
                    <input
                      className="form-control"
                      type="integer"
                      name="weight"
                      id="weight"
                      placeholder="Peso en kilogramos"
                      maxlength="3"
                      onChange={this.handleChangeInputNumber}
                      value={form ? form.weight : ""}
                    /> */}
                    
                    <label htmlFor="bloody">Tipo de sangre: </label>
                    <input
                      className="form-control"
                      type="text"
                      name="bloody"
                      id="bloody"
                      readOnly
                      onChange={this.handleChange}
                      value={form ? form.bloody : ""}
                    />
                    <br />
                    <ThemeProvider theme={materialTheme}>
                        <MuiPickersUtilsProvider  utils={DateFnsUtils} >

                                  <label className="articulo">Hora de desayuno</label>
                                    <br />
                                    <KeyboardTimePicker
                                        margin="normal"
                                        name="hour_breakfast"
                                        id="time-picker"
                                        label=""
                                        value={conversionHoras(form.hour_breakfast)}
                                        onChange={this.handleHourhour_breakfast}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />  
                                <br></br>
                                <label className="articulo">Hora de colación:</label>
                                    <br />
                                    <KeyboardTimePicker
                                        margin="normal"
                                        name="hour_collation"
                                        id="time-picker"
                                        label=""
                                        value={conversionHoras(form.hour_collation)}
                                        onChange={this.handleHourhour_collation}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />  
                                <br></br>
                                <label className="articulo">Hora de comida:</label>
                                    <br />
                                    <KeyboardTimePicker
                                        margin="normal"
                                        name="hour_lunch"
                                        id="time-picker"
                                        label=""
                                        value={conversionHoras(form.hour_lunch)}
                                        onChange={this.handleHourhour_lunch}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />  
                                <br></br>
                                <label className="articulo">Hora de bocadillo:</label>
                                    <br />
                                    <KeyboardTimePicker
                                        margin="normal"
                                        name="hour_snack"
                                        id="time-picker"
                                        label=""
                                        value={conversionHoras(form.hour_snack )}
                                        onChange={this.handleHourhour_snack}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />  
                                <br></br>
                                <label className="articulo">Hora de cena:</label>
                                    <br />
                                    <KeyboardTimePicker
                                        margin="normal"
                                        name="hour_dinner"
                                        id="time-picker"
                                        label=""
                                        value={conversionHoras(form.hour_dinner)}
                                        onChange={this.handleHourhour_dinner}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change time',
                                        }}
                                    />  
                                <br></br>
                        </MuiPickersUtilsProvider>
              </ThemeProvider>
                    {/* <label htmlFor="hour_breakfast">Hora de desayuno: </label>
                    <TimeField
                      name="hour_breakfast"
                      id="hour_breakfast"
                      showSeconds
                      onChange={this.handleChange} // {Function} required
                      input={<input type="text" />}
                      // {String}   default: ":"
                      value={form ? form.hour_breakfast : ""}
                    />
                    <br />
                    <label htmlFor="hour_collation">Hora de colación: </label>
                    <TimeField
                      name="hour_collation"
                      id="hour_collation"
                      showSeconds
                      onChange={this.handleChange} // {Function} required
                      input={<input type="text" />}
                      // {String}   default: ":"
                      value={form ? form.hour_collation : ""}
                    />
                    <br />
                    <label htmlFor="hour_lunch">Hora de comida: </label>
                    <TimeField
                      name="hour_lunch"
                      id="hour_lunch"
                      showSeconds
                      onChange={this.handleChange} // {Function} required
                      input={<input type="text" />}
                      // {String}   default: ":"
                      value={form ? form.hour_lunch : ""}
                    />

                    <br />
                    <label htmlFor="hour_snack">Hora de bocadillo: </label>
                    <TimeField
                      name="hour_snack"
                      id="hour_snack"
                      showSeconds
                      onChange={this.handleChange} // {Function} required
                      input={<input type="text" />}
                      // {String}   default: ":"
                      value={form ? form.hour_snack : ""}
                    />
                    <br />
                    <label htmlFor="hour_dinner">Hora de cena: </label>
                    <TimeField
                      name="hour_dinner"
                      id="hour_dinner"
                      showSeconds
                      onChange={this.handleChange} // {Function} required
                      input={<input type="text" />}
                      // {String}   default: ":"
                      value={form ? form.hour_dinner : ""}
                    /> */}
                    <br />
                  </div>
                </ModalBody>

                <ModalFooter>
                  <button
                    className="btn btn-danger"
                    onClick={
                      /* this.setState({ form: null, tipoModal: "Agregar" }); */
                      this.modalAgregar
                    }
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={this.modalAgregar2}
                  >
                    Siguiente
                  </button>
                </ModalFooter>
              </Modal>

              {/* Aqui comienza la segunda ventana modal */}
              <Modal isOpen={this.state.modalAgregar2}>
                {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
                <ModalHeader style={{ display: "block" }}>
                  REGISTRAR HOJA CLINICA ESTRUCTURA CORPORAL
                  <span style={{ float: "right" }}></span>
                </ModalHeader>

                <ModalBody>
            <div className="form-groupp">
              <label htmlFor="uno">Estructura corporal *: </label>
              <input
                className="form-control"
                type="text"
                name="uno"
                id="uno"
                placeholder="Estructura corporal"
                maxLength="40"
                onChange={this.handleChangeInput}
                value={formcorps ? formcorps.uno : ""}
              />
              <br />
              <br />
              <label htmlFor="dos">Tensión arterial *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="dos"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.dos : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="dos"
                id="dos"
                maxLength="10"
                placeholder="Tensión arterial"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.dos : ""}
              /> */}
              <br />
              <br />
              <label htmlFor="tres">Indice de masa corporal actual *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="tres"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.tres : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="tres"
                id="tres"
                size="50"
                placeholder="Indice de masa corporal actual"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.tres : ""}
              /> */}
              <br />
              <br />
              <label htmlFor="cuatro">% de Grasa *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="cuatro"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.cuatro : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="cuatro"
                id="cuatro"
                placeholder="% de Grasa"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.cuatro : ""}
              /> */}
              <br />
              <br />
              <label htmlFor="cinco">% MM *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="cinco"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.cinco : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
             {/*  <input
                className="form-control"
                type="text"
                name="cinco"
                id="cinco"
                maxLength="10"
                placeholder="% MM"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.cinco : ""}
              /> */}
              <br />
              <br />
              <label htmlFor="seis">KC correspondientes *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="seis"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.seis : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="seis"
                id="seis"
                maxLength="10"
                placeholder="KC correspondientes"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.seis : ""}
              /> */}
              <br />
              <br />
              <label htmlFor="siete">Edad de acuerdo al peso *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="siete"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.siete : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="siete"
                id="siete"
                placeholder="Edad de acuerdo al peso"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.siete : ""}
              /> */}
              <br />
              <br />
              <label htmlFor="ocho">Grasa viceral *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="ocho"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.ocho : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="ocho"
                id="ocho"
                placeholder="Grasa viceral"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.ocho : ""}
              /> */}
              <br />
              <br />
              <label htmlFor="nueve">Situación Nutricional *: </label>
              <input
                className="form-control"
                type="text"
                name="nueve"
                id="nueve"
                placeholder="Situación Nutricional"
                maxLength="50"
                onChange={this.handleChangeInput}
                value={formcorps ? formcorps.nueve : ""}
              />
              <br />
              <label htmlFor="diez">
                Gasto calórico por horas de oficina *:{" "}
              </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="diez"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.diez : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="diez"
                id="diez"
                placeholder="Horas de oficina"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.diez : ""}
              /> */}
              <br />
              <label htmlFor="once">
                Gasto calórico por horas de movimiento *:{" "}
              </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="once"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.once : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="once"
                id="once"
                placeholder="Horas de movimiento"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.once : ""}
              /> */}
              <br />
              <label htmlFor="doce">
                Gasto calórico por horas de entrenamiento *:{" "}
              </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="doce"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.doce : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="doce"
                id="doce"
                placeholder="Horas de entrenamiento"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.doce : ""}
              /> */}
              <br />
              <label htmlFor="trece">
                Gasto calórico por horas de dormir *:{" "}
              </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="trece"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.trece : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="trece"
                id="trece"
                placeholder="Horas de dormir"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.trece : ""}
              /> */}
              <br />
              <label htmlFor="catorce">Total de gasto calórico *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="catorce"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.catorce : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="catorce"
                id="catorce"
                placeholder="Gasto calórico"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.catorce : ""}
              /> */}
              <br />
              <label htmlFor="quince">
                Total de calorías de acuerdo a su peso corporal *:
              </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="quince"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.quince : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="quince"
                id="quince"
                placeholder="Total de calorías"
                maxLength="10"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.quince : ""}
              /> */}
              <br />
              <label htmlFor="dieciseis">Metabolismo basal (I CB) *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="dieciseis"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.dieciseis : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="dieciseis"
                id="dieciseis"
                maxLength="10"
                placeholder="Metabolismo basal (I CB)"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.dieciseis : ""}
              /> */}
              <br />
              <label htmlFor="diecisiete">Consumo calórico (C C) *: </label>
              <TextField
                        id="outlined-number"
                        InputProps={{ inputProps: { min: 0} }}
                        name="diecisiete"
                        onChange={this.handleChangeInputNumber2}
                        value={formcorps ? formcorps.diecisiete : ""}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
              />
              {/* <input
                className="form-control"
                type="text"
                name="diecisiete"
                id="diecisiete"
                maxLength="10"
                placeholder="Consumo calórico"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.diecisiete : ""}
              /> */}
            </div>
          </ModalBody>

                <ModalFooter>
                  <button
                    className="btn btn-danger"
                    onClick={
                      /* this.setState({ form: null, tipoModal: "Agregar" }); */
                      this.modalAgregar
                    }
                  >
                    Regresar
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={/* () => this.peticionPut() */ this.modalAgregar3}
                  >
                    Siguiente
                  </button>
                </ModalFooter>
              </Modal>

              {/* Esta es la tercera ventana modal */}
              <Modal isOpen={this.state.modalAgregar3}>
                {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
                <ModalHeader style={{ display: "block" }}>
                  Hoja Clinica Información Extra
                  <span style={{ float: "right" }}></span>
                </ModalHeader>

                <ModalBody>
                  <div className="form-group">
                    <div className="Sintomas">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered ">
                          <thead>
                            <tr>
                              {/* <th>ID</th> */}
                              <th>Tipo de información</th>
                              <th>Nombre</th>
                              <th>Estatus</th>
                              {/* <th>Acciones</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.body.map((body) => {
                              /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                              return (
                                <tr>
                                  {/* <td>{body.typeExtraInformation_id.id}</td> */}
                                  <td>{body.typeExtraInformation_id.name}</td>
                                  <td>{body.name}</td>
                                  <td>{body.value ? "Si" : "No"}</td>
                                  <td>
                                    {/* <button
                                      className="btn btn-primary"
                                      onClick={() => {
                                        // this.seleccionarUsuario(clientes);
                                        this.modalEditarInformacion();
                                        this.state.typeExtraInformation_id = body.typeExtraInformation_id.id;
                                        //this.state.typeExtraInformation_id 
                                        this.seleccionarBody(body)
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faEdit} />
                                    </button> */}
                                    {/* <button
                                      className="btn btn-danger"
                                      onClick={() => {
                                        // this.seleccionarUsuario(clientes);
                                        let i = 0;
                                        this.state.body.forEach((e, index) => {
                                          if (e.typeExtraInformation_id.id === this.state.typeExtraInformation_id) {
                                            i = index;
                                            return;
                                          }
                                        });
                                        this.state.body.splice(i, 1)
                                        
                                        swal({
                                          text: 'Elemento eliminado correctamente',
                                          icon: "info",
                                          button: "Aceptar",
                                          timer: "5000",
                                        });
                                        this.setState({
                                          modalEditarInformacionExtra: false,
                                        });
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrashAlt} />
                                    </button> */}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </ModalBody>

                <ModalFooter>
                  <button
                    className="btn btn-danger"
                    onClick={
                      /* this.setState({ form: null, tipoModal: "Agregar" }); */
                      this.modalAgregar2
                    }
                  >
                    Regresar
                  </button>
                  {this.state.tipoModal == "Agregar" ? (
                    <button
                      className="btn btn-success"
                      onClick={() => this.peticionPost()}
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      onClick={() => {this.peticionPut()
                        this.modalAgregar3();
                      }}
                    >
                      Actualizar
                    </button>
                  )}
                </ModalFooter>
              </Modal>

              <Modal isOpen={this.state.modalEliminar}>
                <ModalBody>
                  <div className="form-group">
                    ¿Seguro de eliminar esta hoja clínica?
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
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={
                /* this.setState({ form: null, tipoModal: "Agregar" }); */
                this.modalInsertar
              }
            >
              Regresar
            </button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.modalEditarInformacionExtra}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            Editar Hoja Clínica Información Extra
            <span style={{ float: "right" }}></span>
          </ModalHeader>
            {console.log(this.state.formextra)}
          <ModalBody>
            <div className="form-group">
              <label htmlFor="namee">Seleccione el tipo: </label>
              <select
                name="namee"
                className="form-control"
                onChange={this.handleChangeCombo}
              >
                {this.state.sintomas.map((elemento, index) => (
                  <option key={elemento.id} value={index}>
                    {elemento.name}
                  </option>
                ))}
              </select>
              <br />
              <label htmlFor="descriptione">Nombre: </label>
              <input
                className="form-control"
                type="text"
                name="descriptione"
                id="descriptione"
                placeholder="Nombre"
                onChange={this.handleChangelabel}
                value={this.state.formextra ? this.state.formextra.descriptione : ""}
              />
              <br />
              <label htmlFor="statuse"> ¿Lo posee? </label>
              <br />
              <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn btn-info">
                  <input
                    type="radio"
                    name="statuse"
                    value="true"
                    autocomplete="off"
                    onChange={this.handleChangeSwitch}
                    checked={
                      // this.state.formextra.statuse ? true : false
                      (this.state.tipoModal === "Agregar" &&
                        this.state.formextra == null) ||
                      this.state.formextra.statuse === undefined
                        ? true
                        : this.state.formextra.statuse === "true"
                        ? true
                        : false
                    }
                  />{" "}
                  Sí
                </label>
                <label class="btn btn-info ">
                  <input
                    type="radio"
                    name="statuse"
                    value="false"
                    autocomplete="on"
                    onChange={this.handleChangeSwitch}
                    checked={
                      // !this.state.formextra.statuse ? true : false
                       (this.state.tipoModal === "insertar" &&
                        this.state.formextra == null) ||
                      this.state.formextra.statuse === undefined
                        ? false
                         : this.state.formextra.statuse === "false"
                        ? true
                         : false
                    }
                  />{" "}
                  No
                </label>
              </div>
              <br />
            </div>
          </ModalBody>

          <ModalFooter>
            <button
              className="btn btn-danger"
              onClick={() =>
                this.setState({ modalEditarInformacionExtra: false })
              }
            >
              Regresar
            </button>

            <button
              className="btn btn-primary"
              onClick={
                (() => this.handleInputChange(), () => {
                  this.state.body.forEach((e) => {
                    if (e.typeExtraInformation_id.id === this.state.typeExtraInformation_id) {
                      e.typeExtraInformation_id.name = this.state.formextra.namee || e.typeExtraInformation_id.name;
                      e.name = this.state.formextra.descriptione || e.name ;
                      const value = this.state.formextra.statuse === "false" ? false : true;
                      console.log('value :>> ', value);
                      e.value = value;
                      e.typeExtraInformation_id["id"] = this.state.formextra.id || e.typeExtraInformation_id["id"];
                      console.log(e)
                      swal({
                        text: "Actualizado correctamente",
                        icon: "success",
                        button: "Aceptar",
                        timer: "5000",
                      });
                      
                      this.setState({
                        modalEditarInformacionExtra: false,
                      });
                    }
                  });
                  console.log('-----------------------------------------')
                })
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
export default BtnModalHoja;
