import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import TimeField from "react-simple-timefield";
import TextField from '@material-ui/core/TextField';
import swal from "sweetalert";
import { isEmpty } from "../helpers/methods";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";


const base_url = "https://www.huxgym.codes/";


class BtnMembresia extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        data: [] /* Aqui se almacena toda la informacion axios */,
        body: [],
        list: [],
        customer_id: this.props.id_cliente,
        form: {
          /* Aqui guardaremos los datos que el usuario introduce en el formulario modal 1*/
          customer_id: this.props.id_cliente,
          id: "",
          customer_name: "",
        },
       
      };

      render() {
        return (
            <>
                <div>
                    <button type="button" class="btn btn-light">Detalles Membresia</button>
                </div>
            </>
        );

      }


}

export default BtnMembresia;