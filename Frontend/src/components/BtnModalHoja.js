import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Col.css";
import "../styles/Crud.css";
import "../styles/HojaClinica.css";
import axios from "axios";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { Input } from '@mui/material';
import DateFnsUtils from "@date-io/date-fns";
import swal from "sweetalert";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import TimeField from "react-simple-timefield";
import { isEmpty } from "../helpers/methods";
import TextField from "@material-ui/core/TextField";
const url = "https://www.huxgym.codes/customers/customers/";
const url_sn = "https://www.huxgym.codes/customers/nutritionalSituation/";
const url_hc = "https://www.huxgym.codes/customers/historyClinic/";
const url_hc_tei =
  "https://www.huxgym.codes/customers/typeExtraInformation_HistoryClinic/";
const url_hc_ba =
  "https://www.huxgym.codes/customers/bodyAttribute_HistoryClinic/";
const materialTheme = createMuiTheme({
  palette: {
    background: {
      paper: "#EDEDED",
      default: "#114e60",
    },
    text: {
      default: "#fff",
    },
    textColor: "#fff",
    primary: {
      main: "#1b1a17",
    },
  },
});

function conversionHoras(date) {
  let datos = date.split(":");
  let hr = datos[0];
  let min = datos[1];
  let sec = datos[2];

  let fecha = new Date();

  fecha.setHours(parseInt(hr, 10));
  fecha.setMinutes(parseInt(min, 10));
  fecha.setSeconds(parseInt(sec, 10));
  return fecha;
}

