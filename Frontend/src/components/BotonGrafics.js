import React from "react";
import "../styles/BotonProducts.css";
import { NavLink, Link } from "react-router-dom";

export default function BotonGrafics(){
    return(
        <>
            <ul class="nav nav-tabs mt-2" id="myTab" role="tablist">
                <li class="nav-item espaciado">
                    <NavLink className="letra nav-link btn contenedor2" to="/Grafics" activeClass="btn contenedor active">
                        Compra Productos 
                    </NavLink>
                </li>
                <li class="nav-item espaciado">
                    <NavLink className="letra nav-link btn contenedor2" to="/GraficsAsistencia" activeClass="btn contenedor active">
                        Asistencias
                    </NavLink>
                </li>
                <li class="nav-item espaciado">
                    <NavLink className="letra nav-link btn contenedor2" to="/GraficsVentasP" activeClass="btn contenedor active">
                        Venta de productos
                    </NavLink> 
                </li>
                <li class="nav-item espaciado">
                    <NavLink className="letra nav-link btn contenedor2" to="/GraficsVentasM" activeClass="btn contenedor active">
                        Venta de membresias
                    </NavLink> 
                </li>
                <li class="nav-item espaciado">
                    <NavLink className="letra nav-link btn contenedor2" to="/GraficsCompras" activeClass="btn contenedor active">
                        Compras
                    </NavLink> 
                </li>
                {/* <li class="nav-item espaciado">
                    <NavLink className="letra nav-link btn contenedor2" to="/GraficsCliente" activeClass="btn contenedor active">
                        Cliente
                    </NavLink> 
                </li> */}
                <li class="nav-item espaciado">
                    <NavLink className="letra nav-link btn contenedor2" to="/GraficsEmpleado" activeClass="btn contenedor active">
                        Empleado
                    </NavLink> 
                </li>
            </ul>
        </>
    )
}