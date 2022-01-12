import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "../styles/checkin.css";
function Grafica_Barras() {
  const [Ventas, setVentas] = useState([]);
  const [Compras, setCompras] = useState([]);
  const [Cambio, setCambio] = useState([]);
  const [Caja, setCaja] = useState([]);

  const data = {
    labels: [
      "Total de Ventas",
      "Total de Compras",
      "Total de cambio dado",
      "Total de cantidad en caja",
    ],
    datasets: [
      {
        label: "Estadisticas Generales",
        backgroundColor: "rgba(0,255,0,1)",
        borderColor: "black",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(0,255,0,0.2)",
        hoverBorderColor: "#FF0000",
        data: [Compras, Ventas, Cambio, Caja],
      },
    ],
  };
  const opciones = {
    maintainAspectRatio: false,
    responsive: true,
  };
  const peticion = async () => {
    try {
      const res = await axios.get(
        "https://www.huxgym.codes/user/cash-register/",
        {
          headers: {
            Authorization: "Token " + localStorage.getItem("token"),
          },
        }
      );
      /* console.log(res); */
      if (res.status === 200 || res.status === 201) {
        console.log(res);
        var auxCompras = "",
          auxVentas = "",
          auxCambio = "",
          auxCaja = "";

        auxCompras = res.data.cash_register.amount_sell;
        auxVentas = res.data.cash_register.amount_purchase;
        auxCambio = res.data.cash_register.cambio;
        auxCaja = res.data.cash_register.cash_end;
        console.log(auxCompras);
        setCompras(auxCompras);
        setVentas(auxVentas);
        setCambio(auxCambio);
        setCaja(auxCaja);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    peticion();
  }, []);
  return (
    <div className="Grafic" Style={{ with: "100%", height: "500px" }}>
      <Bar data={data} options={opciones} />
    </div>
  );
}
export default Grafica_Barras;
