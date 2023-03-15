import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../storeAuth/auth-context";
import { useBaseUrl } from "./hooks/useBaseUrl";
import axios from "axios";
import "./logoicon.css";
import { usePageTitle } from "./hooks/usePageTitle";
import { motion } from "framer-motion";

function Dashboard() {
  const authCtx = useContext(AuthContext);

  // const authCtx = useContext(AuthContext);
  const { server1: baseUrl } = useBaseUrl();
  const [Live_tenders_count, setLive_tenders_count] = useState(0);
  const [fresh_tenders_count, setfresh_tenders_count] = useState(0);
  const [awarded_tenders_count, setawarded_tenders_count] = useState(0);
  const [completed_tenders_count, setcompleted_tenders_count] = useState(0);
  const [running_tenders_count, setrunning_tenders_count] = useState(0);
  const [bidanalysis, setbidAnalysis] = useState({
    awarded: 0,
    bid_submitted: 0,
    to_be_opened: 0,
    bid_details: 0,
    in_tech_eval: 0,
    in_fin_eval: 0,
    cancelled: 0,
    retender: 0,
  });

  // url: 'bidcreation/creation/live_tenders'
  usePageTitle("Dashboard");

  useEffect(()=>{
    //Tender Analysis
    axios.get(`${baseUrl}/api/dashboard/tenderanalysis`).then((resp) => {
      console.log("Tender :",resp.data);
    });


  //Customer Analysis
  axios.get(`${baseUrl}/api/dashboard/ulbdetails`).then((resp) => {
    // if(resp.data.awarded_tender_count){
    // console.log("ULB :",resp.data);
    // setawarded_tenders_count(resp.data.awarded_tender_count)
    // }
  });


  //Customer Bid Analysis
  axios.get(`${baseUrl}/api/dashboard/bidanalysis`).then((resp) => {
    if (resp.data.status === 200) {     
      
      // console.log("Bid :", resp.data);

        setbidAnalysis({ awarded : resp.data.awarded.reduce((acc, item) => {
          return acc + item.count;
        },0),
        bid_submitted: resp.data.bid_submitted.reduce((acc, item) => {
          return acc + item.count;
        },0),
        to_be_opened : resp.data.to_be_opened.reduce((acc, item) => {
          return acc + item.count;
        },0),
        bid_details : resp.data.bid_details.reduce((acc, item) => {
          return acc + item.count;
        },0),
        in_tech_eval : resp.data.in_tech_eval.reduce((acc, item) => {
          return acc + item.count;
        },0),
        in_fin_eval : resp.data.in_fin_eval.reduce((acc, item) => {
          return acc + item.count;
        },0),
        cancelled : resp.data.cancelled.reduce((acc, item) => {
          return acc + item.count;
        },0),
        retender : resp.data.retender.reduce((acc, item) => {
          return acc + item.count;
        },0),
      })
    }
  });

  //Dashboard card
  axios
    .get(`${baseUrl}/api/bidcreation/creation/projectstatus`)
    .then((resp) => {
      // if(resp.data.awarded_tender_count){

      if (resp.data.status === 200) {
        resp.data.live_tender_count &&
          setLive_tenders_count(resp.data.live_tender_count);
        resp.data.fresh_tender_count &&
          setfresh_tenders_count(resp.data.fresh_tender_count);
        resp.data.awarded_tender_count &&
          setawarded_tenders_count(resp.data.awarded_tender_count);
        resp.data.completed_tenders_count &&
          setcompleted_tenders_count(resp.data.completed_tenders_count);
        resp.data.running_tenders_count &&
          setrunning_tenders_count(resp.data.running_tenders_count);
      } else {
        console.log("error");
      }

      // setawarded_tenders_count(resp.data.awarded_tender_count)
      // }

      // setcompleted_tenders_count()
    });






  },[])
  // axios
  // .get(`${baseUrl}/api/dashboard/customeranalysis`)
  // .then((resp) => {

  // });
  // console.log("Bidanan - ",bidanalysis);
  return (
    <>
      {/* Page Heading */}

      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <motion.h1
          className="h3 mb-0 text-gray-800"
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
        >
          Dashboard
        </motion.h1>
      </div>

      <div className="row">
        {/* Content Row */}
        <div className="col-xl-4 col-md-6 mb-4">
          <motion.div
            className="card  shadow h-100 py-2 border-left-primary border-3"
            initial={{
              x: 1300,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              type: "tween",
              stiffness: 10,
              duration: 0.5,
            }}
          >
            <div className="card-body ">
              <div className="row no-gutters align-items-center ">
                <div className="col mr-2">
                  <div className="h4 text-xl font-weight-bold text-primary text-uppercase mb-2 text-center">
                    Live Tenders
                  </div>

                  <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                    {Live_tenders_count}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="triangle-live"></div>
                  {/* <i className="fas fa-calendar fa-2x text-gray-300" /> */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <motion.div
            className="card border-left-success shadow h-100 py-2  border-3"
            initial={{
              x: 1300,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              type: "tween",
              stiffness: 10,
              duration: 0.5,
              delay: 0.2,
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="h4 text-xl font-weight-bold text-success text-uppercase mb-2 text-center">
                    Fresh Tenders
                  </div>
                  <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                    {fresh_tenders_count}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="triangle-fresh"></div>
                  {/* <i className="fas fa-clipboard-list fa-2x text-gray-300" /> */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="col-xl-4 col-md-6 mb-4">
          <motion.div
            className="card border-left-info shadow h-100 py-2 triangle-awarded border-3"
            initial={{
              x: 1300,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            transition={{
              type: "tween",
              stiffness: 10,
              duration: 0.5,
              delay: 0.3,
            }}
          >
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="h4 text-xl font-weight-bold text-info text-uppercase mb-2 text-center">
                    Awarded Tenders
                  </div>
                  <div className="h2 mb-0 font-weight-bold text-gray-800 text-center">
                    {awarded_tenders_count}
                  </div>
                </div>
                <div className="col-auto">
                  <div className="triangle-info"></div>
                  {/* <i className="fas fa-clipboard-list fa-2x text-gray-300" /> */}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
