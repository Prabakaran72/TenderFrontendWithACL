import { Fragment } from "react";
import { useState, useEffect } from "react";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Select from "react-select";

// const options = [{value:'1', label : 'AP'},{value:'2', label : 'MP'},{value:'3', label : 'Tamilnadu'},{value:'4', label : 'Delhi'}];

const ZoneMaster = () => {
    usePageTitle("Zone Master Creation");

    const {server1:baseUrl} = useBaseUrl()
  
    const navigate = useNavigate();
    const { id } = useParams();
    const [options, setOptions] = useState([]);

    const initialState = {
        zonename: "",
        status: "active",
      };
    
      const [input, setInput] = useState(initialState);
      const [statelist, setStateList] = useState([]);
      const [validation, setInputValidation] = useState({
        zonenameErr : "",
        statelistErr :""
      });
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

            setStateList(resp.data.zonename.statelist)
          })
        }
      },[id, baseUrl])

      const postData = (data) => {
        axios.post(`${baseUrl}/api/zonemaster`, data).then((res) => {
              if (res.data.status === 200) {
                Swal.fire({
                  icon: "success",
                  title: "New Zone ",
                  text: "Created Successfully!",
                  confirmButtonColor: "#5156ed",
                });
                setInput(initialState)
                navigate('/tender/master/zonemaster')
              } else if (res.data.status === 400) {
                Swal.fire({
                  icon: "error",
                  title: "Zone ",
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
              title: "Zone ",
              text: "Updated Successfully!",
              confirmButtonColor: "#5156ed",
            });
            setInput(initialState)
            navigate('/tender/master/zonemaster')
          } else if (res.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Zone ",
              text: res.data.errors,
              confirmButtonColor: "#5156ed",
            });
            setDataSending(false)
          }
        });
      }


      const inputHandler = (e) => {
        e.persist();
        setInput({ ...input , [e.target.name]: e.target.value });
      };

   
    const submitHandler = (e) => {
        e.preventDefault();
        setDataSending(true)
        var errors = { ...validation };
    
        if (input.zonename.trim() === "") {
          errors.zonenameErr = "Please Enter Zone Name";
        
        } else {
          errors.zonenameErr = "";
        }
    
        const { zonenameErr } = errors;
    
        setInputValidation(errors);
    
        if (zonenameErr !== "") {
          setDataSending(false)
          return;
        }
    
        if (zonenameErr === "") {
          const data = {
            zonename: input.zonename,
            statelist: statelist,
            status: input.status,
            tokenId: localStorage.getItem('token'),
          };
        
    
          if(!id){
            postData(data);
          }else{
            putData(data, id);
          }
        }
    };

    return (
        <Fragment>
        <div className="container-fluid">
            <div className="card p-4">
                <form onSubmit={submitHandler}>
                <div className="row">
                    <div className="col-2">
                    <label>Zone Name</label>
                    </div>
                    <div className="col-10 mb-3">
                    <div className="row">
                        <div className="col-5 mr-5 ">
                        <input
                            className="form-control "
                            type="text"
                            id="zonename"
                            name="zonename"
                            onChange={inputHandler}
                            value={input.zonename}
                        />
                        </div>
                        <div className="col-6 ml-n5 mt-2">
                        <span style={{ color: "red" }}>
                            {validation.zonenameErr}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-2">
                    <label>State</label>
                    </div>
                    <div className="col-10 mb-3">
                    <div className="row">
                        <div className="col-5 mr-5 ">
                        <Select
                                            name="statelist"
                                            id="statelist"
                                            isSearchable="true"
                                            isClearable="true"
                                            isMulti='true'
                                            options={options}
                                            value={statelist}
                                            onChange={(value, action) => { setStateList(value) }}
                                            closeMenuOnSelect={false}
                                        ></Select>
                        </div>
                        <div className="col-6 ml-n5 mt-2">
                        <span style={{ color: "red" }}>
                            {validation.zonenameErr}
                        </span>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="row">
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
                </div>
                <div className="row text-center">
                    <div className="col-12">
                    {id ? (
                        <button className="btn btn-primary" disabled ={dataSending} > {dataSending ? "Updating..." : "Update"}</button>
                    ) : (
                        <button className="btn btn-primary" disabled = {dataSending}> {dataSending ? "Submitting..." : "Submit"}</button>
                    )}
                    </div>
                </div>
                </form>
            </div>
        </div>
        </Fragment>
    )
}

export default ZoneMaster;