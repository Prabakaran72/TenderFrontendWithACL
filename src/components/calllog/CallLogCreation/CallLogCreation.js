import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";
// import styles from "./UserCreation.module.css";
import styles from '../../master/UserCreation/UserCreation.module.css';
// import ReadyToUpload from "./ReadyToupload";


const initialState = {
    userName : "",
    usertype : "",
    loginId  : "",
    password : "",
    confirmPassword : "",
    mobile: "",
    email: '',
    activeStatus: 'active',
    closed: 'closed',
    forecastStatus : null,
}

const initialStateErr = {
    userName: '',
    usertype: '',
    loginId : '',
    password : "",
    confirmPassword : "",
    mobile : '',
    email : '',
    activeStatus: '',
    forecastStatus : "",
}


const CallLogCreation = () => {
    usePageTitle("Call Log Creation");
    // const { id } = useParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();
    const wrapperRef = useRef(null);
    const [file, setFile] = useState(null);

    const [dataSending, setDataSending] = useState(false);
    const [input, setInput] = useState(initialState);       
    const [inputValidation, setInputValidation] = useState(initialStateErr);
    const [dragover, setdragover] = useState(false);   
   
    const [options, setOptions] = useState([]);
    const [optionsForCutomerList, setOptionsForCutomerList] = useState([]);
    const [optionsForBizzList, setOptionsForBizzList] = useState([]);
    const [optionsForStatusList, setOptionsForStatusList] = useState([]);   
    
    const [checkValForCall, setCheckValForCall] = useState('');  
    const [checkValForBizz, setCheckValForBizz] = useState(null); 
    
    const [checked, setChecked] = useState("nextFollowUp");
    const [check, setCheck] = useState(false);  
                 

    let ref = useRef();

    useEffect(()=> {
      axios.get(`http://192.168.1.32:8000/api/calltype/list`)
      .then((res)=>{                
        setOptions(res.data.calltype)         
      })

      axios.get('http://192.168.1.32:8000/api/customer/list')
      .then((res)=>{        
        setOptionsForCutomerList(res.data.customerList)
      })
         
    },[]);

    // checkValForCall
    useEffect(()=> {
        if(checkValForCall)
        {
        axios.get(`http://192.168.1.32:8000/api/bizzlist/list/${checkValForCall?.value}`)
            .then((res)=>{           
            setOptionsForBizzList(res.data.bizzlist);
            })
        }
        else{
            setOptionsForBizzList('null');            
        }
        
    },[checkValForCall])

     // checkValForBizz
     useEffect(()=> {
        axios.get(`http://192.168.1.32:8000/api/statuslist/list/${checkValForBizz?.value}`)
        .then((res)=>{            
          setOptionsForStatusList(res.data.statuslist)
        })
    },[checkValForBizz])
   
      
    const inputHandlerForSelect = (value, action) => {
        // console.log("Value", value);
        // console.log("Action", action);
    
        setInput({
          ...input,
          [action.name]: value,
        });
        if(value === "" | value === null){
            setInputValidation({...inputValidation, [action.name]:true});
        }
        else{
            setInputValidation({...inputValidation, [action.name]:false});
        }
        // if(action.name === 'CallType')
        // {
        //     setCheckValForBizz(null);
        // }
        // if(action.name === 'CallType')
        // {
        //     setInput((prev)=>{return{ ...prev,biz : null ,status: null}})

        // }
      };

    const inputHandlerForSelectCall = (value, action) => {                     
        setCheckValForCall(value);   
        setCheckValForBizz(null);                
        setCheck(checkValForCall.label !== 'General Customer Visit');   
        console.log('checkValForCall',checkValForCall);
    };

    const inputHandlerForSelectBizz = (value, action) => {                       
        setCheckValForBizz(value);
        console.log('checkValForBizz',checkValForBizz); 
    };

                   
      const onDragEnter = () => {
        wrapperRef.current.classList.add(styles['dragover'])
        setdragover(true)
    };

    const onDragLeave = () => {
        wrapperRef.current.classList.remove(styles['dragover'])
        setdragover(false)
    };

    const onDrop = () => wrapperRef.current.classList.remove(styles['dragover']);

    const onFileDrop = (e) => {
        const newFile = e.target.files[0];

        let filetypes = newFile.type;

        if((newFile.size/(1000*1000)) > 1){
            alert("Maximum upload size limit (1 MB) reached")
            return;
        }

        if (filetypes.split('/')[0] === "image") {
            setFile(newFile);
        } else {
            alert("File format not suppoted.")
        }

    }

    let formIsValid = false;

    if(input.userName !== '' && 
       (input.usertype !== null && input.usertype !== '') &&
       input.loginId !== ''  &&
       input.password !== '' &&
       input.confirmPassword !== '' &&      
       !inputValidation.confirmPassword && 
       file
    ){
        formIsValid = true
    }

    const postData = (data) => {
        axios.post(`${baseUrl}/api/usercreation`, data).then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "User Creation",
                text:  resp.data.message,
                confirmButtonColor: "#5156ed",
              });
  
            navigate(`/tender/master/usercreation`);
            
            } else if (resp.data.status === 400) {
              Swal.fire({
                icon: "error",
                title: "User Creation",
                text: resp.data.errors,
                confirmButtonColor: "#5156ed",
              });
            }
            else {
              Swal.fire({
                icon: "error",
                title: "User Creation",
                text: "Provided Credentials are Incorrect",
                confirmButtonColor: "#5156ed",
              }).then (()=>{
                localStorage.clear();
                navigate("/");
              });
            }
            setDataSending(false);
          }).catch((err) => {
            console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "User Creation",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
    }

    const putData = (data, id) => {
        axios.post(`${baseUrl}/api/usercreation/${id}?_method=PUT`, data).then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                icon: "success",
                title: "User Creation",
                text:  resp.data.message,
                confirmButtonColor: "#5156ed",
              });
  
            navigate(`/tender/master/usercreation`);
            
            } else if (resp.data.status === 400) {
              Swal.fire({
                icon: "error",
                title: "User Creation",
                text: resp.data.errors,
                confirmButtonColor: "#5156ed",
              });
            }
            else {
              Swal.fire({
                icon: "error",
                title: "User Creation",
                text: "Provided Credentials are Incorrect",
                confirmButtonColor: "#5156ed",
              })
            //   .then (()=>{
            //     localStorage.clear();
            //     navigate("/");
            //   });
            }
            setDataSending(false);
          }).catch((err) => {
            console.log("err", err.response.data.message)
            Swal.fire({
                icon: "error",
                title: "User Creation",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(!formIsValid){
        setDataSending(false)
        return     
        }

        let data = {
            userName            : input.userName,
            userType            : input.usertype.value,  
            activeStatus        : input.activeStatus,
            password            : input.password,
            confirmPassword     : input.confirmPassword,
            mobile              : input.mobile,
            email               : input.email,
            loginId             : input.loginId,
            file                : file,
            tokenId             : localStorage.getItem("token")
        }


        if (file instanceof Blob) {
            data.file = new File([file], file.name);
        }

        const formdata = new FormData();
        for (var key in data) {
            if(data[key] === null){
                formdata.append(key, '');
                continue;
            }

            formdata.append(key, data[key]);
        }   

        // console.log(data)
        // console.log(formdata)   
        if(!id){
            postData(formdata);
        }else{
            putData(formdata, id);
        }
    }

    const cancelHandler = () => {
        navigate(`/tender/master/usercreation`);
    }

    return (
        <Fragment>            
                <div className="card shadow p-4 mb-4">
                    <form>
                        <div className="row align-items-center">
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="Customer" className="font-weight-bold">Customer Name</label>
                                    </div>
                                    <div className="col-lg-8">
                                      <Select
                                          name="Customer"
                                          id="Customer"
                                          isSearchable="true"
                                          isClearable="true"
                                          options={optionsForCutomerList}
                                          value={input.Customer}
                                          onChange={inputHandlerForSelect}
                                      ></Select>                                       
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="date" className="font-weight-bold">Date</label>
                                    </div>
                                    <div className="col-lg-8">
                                        <input
                                            type="datetime-local"
                                            className="form-control"                                            
                                            id="date"
                                        />                                       
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="calltype" className="font-weight-bold">Call Type </label>
                                    </div>
                                    <div className="col-lg-8">
                                    <Select
                                        name="calltype"
                                        id="calltype"
                                        isSearchable={true}
                                        isClearable={true}
                                        options={options}
                                        value={checkValForCall}
                                        onChange={inputHandlerForSelectCall}
                                    ></Select>                                                                          
                                    </div>
                                </div>
                            </div>
                             <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="email" className="font-weight-bold">Executive Name</label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            id='admin'
                                            name="admin"
                                        />                              
                                    </div>
                                </div>
                            </div>                           
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="businessForecast" className="font-weight-bold">Business Forecast<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                    <Select
                                        name="businessForecast"
                                        id="businessForecast"
                                        ref={ref}
                                        isSearchable={true}
                                        isClearable={true}
                                        options={optionsForBizzList}
                                        value={checkValForBizz}                                       
                                        onChange={inputHandlerForSelectBizz}
                                    ></Select>                                       
                                    </div>
                                </div>
                            </div>
                            {check ?
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="mobile" className="font-weight-bold">Procurement Type<span className="text-danger"></span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                    <Select
                                        name="forecastStatus"
                                        id="forecastStatus"
                                        isSearchable="true"
                                        isClearable="true"
                                        options={optionsForStatusList}
                                        value={input.forecastStatus}
                                        onChange={inputHandlerForSelect}
                                    ></Select>

                                        {inputValidation.mobile && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Invaild 
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div> :
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark"></div>
                                </div>
                            </div>
                            }
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="mobile" className="font-weight-bold">Status<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                    <Select
                                        name="forecastStatus"
                                        id="forecastStatus"
                                        isSearchable="true"
                                        isClearable="true"
                                        options={optionsForStatusList}
                                        value={input.forecastStatus}
                                        onChange={inputHandlerForSelect}
                                    ></Select>

                                        {inputValidation.mobile && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Invaild 
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark ">
                                        <label htmlFor="activeStatus " className="font-weight-bold" >Action</label>
                                    </div>
                                    <div className="col-lg-8">                                                                              
                                        <div className="form-check form-check-inline">
                                            <label
                                                className="form-check-label"
                                                htmlFor="nxtRadio"
                                            >
                                                <input
                                                    className="form-check-input"                                                   
                                                    type="radio"
                                                    id="nxtRadio"
                                                    checked={checked === "nextFollowUp"}
                                                    name="nextFollowUp" value="nextFollowUp"
                                                    onChange={(e) => {
                                                        setChecked(e.target.value)                                                        
                                                    }}
                                                />
                                                Next Follow Up
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <label className="form-check-label" htmlFor="closedRadio">
                                                <input
                                                    className="form-check-input mx-3"
                                                    type="radio"
                                                    id="closedRadio"
                                                    checked={checked === "closed"}
                                                    name="closed" value="closed"
                                                    onChange={(e) => {
                                                        setChecked(e.target.value)                                                        
                                                    }}
                                                />
                                                Close
                                            </label>
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="mobile" className="font-weight-bold">Additional Info<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                    <textarea id="addInfo" className="form-control" name="addInfo" rows="4" cols="50" />

                                        {inputValidation.mobile && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Invaild 
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {( checked === "nextFollowUp" ) ? 
                                <div className="inputgroup col-lg-6 mb-4">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4 text-dark ">
                                            <label htmlFor="activeStatus " className="font-weight-bold" >Next Follow Up</label>
                                        </div>
                                        <div className="col-lg-8 mb-3">                                        
                                            <input className="form-control" type="date" />
                                        </div>
                                    
                                        <div className="col-lg-4 text-dark ">
                                            <label htmlFor="activeStatus " className="font-weight-bold" >Closer Week</label>
                                        </div>
                                        <div className="col-lg-8">                                        
                                            <input className="form-control" type="week" />
                                        </div>
                                    </div>
                                </div> : 
                            ( checked === "closed" ) ?                                
                                <div className="inputgroup col-lg-6 mb-4">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4 text-dark ">
                                            <label htmlFor="closeStatus " className="font-weight-bold" >Close Status</label>
                                        </div>
                                        <div className="col-lg-8 mb-3">
                                            <Select
                                                name="forecastStatus"
                                                id="forecastStatus"
                                                isSearchable="true"
                                                isClearable="true"
                                                options={optionsForStatusList}
                                                value={input.forecastStatus}
                                                onChange={inputHandlerForSelect}
                                            ></Select>

                                            {inputValidation.mobile && (
                                                <div className="pt-1">
                                                    <span className="text-danger font-weight-bold">
                                                        Invaild 
                                                    </span>
                                                </div>
                                            )}
                                        </div>                                                                 
                                    
                                        <div className="col-lg-4 text-dark ">
                                            <label htmlFor="closeDate" className="font-weight-bold" >Close Date</label>
                                        </div>
                                        <div className="col-lg-8 mb-3">                                        
                                            <input className="form-control" type="date" />
                                        </div>

                                        <div className="col-lg-4 text-dark ">
                                            <label htmlFor="closeDate" className="font-weight-bold" >Remarks</label>
                                        </div>
                                        <div className="col-lg-8">                                        
                                            <textarea id="remarks" className="form-control" name="addInfo" rows="4" cols="50" />
                                        </div>
                                    </div>
                                </div>   :
                                    <div className="inputgroup col-lg-6 mb-4">
                                        <div className="row align-items-center">
                                            <div className="col-lg-4 text-dark ">
                                            </div>                         
                                        </div>
                                    </div>
                            }       

                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="email" className="font-weight-bold">Document<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                    <div className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                                        ref={wrapperRef}
                                        onDragEnter={onDragEnter}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}
                                    >
                                        <p className="display-4 mb-0"><i className='fas fa-cloud-upload-alt text-primary '></i></p>
                                        {!dragover && <p className="mt-0">Drag & Drop an document or Click</p>}
                                        {dragover && <p className="mt-0">Drop the document</p>}
                                        <input type="file" value=""  name= "image" className="h-100 w-100 position-absolute top-50 start-50 pointer" accept={`image/*`} onChange={onFileDrop} />
                                    </div>
                                </div>
                                </div>
                            </div>   

                            {(file !== null) && <div className="inputgroup col-lg-12 mb-4">  
                            <div className="row col-lg-6">
                                <div className="col-lg-4 text-dark font-weight-bold  p-0">
                                  {(file.lastModified) && <label htmlFor="customername">(Ready To Upload)</label>}
                                  {(!file.lastModified) && <label htmlFor="customername">(Uploaded Doc/File)</label>}
                                </div>
                                <div className="col-lg-8 pr-0">
                                    {/* <ReadyToUpload file={file} clearFile={() => setFile(null)}/> */}
                                </div>
                            </div>
                            <div className="col-lg-6">&nbsp;</div>
                            </div>}
                            <div className="inputgroup col-lg-12 mb-4 ml-3">
                                <div className="row align-items-center">
                                    <div className="col-lg-10 text-right ">
                                        <button
                                            className="btn btn-primary"
                                            disabled={!formIsValid}
                                            onClick={submitHandler}
                                        >
                                            {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span> }
                                            {dataSending === true ? ((id) ? 'Updating...' :"Submitting....") : ((id) ? 'Update' :"Save" )}

                                        </button>
                                    </div>
                                    <div className="col-lg-1 text-left">
                                        <button className="btn btn-secondary" onClick={cancelHandler} disabled = {dataSending}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>            
        </Fragment>
    )
}

export default CallLogCreation