function conversionHoras2(date) {
  let fecha = new Date(date);

  let hr = fecha.getHours();
  let min = fecha.getMinutes();
  let sec = fecha.getSeconds();
  return hr + ":" + min + ":" + sec;
}
class BtnModalHoja extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    busqueda: "",
    data: [] /* Aqui se almacena toda la informacion axios */,
    sintomas: [],
    list: [],
    errors:{},
    sintomasSelect: {},
    modalAgregar: false /* Esta es el estado para abrir y cerrar la ventana modal */,
    modalAgregar2: false,
    modalAgregar3: false,
    tipoModal: "Agregar",
    form: {
      /* Aqui guardaremos los datos que el usuario introduce en el formulario modal 1*/
      customer_id: this.props.id_cliente,
      date: "",
      age: "0",
      height: "0",
      weight: "0",
      bloody: "O+",
      hour_breakfast: "00:00:00",
      hour_collation: "00:00:00",
      hour_lunch: "00:00:00",
      hour_snack: "00:00:00",
      hour_dinner: "00:00:00",
    },
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
      e.target.value = "";
      swal({
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
    console.log(this.state.form);
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
      e.target.value = "";
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

    if (regex.test(value) ) {
      this.setState({
        formcorps: {
          ...this.state.formcorps,
          [name]: value,
        },
      });
    } else {
      e.target.value = "";
      swal({
        text: "Este valor no esta permitido",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
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

  handleChangebox = (e) => {
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

  handleChangeName = (e) => {
    const descriptione = e.target.value;
    this.setState({
      formextra: {
        descriptione,
      },
    });
  };

  handleChangeSwitch = (e) => {
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

  validateNumber = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    let regex = new RegExp("^[0-9]+$");

    if (regex.test(value)) {
      const setValue = value <= 100 && value >= 0 ? value : 13;
      this.setState({
        form: {
          ...this.state.form,
          [name]: setValue,
        },
      });
      if(value<13){
        this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              edad: 'La edad minima es 13'
          }
      }))
      }else{
        this.setState(prevState => ({
          errors: {
              ...prevState.errors,
              edad: null
          }
      }))
      }
    } else {
      event.target.value = "";
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
    console.log(value)
    if (regex.test(value)) {
        console.log("asas");
        const setValue = value < 4000 && value >= 0 ? value : 0;
        this.setState({
          form: {
            ...this.state.form,
            [name]: setValue,
          },
        });
        if(value<100){
          this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                estatura: 'La estatura deb ser mayor a 100cm'
            }
        }))
        }else{
          this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                estatura: null
            }
        }))
        }
      } else {
        console.log("asaddds");
        event.target.value = this.state.form.height;
        swal({
          text: "Este valor no es admitido",
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
      const setValue = value < 1000 && value >= 0 ? value : 40;
      this.setState({
        form: {
          ...this.state.form,
          [name]: setValue,
        },
      });
    } else {
      event.target.value = "";
      swal({
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  handleHourhour_breakfast = (e) => {
    let value = conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_breakfast: value,
      },
    });
  };
  handleHourhour_collation = (e) => {
    let value = conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_collation: value,
      },
    });
  };
  handleHourhour_lunch = (e) => {
    let value = conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_lunch: value,
      },
    });
  };

  handleHourhour_snack = (e) => {
    let value = conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_snack: value,
      },
    });
  };

  handleHourhour_dinner = (e) => {
    let value = conversionHoras2(e);
    this.setState({
      form: {
        ...this.state.form,
        hour_dinner: value,
      },
    });
  };

  //comienza parte de insertar sintomas
  handleInputChange = (event) => {
    this.setState({
      list: [...this.state.list, this.state.formextra],
    });
    console.log(this.state.list);
  };

  peticionGet = async () => {
    /* Con esto obtenemos los datos de la url(data) y lo almacenamos en data(data[]) */
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        this.setState({
          /* Con esto accedemos a las variables de state y modificamos */

          data: res.data,
        }); /* Almacenamos la data obtenida de response en la variable data(esta puede tener el nombre que queramos ponerle) */
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      this.setState({
        error: true,
        errorMsg: msj,
      });
    }
  };

  validar = (form) => {
    if (isEmpty(form))
      return { error: true, msj: "Debe rellenar los campos obligatorios" };
    const age = form.age;
    if (age < 11) {
      return {
        error: true,
        msj: "La edad del cliente debe ser mayor a 12",
      };
    }
    const height = form.height;
    const weight = form.weight;
    const hour_breakfast = form.hour_breakfast;
    const hour_collation = form.hour_collation;
    const hour_lunch = form.hour_lunch;
    const hour_snack = form.hour_snack;
    const hour_dinner = form.hour_dinner;

    if (
      isEmpty(age) &&
      isEmpty(height) &&
      isEmpty(weight) &&
      isEmpty(hour_breakfast) &&
      isEmpty(hour_collation) &&
      isEmpty(hour_lunch) &&
      isEmpty(hour_snack) &&
      isEmpty(hour_dinner)
    )
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
      return {
        error: true,
        msj: "El campo de la edad debe ser mayor o igual 13",
      };
    if (!height)
      return { error: true, msj: "El campo de estatura no puede estar vacío" };
    if (height < 100)
      return { error: true, msj: "La estatura no puede se menor a 100cm" };
    const altura = parseInt(height);
    if (altura <= 0)
      return {
        error: true,
        msj: "El campo de estatura debe tener un valor positivo",
      };
    if (isEmpty(weight))
      return {
        error: true,
        msj: "El campo de Peso en kilogramos no puede estar vacío",
      };
    const peso = parseInt(weight);
    if (peso <= 0)
      return {
        error: true,
        msj: "El campo de peso debe tener un valor positivo",
      };
    if (isEmpty(hour_breakfast))
      return {
        error: true,
        msj: "El campo de hora de desayuno no puede estar vacío",
      };
    if (isEmpty(hour_collation))
      return {
        error: true,
        msj: "El campo de hora de colación no puede estar vacío",
      };
    if (isEmpty(hour_lunch))
      return {
        error: true,
        msj: "El campo de hora de comida no puede estar vacío",
      };
    if (isEmpty(hour_snack))
      return {
        error: true,
        msj: "El campo de hora de bocadillo no puede estar vacío",
      };
    if (isEmpty(hour_dinner))
      return {
        error: true,
        msj: "El campo de hora de cena no puede estar vacío",
      };
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

    if (
      isEmpty(uno) &&
      isEmpty(dos) &&
      isEmpty(tres) &&
      isEmpty(cuatro) &&
      isEmpty(cinco) &&
      isEmpty(seis) &&
      isEmpty(siete) &&
      isEmpty(ocho) &&
      isEmpty(nueve) &&
      isEmpty(diez) &&
      isEmpty(once) &&
      isEmpty(doce) &&
      isEmpty(trece) &&
      isEmpty(catorce) &&
      isEmpty(quince) &&
      isEmpty(dieciseis) &&
      isEmpty(diecisiete)
    )
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
      return {
        error: true,
        msj: "El campo de Tensión arterial en centímetro no puede estar vacío",
      };
    if (isEmpty(tres))
      return {
        error: true,
        msj: "El campo de Indice de masa corporal actual no puede estar vacío",
      };
    if (isEmpty(cuatro))
      return {
        error: true,
        msj: "El campo de % de Grasa no puede estar vacío",
      };
    if (isEmpty(cinco))
      return { error: true, msj: "El campo de % MM no puede estar vacío" };
    if (isEmpty(seis))
      return {
        error: true,
        msj: "El campo de KC correspondientes no puede estar vacío",
      };
    if (isEmpty(siete))
      return {
        error: true,
        msj: "El campo de Edad de acuerdo al peso no puede estar vacío",
      };
    if (isEmpty(ocho))
      return {
        error: true,
        msj: "El campo de Grasa viceral no puede estar vacío",
      };
    if (isEmpty(nueve))
      return {
        error: true,
        msj: "El campo de Situación Nutricional en centímetro no puede estar vacío",
      };
    if (isEmpty(diez))
      return {
        error: true,
        msj: "El campo de Gasto calórico por horas de oficina no puede estar vacío",
      };
    if (isEmpty(once))
      return {
        error: true,
        msj: "El campo de Gasto calórico por horas de movimiento no puede estar vacío",
      };
    if (isEmpty(doce))
      return {
        error: true,
        msj: "El campo de Gasto calórico por horas de entrenamiento no puede estar vacío",
      };
    if (isEmpty(trece))
      return {
        error: true,
        msj: "El campo de Gasto calórico por horas de dormir no puede estar vacío",
      };
    if (isEmpty(catorce))
      return {
        error: true,
        msj: "El campo de Total de gasto calórico no puede estar vacío",
      };
    if (isEmpty(quince))
      return {
        error: true,
        msj: "El campo de Total de calorías correspondientes de acuerdo a su peso corporal no puede estar vacío",
      };
    if (isEmpty(dieciseis))
      return {
        error: true,
        msj: "El campo de Metabolismo basal (I CB) no puede estar vacío",
      };
    if (isEmpty(diecisiete))
      return {
        error: true,
        msj: "El campo de Consumo calórico (C C) no puede estar vacío",
      };

    return { error: false };
  };

  peticionPost = async () => {
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
          // Realizar validaciones correspondientes

          // Creación de la situación nutricional
          const res_form1 = await axios.post(url_sn, {
            hour_breakfast: form1.hour_breakfast,
            hour_collation: form1.hour_collation,
            hour_lunch: form1.hour_lunch,
            hour_snack: form1.hour_snack,
            hour_dinner: form1.hour_dinner,
            schedule: "Planeación",
          });

          if (res_form1.status === 200 || res_form1.status === 201) {
            const nutritionalSituation_id = res_form1.data.id;
            // Creación de la hoja clínica
            const res_hc = await axios.post(url_hc, {
              age: form1.age,
              weigth: form1.weight,
              heigh: form1.height,
              bloodType: form1.bloody,
              customer_id: form1.customer_id,
              nutritionalSituation_id,
            });

            if (res_hc.status === 200 || res_hc.status === 201) {
              const historyClinic_id = res_hc.data.id;
              const typeExtraInformation = this.state.list;
              // Registro a la hoja clínica su información extra
              typeExtraInformation.forEach(async (extra_information) => {
                await axios.post(url_hc_tei, {
                  name: extra_information.descriptione,
                  value: extra_information.statuse,
                  typeExtraInformation_id: extra_information.id,
                  historyClinic_id,
                });
              });

              // Registro a la hoja clínica la información de atributos del cuerpo
              const pet_ab_1 = await this.peticionAtributoCuerpo(
                { id: 1, value: form2.uno },
                historyClinic_id
              );
              if (pet_ab_1.err) throw new Error(pet_ab_1.error);
              const pet_ab_2 = await this.peticionAtributoCuerpo(
                { id: 2, value: form2.dos },
                historyClinic_id
              );
              if (pet_ab_2.err) throw new Error(pet_ab_2.error);
              const pet_ab_3 = await this.peticionAtributoCuerpo(
                { id: 3, value: form2.tres },
                historyClinic_id
              );
              if (pet_ab_3.err) throw new Error(pet_ab_3.error);
              const pet_ab_4 = await this.peticionAtributoCuerpo(
                { id: 4, value: form2.cuatro },
                historyClinic_id
              );
              if (pet_ab_4.err) throw new Error(pet_ab_4.error);
              const pet_ab_5 = await this.peticionAtributoCuerpo(
                { id: 5, value: form2.cinco },
                historyClinic_id
              );
              if (pet_ab_5.err) throw new Error(pet_ab_5.error);
              const pet_ab_6 = await this.peticionAtributoCuerpo(
                { id: 6, value: form2.seis },
                historyClinic_id
              );
              if (pet_ab_6.err) throw new Error(pet_ab_6.error);
              const pet_ab_7 = await this.peticionAtributoCuerpo(
                { id: 7, value: form2.siete },
                historyClinic_id
              );
              if (pet_ab_7.err) throw new Error(pet_ab_7.error);
              const pet_ab_8 = await this.peticionAtributoCuerpo(
                { id: 8, value: form2.ocho },
                historyClinic_id
              );
              if (pet_ab_8.err) throw new Error(pet_ab_8.error);
              const pet_ab_9 = await this.peticionAtributoCuerpo(
                { id: 9, value: form2.nueve },
                historyClinic_id
              );
              if (pet_ab_9.err) throw new Error(pet_ab_9.error);
              const pet_ab_10 = await this.peticionAtributoCuerpo(
                { id: 10, value: form2.diez },
                historyClinic_id
              );
              if (pet_ab_10.err) throw new Error(pet_ab_10.error);
              const pet_ab_11 = await this.peticionAtributoCuerpo(
                { id: 11, value: form2.once },
                historyClinic_id
              );
              if (pet_ab_11.err) throw new Error(pet_ab_11.error);
              const pet_ab_12 = await this.peticionAtributoCuerpo(
                { id: 12, value: form2.doce },
                historyClinic_id
              );
              if (pet_ab_12.err) throw new Error(pet_ab_12.error);
              const pet_ab_13 = await this.peticionAtributoCuerpo(
                { id: 13, value: form2.trece },
                historyClinic_id
              );
              if (pet_ab_13.err) throw new Error(pet_ab_13.error);
              const pet_ab_14 = await this.peticionAtributoCuerpo(
                { id: 14, value: form2.catorce },
                historyClinic_id
              );
              if (pet_ab_14.err) throw new Error(pet_ab_14.error);
              const pet_ab_15 = await this.peticionAtributoCuerpo(
                { id: 15, value: form2.quince },
                historyClinic_id
              );
              if (pet_ab_15.err) throw new Error(pet_ab_15.error);
              const pet_ab_16 = await this.peticionAtributoCuerpo(
                { id: 16, value: form2.dieciseis },
                historyClinic_id
              );
              if (pet_ab_16.err) throw new Error(pet_ab_16.error);
              const pet_ab_17 = await this.peticionAtributoCuerpo(
                { id: 17, value: form2.diecisiete },
                historyClinic_id
              );
              if (pet_ab_17.err) throw new Error(pet_ab_17.error);
            }
          }
          swal({
            text: "Hoja clínica registrada correctamente",
            icon: "success",
            button: "Aceptar",
            timer: "5000",
          });
          this.modalAgregar3();
        }
      }
    } catch (error) {
      console.log(error);
      swal({
        text: "Error al registrar la hoja clínica",
        icon: "error",
        button: "Aceptar",
        timer: "5000",
      });
    }
  };

  async peticionAtributoCuerpo(data, historyClinic_id) {
    try {
      const res = await axios.post(url_hc_ba, {
        value: data.value,
        bodyAttribute_id: data.id,
        historyClinic_id,
      });
      return {
        err: !(res.status === 200 || res.status === 201),
        data: res.data,
      };
    } catch (error) {
      ///
      return { err: true, error };
    }
  }

  preventNonNumericalInput(e) {
    console.log("entre a prevent")
    var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
    var charStr = String.fromCharCode(charCode);
  
    if (!charStr.match(/^[0-9]+$/))
      swal({
        text: "No se permiten letras",
        icon: "info",
        button: "Aceptar",
        timer: "5000",
      });
  }

  componentDidMount() {
    /* Este metodo se ejecuta inmediatamente despues del renderizado */
    this.peticionGet();
    axios
      .get("https://www.huxgym.codes/customers/typeExtraInformation/")
      .then((response) => {
        console.log(response);
        this.setState({ sintomas: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  modalAgregar = () => {
    this.setState({ modalAgregar2: false, modalAgregar3: false });
    this.setState({ modalAgregar: !this.state.modalAgregar });
    this.setState({ customer_id: this.props.id_cliente });
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

  render() {
    const { form } = this.state;
    const { formcorps } = this.state;
    const { formextra } = this.state;
    return (
      <div className="denada">
        <button
          className="btn btn-outline-dark"
          onClick={() => {
            this.setState({ customer_id: this.props.id_cliente });
            this.modalAgregar();
          }}
        >
          Añadir nueva hoja clínica
        </button>
        <Modal isOpen={this.state.modalAgregar}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            REGISTRAR HOJA CLINICA SITUACION NUTRICIONAL
            <span style={{ float: "right" }}></span>
          </ModalHeader>

          <ModalBody>
            <div className="form-group">
              {/* <label htmlFor="id">ID Cliente</label>
              <input
                className="form-control"
                type="integer"
                name="id"
                id="id"
                readOnly
                onChange={this.handleChange}
                value={form ? form.customer_id : ""}
              /> */}
              <label htmlFor="age">Edad actual *: </label>
              <br />
              <TextField
                id="outlined-number"
                name="age"
                onChange={this.validateNumber}
                value={form.age}
                type="number"
                style={{ width: "200px" }}
                placeholder="Edad mínima 13 años"
                InputProps={{ inputProps: { min: 13, max: 99 } }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              {/* <input
                className="form-control"
                type="float"
                name="age"
                id="age"
                size="100"
                min="11"
                maxlength="2"
                placeholder="Edad actual"
                onChange={this.handleChangeInputNumber}
                value={form ? form.age : ""}
               
              /> */}
              <br />
              {this.state.errors.edad && <p  className="errores mt-2">{this.state.errors.edad}</p>}
              <br />
              <label htmlFor="height">Estatura en centímetros *: </label>
              <br />
              <TextField
                id="outlined-number"
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', min: 100, max: 4000  }}
                style={{ width: "200px" }}
                name="height"
                placeholder="Ingrese estatura"
                onChange={this.validateEstatura}
                value={this.state.form.height}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <br />
              {this.state.errors.estatura && <p  className="errores mt-2">{this.state.errors.estatura}</p>}
              <br />
              <label htmlFor="weight">Peso en kilogramos *: </label>
              <br />
              <TextField
                id="outlined-number"
                InputProps={{ inputProps: { min: 0, max: 1000 } }}
                style={{ width: "200px" }}
                name="weight"
                placeholder="Ingrese peso en kg"
                onChange={this.validatePeso}
                value={form.weight}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <br />
              <br />
              <label htmlFor="bloody">Tipo de sangre: </label> <br />
              <select
                className="selectblood"
                name="bloody"
                onChange={this.handleChange}
              >
                <option value="O+" selected>
                  O+
                </option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="A-">A-</option>
                <option value="O-">O-</option>
                <option value="B-">B-</option>
                <option value="AB-">AB-</option>
              </select>
              <br />
              <br />
              <ThemeProvider theme={materialTheme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                      "aria-label": "change time",
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
                      "aria-label": "change time",
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
                      "aria-label": "change time",
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
                    value={conversionHoras(form.hour_snack)}
                    onChange={this.handleHourhour_snack}
                    KeyboardButtonProps={{
                      "aria-label": "change time",
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
                      "aria-label": "change time",
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
              /> */}
              {/* <br />
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
              <br /> */}
              {/* <label htmlFor="hour_lunch">Hora de comida: </label>
              <TimeField
                name="hour_lunch"
                id="hour_lunch"
                showSeconds
                onChange={this.handleChange} // {Function} required
                input={<input type="text" />}
                // {String}   default: ":"
                value={form ? form.hour_lunch : ""}
              /> */}
              {/* <br />
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
              <br /> */}
              {/*  <label htmlFor="hour_dinner">Hora de cena: </label>
              <TimeField
                name="hour_dinner"
                id="hour_dinner"
                showSeconds
                onChange={this.handleChange} // {Function} required
                input={<input type="text" />}
                // {String}   default: ":"
                value={form ? form.hour_dinner : ""}
              />
              <br />  */}
              {/* <label htmlFor="">Información extra: </label>
              <input
                className="form-control"
                type="text"
                name="membershipActivate"
                id="membershipActivate"
                onChange={this.handleChange}
                value={form ? form.membershipActivate : ""}
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
              Cancelar
            </button>
            {this.state.tipoModal == "Agregar" ? (
              <button
                className="btn btn-success"
                onClick={/* this.peticionPut */ this.modalAgregar2}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                SiguienteSe
              </button>
            )}
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
                name="dos"
                onChange={this.handleChangeInputNumber2}
                value={formcorps ? formcorps.dos : ""}
                type="number"
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
                onChange={this.handleChangeInput}
                value={formcorps ? formcorps.nueve : ""}
              />
              <br />
              <label htmlFor="diez">
                Gasto calórico por horas de oficina *:{" "}
              </label>
              <TextField
                id="outlined-number"
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
                InputProps={{ inputProps: { min: 0 } }}
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
            {this.state.tipoModal == "Agregar" ? (
              <button
                className="btn btn-success"
                onClick={/* () => this.peticionPut() */ this.modalAgregar3}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}
          </ModalFooter>
        </Modal>

        {/* Esta es la tercera ventana modal */}
        <Modal isOpen={this.state.modalAgregar3}>
          {/* Al metodo isOpen se le pasa el valor de modalInsertar */}
          <ModalHeader style={{ display: "block" }}>
            REGISTRAR HOJA CLINICA INFORMACION EXTRA
            <span style={{ float: "right" }}></span>
          </ModalHeader>

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
                size="40"
                placeholder="Nombre"
                maxLength="40"
                onChange={this.handleChangelabel}
                value={form ? form.descriptione : ""}
              />
              <br />
              <br />
              <label htmlFor="statuse"> ¿Lo posee? </label>
              <br />{" "}
              <div class="btn-group btn-group-toggle" data-toggle="buttons">
                <label class="btn botonesForm m-1">
                  <input
                    type="radio"
                    name="statuse"
                    value="true"
                    autocomplete="off"
                    onChange={this.handleChangeSwitch}
                    checked={
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

                <label class="btn botonesForm m-1">
                  <input
                    type="radio"
                    name="statuse"
                    value="false"
                    autocomplete="on"
                    onChange={this.handleChangeSwitch}
                    checked={
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
              <br />
              <button
                className="btn botonesdash"
                onClick={() => {
                  const nami = this.state.formextra.descriptione;
                  const tiene = this.state.formextra.statuse;
                  if (isEmpty(nami)) {
                    swal({
                      text: "El campo Nombre no debe estar vacio",
                      icon: "info",
                      button: "Aceptar",
                      timer: "5000",
                    });
                  } else {
                    if (isEmpty(tiene)) {
                      swal({
                        text: "El campo lo ¿Lo posee? no debe estar vacio",
                        icon: "info",
                        button: "Aceptar",
                        timer: "5000",
                      });
                    } else {
                      this.handleInputChange();
                    }
                  }
                }}
              >
                Agregar
              </button>
              <div className="Sintomas">
                <div className="table-responsiveV">
                  <table className="table table-striped table-bordered ">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tipo de información</th>
                        <th>Nombre</th>
                        <th>Estatus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.list.map((list) => {
                        /* Con esto recorremos todo nuestro arreglo data para rellenar filas */
                        return (
                          <tr>
                            <td>{list.id}</td>
                            <td>{list.namee}</td>
                            <td>{list.descriptione}</td>
                            <td>{list.statuse === "true" ? "Si" : "No"}</td>
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
                onClick={() => this.peticionPut()}
              >
                Actualizar
              </button>
            )}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default BtnModalHoja;
