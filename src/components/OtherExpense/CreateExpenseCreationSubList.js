import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useBaseUrl } from "../hooks/useBaseUrl";
import styles from "../master/UserCreation/UserCreation.module.css";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import {useAllowedMIMEDocType} from '../hooks/useAllowedMIMEDocType';
import {ImageConfig} from '../hooks/Config';


const selectState = {
  customerName: '',
  callNo: '',
  expenseType: '',
  amount: '',
  description: '',
};

const selectFile = {
  name: "",
  size: "",
  type: "",
  value: "",  
  src: undefined,
};

const CreateExpenseCreationSubList = ({setTable, editData, currentRow, pass, input}) => {
  const [inputSub, setInputSub] = useState(selectState);
  const [file, setFile] = useState(selectFile);
  const [eTargFiles, setETargFiles] = useState(null);
  const [fileCheck, setFileCheck] = useState(null);
  const [btnCheck, setBtnCheck] = useState(false);
  const [optionsForCustomers, setOptionsForCustomers] = useState([]);
  const [optionsForExpense, setOptionsForExpense] = useState([]);
  const [checkBox, setCheckBox] = useState(false);
  const [check, setCheck] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);
  const [triggerTable, setTriggerTable] = useState(false);

  const {MIMEtype: docType} = useAllowedMIMEDocType();
  const { server1: baseUrl } = useBaseUrl();

  useEffect(() => {
    axios.get(`${baseUrl}/api/customer/list`).then((res) => {
      if (res.status === 200) {
        setOptionsForCustomers(res.data.customerList);
      }
    });

    axios.get(`${baseUrl}/api/expensetype/list`).then((res) => {
      if (res.status === 200) {
        setOptionsForExpense(res.data.expenselist);
      }
    });
    
  }, []);

  useEffect(() => {
    if (check) {
      setCheckBox(true);
    } else {
      setCheckBox(false);
      setInputSub({ ...inputSub, customerName: null, callNo: null });
    }
  }, [check]);

  useEffect(()=>{
    if (fileCheck === true) {
      setBtnCheck(true)
    }    
  }, [file]) // this hook will render when file change

  useEffect(() => {
    if (
      inputSub.expenseType !== null &&
      inputSub.amount !== "" &&
      inputSub.description !== ""
    ) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }  

    setTriggerTable(false);         
  }, [inputSub]) // this hook will render when inputSub change

  useEffect(()=>{
    if(pass) {
      setInputSub({...inputSub, expenseType: editData.expenseType, amount: editData.amount, description:editData.description});    
    }   
  },[currentRow]) // Current Row state gets true this hook will render *** this state comes from props

  useEffect(()=> {
    axios.get(`${baseUrl}/api/otherexpensesub`).then((res)=>{           
      if(res.status === 200) {
          setTable(res.data.otherexpensesub);
      }
    })   
    
  if(triggerTable === true) {
    setInputSub({...inputSub, expenseType: null, amount: '', description: ''});  
    setFileCheck(false);
    setBtnCheck(false)
  }
  },[triggerTable]) // triggerTable state gets true this hook will render *** initially works in handleSubmit
 
  const handleCheck = () => {
    setCheck(!check);
  };

  const inputHandlerForText = (e) => {
    setInputSub({ ...inputSub, [e.target.name]: e.target.value });
  };

  const inputHandlerForSelect = (value, action) => {
    setInputSub({ ...inputSub, [action.name]: value });
  };


  const inputHandlerForFile = (e) => {   
    const Files = e.target.files[0];
    const FilesValue = e.target.value;
    const fileName = Files.name;
    const fileType = Files.type;
    const fileSize = Files.size + ' KB';
    const url = URL.createObjectURL(Files);
    setETargFiles(Files)

    // FileMatch
    // const pngFile = fileName.match("png");
    // const jpgFile = fileName.match("jpg");
    // const jpegFile = fileName.match("jpeg");
    // const csvFile = fileName.match("csv");
    // const mswordFile = fileName.match("docx");
    // const zipFile = fileName.match("zip");
    // const pdfFile = fileName.match("pdf");
    // const msxlFile = fileName.match("vnd.ms-excel");
    // const xlFile = fileName.match("xlsx");
    // const osFile = fileName.match("octet-stream");
    // const rarFile = fileName.match("rar");

  
    if(docType.includes(e.target.files[0].type) ) {
      setFile({
        ...file,
        name: fileName,
        size: fileSize,
        value: FilesValue,
        type: fileType,
        src: fileType.split('/')[0] === 'image' ? url : ImageConfig[fileType.split('/')[1]]       
      });
    }       
    setFileCheck(true);   
   
  };
  
  const handleRemoveDoc = () => {
    setFile({...file, value: ''});
    setFileCheck(false);
    setBtnCheck(false)
  }
 
  const handleSubmit = (e) => {
    e.preventDefault();   
    const formdata = new FormData();  

    let data = { 
      executive_id: input.staff.value,     
      entry_date: input.entryDate,
      description: input.description,

      customer_id: inputSub.customerName?.value ?? '',
      call_no: inputSub.callNo?.value ?? '',
      expense_type_id: inputSub.expenseType?.value ?? '',
      amount: inputSub.amount,
      description_sub: inputSub.description,
      filename: file.name,
      // filetype: file.type,
      // filesize: file.size,
      // file: file,
      tokenid: localStorage.getItem("token"), 
    }
        
    if (eTargFiles instanceof Blob) {
      data.filename = new File([eTargFiles], file.name);             
      console.log('data.filename',data.filename); 
    }
    
    for (var key in data) {
      formdata.append(key, data[key]);
    }
    postData(formdata);    
    setTriggerTable(true);    
  }

  const postData = (data) => {
    axios.post(`${baseUrl}/api/otherexpensesub`, data)
    .then((res) => {
      if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "New SubExpense",
            text: "Created Successfully!",
            confirmButtonColor: "#5156ed",
          });                 
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "New SubExpense",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });          
      }
    });
    console.log('data',data);      
  }

  const optionsForCustomer = [
    { value: 1, label: "Abc" },
    { value: 2, label: "def" },
  ];
  
  // console.log("input", input);    
  // console.log("inputSub", inputSub);  

  return (
    <div className='CreateExpenseCreationSubList'>
      <form onSubmit={handleSubmit}>              
        <div className="row d-flex justify-content-between">
          <div className="col-sm-12 row d-flex align-items-center mb-4">
            <div className="col-lg-5">
              <input
                type="checkbox"
                id="checkBox"
                name="check"
                value=""
                className="mr-3"
                checked={checkBox}
                onChange={handleCheck}
              />
              <label htmlFor="checkBox">Need Call Against Expense </label>
            </div>
          </div>
          {checkBox && (
            <div className="col-sm-6 row d-flex align-items-center mb-4">
              <div className="col-lg-3 text-dark font-weight-bold">
                <label>Customer Name </label>
              </div>
              <div className="col-lg-9">
                <Select
                  name="customerName"
                  id="cusName"
                  isSearchable="true"
                  isClearable="true"
                  options={optionsForCustomers}
                  value={inputSub.customerName}
                  onChange={inputHandlerForSelect}
                ></Select>
              </div>
            </div>
          )}
          {checkBox && (
            <div className="col-sm-6 row  align-items-center mb-4">
              <div className="col-lg-3 text-dark font-weight-bold">
                <label>Call No </label>
              </div>
              <div className="col-lg-9">
                <Select
                  name="callNo"
                  id="callNo"
                  isSearchable="true"
                  isClearable="true"
                  options={optionsForCustomer}
                  value={inputSub.callNo}
                  onChange={inputHandlerForSelect}
                ></Select>
              </div>
            </div>
          )}
          <div className="col-sm-6 row d-flex align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Expense Type </label>
            </div>
            <div className="col-lg-9">
              <Select
                name="expenseType"
                id="expenseType"
                isSearchable="true"
                isClearable="true"
                options={optionsForExpense}
                value={inputSub.expenseType}
                onChange={inputHandlerForSelect}
              ></Select>
            </div>
          </div>
          <div className="col-sm-6 row  align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Amount </label>
            </div>
            <div className="col-lg-9">
              <input
                type="text"
                name="amount"
                value={inputSub.amount}
                onChange={(e) => inputHandlerForText(e)}
                className="form-control"
              />
            </div>
          </div>
          <div className="col-sm-6 row d-flex align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Description</label>
            </div>
            <div className="col-lg-9">
              <textarea
                type="textarea"
                name="description"
                col="40"
                row="40"
                className="form-control"
                value={inputSub.description}
                onChange={(e) => inputHandlerForText(e)}
              />
            </div>
          </div>
          <div className="col-sm-6 row d-flex align-items-center mb-4">
            <div className="col-lg-3 text-dark font-weight-bold">
              <label>Document Upload</label>
            </div>       
            <div className="col-lg-9">
              <div
                className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
              >
                <p className="display-4 mb-0">
                  <i className="fas fa-cloud-upload-alt text-primary "></i>
                </p>
                <p>Drag & Drop an document or Click</p>
                <input
                  type="file"
                  value={file.value}
                  name="file"
                  className="h-100 w-100 position-absolute top-50 start-50 pointer"
                  // accept={`image/*`}
                  onChange={(e) => inputHandlerForFile(e)}
                  multiple
                />
              </div>
            </div>
            {btnCheck && <div className="d-flex justify-content-end w-100 pr-3">                      
              <button className="doc-cancel" onClick={handleRemoveDoc}>Click to Cancel</button>          
            </div>}
          </div>
          <div className="col-sm-6 row d-flex align-items-center mb-4 ">
            {fileCheck && (    
              <>
              <div className="col-lg-3 text-dark font-weight-bold">
                <label className="font-weight-bold">Preview</label>
              </div>
              <motion.div className="col-lg-9" 
                initial={{scale: 0.5, opacity: 0.4}} animate={{scale: 1, opacity: 1}} transition={{type: "tween", stiffness: 10, duration: 0.1, delay: 0.1}}>
                <>
                  <div className="upload_Documents">
                    <div className="card  my-4">
                      <div className="card-body">
                        {/* <div className="noOfCountsForUpload">{''}</div> */}
                        <div className="UploadingDetails">
                          <div>
                            <h6> Name : </h6> <span>{file.name}</span>
                          </div>
                          <div>
                            <h6> Size : </h6> <span>{file.size}</span>
                          </div>
                        </div>
                        <div className="UploadImg">
                          <img src={file.src} />
                        </div>
                      </div>
                    </div>                 
                  </div>
                </>
              </motion.div>     
              </>              
            )}
          </div>
          <div className="col-sm-12 row d-flex align-items-center justify-content-center mb-4">
            <button
              className="btn btn-success"
              type="submit"
              disabled={isFormValid}
            >
              ADD
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateExpenseCreationSubList;
