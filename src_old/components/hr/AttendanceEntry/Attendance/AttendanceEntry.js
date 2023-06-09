import { Fragment } from "react";
import { useState, useEffect, useRef } from "react";
import { usePageTitle } from "../../../hooks/usePageTitle";
import Swal from "sweetalert2/src/sweetalert2.js";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useBaseUrl } from "./../../../hooks/useBaseUrl";
import Select from "react-select";
import LocalDateTime from "./../../../hooks/useLocalDateTime";
import styles from "../../../master/UserCreation/UserCreation.module.css";
import { ImageConfig } from "../../../hooks/Config";
import { useAllowedMIMEDocType } from "../../../hooks/useAllowedMIMEDocType";
import { useAllowedUploadFileSize } from "../../../hooks/useAllowedUploadFileSize";
import { useImageStoragePath } from "../../../hooks/useImageStoragePath";
import { FaDownload } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";

const selectFiles = {
  name: '',
  size: '',
  type: '',
  value: '',
  src: undefined,
};


const AttendanceEntry = () => {
  usePageTitle("Daily Attendance Entry");
  const { server1: baseUrl } = useBaseUrl()
  const navigate = useNavigate();
  const { id } = useParams();
  const [options, setOptions] = useState([]);  

  const initialState = {
    userId: '',
    attendanceType: '',
    fromDate: '',
    toDate: '',
    startTime: '',
    reason: '',   
  };
  const initialStateErr = {
    userIdErr: false,
    attendanceTypeErr: false,
  };
  const { MIMEtype: docType } = useAllowedMIMEDocType();
  const [accFileStorage, setAccFileStorage] = useState(0);
  const { total: totalStorageSize } = useAllowedUploadFileSize();
  const { attendance: filePath } = useImageStoragePath();
  const [dateTime, setDateTime] = useState(new Date());

  const [formIsValid, setFormIsValid] = useState(false);
  const [input, setInput] = useState(initialState);
  const [validation, setInputValidation] = useState(initialStateErr);
  const [isClicked, setIsClicked] = useState({
    userId: false,
    attendanceType: false
  });

  const [employeeList, setEmployeeList] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);

  const [files, setFiles] = useState({});
  const [fileData, setFileData] = useState([]);
  const [fileCheck, setFileCheck] = useState(null);
  const [fileSizeLimit, setFileSizeLimit] = useState({ error: '' });
  const [dataSending, setDataSending] = useState(false);
  const [file, setFile] = useState(selectFiles);
  const [fileListCheck, setFileListCheck] = useState(false);
  const [fileuploading, setFileUploading] = useState(false);  

  const [savedData, setSavedData] = useState({});



  useEffect(() => {
    axios.get(`${baseUrl}/api/employeelist`).then((resp) => {
      setEmployeeList(resp.data.employeelist);
     
    })

    axios.get(`${baseUrl}/api/attendancetypelist`).then((resp) => {
      setAttendanceList(resp.data.attendancetypelist);
    })

  }, [])  

  useEffect(() => {
    let fileCount = 1;
  
    if (id && employeeList.length >0 && attendanceList.length > 0) {
     getSavedList();
    }
    else{
      if(employeeList.find((x) => x.label == localStorage.getItem('userName'))){
        setInput((prev)=>{return{...prev, userId: employeeList.find((x) => x.label == localStorage.getItem('userName'))}});
      }
    }
  }, [id, baseUrl,employeeList, attendanceList])


const getSavedList = ()=>{
    axios.get(`${baseUrl}/api/attendanceregister/${id}`).then((resp) => {
        
      let setuserid = employeeList.find((x) => x.value == resp.data?.showattendance?.user_id);
      let setAttendanceType = attendanceList.find((x) => x.value == resp.data?.showattendance?.attendance_type_id);

      setInput({
        userId: setuserid,
        attendanceType: setAttendanceType,
        fromDate: resp.data.showattendance.from_date,
        toDate: resp.data.showattendance.to_date,
        startTime: resp.data.showattendance?.start_time ? resp.data.showattendance.start_time : '',
        reason: resp.data.showattendance.reason,              
      })

getAttendanceFiles(resp.data.attendanceFiles, 1);
})
}


//get the submittd file list
//here mode == 1  ---> file action happend for not submitted file. ie., locally added file have to be delete
//here mode == 0  ---> file action happend for submitted file. ie., no file is added locally added 

