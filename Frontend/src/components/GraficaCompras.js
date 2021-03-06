import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BotonGrafics from "../components/BotonGrafics";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import DateFnsUtils from "@date-io/date-fns";
import "../styles/GraficaTotal.css";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { isEmpty } from "../helpers/methods";
const url = "https://www.api.huxgym.codes/reports/sales/";
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

function obtenerTotales(data) {
  let nuevo = data.map((dato) => {
    return dato.total;
  });
  return nuevo;
}

function getDate(date) {
  let fecha = new Date(date);
  let year = fecha.getFullYear();
  let mounth = fecha.getUTCMonth() + 1;
  let day = fecha.getDate();
  if (mounth < 10) {
    mounth = "0" + mounth;
  }
  return year + "-" + mounth + "-" + day;
}

function getCategories(data) {
  let nuevo = data.map((dato) => {
    return dato.name;
  });
  return nuevo;
}
class GraficaTotal extends Component {
  state = {
    fechaInicial: new Date(),
    fechaFinal: new Date(),
    order: "",
    selectedOption: "",
    data: [],
  };

  handleChange = async (selectedOption) => {
    await this.setState({ selectedOption: selectedOption.target.value });
    this.peticionGet();
  };

  handleFechaInicial = async (e) => {
    await this.setState({
      fechaInicial: e,
    });
    this.peticionGet();
  };

  handleFechaFinal = async (e) => {
    await this.setState({
      fechaFinal: e,
    });
    this.peticionGet();
  };

  peticionGet = async () => {
    var FormData = require("form-data");
    var data = new FormData();
    data.append("first_date", getDate(this.state.fechaInicial));
    data.append("last_date", getDate(this.state.fechaFinal));
    data.append("order", this.state.selectedOption);

    var config = {
      method: "POST",
      url: url,
      headers: {
        /* Allow:"GET, OPTIONS", */
      },
      data: data,
    };

    axios(config)
      .then((res) => {
        console.log(res);
        this.setState({
          data: res.data.products,
        });
      })
      .catch((error) => {
        this.setState({
          data: [],
        });
        console.log(error);
      });
  };

  render() {
    const { form } = this.state;
    const data = {
      labels: getCategories(this.state.data),
      datasets: [
        {
          label: "Total del producto",
          backgroundColor: "#062256",
          bordercolor: "black",
          borderWidth: 1,
          height: "100%",
          with: "40%",
          data: obtenerTotales(this.state.data),
        },
      ],
    };
    const opciones = {
      /* maintainAspectsRatio: false, */
      indexAxis: "x",
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: (ctx) =>
            "TOTAL DE PRODUCTOS VENDIDOS"
        },
        tooltip: {
          mode: "index",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'PRODUCTO'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'CANTIDAD'
          }
        }
      }
    };
    return (
      <>
        <div className="table-responsive-main">
          <div className="Barra_opciones mt-3">
            <BotonGrafics />
          </div>
        </div>
        <br />
        
        <div className="SelectorWrapperAsistencia">
          <label className="Texto mt-3">Seleccionar orden:</label>
          <div className="SelectorP mt-3">
            <select
              name="selectedOption"
              className="Opciones form-select"
              onChange={this.handleChange}
              value={this.state.selectedOption}
            >
              <option selected>--Selecciona--</option>
              <option value="asen">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>
          <ThemeProvider theme={materialTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <label className="Texto mt-3">Fecha inicial</label>
              <>
                <KeyboardDatePicker
                  className="fecha"
                  name="fechaInicial"
                  allowKeyboardControl={true}
                  id="fechaInicial"
                  format="yyyy-MM-dd"
                  value={this.state.fechaInicial}
                  onChange={this.handleFechaInicial}
                  animateYearScrolling={true}
                />
              </>
            </MuiPickersUtilsProvider>
          </ThemeProvider>

          <ThemeProvider theme={materialTheme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <label className="Texto mt-3">Fecha Final</label>
              <>
                <KeyboardDatePicker
                  className="fecha"
                  allowKeyboardControl={true}
                  id="fechaFinal"
                  name="fechaFinal"
                  format="yyyy-MM-dd"
                  value={this.state.fechaFinal}
                  onChange={this.handleFechaFinal}
                  animateYearScrolling={true}
                />
              </>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </div>
        <div className="GraficaWrapper ">
          <div className="Grafica">
            <Bar data={data} options={opciones} />
          </div>
        </div>
      </>
    );
  }
}

export default GraficaTotal;
