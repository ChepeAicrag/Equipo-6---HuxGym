import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BotonGrafics from "../components/BotonGrafics";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {Bar} from 'react-chartjs-2'
import DateFnsUtils from "@date-io/date-fns";
import "../styles/GraficaTotal.css";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from "@material-ui/pickers";

import { isEmpty } from "../helpers/methods";

class GraficaTotal extends Component{
    
    state = {
        selectedOption: null
    };
    handleChange = selectedOption => {
        this.setState({ selectedOption });
    };

    render(){
        const { form } = this.state;
        const data={
            labels: ["Personas que compran","Personas que no compran"],
            datasets:[{
                label:"Productos",
                backgroundColor: ['purple','orange'],
                bordercolor: 'black',
                borderWidth: 1,
                height:'100%',
                with:'30%',
                data: [1,2]
            }]
        };
        const opciones={
            /* maintainAspectsRatio: false, */
            indexAxis:'y',
            responsive: true
        }
        return(
            <><div className="table-responsive-main">
                <div className="Barra_opciones mt-3">
                    <BotonGrafics />
                </div>
            </div><br />
            <div className="SelectorWrapperAsistencia">
                <label className="Texto">Tipo de persona</label>
                <div className="SelectorP">
                    <select className="Opciones" class="form-select" onChange={this.handleChange}/> 
                </div>
                <label className="Texto">Genero</label>
                <div className="SelectorP">
                    <select className="Opciones" class="form-select" onChange={this.handleChange}/> 
                </div>
                <label className="Texto">Edad</label>
                <div className="SelectorEdad">
                    <select className="Opciones" class="form-select" onChange={this.handleChange}/> 
                </div>
                <div className="Selector">
                    <select className="fechas" class="form-select" onChange={this.handleChange}/> 
                </div>
            </div>
            <div className="GraficaWrapper">
                <div className="Grafica">
                    <Bar data={data} options={opciones}/>
                </div>
            </div>
            </>
        );
    }
};

export default GraficaTotal;