const getAttendanceFiles = (fileList, mode = 0) =>{

      let PreviweList=[];
      fileList.forEach((item)=>{
        let fileTypeRow = item.filetype? item.filetype: item.filetype === "" ? "application/x-rar-compressed": "";
        let fileNameExt = item.hasfilename.split('.')[item.hasfilename.split('.').length-1];
        let imgfilePath = filePath+item.hasfilename; 
        let fileExt = fileTypeRow.split("/")[1];
        let fileMIME = fileTypeRow.split("/")[0];
        let src = fileMIME === "image"
            ? imgfilePath
            : (fileMIME === "octet-stream" || (fileMIME === 'text' && (fileExt ==='csv' || fileExt ==='plain') && fileNameExt==='csv' ))
              ? ImageConfig["csv"]
              : (fileMIME === "octet-stream" || fileMIME === "application") &&
                (fileExt === "rar" || fileExt === "x-rar-compressed")
                ? ImageConfig["rar"]
                : ImageConfig[fileExt];
      
                PreviweList.push({
            name : item.filename,
            size: item.filesize,
            pic: src,
            rowId : item.id
            });
      
      }) 
      
      //Set fileData For Show preview of files
      if(mode === 1)
      {
      setFileData((prev)=>{
        return{
          ...prev,...PreviweList
        }
      });
    }
    else{
      setFileData({...PreviweList});
    }
  
    }

  useEffect(() => {
    const errors = validation;
    if (input.userId === null) {
      errors.userIdErr = true;
    } else {
      errors.userIdErr = false;
    }
    if (input.attendanceType === null) {
      errors.attendanceTypeErr = true;
    } else {
      errors.attendanceTypeErr = false;
    }
    setInputValidation((prev) => { return { ...prev, userIdErr: errors.userIdErr, attendanceTypeErr: errors.attendanceTypeErr } });

  }, [input])

  useEffect(() => {
    if (validation.userIdErr !== true && validation.attendanceTypeErr !== true) {
      setFormIsValid(true);
    } else {
      setFormIsValid(false);
    }
  }, [validation])

  const postData = (formData) => {
    axios({
      method: 'post',
      url: `${baseUrl}/api/attendanceregister`,
      data: formData,
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) =>{
      if(res.data.status === 200){
        Swal.fire({
          title: "Attendance Details",
          text: "Submitted Successfully...!",
          icon: "success",
          confirmButtonColor: "#2fba5f",
          timer: 1000,
        });
        getFileList();
      }
      else if(res.data.status === 400){
        Swal.fire({
          title: "Attendance Details",
          text: res.data.message,
          icon: "error",
          confirmButtonColor: "#2fba5f",
          timer: 1000,
        });
      }
      else{
        Swal.fire({
          title: "Attendance Details",
          text: "Failed to Submit",
          icon: "error",
          confirmButtonColor: "#2fba5f",
          timer: 1000,
        });
      }
      setDataSending(false)
    })

  }

  const putData = (data, id) => {

     axios({
      method: 'post',
      url: `${baseUrl}/api/attendanceregister/${id}`,
      data: data,
      headers:{
        'Content-Type': 'multipart/form-data'
      }
    }).then((res) =>{
    // axios.put(`${baseUrl}/api/attendanceregister/${id}`, data).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Attendance",
          text: "Status Updated Successfully!",
          confirmButtonColor: "#5156ed",
        });
        getFileList();
        // setInput(initialState)
        // navigate('/tender/hr/attendanceentry')
      } else if (res.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "Attendance",
          text: res.data.message,
          confirmButtonColor: "#5156ed",
        });
       
      }
      else{
        Swal.fire({
          icon: "error",
          title: "Attendance",
          text: "Unable to Update Record Now..!",
          confirmButtonColor: "#5156ed",
        });
      }
      setDataSending(false)
    });
  }

  const getFileList = () =>{
    
    let senddata = {
      "id": id,
      "tokenid": localStorage.getItem('token')
    }
    axios.post(`${baseUrl}/api/attendanceregister/fileList`, senddata).then((resp)=>{
      getAttendanceFiles(resp.data.attendanceFiles);
    }) 
  }

  
  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true)
        
    const formData = new FormData();
    formData.append('user_id', input.userId?.value); 
    formData.append('attendance_type_id',input.attendanceType?.value);  
    formData.append('from_date',input.fromDate);  
    formData.append('to_date',input.toDate);  
    formData.append('reason',input.reason);  
    formData.append('start_time',input.startTime);  
    // formData.append('file',file);      

    Object.values(files).forEach((item)=>{
      formData.append("file[]", item);
    })
    
    formData.append('tokenid',localStorage.getItem('token')); 

    if(id)
    {
      formData.append('_method',"PUT"); 
    }

          

    if (!id) {
      postData(formData);
    } else {
      putData(formData, id);
    }

  };

  const selectChangeHandler = (value, action) => {
    setInput((prev) => { return { ...prev, [action.name]: value } });
    setIsClicked((prev) => { return { ...prev, [action.name]: true } });
  }

  let fileCount = 1;



  useEffect(()=>{
        let PreviweList = [];      
      Object.values(files).forEach((item)=>{
        
        const fileType = item.type
        ? item.type
        : item.type === ""
          ? "application/x-rar-compressed"
          : "";
  
      if (docType.includes(fileType)) {
        
      //to skip text file. MIME type of text file and csv file are same. so we get the extension of a file to stop uploading .txt file
        if((fileType == "text/plain" && item.name.split('.').length[item.name.split('.').length]-1) =='txt')
      {
        
        Swal.fire({
          title: "File Type",
          text: "Invalid File Type..!",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
      else{
      
        // if (docType.includes(fileType)) {
        if (accFileStorage + item?.size <= totalStorageSize) {
          const Files = item;
          const FilesValue =item;
          const fileName = Files.name;
          const fileSize = (Files.size.toString().length > 6 ? (Files.size / 1e+6).toString().slice(0, -5) + ' MB' : (Files.size / 1000).toString().slice(0, -1) + ' KB');
  
          //Set fileData For Show preview of files
    let fileTypeRow = item.type? item.type: item.type === "" ? "application/x-rar-compressed": "";
    let urlRow = URL.createObjectURL(item); //
    let fileExt = fileTypeRow.split("/")[1];
    let fileMIME = fileTypeRow.split("/")[0];
    let src = fileMIME === "image"
        ? urlRow
        : fileMIME === "octet-stream" && fileExt === "csv"
          ? ImageConfig["csv"]
          : (fileMIME === "octet-stream" || fileMIME === "application") &&
            (fileExt === "rar" || fileExt === "x-rar-compressed")
            ? ImageConfig["rar"]
            : ImageConfig[fileExt];
  
            PreviweList.push({
        name : item.name,
        size: item.size,
        pic: src,
        rowId : ''
        });
  
        // accFileStorage
          setAccFileStorage((prev)=> {return prev + item.size});
          // setFileCheck(true);
            }
         else {
          Swal.fire({
            title: "File Storage",
            text: "Storage size Overflow..",
            icon: "error",
            confirmButtonColor: "#2fba5f",
          });
        }
      } }else {
        
        Swal.fire({
          title: "File Type",
          text: "Invalid File Type..!",
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
      })
      if(Object.keys(fileData).length > 0)
      {
          Object.values(fileData).forEach((obj)=>{
            PreviweList.push(obj);
          })
      }
      //Eliminate File Duplication 
      const uniqueArray = PreviweList.filter((obj, index, self) =>
      index === self.findIndex((o) => o.size === obj.size && o.name === obj.name));
      setFileData({...uniqueArray});
  
  },[files])

  
  const handleFile = (e) => {
    let filelist = Object.values(e.target.files).map((fileQ)=>{
      return fileQ;
    })
   setFiles((prev)=>{return{...prev, ...filelist}});    
  };

  const objectData = {
    name: file.name,
    size: file.size,
    pic: file.src,
  };

  //for Preview purpose only
  const addfiles = () => {
    let updated = [...fileData];
    updated.push(objectData);
    setFileData(updated);
    setFileListCheck(true);
    setFileSizeLimit({ ...fileSizeLimit, error: '' })
  };

  const handleFileAdd = (e) => {
    e.preventDefault();
    addfiles();
    // uploadFiles();      
    setFileCheck(false);
  };

  const removePreview = (e) => {
    e.preventDefault();
    setFileCheck(false);
    setFile({ ...file, value: '' })
    setFileSizeLimit('');
  };

  const downloadDoc = (fileid, filename) => {
    if(fileid!="")
    {
    let sendData={
      "id" : fileid,
      "fileName": filename
    }
    axios({
      url: `${baseUrl}/api/attendance/docdownload`,
      data: sendData,
      method: "POST",
      responseType: "blob", // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}`);
      document.body.appendChild(link);
      link.click();
    });
  }
  else{

    let blobFile = Object.values(files).find((x)=> x.name == filename);
    const url = window.URL.createObjectURL(new Blob([blobFile]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${filename}`);
      document.body.appendChild(link);
      link.click();
  }
  };

  const DeleteDoc = (fileid, filename) => {
    
    if(fileid==="")
    {

      //files has newly added files alone not stored/submitted files
      const fileArray = Object.values(files);

      const filteredFiles = fileArray.filter((x) => x.name != filename);
      
      setFiles(filteredFiles);


      //fileData has both newly added and stored/submitted files 
      //fileData used to display the list of files
      const fileArray1 = Object.values(fileData);
      const filteredFiles1 = fileArray1.filter((x) => x.name != filename);

      setFileData({...filteredFiles1}); 
    }
    else{    
    axios.delete(`${baseUrl}/api/destroyfile/${fileid}`).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          title: "File",
          text: "Removed Successfully..",
          icon: "success",
          confirmButtonColor: "#2fba5f",
        });
        // getSavedList(); 
        //here parameter '0' indicates the function that, file removed from server and have to update the list
        // getFileList(0);
      
        const fileArray2 = Object.values(fileData);
        const filteredFiles2 = fileArray2.filter((x) => (x.name != filename && x.rowId != fileid));
        setFileData({...filteredFiles2}); 

      } else {
        Swal.fire({
          title: "File",
          text: res.data.message,
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
    });
  }
  };

  const inputChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  return (
    <Fragment>
      <div className="AttendanceEntry">
        <div className="card shadow p-4 mb-4">
          <form onSubmit={submitHandler}>
            <div className="row">
              <div className="col-lg-6">
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>Employee Name <span className="text-danger h6">*</span></label>
                  </div>
                  <div className="col-lg-9">
                    <Select
                      name="userId"
                      id="userId"
                      isSearchable="true"
                      isClearable="true"
                      options={employeeList}
                      value={input.userId}
                      onChange={selectChangeHandler}
                    ></Select>
                    <div className="col-6 ml-n5 mt-2">
                      {(validation.userIdErr === true && isClicked.userId) &&
                        <span style={{ color: "red" }}>
                          Please Select Employee..!
                        </span>}
                    </div>
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>From Date<span className="text-danger h6">*</span></label>
                  </div>
                  <div className="col-lg-9">
                    <input type="date" className="form-control" name='fromDate' value={input.fromDate} onChange={(e) => inputChangeHandler(e)} />
                  </div>
                  <div className="col-6 ml-n5 mt-2">
                    {(validation.userIdErr === true && isClicked.userId) &&
                      <span style={{ color: "red" }}>
                        Please Select Employee..!
                      </span>}
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label htmlFor="startTime">Start Time</label>
                  </div>
                  <div className="col-lg-9">
                    <input type="time" id="startTime" name="startTime" className="form-control" value={input.startTime} onChange={inputChangeHandler}/>                   
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3 text-dark">
                    <label htmlFor="document" className="font-weight-bold">
                      Document
                    </label>
                  </div>
                  <div className="col-lg-9">
                    <div
                      className={`document border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input} `}
                    >
                      <p className="display-4 mb-0">
                        <i className="fas fa-cloud-upload-alt text-primary "></i>
                      </p>
                      <p>Drag & Drop an document or Click</p>
                      <input
                        type="file"
                        value={file.value}
                        name="image"
                        id="image"
                        className="h-100 w-100 position-absolute top-50 start-50 pointer"
                        // accept={`image/*`}
                        onChange={(e) => handleFile(e)}
                        multiple
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>Attendance Type <span className="text-danger h6">*</span>  </label>
                  </div>
                  <div className="col-lg-9">
                    <Select
                      name="attendanceType"
                      id="attendanceType"
                      isSearchable="true"
                      isClearable="true"
                      options={attendanceList}
                      value={input.attendanceType}
                      onChange={selectChangeHandler}
                    ></Select>
                    <div className="col-6 ml-n5 mt-2">
                      {(validation.attendanceTypeErr === true && isClicked.attendanceType) &&
                        <span style={{ color: "red" }}>
                          Please Select Attendance Type..!
                        </span>}
                    </div>
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>To Date<span className="text-danger h6">*</span></label>
                  </div>
                  <div className="col-lg-9">
                    <input type="date" className="form-control" name='toDate' value={input.toDate} onChange={(e) => inputChangeHandler(e)} />
                  </div>
                  <div className="col-6 ml-n5 mt-2">
                    {(validation.attendanceTypeErr === true && isClicked.attendanceType) &&
                      <span style={{ color: "red" }}>
                        Please Select Attendance Type..!
                      </span>}
                  </div>
                </div>
                <div className="row align-items-center mb-3">
                  <div className="col-lg-3">
                    <label>Reason </label>
                  </div>
                  <div className="col-lg-9">
                    <textarea cols={50} rows={2} className="form-control" name='reason' value={input.reason} onChange={(e) => inputChangeHandler(e)} />
                  </div>
                </div>
                {/* {fileCheck ?
                  <div className="row align-items-center mb-3">
                    <div className="col-lg-3">
                      <label className="font-weight-bold">Preview</label>
                    </div>
                    <div className="col-lg-9">
                      <>
                        <div className="upload_Documents">
                          <div className="card  my-4">
                            <div className="card-body">
                              <div className="UploadingDetails">
                                <div>
                                  <h6> Name : </h6> <span>{file.name}</span>
                                </div>
                                <div>
                                  <h6> Size : </h6> <span>{file.size}</span>
                                </div>
                              </div>
                              <div className="UploadImg">
                                <img
                                  src={file.src}
                                  onClick={() =>
                                    window.open(file.src, "_blank")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="btns">
                            <button
                              className="btn btn-info mr-2"
                              onClick={(e) => {
                                handleFileAdd(e);
                                // setFileUploading(true);
                              }}
                            >
                              {fileuploading ? "Adding..." : "Add"}
                            </button>
                            <button
                              className="btn btn-dark"
                              onClick={(e) => removePreview(e)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </>
                    </div>
                  </div> : fileSizeLimit.error
                } */}
              </div>
            </div>

            <div className="row align-items-center mb-4">
              <div className="col-lg-12">
               
                  <h6 className="listOfupload">
                    List of Uploaded documents
                  </h6>
               
              </div>
              <div className="col-lg-12">
                {/* {fileListCheck && ( */}
                  <div className="file_Documents">
                    
                    {Object.keys(fileData).length > 0 && (
                    Object.values(fileData).map((t, i) => (
                  
                      <div className="card" key={i}>
                        <div className="card-body">
                          <div className="noOfFiles">{fileCount++}</div>
                          <div className="fileDetails">
                            <div className="pic">
                              <img src={t.pic} alt="" />
                            </div>
                            <div className="text">
                              <div>
                                <h6>Name: </h6>
                                <p>{t.name} &nbsp;&nbsp; {!t.rowId && <i className="fa fa-info-circle text-warning" aria-hidden="true" title="File not Stored"></i>}</p>
                              </div>
                              <div>
                                <h6>Size: </h6>
                                <p>{(Math.round((t.size/1024) * 100) / 100).toFixed(2)} KB</p>
                              </div>
                            </div>
                          </div>
                          <div className="fileAction">
                            <div className="download" onClick={() => downloadDoc(t.rowId, t.name)}>
                              <FaDownload/>
                            </div>

                            <div className="delete" onClick={() => DeleteDoc(t.rowId, t.name)}> 
                              <RiDeleteBin5Fill/>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                    )}
                  </div>
                {/* )} */}
              </div>
            </div>
            <div className="row text-center">
              <div className="col-12">
                {id ? (
                  <button className="btn btn-primary" disabled={dataSending || !formIsValid} > {dataSending ? "Updating..." : "Update"}</button>
                ) : (
                  <button className="btn btn-primary" disabled={dataSending || !formIsValid}> {dataSending ? "Submitting..." : "Submit"}</button>
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





{/* <form onSubmit={submitHandler}>
<div className="row">
  <div className="col-2">
    <label>Employee Name</label>
  </div>
  <div className="col-10 mb-3">
    <div className="row">
      <div className="col-5 mr-5 ">
        <Select
          name="userId"
          id="userId"
          isSearchable="true"
          isClearable="true"
          options={employeeList}
          value={input.userId}
          onChange={selectChangeHandler}
        ></Select>
      </div>

      <div className="col-6 ml-n5 mt-2">
        {(validation.userIdErr === true && isClicked.userId) &&
          <span style={{ color: "red" }}>
            Please Select Employee..!
          </span>}
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
        {(validation.attendanceTypeErr === true && isClicked.attendanceType) &&
          <span style={{ color: "red" }}>
            Please Select Attendance Type..!
          </span>}
      </div>
    </div>
  </div>
</div>
<div className="row">
  <div className="col-2">
    <label>Server Time</label>
  </div>

  <div className="col-5 ml-3">
    <LocalDateTime />
  </div>
</div>
<div className="row text-center">
  <div className="col-12">
    {id ? (
      <button className="btn btn-primary" disabled={dataSending || !formIsValid} > {dataSending ? "Updating..." : "Update"}</button>
    ) : (
      <button className="btn btn-primary" disabled={dataSending || !formIsValid}> {dataSending ? "Submitting..." : "Submit"}</button>
    )}
  </div>
</div>
</form> */}