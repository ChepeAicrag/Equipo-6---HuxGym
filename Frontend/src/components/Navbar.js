import React from "react";
import { Link } from "react-router-dom";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import styled from "styled-components";
import Logo from "./navbar/Logo";
import NavLinksGroup from "../components/navbar/NavLinksGroup";
import NavLink from "../components/navbar/NavLink";
import NavToogle from "../components/navbar/NavToggle";
import { breakpoints as bp } from "./navbar/GlobalStyle";
import { useState } from "react";
import BtnLogout from "./BtnLogout";

const StyledNav = styled.nav`
    background: rgba(26, 61, 99, 1);
    width: var(--navbar-width);
    height: 100vh;
    position: sticky;
    top: 0;
    z-index: 1000;
    &::before{
      content: "";
      background-color; rgba(var(--color-secondary-rgb), .2);
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    
    
`;

export default function Navbars(props) {
  return (
    <StyledNav {...props}>
      <Logo />
      <NavLinksGroup />
      <NavLink
      /* to="/Dasboard"
        iconClassName="fas fa-cog"
        label="Dashboard"
        to="/ClientPage"
        iconClassName="fas fa-cog"
        label="Clientes"
        to="/"
        iconClassName="fas fa-cog"
        label="Cerrar Sesion" */
      >
        {/* <BtnLogout /> */}
      </NavLink>
    </StyledNav>
  );
}
