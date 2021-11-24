import React, { Component } from "react";
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const url_caja = "https://www.huxgym.codes/user/cash-register/";

class Grafica extends Component {
  state = {
    gra1: "ddd",
    data: {
      labels: [
        "Total de Ventas",
        "Total de Compras",
        "Total de cambio dado",
        "Total de cantidad en caja",
      ],
      datasets: [
        {
          label: "Ejemplo",
          backgroundColor: "rgba(0,255,0,1)",
          borderColor: "black",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(0,255,0,0.2)",
          hoverBorderColor: "#FF0000",
          data: [300, 120, 300, 120],
        },
      ],
    },
    opciones: {
      maintainAspectRatio: false,
      responsive: true,
    },
    formCash: {
      efeInicial: 0,
      efeVentas: "",
      gasCompras: "",
      efeIngresado: "",
      efeFinal: "",
      observations: "",
    },
  };

  peticionGetCash = async () => {
    try {
      const res = await axios.get(url_caja, {
        headers: {
          Authorization: "Token " + localStorage.getItem("token"),
        },
      });
      /* console.log(res); */
      if (res.status === 200 || res.status === 201) {
        console.log(this.state.data.datasets[0].data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { formCash } = this.state;
    return (
      <>
        <div className="Grafic">
          {" "}
          <Bar data={this.state.data} options={this.state.opciones} />
        </div>
      </>
    );
  }
}

export default Grafica;
