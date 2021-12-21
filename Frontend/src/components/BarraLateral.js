import React, { Component, useState, useEffect } from "react";
import "../styles/BarraL.css";
import { link, NavLink } from "react-router-dom";
import LogoGYM from '../assets/img/log.jpg';
import BtnLogout from "../components/BtnLogout";

const rol = localStorage.getItem("rol");
/* const rol ="Administrador" ; */
const logo = require('../assets/img/log.jpg');
export default function BarraLateral() {
  /* constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  } */
  useEffect(() => {
    return () => {
      
    };
  }, []);
  return (
    <>
      <div className="principalLateral">
        <div className="sidebar">
        <div className="imgLogo">
          <img className="iml" src={LogoGYM} width="100%" height="100%"/>
        </div>
        {/* <p className="mt-4 tituloB"></p> */}
       
          {/* <ul className="mt-3 nav_list"> */}
          <ul className="nav_list">
            <li>
              <NavLink to="/Dashboard" activeClass="active">
                <i className="bx bx-grid-alt">
                  <box-icon
                    name="home"
                    type="solid"
                    color="#000"
                    animation="tada"
                  ></box-icon>
                </i>
                <span className=" links_names">
                  <p className="opcionBarra"> Dashboard</p>
                </span>
              </NavLink>
            </li>
            <div>
              
            </div>
            <li>
            <NavLink to="/ClientPage" activeClass="active">
              <i className="bx bxs-user">
                <box-icon
                  type="solid"
                  name="user"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">
              <p className="opcionBarra"> Clientes</p>
              </span>
            </NavLink>
          </li>
          {rol == "Administrador" ? (
            <li>
              <NavLink to="/EmployeePage">
                <i className="bx bx-book-content">
                  <box-icon
                    type="solid"
                    name="user"
                    color="#000"
                    animation="tada"
                  ></box-icon>
                </i>
                <span className="links_names">
                <p className="opcionBarra"> Empleados</p>
                </span>
              </NavLink>
            </li>
          ) : (
            <></>
          )}
          <li>
            <NavLink to="/MembershipPage">
              <i className="bx bxs-credit-card-front">
                <box-icon
                  name="credit-card-front"
                  type="solid"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">
              <p className="opcionBarra"> Membresias</p>
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/SalesPage">
              <i className="bx bx-purchase-tag-alt">
                <box-icon
                  name="purchase-tag-alt"
                  type="solid"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">
              <p className="opcionBarra"> Ventas</p>
              </span>
            </NavLink>
          </li>
           <li>
            <NavLink to="/ProductsPage">
              <i className="bx bxl-product-hunt">
                <box-icon
                  name="package"
                  color="#000"
                  type="solid"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">
              <p className="opcionBarra"> Productos</p>
              </span>
            </NavLink>
          </li> 
         {rol == "Administrador" || rol == "Encargado" ? (
            <li>
              <NavLink to="/PurchPage">
                <i className="bx bxs-cart">
                  <box-icon
                    name="cart"
                    type="solid"
                    color="#000"
                    animation="tada"
                  ></box-icon>
                </i>
                <span className="links_names">
                <p className="opcionBarra"> Compras</p>
                </span>
              </NavLink>
            </li>
          ) : (
            <></>
          )}
          
          
          {/* { rol == "Administrador" ? ( <> 
           { <li>
            <NavLink to="/AccountingPage">
              <i className="bx bxs-coin-stack">
                <box-icon
                  name="coin-stack"
                  type="solid"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">
              <p className="opcionBarra"> Contabilidad</p>
              </span>
            </NavLink>
          </li> }  </>):(<></>)} */}
          </ul>
        </div>
      </div> 
      {/* <div className="principalLateral">
      <div className="sidebar">
        <ul className="nav_list">
          <li>
            <NavLink to="/Dashboard" activeClass="active">
              <i className="bx bx-grid-alt">
                <box-icon
                  name="home"
                  type="solid"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/ClientPage" activeClass="active">
              <i className="bx bxs-user">
                <box-icon
                  type="solid"
                  name="user"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">Clientes</span>
            </NavLink>
           </li>
          {rol == "Administrador" ? (
            <li>
              <NavLink to="/EmployeePage">
                <i className="bx bxs-user">
                  <box-icon
                    type="solid"
                    name="user"
                    color="#000"
                    animation="tada"
                  ></box-icon>
                </i>
                <span className="links_names">Empleados</span>
              </NavLink>
            </li>
          ) : (
            <></>
          )}

          <li>
            <NavLink to="/MembershipPage">
              <i className="bx bxs-credit-card-front">
                <box-icon
                  name="credit-card-front"
                  type="solid"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">Membresias</span>
            </NavLink>
          </li>


          <li>
            <NavLink to="/SalesPage">
              <i className="bx bx-purchase-tag-alt">
                <box-icon
                  name="purchase-tag-alt"
                  type="solid"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">Ventas</span>
            </NavLink>
          </li>


          <li>
            <NavLink to="/ProductsPage">
              <i className="bx bxl-product-hunt">
                <box-icon
                  name="package"
                  color="#000"
                  type="solid"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">Productos</span>
            </NavLink>
          </li>

          {rol == "Administrador" || rol == "Encargado" ? (
            <li>
              <NavLink to="/PurchPage">
                <i className="bx bxs-cart">
                  <box-icon
                    name="cart"
                    type="solid"
                    color="#000"
                    animation="tada"
                  ></box-icon>
                </i>
                <span className="links_names">Compras</span>
              </NavLink>
            </li>
          ) : (
            <></>
          )}


         {rol == "Administrador" ? ( <> <li>
            <NavLink to="/AccountingPage">
              <i className="bx bxs-coin-stack">
                <box-icon
                  name="coin-stack"
                  type="solid"
                  color="#000"
                  animation="tada"
                ></box-icon>
              </i>
              <span className="links_names">Contabilidad</span>
            </NavLink>
          </li>  </>):(<></>)}
          
        </ul>
      </div>
    </div> */}
    </>
  );
}
