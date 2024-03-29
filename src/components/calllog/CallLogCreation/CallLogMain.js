import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Fragment, useContext } from "react"
import CallLogDashboard from "./CallLogDashboard";
import CallLogMainList from "./CallLogMainList";
import CallLogCreation from "./CallLogCreation";

import "./../../logoicon.css";
const CallLogMain = () => {
  return (

    <Fragment>
       <CallLogDashboard />
      {/* Page Heading */}
      <div className="CallLogMain">
        <motion.div className="card shadow mb-4"
           initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
          <div className="card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="float-right">
                <Link  
                    to="callcreation/callDetails"
                    className="btn btn-primary btn-icon-split"
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text res-720-btn-none">New</span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-12">
              <CallLogMainList />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default CallLogMain;
