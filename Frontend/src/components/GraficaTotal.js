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
            labels: ["ingreso ventas","gasto compras"],
            datasets:[{
                label:"Totales",
                backgroundColor: ['purple','orange'],
                bordercolor: 'black',
                borderWidth: 1,
                height:'100%',
                with:'30%',
                data: [1,2]//datos que lleva dentro la grafica
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
            <label className="Texto mt-3">Seleccionar orden:</label>
            <div className="SelectorP mt-3">
                    <select className="Opciones" class="form-select" onChange={this.handleChange}>
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
                        id="birthdate"
                        format="yyyy-MM-dd"
                        value={form ? form.birthdate : new Date()}
                        onChange={this.handleDateChange}
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
                        id="birthdate"
                        format="yyyy-MM-dd"
                        value={form ? form.birthdate : new Date()}
                        onChange={this.handleDateChange}
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
