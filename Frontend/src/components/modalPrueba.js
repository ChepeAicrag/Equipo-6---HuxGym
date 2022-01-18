

import React, { useEffect, useState } from 'react';


export default function ModalPrueba({ closeModal }) {
  

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <header className="cancelar">
          <button
            type="button"
            className="btn btn-danger"
           
          >
            {" "}
            X{" "}
          </button>
        </header>

        <div className="titulo">
          <h1>Creando bitacoras</h1>
        </div>
        <div className="body">
          <div className="entradas">
            <p className="letra">Matricula :</p>
            <input name="matricula"  className="redondeo"></input>
          </div>

          <div className='entradas'>
            <p className="letra">Folio :</p>
            <input name="folio" className="redondeo" ></input>
          </div>
        </div>
        <div className="footer botones">
          <button
            type="button"
            className="btn btn-outline-light"
            
          >
            Cancel
          </button>
          <button   type="button" className="btn btn-outline-light">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
