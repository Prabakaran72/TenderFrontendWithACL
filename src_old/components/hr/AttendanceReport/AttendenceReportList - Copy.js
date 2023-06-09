import axios from "axios";
import { Fragment } from "react"
import { useBaseUrl } from '../../hooks/useBaseUrl'
import { useEffect } from "react";
import { useState } from "react";

const AttendenceReportList = ({employeeOptions,month}) => {
    const {server1: baseUrl} = useBaseUrl();
    const [getEmpOption, setGetEmpOption] = useState([]);
    const [govHoliday, setGovHoliday] = useState([]);   
    const [num, setNum] = useState([]);
    const [leaveDate, setLeaveDate] = useState([]);    
    const [input, setInput] = useState({
        id: [],
        attendanceType : [],
        fromDate : [],
        toDate : []
    });    

    const daysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
    }

    const monthYear = month.split('-')
    const noOfDays = daysInMonth(monthYear[0], monthYear[1]);

    let dates = []
    for (let day = 1; day <= (noOfDays || 0); day++) {
        dates.push(day)
    }    
    

    useEffect(()=> {                       
        axios.post(`${baseUrl}/api/getempleave/list`).then((res)=> {
            setGetEmpOption(res.data.userlist);
            setGovHoliday(res.data.holiday);
            console.log('res',res.data);

            let ResultSet = [];
             Object.keys(res.data.userlist).forEach((user)=>{
                //user - Key : {id,name}
                let UserWiseSet = dates.map((date)=>{
                                                                        
                })

            })
           








            const updateNum = res.data.holiday.map((hod)=> {
                const checkDate = hod.date.toString().slice(8,10);                
                const checkGovHoliday = dates.find((x)=> x == checkDate);
                // console.log(checkGovHoliday);                
                return checkGovHoliday;
            })   
            setNum(updateNum);

            let arrId = [];
            let arrAttendanceType = [];
            let arrFromDate = [];
            let arrToDate = [];
            console.log("DATEs", dates);
           

            Object.values(res.data.result).forEach((user)=> {               
                user.map((item, index) => {                   
                    const id = item.user_id ;   
                    const attendanceType = item.attendanceType; 
                    const fromDate = item.from_date.toString().slice(8,10); 
                    const toDate = item.to_date.toString().slice(8,10);  

                    arrId.push(id);                    
                    arrAttendanceType.push(attendanceType); 
                    arrFromDate.push(fromDate); 
                    arrToDate.push(toDate); 
                })
            })
            
            setInput({...input,
                id:arrId,
                attendanceType: arrAttendanceType, 
                fromDate: arrFromDate, 
                toDate: arrToDate
            })            
        })                            
    },[])      
    
    
    console.log('input',input);  


    const monthDays = (emp) => {  
        
        const strToNum = input.fromDate
        const numbersArray = strToNum.map((str) => Number(str));                
        return dates.map((item, index) => {                
            return (
                <td key={index}>                     
                    {num.includes(item) 
                        ? <i className="fa fa-star" />                            
                            : (input.id.includes(emp.id) && item == 2) 
                                ? <i className="fa fa-close" />
                                    : <i className="fa fa-check" />
                    }                                                           
                </td>  
            )                                  
        });     
    }    

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
                               return(
                                <th key={index}>{item}</th>
                               )
                            })}             
                          
                        </tr>
                    </thead>
                    <tbody>     
                        {getEmpOption.map((emp, i)=> (                                                                         
                            <tr key={i}>     
                                <td>{emp.name}</td>  
                                {monthDays(emp)}                                                                                        
                            </tr>                                                        
                        ))}  
                    </tbody>
                </table>
            </div>
        </Fragment>
    )
}

export default AttendenceReportList

 {/* {dates.map((item, index) => {                                                                                                                      
                                        <td key={index}><i className="fa fa-close"></i></td>                                    
                                })
                                }                         */}