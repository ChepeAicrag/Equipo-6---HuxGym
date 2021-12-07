import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import swal from "sweetalert";
import "../styles/checkin.css";

const url = "https://www.huxgym.codes/user/attendance/checkin/";
const url_checkout = "https://www.huxgym.codes/user/attendance/checkout/";

class Checkin extends Component {
  peticionPost = async () => {
    try {
      var config = {
        method: "post",
        url,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      };
      const res = await axios(config);
      if (res.status === 200 || res.status === 201) {
        const { check_in } = res.data;
        swal({
          text: "Checkin correcto a las " + check_in,
          icon: "success",
          button: "Aceptar",
          timer: "3000",
        });
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: msj,
        icon: "info",
        button: "Aceptar",
        timer: "3000",
      });
    }
  };

  peticionCheckOut = async () => {
    try {
      var config = {
        method: "post",
        url: url_checkout,
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      };
      const res = await axios(config);
      if (res.status === 200 || res.status === 201) {
        const { check_out } = res.data;
        swal({
          text: "Checkout realizado a las " + check_out,
          icon: "success",
          button: "Aceptar",
          timer: "3000",
        });
      }
    } catch (error) {
      const msj = JSON.parse(error.request.response).message;
      console.log(msj);
      swal({
        text: msj,
        icon: "info",
        button: "Aceptar",
        timer: "3000",
      });
    }
  };

  constructor(props) {
    super(props);
    this.state = { date: new Date() };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date(),
    });
  }

  render() {
    return (
      <div className="check">
        <p className="palabra">Realiza tu hora de entrada:</p>
        <p className="palabra">
          La hora actual es:{" "}
          <label>{this.state.date.toLocaleTimeString()} </label>
        </p>
        <button
          variant="success"
          className="btn botonescheck"
          onClick={() => this.peticionPost()}
        >
          Realizar
        </button>
        <p className="palabra">
          Realiza tu hora de salida: La hora actual es:{" "}
          <label>{this.state.date.toLocaleTimeString()} </label>
        </p>
        <button
          variant="sucess"
          className="btn botonescheck"
          onClick={() => this.peticionCheckOut()}
        >
          Realizar
        </button>{" "}
      </div>
    );
  }
}

export default Checkin;