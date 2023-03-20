import React, { useState, useEffect, useReducer } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { useBaseUrl } from "./hooks/useBaseUrl";
import { Slider } from "@mui/material";

const AreaChart = () => {
  const { server1: baseUrl } = useBaseUrl();

  const [options1, setOptions1] = useState({});
  const [series1, setSeries1] = useState([]);

  const year = [];
  const count1 = [];
  const countVal = [];
  const countVal_bidS = [];
  const countVal_bidD = [];
  const countVal_opened = [];
  const countVal_inTechEval = [];
  const countVal_inFinEval = [];
  const countVal_cancelled = [];
  const countVal_retender = [];

  // Customer Analysis
  let total = 0;
  let bidS_total = 0;
  let bidD_total = 0;
  let toBeOpened_total = 0;
  let inTechEval_total = 0;
  let inFinEval_total = 0;
  let cancelled_total = 0;
  let retender_total = 0;

  useEffect(() => {
    // const ulbDetails = () => {
    axios.get(`${baseUrl}/api/dashboard/bidanalysis`).then((res) => {
      // setBool(res.data.list);
      // console.log(res.data.awarded);
      {
        res.data.awarded.map((award) => {
          year.push(award.year);
          count1.push(award.count);
          total += award.count;
        });
        countVal.push(total);
      }
      {
        res.data.bid_submitted.map((bidS) => {
          bidS_total += bidS.count;
        });
        countVal_bidS.push(bidS_total);
      }
      {
        res.data.bid_details.map((bidD) => {
          bidD_total += bidD.count;
        });
        countVal_bidD.push(bidD_total);
      }
      {
        res.data.to_be_opened.map((opened) => {
          toBeOpened_total += opened.count;
        });
        countVal_opened.push(toBeOpened_total);
      }
      {
        res.data.in_tech_eval.map((techE) => {
          inTechEval_total += techE.count;
        });
        countVal_inTechEval.push(inTechEval_total);
      }
      {
        res.data.in_fin_eval.map((finE) => {
          inFinEval_total += finE.count;
        });
        countVal_inFinEval.push(inFinEval_total);
      }
      {
        res.data.cancelled.map((cancel) => {
          cancelled_total += cancel.count;
        });
        countVal_cancelled.push(cancelled_total);
      }
      {
        res.data.retender.map((retender) => {
          retender_total += retender.count;
        });
        countVal_retender.push(retender_total);
      }

      setOptions1({
        chart: {
          id: "basic-bar",
        },
        // colors: ['#252525','#ccc','ddd'],
        xaxis: {
          labels: {
            rotate: 270,
            borderColor: "#00E396",
          },
          categories: year,
        },
        title: {
          text: "Customer Analysis",
        },
        noData: {
          text: "Loading...",
        },
      });
      setSeries1([
        {
          name: "Awarded",
          data: countVal,
        },
        {
          name: "Bid Submitted",
          data: countVal_bidS,
        },
        {
          name: "Bid Details",
          data: countVal_bidD,
        },
        {
          name: "To Be Opened",
          data: countVal_opened,
        },
        {
          name: "Technical Eval",
          data: countVal_inTechEval,
        },
        {
          name: "Financial Eval",
          data: countVal_inFinEval,
        },
        {
          name: "Cancelled",
          data: countVal_cancelled,
        },
        {
          name: "Retender",
          data: countVal_retender,
        },
      ]);
    });
    // };
    // return () => ulbDetails();
  }, []);

  return (
    <>
      <Chart
        options={options1}
        series={series1}
        type="area"
        width="100%"
        height={450}
      />
    </>
  );
};

export default AreaChart;
