import React from "react";
import { Redirect, Route } from "react-router-dom";
import axios from "axios";
const baseUrl = "https://www.api.huxgym.codes/profile/";

/* const user = null; */
var acceder = false

const confirm_login = async() => {
  try {
    const res = await axios.get(baseUrl, {
      headers: {
        Authorization: "Token " + localStorage.getItem("token"),
      },
    })
    acceder = (res.status === 200 || res.status === 201)
  } catch (error) {
    acceder =  false
  }
}

const token = localStorage.getItem("token") || "";

export default function PrivateRoute ({ component: Component, ...rest }) {
  /* const { user } = useAuth(); */ /* AzE */
  // const x = confirm_login;
  return <Route {...rest}>{token  ? <Component /> : <Redirect to="/" />}</Route>;
}
