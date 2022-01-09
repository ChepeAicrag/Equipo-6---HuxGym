import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import PasswordResetPage from "../pages/PasswordResetPage";
import PasswordChangePage from "../pages/PasswordChangePage";

import NotFoundPage from "../pages/NotFoundPage";
import ProfilePage from "../pages/ProfilePage";
import HomePage from "../pages/HomePage";
import Barra_Lateral from "../pages/Barra_Lateral";
import Dashboard from "../pages/Dashboard";
import Sidebar from "../components/Sidebar";
import Pruebas from "../pages/Pruebas";
import ClientPage from "../pages/ClientPage";
import EmployeePage from "../pages/EmployeePage";
import Login from "../components/Login";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import ExitPage from "../pages/ExitPage";
import MembershipsPage from "../pages/MembershipsPage";

import ClientPageClinic from "../pages/ClientPageClinic";
import ProvidersPage from "../pages/ProvidersPage";
import CategoriesPage from "../pages/CategoriesPage";
import ProductsPage from "../pages/ProductsPage";
import SalesPage from "../pages/SalesPage";
import PurchPage from "../pages/PurchPage";
import AccountingPage from "../pages/AccountingPage";
import ExpensePage from "../pages/ExpensePage";
import IncomePage from "../pages/IncomePage";
import Grafics from "../pages/Grafics";

export default function AppRouter() {
  return (
    <Router >
      <Switch>
        {/* <Route exact path="/" exact render={(props) => <Login {...props} />} /> */}

        <PublicRoute
          exact
          path="/password_reset"
          component={PasswordResetPage}
        />

        <PrivateRoute path="/Dashboard" component={Dashboard} />

        <PrivateRoute path="/ClientPage" component={ClientPage} />

        <PrivateRoute path="/ClientPageClinic" component={ClientPageClinic} />

        <PrivateRoute path="/EmployeePage" component={EmployeePage} />

        <PrivateRoute path="/ProductsPage" component={ProductsPage} />

        <PrivateRoute path="/MembershipPage" component={MembershipsPage} />

        <PrivateRoute path="/ProvidersPage" component={ProvidersPage} />

        <PrivateRoute path="/CategoriesPage" component={CategoriesPage} />

        <PrivateRoute path="/SalesPage" component={SalesPage} />

        <PrivateRoute path="/PurchPage" component={PurchPage} />

        <PrivateRoute path="/AccountingPage" component={AccountingPage} />

        <PrivateRoute path="/ExpensePage" component={ExpensePage} />

        <PrivateRoute path="/IncomePage" component={IncomePage} />

        <PrivateRoute path="/Grafics" component={Grafics} />

        {/* <Route exact path="/Sidebar" component={Sidebar} />

        <Route exact path="/Pruebas" component={Pruebas} /> */}

        <PublicRoute exact path="/" component={Login} />

        <Route path="*" component={NotFoundPage} />

        
      </Switch>
    </Router>
  );
}
