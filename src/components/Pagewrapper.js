import React from "react";
import {  Outlet } from "react-router-dom";
import PreLoader from "./UI/PreLoader";



function Pagewrapper(props) {
  return (
   

    <div className="container-fluid"> 
      {!props.loading && <Outlet />}
    </div>
   
  );
}

export default Pagewrapper;
