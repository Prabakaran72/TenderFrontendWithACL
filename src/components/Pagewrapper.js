import React from "react";
import {  Outlet } from "react-router-dom";
import PreLoader from "./UI/PreLoader";
import { Provider } from "react-redux";
import dashboardStore from './store';

function Pagewrapper(props) {
  return (
   
    <Provider store={dashboardStore}>
    <div className="container-fluid"> 
      {!props.loading && <Outlet />}
    </div>
   </Provider>
  );
}

export default Pagewrapper;
