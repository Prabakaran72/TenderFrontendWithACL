import axios from "axios";
import { Fragment } from "react"
import { useBaseUrl } from '../../hooks/useBaseUrl'
import { useEffect } from "react";
import { useState } from "react";

let ResultSet = [                
    {
        name: '',
        id: 0,
        entry: [
            {
                date: 1,
                title: ''
            }
        ]
    },                                                     
];


const AttendenceReportList = ({ employeeOptions, month }) => {
    const { server1: baseUrl } = useBaseUrl();
    const [getEmpOption, setGetEmpOption] = useState([]);
    const [govHoliday, setGovHoliday] = useState([]);   
    const [holiday, setHoliday] = useState([]); 
    // const [input, setInput] = useState({
    //     id: [],
    //     attendanceType: [],
    //     fromDate: [],
    //     toDate: []
    // });
    const [getResult, setGetResult] = useState(ResultSet);


    const daysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

    const monthYear = month.split('-')
    const noOfDays = daysInMonth(monthYear[0], monthYear[1]);

    let dates = []
    for (let day = 1; day <= (noOfDays || 0); day++) {
        dates.push(day)
    }

       
    useEffect(() => {
        axios.post(`${baseUrl}/api/getempleave/list`).then((res) => {
            setGetEmpOption(res.data.userlist);
            setGovHoliday(res.data.holiday);
            console.log('res', res.data);            
            
            let arrId = [];
            let arrName = [];
            let arrAttendanceType = [];
            let arrFromDate = [];
            let arrToDate = [];
            let arrHoliday = [];

            Object.values(res.data.holiday).forEach((holid) => {  
                const getHoliday = holid.date.toString().slice(8,10); 
                const cnvNumber = Number(getHoliday);
                arrHoliday.push(cnvNumber);                     
            })  
            Object.values(res.data.userlist).forEach((user) => {  
                arrId.push(user.id);          
                arrName.push(user.name);
            })  
            Object.values(res.data.result).forEach((user)=> {               
                user.map((item, index) => {                                       
                    arrId.push(item.user_id);                    
                    arrAttendanceType.push(item.attendanceType); 
                    arrFromDate.push(item.from_date.toString().slice(8,10)); 
                    arrToDate.push(item.to_date.toString().slice(8,10)); 

                    console.log('item.from_date',item.from_date)
                })
            })            

            // setGetResult([ {name: arrName, id: arrId, entry: [{date: arrFromDate, title: arrAttendanceType}] } ]);
                       
            const resultArr = [];
            for (let i = 0; i < arrName.length; i++) {                
                resultArr.push({ name: arrName[i], id: arrId[i], entry: [{date: Number(arrFromDate[i]), title: arrAttendanceType[i]}] });          
            }
            setHoliday(arrHoliday);
            setGetResult(resultArr);                        
        })      
    }, [])

    

    const Result = getResult.map((emp, i) => {        
        return (
            <tr key={emp.id}>
                <td>{emp.name}</td>  
                {dates.map((item, index) => (                                             
                    emp.entry.map((ent)=> {                        
                        return (
                            <td key={i}>
                              { holiday.includes(item) ? <i className="fa fa-star yellow" title='Holiday' /> : ent.date === item ? <i className="fa fa-close red" title='Absent'/> : <i className="fa fa-check blue" />}
                            </td>
                        )
                    })
                ))}
            </tr>
        )
    })

    console.log('getResult',getResult);


    // console.log('input', input);
  
    return (
        <Fragment>
            <div className="table-responsive pb-3">
                <table
                    className="table text-center"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                >
                    <thead className="text-center bg-gray-200 text-primary">
                        <tr>
                            <th scope="col">Employee Name</th>
                            {dates.map((item, index) => {
                                return (
                                    <th key={index}>{item}</th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {Result}
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default AttendenceReportList
