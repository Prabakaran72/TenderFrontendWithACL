import React, { useState, useEffect, useReducer, useRef } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Slider } from "@mui/material";
import Select from "react-select";

const dataValue = [
  { state: "31", count: 5, year: 2021, name: "Tamilnadu" },
  { state: "31", count: 12, year: 2022, name: "Tamilnadu" },
  { state: "31", count: 25, year: 2023, name: "Tamilnadu" },
  { state: "1", count: 1, year: 2021, name: "Delhi" },
  { state: "1", count: 5, year: 2022, name: "Delhi" },
  { state: "1", count: 8, year: 2023, name: "Delhi" },
  { state: "17", count: 10, year: 2021, name: "Karnataka" },
  { state: "17", count: 20, year: 2022, name: "Karnataka" },
  { state: "17", count: 2, year: 2023, name: "Karnataka" },
  { state: "14", count: 0, year: 2021, name: "Himachal Pradesh" },
  { state: "14", count: 20, year: 2022, name: "Himachal Pradesh" },
  { state: "14", count: 45, year: 2023, name: "Himachal Pradesh" },
  { state: "2", count: 12, year: 2021, name: "Andhra pradesh" },
  { state: "2", count: 8, year: 2022, name: "Andhra pradesh" },
  { state: "2", count: 0, year: 2023, name: "Andhra pradesh" },
];

const AreaChart = () => {
  const [options, setOption] = useState([]); // list of values for dropdown
  const [selectedOption, setSelectedOption] = useState(null); // state for selected state id
  const [chartValue, setChartValue] = useState({
    year: [],
    count: [],
  }); // state hold value for chart preparing
  const [yearlysum, setYearlySum] = useState(); // holds [year : {count : value}] =>  [2021 : {count: 10}]
  const [opt, setOpt] = useState({}); // set year options for Chart in x axis
  const [srs, setSrs] = useState([]); // set Customer count options for Chart in y axis
  

  useEffect(() => {
    if (dataValue) {
      setdropdown();
    }
  }, [dataValue, selectedOption]);

  const setdropdown = () => {
    let uniqueList = []; //for Dropdown
    let uniqueYear = []; //for chart x axis
    let yearlyCount = [];
    

    let list = dataValue.forEach((item) => {
      //set Dropdown options
      if (!uniqueList.some((el) => el.value === item.state)) {
        let newArr = { value: item.state, label: item.name };
        uniqueList.push(newArr);
        // y.push(item.count);
      }

      //collect unique Year list
      if (!uniqueYear.some((elem) => elem == item.year)) {
        uniqueYear.push(item.year);
        // x.push(item.year);
      }

      if (!selectedOption) {
        if (uniqueYear.some((elem) => elem == item.year)) {
          yearlyCount[item.year] = {
            count: (yearlyCount[item.year]?.count || 0) + item.count,
          };
        }
      }
      else if ((uniqueYear.some((elem) => elem == item.year ) && item.state == selectedOption)) {
          yearlyCount[item.year] = {
            count: (yearlyCount[item.year]?.count || 0) + item.count,
          };
        
      }
    });
    setYearlySum(yearlyCount);
    setOption(uniqueList);
  };

  //to change Objet to array
  useEffect(() => {
      if (yearlysum) {
      setChartValue({
        year: Object.keys(yearlysum),
        count: Object.values(yearlysum.map((obj) => obj.count)),
      });
    }
  }, [yearlysum]);

  
  useEffect(() => {
    if (chartValue) {
      getOpt();
      getSrs();
    }
  }, [chartValue]);

  const getOpt = () => {
    setOpt({
      chart: {
        id: "area-bar",
      },
      xaxis: {
        categories: chartValue.year,
      },
      title: {
        text: "Customer Analysis",
      },
      noData: {
        text: "Loading...",
      },
    });
  };
  const getSrs = () => {
    setSrs([
      {
        name: "Customers",
        data: chartValue.count,
      },
    ]);
  };

  const handleTypeSelect = (e) => {
    setSelectedOption(e.value);
  };
console.log("selectedOption",selectedOption);
  return (
    <div className="responsive col-log-12">
      <div className="row">
        <div className="col-md-8 d-flex "></div>
        <div className="col-md-4 d-flex align-item-right">
          <div className="col-sm-3 mt-2">State : </div>
          <div className="col-sm-8">
            <Select
              name="stateList"
              id="stateList"
              options={options}
              onChange={handleTypeSelect}
              value={options.filter(e=> e.value === selectedOption)}
            ></Select>
          </div>
        </div>
      </div>

      <div>
        <Chart
          options={opt} 
          series={srs} 
          type="area"
          width="97%"
          height={350}
        />
      </div>
    </div>
  );
};

export default AreaChart;
