import React from "react";
import { Redirect, Route } from "react-router-dom";
/* const user = null; */
const token = localStorage.getItem("token") || "";

export default function PublicRoute({ component: Component, ...rest }) {
  return (
    <Route {...rest}>
      {token != "" ? <Redirect to="/Dashboard" /> : <Component />}
    </Route>
  );
}
