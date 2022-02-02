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
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {Bar} from 'react-chartjs-2'
import DateFnsUtils from "@date-io/date-fns";
//import "../styles/GraficaTotal.css";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from "@material-ui/pickers";

import { isEmpty } from "../helpers/methods";
const url ="https://www.api.huxgym.codes/reports/employees/";
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

function obtenerTotales(data){
    let nuevo=data.map(dato=>{
        return(dato.total)
    })
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

function getEmpleados(data){
    let nuevo=data.map(dato=>{
        return(dato)
    })
    return nuevo;
}
class GraficaTotal extends Component{
    
    state = {
        fechaInicial:new Date(),
        fechaFinal:new Date(),
        order:"",
        selectedOption: "",
        data:[],
        etiquetas:[],
    };

    handleChange = async selectedOption => {
        await this.setState({ selectedOption: selectedOption.target.value});
        this.peticionGet();
    };

    handleFechaInicial = async(e) => {
        await this.setState({
          fechaInicial:e,
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
        data.append('first_date', getDate(this.state.fechaInicial ));
        data.append('last_date',getDate( this.state.fechaFinal));
        data.append('order', this.state.selectedOption);
        
        var config = {
        method: 'POST',
        url: "https://www.api.huxgym.codes/reports/employees/",
        headers: { 
                /* Allow:"GET, OPTIONS", */
        },
        data : data
        };
        
        axios(config)
        .then( res=>{
            console.log(res);
            this.setState({
                data:Object.values(res.data.total),
                etiquetas:Object.keys(res.data.total),
            });
            console.log(Object.values(this.state.data));
        })
        .catch( error=>{ 
            this.setState({
                data:[]
            });
            console.log(error);
        });
    };

    render(){
        const { form } = this.state;
        const data={
            labels: this.state.etiquetas,
            datasets:[{
                label:"Total",
                backgroundColor: '#e312a1',
                bordercolor: 'black',
                borderWidth: 1,
                height:'100%',
                with:'30%',
                data:this.state.data
            }]
        };
        const opciones={
            /* maintainAspectsRatio: false, */
            indexAxis:'x',
            responsive: true, 
            plugins: {
                title: {
                  display: true,
                  text: (ctx) => "VENTAS POR EMPLEADOS",
                },
                tooltip: {
                  mode: "index",
                },
              },
              scales: {
                x: {
                  title: {
                    display: true,
                    text: "EMPLEADO",
                  },
                },
                y: {
                  stacked: true,
                  title: {
                    display: true,
                    text: "CANTIDADES",
                  },
                },
              },
        }
        return(
            <><div className="table-responsive-main">
                <div className="Barra_opciones mt-3">
                    <BotonGrafics />
                </div>
            </div><br />
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
