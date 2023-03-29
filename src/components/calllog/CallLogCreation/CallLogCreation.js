import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { generatePath, useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { usePageTitle } from "../../hooks/usePageTitle";
import Select from "react-select";
import styles from "../../master/UserCreation/UserCreation.module.css";
import lock from '../../../images/lock.png';

const selectState = {
  customer: {},
  entrydate: "",
  calltype: {},
  executiveName: {},
  procurement: {},
  businessForecast: {},
  forecastStatus: {},
  addInfo: "",
  nxtFollowupDate: "",
  callcloseStatus: {},
  callcloseDate: {},
  remarks: "",
};

const selectFiles = {
  name: '',
  size: '',
  type: '',
  value: '',
  src: undefined
}

const selectStateErr = {
  customer: {},
  entrydate: "",
  calltype: {},
  executiveName: {},
  procurement: {},
  businessForecast: {},
  forecastStatus: {},
  callstatus: "",
  addInfo: "",
  nxtFollowupDate: "",
  callcloseStatus: {},
  callcloseDate: {},
  remarks: "",
};

const CallLogCreation = () => {

  usePageTitle("Call Log Creation");   
  const { server2: baseUrl } = useBaseUrl();
  
  const [optionsForCallList, setOptionsForCallList] = useState([]);              
  const [optionsForCutomerList, setOptionsForCutomerList] = useState([]);   
  const [optionsForBizzList, setOptionsForBizzList] = useState([]);   
  const [optionsForStatusList, setOptionsForStatusList] = useState([]);  
  const [optionsForProcurement, setOptionsForProcurement] = useState([]);   

  // const [date, setDate] = useState(null);
  // const [checkValForCustomer, setCheckValForCustomer] = useState(null);
  // const [checkValForCall, setCheckValForCall] = useState(null);
  // const [checkValForBizz, setCheckValForBizz] = useState(null);
  // const [forecastStatus, setForecastStatus] = useState(null);  
  // const [executive, setExecutive] = useState(null);
  // const [procurement, setProcurement] = useState(null);
  // const [callCloseStatus, setCallCloseStatus] = useState(null);
  // const [dateStatus, setDateStatus] = useState(null);
  
  const [file, setFile] = useState(selectFiles);
  const [fileCheck, setFileCheck] = useState(null);
  // const [files, setFiles] = useState(selectFiles);
  
  const [checked, setChecked] = useState("nextFollowUp");
  const [check, setCheck] = useState(false);

  const [input, setInput] = useState(selectState);
  const [inputValidation, setInputValidation] = useState(selectStateErr);
  const [selectLists, setSelectLists] = useState({
      customer : [],
      executive :[],
      calltype:[],
      bizzlist:[],    
      bizzstatus : [],
      procurement : [],
      callclosed:[],    
    })    
    const today = new Date();

    console.log("Input", input);



  useEffect(() => {
    document.getElementById("myDate").innerHTML = today;

    axios.get(`${baseUrl}/api/calltype/list`).then((res) => {
        setOptionsForCallList( res.data.calltype );
    });

    axios.get(`${baseUrl}/api/customer/list`).then((res) => {
      setOptionsForCutomerList(res.data.customerList);
    });

    axios
      .get(`${baseUrl}/api/procurementlist/list`)
      .then((res) => {
        setOptionsForProcurement(res.data.procurementlist);
      });
  }, []);

  useEffect(() => {
    if(input.calltype?.value) {
    axios
      .get(
        `${baseUrl}/api/bizzlist/list/${input.calltype?.value}`
      )
      .then((res) => {
        setOptionsForBizzList(res.data.bizzlist);
      });
    }
    else{
      setOptionsForBizzList(null);
    }
    setInput({...input, businessForecast:null});      
  }, [input.calltype]);

  useEffect(() => {
    if(input.businessForecast?.value) {
    axios
      .get(
        `${baseUrl}/api/statuslist/list/${input.businessForecast?.value}`
      )
      .then((res) => {
        setOptionsForStatusList(res.data.statuslist);
      });
    }
    else{
      setOptionsForStatusList(null);
    }
    setInput({...input, forecastStatus:null})
  }, [input.businessForecast]);
  


  const inputHandlerFortext = (e) => {
    setInput((prev)=>{return{...prev, [e.target.name]: e.target.value}})
  }


  const inputHandlerForSelect = (value, action) => {
    setInput((prev)=>{return{...prev, [action.name]: value}})
    
    if (action.name === 'calltype' && value.label !== "General Customer Visit") {              
        setCheck(true);
    }
    else if (action.name === 'calltype' && value.label === "General Customer Visit" ){
      setCheck(false);
    }
    console.log('check',check);

    // if (action.name === 'calltype' && value === null) {    
    //   setInput({ ...input, calltype: null, businessForecast: null, forecastStatus: null});      
    // }


  };

  const handleFile = (e) => {                
      const Files = e.target.files[0];
      const FilesValue = e.target.value;
      const fileName = Files.name;
      const fileType = Files.type;
      const fileSize = Files.size + ' KB';
      const url = URL.createObjectURL(Files); // this points to the File object we just created
      // document.querySelector('img').src = url;
      setFile({...file, name: fileName, type: fileType, size: fileSize, value: FilesValue, src: url});
      setFileCheck(true);
    }
    console.log('file',file.src);
    

  const executiveOption = [
    {value: '1', label: "Admin"},
    {value: '2', label: "Prabakaran"},
    {value: '3', label: "User"}
  ];

  const optionsForCallCloseStatus = [
    {value: '1', label: "Completed"},
    {value: '2', label: "Order List"},    
  ];


  
  
  useEffect(()=> {
      if(checked === "closed") {
        setInput({...input, nxtFollowupDate: null});
      }
     if(checked === "nextFollowUp") {
      setInput({...input,  callcloseDate: null, callcloseStatus: null, remarks: null });
      }      
  },[checked === "closed"])


  return (
    <Fragment>
      <div className="CallLogsCreation">              
        <div className="card shadow p-4 mb-4">
          <form>
            <div className="row align-items-center">
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="customer" className="font-weight-bold">
                      Customer Name
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="customer"
                      id="customer"
                      isSearchable="true"
                      isClearable="true"
                      options={optionsForCutomerList}
                      value={input.customer}
                      onChange={inputHandlerForSelect}
                    ></Select>
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="date" className="font-weight-bold">
                      Date
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <input
                      type="datetime-local"
                      className="form-control"
                      id="myDate"
                      name= 'entrydate'
                      onChange={(e)=> inputHandlerFortext(e)}
                      value={input.entrydate}
                    />
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="calltype" className="font-weight-bold">
                      Call Type{" "}
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="calltype"
                      id="calltype"
                      isSearchable="true"
                      isClearable="true"
                      options={optionsForCallList}
                      value={input.calltype}
                      onChange={inputHandlerForSelect}
                    ></Select>
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="executiveName" className="font-weight-bold">
                      Executive Name
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      id="executiveName"
                      name="executiveName"
                      isSearchable='true'
                      isClearable='true'
                      options={executiveOption}
                      value={input.executiveName}
                      onChange={inputHandlerForSelect}
                    ></Select>
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label
                      htmlFor="businessForecast"
                      className="font-weight-bold"
                    >
                      Business Forecast                   
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <Select
                      name="businessForecast"
                      id="businessForecast"                  
                      isSearchable={true}
                      isClearable={true}
                      options={optionsForBizzList}
                      value={input.businessForecast}
                      onChange={inputHandlerForSelect}
                    ></Select>
                  </div>
                </div>
              </div>
              {check ? (
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark">
                      <label htmlFor="procurement" className="font-weight-bold">
                        Procurement Type
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <Select
                        name="procurement"
                        id="procurement"
                        isSearchable="true"
                        isClearable="true"
                        options={optionsForProcurement}
                        value={input.procurement}
                        onChange={inputHandlerForSelect}
                      ></Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark"></div>
                  </div>
                </div>
              )}
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="forecastStatus" className="font-weight-bold">
                      Status
                    </label>
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
                    
                  </div>
                </div>
              </div>
              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark ">
                    <label htmlFor="action " className="font-weight-bold">
                      Action
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <div className="form-check form-check-inline">
                      <label className="form-check-label" htmlFor="nxtRadio">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="nxtRadio"
                          checked={checked === "nextFollowUp"}
                          name="callstatus"
                          value="nextFollowUp"
                          onChange={(e) => {
                            setChecked(e.target.value);
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
                          name="callstatus"
                          value="closed"
                          onChange={(e) => {
                            setChecked(e.target.value);
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
                    <label htmlFor="mobile" className="font-weight-bold">
                      Additional Info
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <textarea
                      id="addInfo"
                      className="form-control"
                      name="addInfo"
                      rows="4"
                      cols="50"
                      value={input.addInfo}
                      onChange={(e)=>inputHandlerFortext(e)}
                    />                  
                  </div>
                </div>
              </div>

              {checked === "nextFollowUp" ? (
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark ">
                      <label htmlFor="activeStatus " className="font-weight-bold">
                        Next Follow Up
                      </label>
                    </div>
                    <div className="col-lg-8 mb-3">
                      <input
                        className="form-control"
                        name="nxtFollowupDate"
                        type="date"
                        value={input.nxtFollowupDate}
                        onChange={(e)=>inputHandlerFortext(e)}
                      />
                    </div>

                    {/* <div className="col-lg-4 text-dark ">
                          <label htmlFor="activeStatus " className="font-weight-bold" >Closer Week<   /label>
                      </div>
                      <div className="col-lg-8">                                        
                          <input className="form-control" type="week" />
                      </div> */}
                  </div>
                </div>
              ) : checked === "closed" ? (
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark ">
                      <label
                        htmlFor="callclosestatus "
                        className="font-weight-bold"
                      >
                        Close Status
                      </label>
                    </div>
                    <div className="col-lg-8 mb-3">
                      <Select
                        name="callcloseStatus"
                        id="callcloseStatus"
                        isSearchable="true"
                        isClearable="true"
                        options={optionsForCallCloseStatus}
                        value={input.callcloseStatus}
                        onChange={inputHandlerForSelect}
                      ></Select>                   
                    </div>

                    <div className="col-lg-4 text-dark ">
                      <label htmlFor="closeDate" className="font-weight-bold">
                        Close Date
                      </label>
                    </div>
                    <div className="col-lg-8 mb-3">
                      <input
                        className="form-control"
                        name="callcloseDate"
                        type="date"
                        onChange={(e)=> inputHandlerFortext(e)}
                        value={input.callcloseDate}
                      />
                    </div>

                    <div className="col-lg-4 text-dark ">
                      <label htmlFor="closeDate" className="font-weight-bold">
                        Remarks
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <textarea
                        id="remarks"
                        className="form-control"
                        name="remarks"
                        rows="4"
                        cols="50"
                        value={input.remarks}
                        onChange={(e)=>inputHandlerFortext(e)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="inputgroup col-lg-6 mb-4">
                  <div className="row align-items-center">
                    <div className="col-lg-4 text-dark "></div>
                  </div>
                </div>
              )}

              <div className="inputgroup col-lg-6 mb-4">
                <div className="row align-items-center">
                  <div className="col-lg-4 text-dark">
                    <label htmlFor="document" className="font-weight-bold">
                      Document
                    </label>
                  </div>
                  <div className="col-lg-8">
                    <div
                      className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                      // ref={wrapperRef}
                      // onDragEnter={onDragEnter}
                      // onDragLeave={onDragLeave}
                      // onDrop={onDrop}
                    >
                      <p className="display-4 mb-0">
                        <i className="fas fa-cloud-upload-alt text-primary "></i>
                      </p>          
                      <p>Drag & Drop an document or Click</p>        
                      <input
                        type="file"
                        value={file.value}
                        name="image"
                        className="h-100 w-100 position-absolute top-50 start-50 pointer"
                        // accept={`image/*`}
                        onChange={(e)=>handleFile(e)}
                      />
                    </div>                    
                  </div>                                            
                </div>
              </div>

                <div className="inputgroup col-lg-6 mb-4 ">
                  <div className="row align-items-center">
                    <div className="col-lg-4">
                      {fileCheck && <label className="font-weight-bold">Preview</label>}
                    </div>
                    <div className="col-lg-8">
                      {fileCheck &&
                          <>
                            <div className="upload_Documents">                              
                              <div className="card shadow my-4">                        
                                <div className="card-body">
                                  {/* <div className="noOfCountsForUpload">{''}</div> */}
                                  <div className="UploadingDetails">                                                      
                                    <div><h6> Name : </h6> <span>{file.name}</span></div>
                                    <div><h6> Size : </h6> <span>{file.size}</span></div>                            
                                  </div>
                                  <div className="UploadImg">
                                    <img src={file.src}  />
                                  </div>
                                </div>
                              </div>
                              <button className="btn btn-info">Add</button>
                              <button className="btn btn-dark">Remove</button>
                            </div>
                          </>
                        }
                    </div>
                  </div>
                </div>
              
              
              <div className="inputgroup col-lg-12 mb-4 ml-3">
                <div className="row align-items-center">
                  <div className="col-lg-10 text-right ">
                    <button className="btn btn-primary" type="submit" >
                      Save                 
                    </button>
                    <button className="btn btn-secondary" >
                      Cancel                 
                    </button>
                  </div>               
                </div>
              </div>
            </div>
          </form>        
        </div>
      </div>
    </Fragment>
  );
};

export default CallLogCreation;
