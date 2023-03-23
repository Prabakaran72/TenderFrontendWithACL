import React, { useEffect, useState, useContext, Fragment } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../storeAuth/auth-context";
import { can } from "./UserPermission";
import { useBaseUrl } from "./hooks/useBaseUrl";
import axios from "axios";
function Sidebar() {
  const [active, setActive] = useState("");
  const { server1: baseUrl } = useBaseUrl();
  const [menus, setMenu] = useState([])

  const pathName = "tender";


  const authData = useContext(AuthContext);
  console.log(authData)
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

  console.log(menus)

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
         <span>{item.name}</span> 
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
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
                to={subMenu.menuLink}
                onClick={() => hideSidebarElement(`${item.name}Menu`)}
              >
                {subMenu.name}
              </NavLink>
              )
            }) }
        </div>
        </div>
        </motion.li>
        </Fragment> )
      })}

      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Dashboard */}
      <motion.li className="nav-item "
        animate={{x:0}} initial={{x:-300}} transition={{type: 'tween', delay: 0.1 }}>
        <Link
          className="nav-link collapsed"
          to="#"
          data-toggle="collapse"
          data-target="#collapseMasterMenu"
          aria-expanded="true"
          aria-controls="collapseMasterMenu"
          id="MasterMenu"
        >
          {/*<i className="fas fa-fw fa-cog" />*/}
          <i className="fa fa-graduation-cap"></i>
          <span>Master</span> 
        </Link>
        <div
          id="collapseMasterMenu"
          className="collapse"
          aria-labelledby="headingThree"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
          <h6 className="collapse-header">Login Screens:</h6>
            {can('userType-list',  authData.permission) && <NavLink
                  className={`collapse-item ${({ isActive }) =>
                    isActive ? "active" : undefined}`}
                  to={`/${pathName}/master/usertype`}
                  onClick={() => hideSidebarElement("MasterMenu")}
                >
                  User Type
                </NavLink>}
            {can('userCreation-list',  authData.permission) && <NavLink
                className={`collapse-item ${({ isActive }) =>
                  isActive ? "active" : undefined}`}
                to={`/${pathName}/master/usercreation`}
                onClick={() => hideSidebarElement("MasterMenu")}
              >
                User Creation
              </NavLink>}
          <h6 className="collapse-header">Other Master:</h6>
           {can('customer-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/customercreation/list`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Customer Creation
            </NavLink>}

           {can('competitor-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/competitorcreation`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Competitor Creation
            </NavLink>}
            {/* <Link className={`collapse-item ${active === "stateMasterTab"? "active":""}`} to={`/${pathName}/master/statemaster`} onClick = {() => hideSidebarElement("MasterMenu", "stateMasterTab")}>
              State Creation
            </Link> */}
            {can('country-list',  authData.permission) &&  <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/countrymaster`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Country Creation
            </NavLink>}
            {can('state-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/statemaster`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              State Creation
            </NavLink>}
            {/* <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/ulbmaster`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              ULB Creation
            </NavLink> */}

           {can('district-list',  authData.permission) &&  <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/districtmaster`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              District Creation
            </NavLink>}
           { can('city-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/citymaster`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              City Creation
            </NavLink>}
           { can('unit-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/unitmaster`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Unit Creation
            </NavLink>}
            {can('projectType-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/projecttype`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Project Type Creation
            </NavLink>}
            {can('projectStatus-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/projectstatus`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Project Status
            </NavLink>}
            {authData.permission.includes("delete") && 
            <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/test`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              ACL TEST COMP
            </NavLink>}
            <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/customersubcategory`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Customer Sub Category
            </NavLink>
           {can('tenderType-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/master/tendertypemaster`}
              onClick={() => hideSidebarElement("MasterMenu")}
            >
              Tender Type Master
            </NavLink>}
            
          </div>
        </div>
      </motion.li>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />
      {/* Nav Item - Pages Collapse Menu */}
      <motion.li className="nav-item"
        animate={{x:0}} initial={{x:-300}} transition={{type: 'tween', delay: 0.2 }}>
        <Link
          className="nav-link collapsed"
          to="#"
          data-toggle="collapse"
          data-target="#collapseTenderMenu"
          aria-expanded="true"
          aria-controls="collapseTenderMenu"
          id="tenderMenu"
        >
          {/*<i className="fas fa-fw fa-cog" />*/}
          <i className="fa fa-gavel"></i>
          <span>Tenders</span>
        </Link>
        <div
          id="collapseTenderMenu"
          className="collapse"
          aria-labelledby="headingTwo"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
            {can('tenderCreation-create',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/tendercreation`}
              onClick={() => hideSidebarElement("tenderMenu")}
            >
              Tender Creation
            </NavLink>}
            {can('bidsManagement-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/bidmanagement/list`}
              onClick={() => hideSidebarElement("tenderMenu")}
            >
              Bid's Management
            </NavLink>}
            {can('tenderTracker-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/tendertracker`}
              onClick={() => hideSidebarElement("tenderMenu")}
            >
              Tender Tracker
            </NavLink>}
            {can('legacyStatment-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/legacystatement`}
              onClick={() => hideSidebarElement("tenderMenu")}
            >
              Legacy Statement
            </NavLink>}
          </div>
        </div>
      </motion.li>


       {/* Divider */}
       <hr className="sidebar-divider my-0" />
      {/* Nav Item - Pages Collapse Menu */}
      <li className="nav-item">
        <Link
          className="nav-link collapsed"
          to="#"
          data-toggle="collapse"
          data-target="#collapseLibraryMenu"
          aria-expanded="true"
          aria-controls="collapseLibraryMenu"
          id="libraryMenu"
        >
          {/*<i className="fas fa-fw fa-cog" />*/}
          <i className="fa fa-book"></i>
          <span className="font-weight-bold ml-1">Library</span>
        </Link>
        <div
          id="collapseLibraryMenu"
          className="collapse"
          aria-labelledby="headingTwo"
          data-parent="#accordionSidebar"
        >
          <div className="bg-white py-2 collapse-inner rounded">
           {can('communicationFiles-list',  authData.permission) && <NavLink
              className={`collapse-item ${({ isActive }) =>
                isActive ? "active" : undefined}`}
              to={`/${pathName}/library/communicationfiles`}
              onClick={() => hideSidebarElement("libraryMenu")}
            >
              Communication Files
            </NavLink>      }     
          </div>
        </div>
      </li>

      <motion.div className="text-center d-none d-md-inline">
        <button className="rounded-circle border-0" id="sidebarToggle"></button>
      </motion.div>
    </ul>
  );
}

export default Sidebar;
