import React, { Component, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";

import BotonGrafics from "../components/BotonGrafics";

import { Bar } from "react-chartjs-2";
import DateFnsUtils from "@date-io/date-fns";
import "../styles/GraficaTotal.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { isEmpty } from "../helpers/methods";
const url = "https://www.huxgym.codes/reports/customerproduct/";

function obtnerDate(date) {
  let fecha = new Date(date);
  console.log(fecha);
  let year = fecha.getFullYear();
  let mounth = fecha.getUTCMonth() + 1;
  let day = fecha.getDate();
  if (mounth < 10) {
    mounth = "0" + mounth;
  }
  if (day < 10) {
    day = "0" + day;
  }
  console.log(year + "-" + mounth + "-" + day);
  return year + "-" + mounth + "-" + day;
}
const materialTheme = createMuiTheme({
  palette: {
    background: {
      paper: "#EDEDED",
      default: "#1b1a17",
    },
    text: {
      default: "#072227",
    },
    textColor: "#000",
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#0000",
    },
  },
});

class GraficaTotal extends Component {
  campos = {
    first_date: "FechaI",
    last_date: "FechaF",
    customers: "",
    buyers: "",
  };

  state = {
    data: [] /* Aqui se almacena toda la informacion axios */,
    form: {
      first_date: obtnerDate(new Date()),
      last_date: obtnerDate(new Date()),
      buyers: "",
      customers: "",
      message: "",
    },
  };

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
  };
  validar = (form) => {
    if (isEmpty(form))
      return { error: true, msj: "Debe rellenar los campos obligatorios" };
    const first_date = form.first_date;
    const last_date = form.last_date;
    if (isEmpty(first_date) && isEmpty(last_date))
      return {
        error: true,
        msj: "Los campos de Fecha Inicial, Fecha Final, son obligatorios",
      };
  };
  peticionPost = async () => {
    try {
      const { form } = this.state;
      let formData = new FormData();
      formData.append("first_date", obtnerDate(this.state.form.first_date));
      formData.append("last_date", obtnerDate(this.state.form.last_date));
      console.log(formData);
      const res = await axios.post(url, formData);
      console.log(res);

      if (res.status === 200 || res.status === 201) {
        swal({
          text: "Solicitud atendient correctamente",
          icon: "success",
          button: "Aceptar",
          timer: "50",
        });
      }
      this.setState({
        data: res.data,
      });
      console.log("Datoooos", this.state.data);
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      this.setState({
        data: [],
      });
    }
  };
  handleDateChangeI = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        first_date: e,
      },
    });
    this.peticionPost();
  };

  handleDateChangeF = async (e) => {
    await this.setState({
      form: {
        ...this.state.form,
        last_date: e,
      },
    });
    this.peticionPost();
  };
  /* componentDidMount() {
    this.peticionPost();
  } */
  seleccionarFechas = (fechas) => {
    this.setState({
      form: {
        buyers: fechas.buyers,
        customers: fechas.customers,
        message: fechas.message,
      },
    });
  };
  render() {
    const { form } = this.state;
    console.log("Datoooos3", this.state.data);
    let customers = "";
    let buyers = "";
    customers = this.state.data.customers;
    buyers = this.state.data.buyers;
    const data = {
      labels: [
        "Total de compras por clientes",
        "Total de Clientes registrados",
      ],
      datasets: [
        {
          label: "Clientes que compran productos",
          backgroundColor: ["gray"],
          bordercolor: "black",

          borderWidth: 1,
          height: "100%",
          with: "30%",
          data: [buyers, customers],
        },
      ],
    };
    const opciones = {
      /* maintainAspectsRatio: false, */
      indexAxis: "x",
      responsive: true,
    };

    return (
      <>
        <div className="table-responsive-main">
          <div className="Barra_opciones mt-3">
            <BotonGrafics />
          </div>
        </div>
        <br />
        <div className="SelectorWrapper">
          <ThemeProvider theme={materialTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <label className="Texto mt-3">Fecha inicial</label>
              <>
                <KeyboardDatePicker
                  className="fechaInicial"
                  allowKeyboardControl={true}
                  id="fechaInicial"
                  format="yyyy-MM-dd"
                  value={form ? form.first_date : new Date()}
                  onChange={this.handleDateChangeI}
                  animateYearScrolling={true}
                />
              </>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
          <div class="esp"></div>
          <ThemeProvider theme={materialTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <label className="Texto mt-3">Fecha Final</label>
              <>
                <KeyboardDatePicker
                  className="fechaFinal"
                  allowKeyboardControl={true}
                  id="fechaFinal"
                  format="yyyy-MM-dd"
                  value={form ? form.last_date : new Date()}
                  onChange={this.handleDateChangeF}
                  animateYearScrolling={true}
                />
              </>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </div>
        <div className="GraficaWrapper mt-5">
          <div className="Grafica">
            <Bar data={data} options={opciones} />
          </div>
        </div>
      </>
    );
  }
}

export default GraficaTotal;
