import { Link } from "react-router-dom";
import styled from "styled-components";
import { breakpoints as bp } from "../components/navbar/GlobalStyle";
import "../styles/HeaderPerfil.css";

import HeaderPerfil from "./HeaderPerfil";

const Grid = styled.div`
  display: grid;
  background: rgba(26, 61, 99, 1);
  color: rgb(255, 255, 255);
  grid-template-colums: min-content 1fr min-content;
  height: 48px;
  align-itenm: stretch;
  padding: 0 24px;
  > div {
    display: flex;
    align-items: center;
  }
  button {
    white-space: nowrap;
  }
  .nav-toggle {
    pointer-events: none;
    opacity: 0;
    @media (max-width: ${bp.desktop}) {
      opacity: 1;
      pointer-events: all;
    }
  }
`;

function Header({ toggle }) {
  return (
    <Grid>
      <div className="H">
        {/* <HeaderPerfil></HeaderPerfil> */}
      </div>
    </Grid>
  );
}

export default Header;
