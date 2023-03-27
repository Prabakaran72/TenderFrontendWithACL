import React, { useEffect, useState, useContext, Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../storeAuth/auth-context";
import { useBaseUrl } from "./hooks/useBaseUrl";
import axios from "axios";

function Sidebar() {
  const [active, setActive] = useState("");
  const { server1: baseUrl } = useBaseUrl();
  const [menus, setMenu] = useState([])

  const pathName = "tender";


  const permission = useContext(AuthContext);
  // console.log(authData)
  const hideSidebarElement = (menuId, tab) => {
    document.getElementById(menuId).click();
    setActive(tab);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "js/sb-admin-2.min.js";
    document.body.appendChild(script);
    return () => {
      // clean up the script when the component in unmounted
      document.body.removeChild(script);
    };
  }, []);


  useEffect(() => {
    axios.get(`${baseUrl}/api/menus`).then((response) => {
      // console.log(response.data.menuList)
      setMenu(response.data.menuList || [])
    });
  }, [])

  
  return (
    <ul
      className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion SideNav"
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <motion.span
      initial={{opacity: 0}}
      animate={{opacity: 1}} 
        // to="/"
        className="sidebar-brand d-flex align-items-center justify-content-center brand"
      >
        <div className="sidebar-brand-icon">
          <img
            src="assets/icons/logo.png"
            width="70"
            height="70"
            className="icon"
            alt="..."
          />
        </div>
        <div className="sidebar-brand-text mx-3">Zigma</div>
      </motion.span>
      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <motion.li className="nav-item" 
        animate={{x:0}} initial={{x:-300}} transition={{type: 'tween'  }}>
        <Link className="nav-link" to="/tender">
          {/*<i className="fas fa-fw fa-tachometer-alt" />*/}
          <i className="fa fa-laptop"></i>
          <span className="font-weight-bold ml-1">Dashboard</span>
        </Link>
      </motion.li>
      {/* $$$$ */}
     
      {menus.map((item,index) => {
       
       return (
        <Fragment key={index}>

        <hr className="sidebar-divider my-0" />
        <motion.li className="nav-item "
        animate={{x:0}} initial={{x:-300}} transition={{type: 'tween', delay: 0.1 }}>
        <Link
        className="nav-link collapsed"
        to="#"
        data-toggle="collapse"
        data-target={`#collapse${item.name}Menu`}
        aria-expanded="true"
        aria-controls={`collapse${item.name}Menu`}
        id={`${item.name}Menu`}
        >
         <i className={item.icoClass}></i>
         <span>{item.aliasName}</span> 
        </Link>
        <div
          id={`collapse${item.name}Menu`}
          className="collapse"
          data-parent="#accordionSidebar"
        >
        <div className="bg-white py-2 collapse-inner rounded">  
            {item.sub_menus.map((subMenu, i)=> {
              
              return(
        
              <NavLink
                key={index+""+i}
                className={`collapse-item ${({ isActive }) => isActive ? "active" : undefined}`}
                to={subMenu.menuLink}
                onClick={() => hideSidebarElement(`${item.name}Menu`)}
              >
               {subMenu.aliasName}   
              </NavLink>
              )
            }) }
        </div>

        </div>
        </motion.li>
        </Fragment> )
      })}

      <motion.div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </motion.div>
    </ul>
  );
}

export default Sidebar;
