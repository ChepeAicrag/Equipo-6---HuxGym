import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Crud.css";
import axios from "axios";
import swal from "sweetalert";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import BotonGrafics from "../components/BotonGrafics";

import {Bar} from 'react-chartjs-2'
import DateFnsUtils from "@date-io/date-fns";
import  "../styles/GraficaTotal.css";
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
  } from "@material-ui/pickers";

import { isEmpty } from "../helpers/methods";
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

function obtenerTotales(data){
    let nuevo=data.map(dato=>{
        return(dato.total)
    })
    console.log(nuevo)
    return nuevo;
}

function obtenerCategorias(data){
    let nuevo=data.map(dato=>{
        return(dato.name)
    })
    console.log(nuevo)
    return nuevo;
}
class GraficaTotal extends Component{

    state = {
        fechaInicial:new Date(),
        fechaFinal:new Date(),
        order:"",
        selectedOption: "",
        data:[],
    }
    
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
    
   

    handleChange = async selectedOption => {
        await this.setState({ selectedOption: selectedOption.target.value});
        //this.peticionGet(selectedOption.target);
        this.peticionGet();
    };

    peticionGet = async () => {
        /* let fechaI=obtnerDate(this.state.fechaInicial);
        let fechaF=obtnerDate(this.state.fechaFinal);
        let orden=obtnerDate(this.state.selectedOption);
        console.log(value)
        if(value.name==="selectedOption"){
            orden=value.value;
        } 
        if(value.name==="fechaInicial"){
            fechaI=value.value;
        }
        if(value.name==="fechaFinal"){
            fechaF=value.value;
        } */
        
        var FormData = require('form-data');
        var data = new FormData();
        /* data.append('first_date',fechaI );
        data.append('last_date', fechaF);
        data.append('order', orden); */
        data.append('first_date', obtnerDate(this.state.fechaInicial ));
        data.append('last_date',obtnerDate( this.state.fechaFinal));
        data.append('order', this.state.selectedOption);
        
        var config = {
        method: 'POST',
        url: 'https://www.huxgym.codes/reports/purchases/',
        headers: { 
                /* Allow:"GET, OPTIONS", */
        },
        data : data
        };
        
        axios(config)
        .then( res=>{
            console.log(res);
            this.setState({
                data:res.data.products,
            });
        
        })
        .catch(function (error) {
        console.log(error);
        });
    };



    render(){
        const { form } = this.state;
        const data={
            labels:  obtenerCategorias(this.state.data),
            datasets:[{
                label:["Compra de productos"],
                backgroundColor: ['purple'],
                bordercolor: 'black',
                borderWidth: 1,
                height:'100%',
                with:'30%',
                data: obtenerTotales(this.state.data)//datos que lleva dentro la grafica
            }]
        };
        const opciones={
            /* maintainAspectsRatio: false, */
            
            responsive: true
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
            <div className="GraficaWrapper mt-2">
                <div className="Grafica">
                    <Bar data={data} options={opciones}/>
                </div>
            </div>
            </>
        );
    }
};

export default GraficaTotal;
