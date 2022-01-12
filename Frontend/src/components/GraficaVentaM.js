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
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Bar } from "react-chartjs-2";
import DateFnsUtils from "@date-io/date-fns";
import "../styles/GraficaTotal.css";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import { isEmpty } from "../helpers/methods";
const url = "https://www.huxgym.codes/reports/memberships/";
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

function prueba(date) {
  console.log("purba");
  console.log(date);
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
    order: "",
    products: "",
  };

  state = {
    data: [] /* Aqui se almacena toda la informacion axios */,
    nombres: [],
    valor: [],
    form: {
      first_date: obtnerDate(new Date()),
      last_date: obtnerDate(new Date()),
      order: "",
      buyers: "",
      customers: "",
      message: "",
    },
  };
  peticionPost = async () => {
    try {
      const { form } = this.state;
      let formData = new FormData();
      formData.append("first_date", obtnerDate(this.state.form.first_date));
      formData.append("last_date", obtnerDate(this.state.form.last_date));
      formData.append("order", this.state.form.order);
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

      let nom = [];
      let valores = [];
      for (const prop in res.data) {
        console.log(`${prop} = ${res.data[prop]}`);
        nom.push(prop);
        valores.push(res.data[prop]);
      }
      await this.setState({
        data: res.data,
        nombres: nom,
        valor: valores,
      });
      /* res.data.products.map((product) => {
        this.state.nombres.push(product.names);
        this.state.valor.push(product.value);
      }); */

      /*  console.log("Datoooos", this.state.data.nombres);
      console.log("Datoooos", this.state.data.valor); */
      console.log("Datoooos", this.state.data);
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      await this.setState({
        data: [],
        nombres: [],
        valor: [],
      });
    }
  };
  handleChange = async (e) => {
    const value = e.target.value;
    console.log(value.name);
    await this.setState({
      form: {
        ...this.state.form,
        order: value,
      },
    });

    this.peticionPost();
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
  render() {
    const { form } = this.state;
    const data = {
      labels: this.state.nombres,
      datasets: [
        {
          label: "Totales",
          backgroundColor: "yellow",
          bordercolor: "black",
          borderWidth: 1,
          height: "100%",
          with: "30%",
          data: this.state.valor,
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
        <div className="SelectorWrapperAsistencia">
          <label className="Texto mt-3">Seleccionar orden:</label>
          <div className="SelectorP mt-3">
            <select
              className="Opciones"
              class="form-select"
              onChange={this.handleChange}
              value={form ? form.order : ""}
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
                  allowKeyboardControl={true}
                  id="first_date"
                  format="yyyy-MM-dd"
                  value={form ? form.first_date : new Date()}
                  onChange={this.handleDateChangeI}
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
                  id="last_date"
                  format="yyyy-MM-dd"
                  value={form ? form.last_date : new Date()}
                  onChange={this.handleDateChangeF}
                  animateYearScrolling={true}
                />
              </>
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        </div>
        <div className="GraficaWrapper">
          <div className="Grafica">
            <Bar data={data} options={opciones} />
          </div>
        </div>
      </>
    );
  }
}

export default GraficaTotal;
