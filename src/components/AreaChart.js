import React, { useState, useEffect, useReducer } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Slider } from '@mui/material';



const AreaChart = () => {

  const [opt, setOpt] = useState({});
  const [srs, setSrs] = useState([]);
  const [tamilnadu, setTamilnadu] = useState([]);
  const [karnataka, setKarnataka] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [all, setAll] = useState([]);

  const [value,setValue] = useState([]);
 

  const years = [];  
  const customers = [];
  const states = [];

 
function handleChange(e) {
  if(e.target.value === '31') {
    setTamilnadu(states);
  }
  else if(e.target.value === '17') 
  {
    setKarnataka(states);
  }
  if(e.target.value === '1') {
    setUnknown(states);
  }
  else if(e.target.value === '100') 
  {
    setAll(states);
  }

}

  
useEffect(()=>{
  // const update_CA = () => {   
  //Customer Bid Analysis
//  axios.get(`http://192.168.1.31:8000/api/dashboard/bidanalysis`).then((resp) => {

  let TN = 0;
  let KA = 0;
  let UN = 0;


  let TN_count = 0;
  let KA_count = 0;
  let UN_count = 0;
  
  const dataValue = [
    { state: 31, count: 5, year: 2021 },
    { state: 31, count: 12, year: 2022 },
    { state: 31, count: 25, year: 2023 },
    { state: 1, count: 1, year: 2021 },
    { state: 1, count: 5, year: 2022 },
    { state: 1, count: 8, year: 2023 },
    { state: 17, count: 10, year: 2021 },
    { state: 17, count: 20, year: 2022 },
    { state: 17, count: 2, year: 2023 },
  ];  
  
  // const val1 = dataValue[0].find((e)=> e.state === 31)
  // const val2 = dataValue[1].find((e)=> e.state === 31)
  // const val3 = dataValue[2].find((e)=> e.state === 31)

  const val1 = dataValue[0]['count'];
  const val2 = dataValue[1]['count'];
  const val3 = dataValue[2]['count'];
  const val4 = dataValue[3]['count'];
  const val5 = dataValue[4]['count'];
  const val6 = dataValue[5]['count'];
  const val7 = dataValue[6]['count'];
  const val8 = dataValue[7]['count'];
  const val9 = dataValue[8]['count'];

  const st31_tn1 = val1;
  const st31_tn2 = val2;
  const st31_tn3 = val3;

  const st17_ka1 = val4;
  const st17_ka2 = val5;
  const st17_ka3 = val6;

  const st1_un1 = val7;
  const st1_un2 = val8;
  const st1_un3 = val9;

  const TN_counts_of_all_year =  TN_count += st31_tn1 + st31_tn2 + st31_tn3;
  const KA_counts_of_all_year =  KA_count += st17_ka1 + st17_ka2 + st17_ka3;
  const UN_counts_of_all_year =  UN_count += st1_un1 + st1_un2 + st1_un3;
  console.log('TN_counts_of_all_year',TN_counts_of_all_year);
  console.log('KA_counts_of_all_year',KA_counts_of_all_year);
  console.log('UN_counts_of_all_year',UN_counts_of_all_year);
  // console.log('s_tn',st31_tn);
  // console.log('s_tn',st31_ka);
  // console.log('s_tn',st31_un);

  const st1 = dataValue[0]["count"];
  const st2 = dataValue[3]["count"];
  const st3 = dataValue[6]["count"];

  const st4 = dataValue[1]["count"];
  const st5 = dataValue[4]["count"];
  const st6 = dataValue[7]["count"];

  const st7 = dataValue[2]["count"];
  const st8 = dataValue[5]["count"];
  const st9 = dataValue[8]["count"];


  const y21 = dataValue[0]["year"];
  const y22 = dataValue[1]["year"];
  const y23 = dataValue[2]["year"];

  const state31 = [st1,st2,st3];
  const state1 = [st4,st5,st6];
  const state17 = [st7,st8,st9];

  const yr = [y21,y22,y23];
  console.log('dataVal',yr);
    
    TN += st1+st2+st3;
    UN += st4+st5+st6;
    KA += st7+st8+st9;


  console.log('TN',TN,UN,KA); 
  states.push(st31_tn1,st31_tn2,st31_tn3);
  years.push(y21,y22,y23);

  getOpt();
  getSrs();
// }
// return () => update_CA();
},[tamilnadu]);
 
useEffect(()=>{
  // const update_CA = () => {   
  //Customer Bid Analysis
//  axios.get(`http://192.168.1.31:8000/api/dashboard/bidanalysis`).then((resp) => {

  let TN = 0;
  let KA = 0;
  let UN = 0;


  let TN_count = 0;
  let KA_count = 0;
  let UN_count = 0;
  
  const dataValue = [
    { state: 31, count: 5, year: 2021 },
    { state: 31, count: 12, year: 2022 },
    { state: 31, count: 25, year: 2023 },
    { state: 1, count: 1, year: 2021 },
    { state: 1, count: 5, year: 2022 },
    { state: 1, count: 8, year: 2023 },
    { state: 17, count: 10, year: 2021 },
    { state: 17, count: 20, year: 2022 },
    { state: 17, count: 2, year: 2023 },
  ];  
  
  // const val1 = dataValue[0].find((e)=> e.state === 31)
  // const val2 = dataValue[1].find((e)=> e.state === 31)
  // const val3 = dataValue[2].find((e)=> e.state === 31)

  const val1 = dataValue[0]['count'];
  const val2 = dataValue[1]['count'];
  const val3 = dataValue[2]['count'];
  const val4 = dataValue[3]['count'];
  const val5 = dataValue[4]['count'];
  const val6 = dataValue[5]['count'];
  const val7 = dataValue[6]['count'];
  const val8 = dataValue[7]['count'];
  const val9 = dataValue[8]['count'];

  const st31_tn1 = val1;
  const st31_tn2 = val2;
  const st31_tn3 = val3;

  const st17_ka1 = val4;
  const st17_ka2 = val5;
  const st17_ka3 = val6;

  const st1_un1 = val7;
  const st1_un2 = val8;
  const st1_un3 = val9;

  const TN_counts_of_all_year =  TN_count += st31_tn1 + st31_tn2 + st31_tn3;
  const KA_counts_of_all_year =  KA_count += st17_ka1 + st17_ka2 + st17_ka3;
  const UN_counts_of_all_year =  UN_count += st1_un1 + st1_un2 + st1_un3;
  console.log('TN_counts_of_all_year',TN_counts_of_all_year);
  console.log('KA_counts_of_all_year',KA_counts_of_all_year);
  console.log('UN_counts_of_all_year',UN_counts_of_all_year);
  // console.log('s_tn',st31_tn);
  // console.log('s_tn',st31_ka);
  // console.log('s_tn',st31_un);

  const st1 = dataValue[0]["count"];
  const st2 = dataValue[3]["count"];
  const st3 = dataValue[6]["count"];

  const st4 = dataValue[1]["count"];
  const st5 = dataValue[4]["count"];
  const st6 = dataValue[7]["count"];

  const st7 = dataValue[2]["count"];
  const st8 = dataValue[5]["count"];
  const st9 = dataValue[8]["count"];


  const y21 = dataValue[0]["year"];
  const y22 = dataValue[1]["year"];
  const y23 = dataValue[2]["year"];

  const state31 = [st1,st2,st3];
  const state1 = [st4,st5,st6];
  const state17 = [st7,st8,st9];

  const yr = [y21,y22,y23];
  console.log('dataVal',yr);

    // TN += st1+st2+st3;
    // UN += st4+st5+st6;
    // KA += st7+st8+st9;

    TN += st1+st2+st3;
    UN += st4+st5+st6;
    KA += st7+st8+st9;


  console.log('TN',TN,UN,KA); 
  states.push(st17_ka1,st17_ka2,st17_ka3);
  years.push(y21,y22,y23);

  getOpt();
  getSrs();
// }
// return () => update_CA();
},[karnataka]);

useEffect(()=>{
  // const update_CA = () => {   
  //Customer Bid Analysis
//  axios.get(`http://192.168.1.31:8000/api/dashboard/bidanalysis`).then((resp) => {

  let TN = 0;
  let KA = 0;
  let UN = 0;


  let TN_count = 0;
  let KA_count = 0;
  let UN_count = 0;
  
  const dataValue = [
    { state: 31, count: 5, year: 2021 },
    { state: 31, count: 12, year: 2022 },
    { state: 31, count: 25, year: 2023 },
    { state: 1, count: 1, year: 2021 },
    { state: 1, count: 5, year: 2022 },
    { state: 1, count: 8, year: 2023 },
    { state: 17, count: 10, year: 2021 },
    { state: 17, count: 20, year: 2022 },
    { state: 17, count: 2, year: 2023 },
  ];  
  
  // const val1 = dataValue[0].find((e)=> e.state === 31)
  // const val2 = dataValue[1].find((e)=> e.state === 31)
  // const val3 = dataValue[2].find((e)=> e.state === 31)

  const val1 = dataValue[0]['count'];
  const val2 = dataValue[1]['count'];
  const val3 = dataValue[2]['count'];
  const val4 = dataValue[3]['count'];
  const val5 = dataValue[4]['count'];
  const val6 = dataValue[5]['count'];
  const val7 = dataValue[6]['count'];
  const val8 = dataValue[7]['count'];
  const val9 = dataValue[8]['count'];

  const st31_tn1 = val1;
  const st31_tn2 = val2;
  const st31_tn3 = val3;

  const st17_ka1 = val4;
  const st17_ka2 = val5;
  const st17_ka3 = val6;

  const st1_un1 = val7;
  const st1_un2 = val8;
  const st1_un3 = val9;

  const TN_counts_of_all_year =  TN_count += st31_tn1 + st31_tn2 + st31_tn3;
  const KA_counts_of_all_year =  KA_count += st17_ka1 + st17_ka2 + st17_ka3;
  const UN_counts_of_all_year =  UN_count += st1_un1 + st1_un2 + st1_un3;
  console.log('TN_counts_of_all_year',TN_counts_of_all_year);
  console.log('KA_counts_of_all_year',KA_counts_of_all_year);
  console.log('UN_counts_of_all_year',UN_counts_of_all_year);
  // console.log('s_tn',st31_tn);
  // console.log('s_tn',st31_ka);
  // console.log('s_tn',st31_un);

  const st1 = dataValue[0]["count"];
  const st2 = dataValue[3]["count"];
  const st3 = dataValue[6]["count"];

  const st4 = dataValue[1]["count"];
  const st5 = dataValue[4]["count"];
  const st6 = dataValue[7]["count"];

  const st7 = dataValue[2]["count"];
  const st8 = dataValue[5]["count"];
  const st9 = dataValue[8]["count"];


  const y21 = dataValue[0]["year"];
  const y22 = dataValue[1]["year"];
  const y23 = dataValue[2]["year"];

  const state31 = [st1,st2,st3];
  const state1 = [st4,st5,st6];
  const state17 = [st7,st8,st9];

  const yr = [y21,y22,y23];
  console.log('dataVal',yr);

    // TN += st1+st2+st3;
    // UN += st4+st5+st6;
    // KA += st7+st8+st9;

    TN += st1+st2+st3;
    UN += st4+st5+st6;
    KA += st7+st8+st9;


  console.log('TN',TN,UN,KA); 
  states.push(st1_un1,st1_un2,st1_un3);
  years.push(y21,y22,y23);

  getOpt();
  getSrs();
// }
// return () => update_CA();
},[unknown]);

useEffect(()=>{
  const CA = () => {   
  //Customer Bid Analysis
//  axios.get(`http://192.168.1.31:8000/api/dashboard/bidanalysis`).then((resp) => {
  let TN = 0;
  let UN = 0;
  let KA = 0;

  
  const dataValue = [
    { state: 31, count: 5, year: 2021 },
    { state: 31, count: 12, year: 2022 },
    { state: 31, count: 25, year: 2023 },
    { state: 1, count: 1, year: 2021 },
    { state: 1, count: 5, year: 2022 },
    { state: 1, count: 8, year: 2023 },
    { state: 17, count: 10, year: 2021 },
    { state: 17, count: 20, year: 2022 },
    { state: 17, count: 2, year: 2023 },
  ];  
  
  const st1 = dataValue[0]["count"];
  const st2 = dataValue[3]["count"];
  const st3 = dataValue[6]["count"];

  const st4 = dataValue[1]["count"];
  const st5 = dataValue[4]["count"];
  const st6 = dataValue[7]["count"];

  const st7 = dataValue[2]["count"];
  const st8 = dataValue[5]["count"];
  const st9 = dataValue[8]["count"];


  const y21 = dataValue[0]["year"];
  const y22 = dataValue[1]["year"];
  const y23 = dataValue[2]["year"];

  const state31 = [st1,st2,st3];
  const state1 = [st4,st5,st6];
  const state17 = [st7,st8,st9];

  const yr = [y21,y22,y23];
  console.log('dataVal',yr);

    // TN += st1+st2+st3;
    // UN += st4+st5+st6;
    // KA += st7+st8+st9;

    TN += st1+st2+st3;
    UN += st4+st5+st6;
    KA += st7+st8+st9;


  console.log('TN',TN,UN,KA); 
  states.push(TN,UN,KA);
  years.push(y21,y22,y23);

  
//   dataValue.map(d=>{       
//     const filteredResult = dataValue.find((e) => e.state === 31);
//     console.log('filteredResult',filteredResult);    
//       years.push(d.year);
//       customers.push(d.count);          
//       states.push(d.state);      
// })
  
  // if (resp.data.status === 200) {     
    
    // console.log("Bid :", resp.data);   
      // setData({ dataValue : dataValue.reduce((acc, item) => {        
      //   return acc + item.state;
      // },0),
      // bid_submitted: resp.data.bid_submitted.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // to_be_opened : resp.data.to_be_opened.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // bid_details : resp.data.bid_details.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // in_tech_eval : resp.data.in_tech_eval.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // in_fin_eval : resp.data.in_fin_eval.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // cancelled : resp.data.cancelled.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // retender : resp.data.retender.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
    // })
    // const pop = data.dataValue;
    // console.log('dataValue2',data.dataValue);
  // }
  getOpt();
  getSrs();
}
return () => CA();
},[all]);
  
useEffect(()=>{
  const CA = () => {   
  //Customer Bid Analysis
//  axios.get(`http://192.168.1.31:8000/api/dashboard/bidanalysis`).then((resp) => {
  let TN = 0;
  let UN = 0;
  let KA = 0;

  
  const dataValue = [
    { state: 31, count: 5, year: 2021 },
    { state: 31, count: 12, year: 2022 },
    { state: 31, count: 25, year: 2023 },
    { state: 1, count: 1, year: 2021 },
    { state: 1, count: 5, year: 2022 },
    { state: 1, count: 8, year: 2023 },
    { state: 17, count: 10, year: 2021 },
    { state: 17, count: 20, year: 2022 },
    { state: 17, count: 2, year: 2023 },
  ];  
  
  const st1 = dataValue[0]["count"];
  const st2 = dataValue[3]["count"];
  const st3 = dataValue[6]["count"];

  const st4 = dataValue[1]["count"];
  const st5 = dataValue[4]["count"];
  const st6 = dataValue[7]["count"];

  const st7 = dataValue[2]["count"];
  const st8 = dataValue[5]["count"];
  const st9 = dataValue[8]["count"];


  const y21 = dataValue[0]["year"];
  const y22 = dataValue[1]["year"];
  const y23 = dataValue[2]["year"];

  const state31 = [st1,st2,st3];
  const state1 = [st4,st5,st6];
  const state17 = [st7,st8,st9];

  const yr = [y21,y22,y23];
  console.log('dataVal',yr);

    // TN += st1+st2+st3;
    // UN += st4+st5+st6;
    // KA += st7+st8+st9;

    TN += st1+st2+st3;
    UN += st4+st5+st6;
    KA += st7+st8+st9;


  console.log('TN',TN,UN,KA); 
  states.push(TN,UN,KA);
  years.push(y21,y22,y23);

  
//   dataValue.map(d=>{       
//     const filteredResult = dataValue.find((e) => e.state === 31);
//     console.log('filteredResult',filteredResult);    
//       years.push(d.year);
//       customers.push(d.count);          
//       states.push(d.state);      
// })
  
  // if (resp.data.status === 200) {     
    
    // console.log("Bid :", resp.data);   
      // setData({ dataValue : dataValue.reduce((acc, item) => {        
      //   return acc + item.state;
      // },0),
      // bid_submitted: resp.data.bid_submitted.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // to_be_opened : resp.data.to_be_opened.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // bid_details : resp.data.bid_details.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // in_tech_eval : resp.data.in_tech_eval.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // in_fin_eval : resp.data.in_fin_eval.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // cancelled : resp.data.cancelled.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
      // retender : resp.data.retender.reduce((acc, item) => {
      //   return acc + item.count;
      // },0),
    // })
    // const pop = data.dataValue;
    // console.log('dataValue2',data.dataValue);
  // }
  getOpt();
  getSrs();
}
return () => CA();
},[]);

const getOpt = () => {
  setOpt({
    chart: {
      id: "area-bar",                      
    },                                     
    xaxis: {                 
      categories: years,              
    },              
    title: {
      text: "Customer Analysis",
    },
    noData: {
      text: "Loading...",
    },
  });   
}
const getSrs = () => {
  setSrs([
    {
      name: "Customers",
      data: states,
    }    
  ])   
}



  return (
    <>
        <div className="areaMap">
          <select onChange={handleChange}>
            <option value={100}>All States</option>
            <option value={31}>Tamilnadu</option>
            <option value={17}>Karnataka</option>
            <option value={1}>Other State</option>
          </select>
        </div>
        <Chart
          options={opt}
          series={srs}
          type="area"
          width='100%'
          height={350}
        />
     
    </>
  )
}

export default AreaChart