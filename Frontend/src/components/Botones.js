import React, { Component } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";
import "../styles/Dashboard.css";
const url = "https://www.huxgym.codes/user/attendance/checkin/";
const urll = "https://www.huxgym.codes/user/attendance/checkout/";

class Botones extends Component {
  peticionPost = async () => {
    /* Son asincronas por que se ejeuctan en segundo plano */
    /* Con esto enviamos los datos al servidor */
    await axios /* a post de parametros le pasamos la url y los datos */
      .post(url, this.state.form)
      .then((reponse) => {
        /* cambiamos el estado de modalInsertar y volvemos a pedir los datos*/
        this.modalInsertar();
        this.peticionGet();
      })
      .catch((error) => {
        console.log(error.message);
      });
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
      <div className="chec">
        <div>
          <button
            variant="success"
            className="btn btn-success"
            onClick={() => this.peticionPost()}>
              Realizar check-in de clientes
          </button>
        </div>
        <br></br>
        <div>
          <Button variant="danger">Ver clientes que estan en el negocio</Button>{" "}
        </div>
      </div>
    );
  }
}

export default Botones;
