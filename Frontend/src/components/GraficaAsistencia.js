import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import TextField from '@material-ui/core/TextField';
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import InputAdornment from '@mui/material/InputAdornment';
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BotonGrafics from "../components/BotonGrafics";
import ToggleButton from 'react-toggle-button';
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
import { toggleButtonClasses } from "@mui/material";
const url ="https://www.huxgym.codes/reports/purchases/";
const materialTheme = createMuiTheme({ 
    palette: {
        background: {
            paper: '#EDEDED',
            default: '#1b1a17',
        },
        text: {
          default: '#072227',
        },
        textColor: '#000',
        primary: {
          main: '#000',
        },
        secondary: {
            main: "#0000"
          },
    }
});
function obtnerDate(date) {
    let fecha = new Date(date);
    console.log(fecha);
    let year = fecha.getFullYear();
    let mounth = fecha.getUTCMonth() + 1;
    let day = fecha.getDate();
    if (mounth < 10) {
      mounth = "0" + mounth;
    }
    console.log(mounth + "aqui es");
    return year + "-" + mounth + "-" + day;
}

class GraficaTotal extends Component{
    
    state = {
        fechaInicial:new Date(),
        fechaFinal:new Date(),
        selectedOption: "",
        estudiante:false,
        data:[0,0],
        etiquetas:[],
        tipo:""
    }

    handleChange = async selectedOption => {
        await this.setState({ selectedOption: selectedOption.target.value });
        this.peticionGet();
    };

    handleFechaInicial = async(e) => {
        await this.setState({
          fechaInicial:e,
        });
        this.peticionGet();
    };

    handleEstudiante = async(e) => {
        console.log("estudiante "+e)
        await this.setState({
          estudiante:!e,
        });
        this.peticionGet();
    };


    handleFechaFinal = async (e) => {
        await this.setState({
            fechaFinal:e,
        });
        this.peticionGet();
    };

    peticionGet = async () => { 
        var FormData = require('form-data');
        var data = new FormData();
        data.append('first_date', obtnerDate(this.state.fechaInicial ));
        data.append('last_date',obtnerDate( this.state.fechaFinal));
        data.append('option', this.state.selectedOption);
        let value="";
        if (this.state.estudiante)value="yes";
        else value ="no";
        data.append('student', value);
        
        var config = {
        method: 'POST',
        url: 'https://www.huxgym.codes/reports/attendence/',
        headers: { 
                /* Allow:"GET, OPTIONS", */
        },
        data : data
        };
        
        axios(config)
        .then( res=>{
            console.log(res);
            if(res.data.message!=="Filtrado por edad"){
                this.setState({
                    data:[res.data.M,res.data.F],
                    etiquetas:["Hombres", "Mujeres"],
                    tipo:"Asistencia segun el género"
                });
            }else{
                this.setState({
                    data:res.data.total,
                    etiquetas:["10-19 años", "20-29 años","30-39 años","40-49 años","50-59 años","60-69 años","70-79 años"],
                    tipo:"Asistencia segun el género"
                });
            }
            console.log(this.state.data);
        
        })
        .catch(function (error) {
        console.log(error);
        });
    };

    render(){
        const { form } = this.state;
        const data={
            labels: this.state.etiquetas,
            datasets:[{
                label:this.state.tipo,
                backgroundColor: ['pink'],
                bordercolor: 'black',
                borderWidth: 1,
                height:'100%',
                with:'30%',
                data: this.state.data //datos que lleva dentro la grafica
            }]
        };
        const tipoPersonas=["Clientes","Empleados"];
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
                <label className="Texto">Filtro</label>
                <div className="SelectorP">
                    <select className="Opciones" class="form-select" onChange={this.handleChange}> 
                        <option selected>--Selecciona--</option>
                        <option value="gender">Género</option>
                        <option value="age">Edad</option>
                    </select> 
                </div>
                <label className="Texto">Estudante</label>
                <ToggleButton inactiveLabel={"No"} activeLabel={"Si"} value={this.state.estudiante} onToggle={this.handleEstudiante} />
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
                        value={ this.state.fechaInicial}
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
