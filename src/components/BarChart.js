import React, { useState, useEffect, useReducer } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import { Slider } from "@mui/material";

function BarChart(props) {
  const [chartValue, setChartValue] = useState();
  const [options, setOptions] = useState({});
  const [series, setSeries] = useState([]);

  const [val, setVal] = useState({ start: [], end: [] });
  const [states ,setStates] = useState([]);
  const [counts ,setCounts] = useState([]);

  const state = [];
  const statename = [];
  const count = [];
  const countryId = [];
  const id = [];
  const pop = [];


  useEffect(() => {
    let total = 0;
    // const ulbDetails = () => {
      axios
        .get("http://192.168.1.31:8000/api/dashboard/ulbdetails")
        .then((res) => {
          //   setBool(res.data.list);
          // console.log(res.data);
          setChartValue(res.data.list);

          res.data.list.map((lis) => {          
            state.push(lis.state_code);
            statename.push(lis.state_name);
            count.push(lis.count);          
            id.push(lis.id);          
          });

          setVal({
            start: 10,
            end: total,
          });
          // console.log('total', total);

          setChart();
        //   check &&
        //     setSeries([
        //       {
        //         name: "Count_No",
        //         data: count,
        //       },
        //     ]);

          //   { checky &&
          //     setSeries([
          //     {
          //       name: "Count",
          //       data: [
          //         {
          //           x: 'Andra',
          //           y: count[0],
          //           goals: [
          //             {
          //               name: 'City',
          //               value: id[0],

          //             },
          //           ]
          //         },
          //       ],
          //     },
          //     // {
          //     //   name: "id",
          //     //   data: id,
          //     // }
          //   ])
          //   }

          //   { checky &&
          //     setSeries([
          //     {
          //       name: "count",
          //       data: count,
          //     },
          //   ])
          //   }
        });
    // };
    // return () => ulbDetails();
  }, []);

  const setChart = () => {
    setOptions({
      chart: {
        id: "basic-bar",
        stacked: true,
        // stackType: '100%'
      },
      colors: ['#619c23','#252525'],
      plotOptions: {
        bar: {
          // horizontal: true
        },
      },
      legend: {
        position: "right",
        verticalAlign: "top",
        containerMargin: {
          left: 35,
          right: 60,
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              bar: {
                horizontal: false,
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      xaxis: {
        labels: {
          rotate: 270,
          borderColor: "#00E396",
        },
        markers: {
          size: 6,
          strokeWidth: 3,
          fillOpacity: 0,
          strokeOpacity: 0,
          hover: {
            size: 8,
          },
        },
        categories: state,
      },
      // tooltip: {
      //   custom: function ({ series, seriesIndex, dataPointIndex, w }) {
      //     return (
      //       '<div class="arrow_box">' +
      //       '<div class="card">' +
      //       '<div class="card-header">' +
      //       "<h5>" +
      //       w.globals.labels[dataPointIndex] +
      //       " : " +
      //       series[seriesIndex][dataPointIndex] +
      //       "</h5>" +
      //       "</div>" +
      //       '<div class="card-body">' +
      //       "<h5>" +
      //       "Population" +
      //       " : " +
      //       pop[0] +
      //       "<h5>" +
      //       "</div>" +
      //       "</div>" +
      //       "</div>"
      //     );
      //   },
      // },
      title: {
        text: "ULB DETAILS",
      },
      noData: {
        text: "Loading...",
      },
    });

    setSeries([
      {
        name: "Count_No",
        data: count,
      },
    ]);
  };

  
  const unit = ["0", "100000", "300000", "500000", "1000000", "2000000"];

  useEffect(() => {
    chartValue &&
      chartValue.map((lis) => {
        let start = unit[props.value[0]];
        let end = unit[props.value[1]];
        // let end = unit[props.value[1]] === 6 ? '+' : '';
        // console.log("start", start)
        // console.log("End", end)

        // console.log("lis.population2011 >= unit[props.value[0]]", lis.population2011 >= unit[props.value[0]]);
        // console.log("lis.population2011 >= unit[props.value[0]] - 1)", lis.population2011 >= unit[props.value[0]] - 1);
        // console.log(" lis.population2011 <= unit[props.value[1]]",  lis.population2011 <= unit[props.value[1]]);
        // console.log("lis.population2011 >= unit[props.value[1] - 1]", lis.population2011 >= unit[props.value[1] - 1]);
        console.log(lis.state_code);
        console.log("lis.population2011", lis.population2011);
        console.log("props.value[0]",props.value[0]);
        console.log("lis.population2011",lis.population2011);
        console.log("unit[props.value[0]]",unit[props.value[0]]);
        console.log("props.value[1]",props.value[1]);
        console.log("unit[props.value[1]]",unit[props.value[1]]);
        console.log("unit[props.value[1]]",unit[props.value[1]-1]);
        console.log("----");
        

        if ((
          (props.value[0] < 6
            ? lis.population2011 >= unit[props.value[0]]
            : lis.population2011 >= unit[props.value[0]] - 1) &&
          (props.value[1] < 6
            ? lis.population2011 <= unit[props.value[1]]
            : lis.population2011 >= unit[props.value[1] - 1]) || (props.value[1] === 6 && (props.value[0] <6 ? lis.population2011 >= unit[props.value[0]] : lis.population2011 >= unit[props.value[0]-1] )))
        ) {
            // console.log("lis.id", lis.id);
                  state.push(lis.state_code);
                  
                  count.push(lis.count);
                  // console.log('changes',state);                                   
        }
      });
      setChart();
      console.log('Final States ',state);  
  }, [props]);

  return (
    <>    
      <div className="responsive">
        <Chart
          options={options}
          series={series}
          type="bar"
          width='100%'
          height={450}
        />
      </div>
    </>
  );
}

export default BarChart;
