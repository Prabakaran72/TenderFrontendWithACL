import { Fragment } from "react";
import { useState, useEffect } from "react";
import { usePageTitle } from "../../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
// import { useBaseUrl } from "../../../hooks/useBaseUrl";
import { useBaseUrl } from "./../../../hooks/useBaseUrl";
import Select from "react-select";
import { BsFillArrowLeftSquareFill } from "react-icons/bs";

const attendance_type_options=[{value : 1, label : "Check-In"},{value : 2, label : "Check-Out"},{value : 3, label : "Break-In"}]

const employeeList = [{value : 1, label : "Kumar"},{value : 2, label : "Babu"},{value : 3, label : "Raja"}]
const AttendanceEntry = () => {
    usePageTitle("Daily Attendance Entry");
    const {server1:baseUrl} = useBaseUrl()
    const navigate = useNavigate();
    const { id } = useParams();
    const [options, setOptions] = useState([]);

    const initialState = {
        employeeId: null,
        attendanceType: null,
      };
      const initialStateErr = {
        employeeIdErr: false,
        attendanceTypeErr: false,
      };
      const [formIsValid, setFormIsValid]=useState(false);
      const [input, setInput] = useState(initialState);
      const [validation, setInputValidation] = useState(initialStateErr);
      const [dataSending, setDataSending] = useState(false);

      useEffect(()=>{
        axios.get(`${baseUrl}/api/state/list/105`).then((resp)=> {
          setOptions(resp.data.stateList);
        })
      },[])
      
      useEffect(() => {
        if(id){
          axios.get(`${baseUrl}/api/zonemaster/${id}`).then((resp)=> {
            setInput({
                zonename: resp.data.zonename.zone_name,
                status: resp.data.zonename.active_status
            })
            // setStateList(resp.data.zonename.statelist)
          })
        }
      },[id, baseUrl])

      useEffect(()=>{
      const errors=validation;
      console.log("Error", errors)
        if (input.employeeId === null) {
          errors.employeeIdErr = true;
        } else {
          errors.employeeIdErr = false;
        }
        if (input.attendanceType === null) {
          errors.attendanceTypeErr = true;
        } else {
          errors.attendanceTypeErr = BsFillArrowLeftSquareFill;
        }
        setInputValidation((prev)=>{return{...prev,employeeIdErr : errors.employeeIdErr,attendanceTypeErr: errors.attendanceTypeErr}});

      },[input])

      useEffect(()=>{
        if (validation.employeeIdErr !== true  || validation.attendanceTypeErr !== true) {
          setFormIsValid(true);          
        }    
      },[validation])

      const postData = (data) => {
        axios.post(`${baseUrl}/api/zonemaster`, data).then((res) => {
              if (res.data.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "Attendance",
                  text: "Status Updated Successfully!",
                  confirmButtonColor: "#5156ed",
                });
                setInput(initialState)
                navigate('/tender/master/zonemaster')
              } else if (res.data.status === 400) {
                Swal.fire({
                  icon: "error",
                  title: "Attendance",
                  text: res.data.errors,
                  confirmButtonColor: "#5156ed",
                });
                setDataSending(false)
              }
            });
      }
      
      const putData = (data, id) => {
        axios.put(`${baseUrl}/api/zonemaster/${id}`, data).then((res) => {
          if (res.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Attendance ",
              text: "Status Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/master/zonemaster')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Attendance",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
      }
   
    const submitHandler = (e) => {
        e.preventDefault();
        setDataSending(true)
        var errors = { ...validation };
    
        if (input.employeeId === null) {
          errors.employeeIdErr = "Please Select Employee";
        } else {
          errors.employeeIdErr = "";
        }
        if (input.attendanceType === null) {
          errors.attendanceTypeErr = "Please Select Attendance Type";
        } else {
          errors.attendanceTypeErr = "";
        }
        setInputValidation(errors);
        if (errors.employeeIdErr !== "" || errors.attendanceTypeErr !== "") {
          setDataSending(false)
          return;
        }    
        if (errors.employeeIdErr === "" && errors.attendanceTypeErr ==="") {
          const data = {
            employeeId: input.employeeId.value,
            attendanceType: input.attendanceType.value,
            tokenId: localStorage.getItem('token'),
          };
  
          if(!id){
            postData(data);
          }else{
            putData(data, id);
          }
        }
    };

const selectChangeHandler = (value, action) =>{
  setInput((prev)=>{return {...prev, [action.name]: value}});
  if (value) {
    setFormIsValid(true);          
  }    
  else{setFormIsValid(false);          }
}
console.log("input",input )
console.log("Vlaidation",validation)
    return (
        <Fragment>
        <div className="container-fluid">
            <div className="card p-4">
                <form onSubmit={submitHandler}>
                <div className="row">
                    <div className="col-2">
                    <label>Employee Name</label>
                    </div>
                    <div className="col-10 mb-3">
                    <div className="row">
                        <div className="col-5 mr-5 ">
                        <Select
                            name="employeeId"
                            id="employeeId"
                            isSearchable="true"
                            isClearable="true"
                            options={employeeList}
                            value={input.employeeId}
                            onChange={selectChangeHandler}
                        ></Select>
                        </div>

                        <div className="col-6 ml-n5 mt-2">
                        {validation.employeeIdErr && 
                        <span style={{ color: "red" }}>
                          Please Select Employee..!                          
                        </span>  }
                        </div>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                    <label>Attendance Type</label>
                    </div>
                    <div className="col-10 mb-3">
                    <div className="row">
                        <div className="col-5 mr-5 ">
                        <Select
                                            name="attendanceType"
                                            id="attendanceType"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={attendance_type_options}
                                            value={input.attendanceType}
                                            onChange={selectChangeHandler}
                                        ></Select>
                        </div>
                        <div className="col-6 ml-n5 mt-2">
                        {validation.attendanceTypeErr && 
                        <span style={{ color: "red" }}>
                            Please Select Attendance Type..!       
                        </span>}
                        </div>
                    </div>
                    </div>
                </div>
                {/* <div className="row">
                    <div className="col-2">
                    <label>Active Status</label>
                    </div>

                    <div className="col-5 ml-3">
                    <div className="row">
                        <div className="col-3">
                        <label
                            className="for-check-label"
                            htmlFor="statusActive"
                        >
                            <input
                            className="form-check-input"
                            type="radio"
                            id="statusActive"
                            name="status"
                            value="active"
                            checked={input.status === "active"}
                            onChange={inputHandler}
                            />
                            Active
                        </label>
                        </div>
                        <div className="col-5">
                        <label
                            className="for-check-label"
                            htmlFor="statusInactive"
                        >
                            <input
                            className="form-check-input"
                            type="radio"
                            id="statusInactive"
                            name="status"
                            value="inactive"
                            checked={input.status === "inactive"}
                            onChange={inputHandler}
                            />
                            Inactive
                        </label>
                        </div>
                    </div>
                    </div>
                </div> */}
                <div className="row text-center">
                    <div className="col-12">
                    {id ? (
                        <button className="btn btn-primary" disabled ={dataSending || formIsValid} > {dataSending ? "Updating..." : "Update"}</button>
                    ) : (
                        <button className="btn btn-primary" disabled = {dataSending || formIsValid}> {dataSending ? "Submitting..." : "Submit"}</button>
                    )}
                    </div>
                </div>
                </form>
            </div>
        </div>
        </Fragment>
    )
}

export default AttendanceEntry;