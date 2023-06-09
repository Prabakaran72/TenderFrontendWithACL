import axios from "axios";
import { Fragment } from "react";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useEffect } from "react";
import { useState } from "react";

let ResultSet = [
  {
    name: "",
    id: 1,
    entry: [
      {
        date: 1,
        attendance_type_id: "",
        icon: "",
        title: "",
        from_date: "10",
        to_datte: "12",
      },
    ],
  },
];

let iconSet = [{}];

const AttendenceReportList = ({ employeeOptions, month, selectedMonth }) => {
  const { server1: baseUrl } = useBaseUrl();
  const [getEmpOption, setGetEmpOption] = useState([]);
  const [govHoliday, setGovHoliday] = useState([]);
  const [holiday, setHoliday] = useState([]);
  const [getResult, setGetResult] = useState([]);

  const daysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const monthYear = month.split("-");
  const noOfDays = daysInMonth(monthYear[0], monthYear[1]);

  let dates = [];
  for (let day = 1; day <= (noOfDays || 0); day++) {
    dates.push(day);
  }

  useEffect(() => {
    axios.post(`${baseUrl}/api/getempleave/list`).then((res) => {
      setGetEmpOption(res.data.userlist);
      setGovHoliday(res.data.holiday);
      console.log("res", res.data);

      let arrId = [];
      let arrName = [];
      let arrAttendanceType = [];
      let arrFromDate = [];
      let arrToDate = [];
      let arrHoliday = [];

      let holidayDateArr = Object.values(res.data.holiday).map((row) => {
        let rowDate = row.date.split("-")[row.date.split("-").length - 1];
        return { ...row, dateValue: rowDate };
      });

      let resultDateArr = Object.values(res.data.result).map((row) => {
        const getResultObj = Object.values(row).map((data) => {
          let fromDate =
            data.from_date.split("-")[data.from_date.split("-").length - 1];
          let toDate =
            data.to_date.split("-")[data.to_date.split("-").length - 1];
          return { ...data, fromDateValue: fromDate, toDateValue: toDate };
        });
        return [...getResultObj];
      });

      console.log("resultDateArr: ", resultDateArr);

      const TodayDate = new Date();
      const year = TodayDate.getFullYear();
      const month = String(TodayDate.getMonth() + 1).padStart(2, "0");
      const day = String(TodayDate.getDate()).padStart(2, "0");
      const currentDate = `${year}-${month}-${day}`;
      const currentMonth = `${year}-${month}`; // compare with selected Dropdown value
      console.log("holidayDateArr",holidayDateArr);
      const Result12 = Object.values(res.data.userlist).map((emp, i) => {
        //emp - > indivudial customer id , name
        let outputObj = { id: emp.id, name: emp.name };
        let entryArr = [];

        dates.map((date) => {
          let isDateHoliday = holidayDateArr.find(
            (hday) => hday.dateValue == date
          );

      console.log("isDateHoliday", isDateHoliday ? true : false);
          if (isDateHoliday) {
            let title = holidayDateArr.find((hday) => hday.dateValue == date);
            entryArr[date - 1] = {
              attendanceType: 0,
              attendanceTypeID: 0,
              fromDay: date,
              toDay: date,
              fromDate: title?.from_date ? title?.from_date : null,
              toDate: title?.to_date ? title?.to_date : null,
              // 'fromDate' : date,
              // 'toDate' : date,
              icon: title?.icon_class ? title?.icon_class : "fas fa-star",
              title: title.occasion,
            };
            // console.log('entryArr: ',entryArr)
          } else {
            //if has result has entry on this date
            // entry
            let dateExistInResult = false;
            let rowData = "";
            resultDateArr.forEach((entry) => {
              Object.values(entry).forEach((row) => {
                if (
                  row.user_id == emp.id &&
                  row.fromDateValue <= date &&
                  row.toDateValue >= date
                ) {
                  dateExistInResult = true;
                  rowData = row;
                }
              });
            });

            // if (dateExistInResult) {
            //   entryArr[date - 1] = {
            //     attendanceType: rowData.attendanceType,
            //     attendanceTypeID: rowData.attendance_type_id,
            //     // 'fromDate' : date,
            //     // 'toDate' : date,
            //     fromDay: date,
            //     toDay: date,
            //     fromDate: rowData?.from_date ? rowData?.from_date : null,
            //     toDate: rowData?.to_date ? rowData?.to_date : null,
            //     icon: rowData?.icon_class
            //       ? rowData?.icon_class
            //       : "fa fa-star-o text-info",
            //     title: rowData?.reason ? rowData.reason : "Not updated",
            //   };
            // } else {
              // let title = holidayDateArr.find((hday) =>  hday.dateValue == date);
              // if(currentDate >= rowData?.from_date || currentDate >= rowData?.to_date || currentDate >= date || currentMonth )

              if (selectedMonth == currentMonth) {
                if (date > day) {
                  entryArr[date - 1] = {
                    attendanceType: null,
                    attendanceTypeID: null,
                    // 'fromDate' : date,
                    // 'toDate' : date,
                    fromDay: date,
                    toDay: date,
                    fromDate: rowData?.from_date ? rowData?.from_date : null,
                    toDate: rowData?.to_date ? rowData?.to_date : null,
                    icon: "",
                    title: "-",
                  };
                } else {
                    if (dateExistInResult) {
                        entryArr[date - 1] = {
                          attendanceType: rowData.attendanceType,
                          attendanceTypeID: rowData.attendance_type_id,
                          // 'fromDate' : date,
                          // 'toDate' : date,
                          fromDay: date,
                          toDay: date,
                          fromDate: rowData?.from_date ? rowData?.from_date : null,
                          toDate: rowData?.to_date ? rowData?.to_date : null,
                          icon: rowData?.icon_class
                            ? rowData?.icon_class
                            // : "fa fa-star-o text-info",
                            : "fa fa-star-o text-info",
                          title: rowData?.attendanceType ? rowData?.attendanceType : rowData.reason ? rowData.reason  : "Not updated",
                        }
                    }
                        else{
                            entryArr[date-1] =  {
                                'attendanceType' : 0,
                                'attendanceTypeID' : 0,
                                // 'fromDate' : date,
                                // 'toDate' : date,
                                'fromDay' : date,
                                'toDay' : date,
                                'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
                                'toDate' : rowData?.to_date ? rowData?.toDate : null,
                                'icon' : 'fas fa-check text-success',
                                'title' : "Present"
                                }
                  }
                }
              } else if (selectedMonth < currentMonth) {
                if (dateExistInResult) {
                    entryArr[date - 1] = {
                      attendanceType: rowData.attendanceType,
                      attendanceTypeID: rowData.attendance_type_id,
                      // 'fromDate' : date,
                      // 'toDate' : date,
                      fromDay: date,
                      toDay: date,
                      fromDate: rowData?.from_date ? rowData?.from_date : null,
                      toDate: rowData?.to_date ? rowData?.to_date : null,
                      icon: rowData?.icon_class
                        ? rowData?.icon_class
                        : "fa fa-star-o text-info",
                        title: rowData?.attendanceType ? rowData?.attendanceType : rowData.reason ? rowData.reason  : "Not updated"
                    }
                }
                    else{
                        entryArr[date-1] =  {
                            'attendanceType' : 0,
                            'attendanceTypeID' : 0,
                            // 'fromDate' : date,
                            // 'toDate' : date,
                            'fromDay' : date,
                            'toDay' : date,
                            'fromDate' : rowData?.from_date ? rowData?.from_date  : null,
                            'toDate' : rowData?.to_date ? rowData?.toDate : null,
                            'icon' : 'fas fa-check',
                            'title' : "Present"
                            }
              }
              } else if (selectedMonth > currentMonth) {
                entryArr[date - 1] = {
                  attendanceType: null,
                  attendanceTypeID: null,
                  // 'fromDate' : date,
                  // 'toDate' : date,
                  fromDay: date,
                  toDay: date,
                  fromDate: rowData?.from_date ? rowData?.from_date : null,
                  toDate: rowData?.to_date ? rowData?.to_date : null,
                  icon: "",
                  title: "-",
                };
              }
            }
        //   }
        });

        let NonentryArr = entryArr.filter(
          (x) => x !== null && x !== "" && x != undefined
        );
        return { ...outputObj, entry: entryArr };
      });

      console.log("Month $$$$", month);
      console.log("currentDate $$$$", currentDate);
      console.log("Current Month $$$$", selectedMonth);
      console.log("Result12", Result12);

    //   Object.values(res.data.holiday).forEach((holid) => {
    //     const getHoliday = holid.date.toString().slice(8, 10);
    //     const cnvNumber = Number(getHoliday);
    //     arrHoliday.push(cnvNumber);
    //   });
    //   Object.values(res.data.userlist).forEach((user) => {
    //     arrId.push(user.id);
    //     arrName.push(user.name);
    //   });
    //   let resultObj = [];
    //   Object.values(res.data.result).forEach((user) => {
    //     user.map((item, index) => {
    //       arrId.push(item.user_id);
    //       arrAttendanceType.push(item.attendanceType);
    //       arrFromDate.push(item.from_date.toString().slice(8, 10));
    //       arrToDate.push(item.to_date.toString().slice(8, 10));
    //       let userName = res.data.userlist.find((x) => x.id == item.user_id);
    //       let getFromDate = item.from_date.toString().slice(8, 10);
    //       let getToDate = item.to_date.toString().slice(8, 10);
    //       let cvrFromNumber = Number(getFromDate);
    //       let cvrToNumber = Number(getToDate);

    //       let rowObj = {
    //         // 'id': item.user_id,
    //         name: userName?.name ? userName?.name : " - ",
    //         attendanceType: item.attendanceType,
    //         attendanceTypeID: item.attendance_type_id,
    //         fromDate: cvrFromNumber,
    //         toDate: cvrToNumber,
    //         icon: "fas fa-close",
    //         title: item.reason,
    //       };
    //     });
    //   });

    //   console.log("resultObj", resultObj);

      const resultArr = [];
      for (let i = 0; i < arrName.length; i++) {
        resultArr.push({
          name: arrName[i],
          id: arrId[i],
          entry: [
            { date: Number(arrFromDate[i]), title: arrAttendanceType[i] },
          ],
        });
      }
      setHoliday(arrHoliday);
      setGetResult(Result12);
    });
  }, []);

  const Result = Object.values(getResult).map((emp, i) => {
    console.log("emp", emp);
    return (
      <tr key={`${emp.id}`}>
        <td>{emp?.name}</td>
        {emp.entry.map((entry, index) => (
          <td key={index}>
            {entry.icon !="" ? <i className={entry.icon} aria-hidden="true" title={entry.title}></i> : "-" }
          </td>
        ))}
      </tr>
    );
  });


  return (
    <Fragment>
      <div className="table-responsive">
        <table
          className="table table-bordered text-center"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center bg-greeny text-white">
            <tr>
              <th scope="col">Employee Name</th>
              {dates.map((item, index) => {
                return <th key={index}>{item}</th>;
              })}
            </tr>
          </thead>
          <tbody>{Result}</tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default AttendenceReportList;
