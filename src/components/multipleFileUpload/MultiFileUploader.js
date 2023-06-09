import React, { useState, useRef } from 'react';
import axios from 'axios';
import styles from "./MultiFileUploader.module.css";
import { ImageConfig } from "../hooks/Config";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaDownload } from "react-icons/fa";
import {useAllowedUploadFileSize} from '../hooks/useAllowedUploadFileSize';
import { useBaseUrl } from "../hooks/useBaseUrl";
import Swal from "sweetalert2";
import { useEffect } from 'react';
import { useImageStoragePath } from "../hooks/useImageStoragePath";

const MultiFileUploader = ({setFileList,  APItoGetFileList,  APItoDeleteFile,  APItoDownloadFile,  ImageStoragePath, mainId, setInitiateRerender, DbOriginalFileName,DbHashedFileName,DbFileSize}) => {

//Props has 
//1)setFileList => to set the latest uploaded files to parent component state
//2) APItoGetFileList => to get list of file details
//3) APItoDeleteFile => api to delete a file from server
//4) APItoDownloadFile=> api to downlaod a file
//5) ImageStoragePath=> Storage path for show image preview, which the files are stored in server


  const [selectedFiles, setSelectedFiles] = useState([]);
  const [totalFileList, setTotalFileList] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const MAX_TEXT_LENGTH = 20; // Maximum length for the card title
  const {total: Total_Max_file_size}=useAllowedUploadFileSize();
  const accumulatedStorageSize = useRef(0);
  const { server1: baseUrl } = useBaseUrl();
 console.log("totalFileList",totalFileList)
let fileObject = {
    id: 0,  //subid if this file is stored in DB
    file: '', 
    name: '',
    type: '',
    size: '',
    value: '',
    src:''
}

useEffect(()=>{
    if(mainId)
    {
      setInitiateRerender(1);
    axios({
      url: `${baseUrl}/api/${APItoGetFileList}${mainId}`,
      method: "GET",
      headers: {
        //to stop cacheing this response at browsers. otherwise wrongly displayed cached files
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
    }).then((res) => {
      let files = res.data.docs;
      console.log(files);
      if (res.status === 200) {
        let updatedSelectedFiles = [];
        let totalFiles = [];
        for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'rar', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
        const fileExtension = file[DbOriginalFileName].split('.').pop().toLowerCase();
          if (allowedExtensions.includes(fileExtension)) 
          {
              let totalSize = accumulatedStorageSize.current + (parseFloat(file[DbFileSize]));
              if(totalSize <= Total_Max_file_size)
              {
               
                accumulatedStorageSize.current = accumulatedStorageSize.current + (parseFloat(file[DbFileSize]));
              
              // If it's an image file, create a preview URL
              const imageExtensions = ['png', 'jpg', 'jpeg'];
              const fileExtension = file[DbOriginalFileName].split('.').pop().toLowerCase();
              
                if (imageExtensions.includes(fileExtension)) {
                  file.previewURL = URL.createObjectURL(new Blob([ImageStoragePath+file[DbHashedFileName]]));
                  
                fileObject = {'id' : file.id, 'file': file,'oName':file[DbOriginalFileName],'hName':file[DbHashedFileName], type:file.filetype, size:file[DbFileSize], src:file.previewURL};
                totalFiles.push(fileObject);
                updatedSelectedFiles.push(file);
            }
            else{
              Swal.fire({
                title: "File Storage",
                text: "Limit reached for this Entry..!",
                icon: "error",
                confirmButtonColor: "#2fba5f",
              });
            }
          }
          else{
            Swal.fire({
              title: "File Type",
              text: "Invalid File Type..!",
              icon: "error",
              confirmButtonColor: "#2fba5f",
            });
          }
          console.log("updatedSelectedFiles",updatedSelectedFiles);
      }
      console.log("totalFiles",totalFiles)
      setTotalFileList(totalFiles);
      setUploadedFiles(updatedSelectedFiles);
    }}})
    }
},[mainId])

  const handleFileSelection = (event) => {
    const files = event.target.files;
    const updatedSelectedFiles = [...selectedFiles];
    let newlyAddedFiles=[...totalFileList]; //to set file list to display to users
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Check if the file extension is allowed
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'rar', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
      if (allowedExtensions.includes(fileExtension)) {
        let totalSize = accumulatedStorageSize.current + file.size;
        if(totalSize <= Total_Max_file_size)
        {
        updatedSelectedFiles.push(file);
        accumulatedStorageSize.current = accumulatedStorageSize.current + file.size;
         
        // If it's an image file, create a preview URL
        const imageExtensions = ['png', 'jpg', 'jpeg'];
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (imageExtensions.includes(fileExtension)) {
          file.previewURL = URL.createObjectURL(file);
          fileObject = {'id' : 0, 'file': file,'oName':file.name,'hName':'', type:file.type, size:file.size, src:file.previewURL};
          console.log("fileObject",fileObject)
          newlyAddedFiles.push(fileObject);
        }
      }
      else{
        alert("File Storage limit reached for this Entry..!");
      }
    }
    }
    setFileList(updatedSelectedFiles);
    // let existingFiles ={...totalFileList};
    // let newFiles ={...newlyAddedFiles};
    
    setTotalFileList(newlyAddedFiles);
    setSelectedFiles(updatedSelectedFiles);
  };

  const isFileTypeAllowed = (file) => {
    const allowedExtensions = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'rar', 'doc', 'docx', 'xls', 'xlsx', 'csv'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const isImageFile = (file) => {
    const imageExtensions = ['png', 'jpg', 'jpeg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return imageExtensions.includes(fileExtension);
  };

  const isRarFile = (file) => {
    console.log("File", file)
    if(file.type === '')
    {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      return fileExtension === 'rar' && true;
    }
      return false;
  };

  const handleDeleteFile = (file) => {
    const updatedSelectedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file);
    setSelectedFiles(updatedSelectedFiles);
    setFileList(updatedSelectedFiles);
  };


  const DeleteDoc = (fileid, filename) => {
    axios.delete(`${baseUrl}/api/callfileupload/${fileid}`).then((res) => {
      if (res.data.status === 200) {
        Swal.fire({
          title: "File",
          text: "Removed Successfully..",
          icon: "success",
          confirmButtonColor: "#2fba5f",
        });
        // getFileList();
      } else {
        Swal.fire({
          title: "File",
          text: res.data.message,
          icon: "error",
          confirmButtonColor: "#2fba5f",
        });
      }
    });
  };



  const handleDownloadFile = (file) => {
    // Implement file download logic here
    console.log('Download file:', file);
  };
console.log("SelectedFiles", selectedFiles)
console.log("uploaded Files", uploadedFiles)

  const renderSelectedFiles = () => {
    return (
      <div className="mt-4">
        <h3>Selected Files:</h3>
        <div className="row">
          {selectedFiles.map((file, index) => (
            <div className="file_Documents col-lg-4">
            <div className="card filecard bg-light shadow-lg">
            <div key={index} className="mb-3">
              <div className="card-body">
              
              <div className="fileDetails ">
                  <div className="pic">
                    {/* {isImageFile(file) ? (
                    <img className="card-img-top" src={file.previewURL} alt={file.name} />
                    ) : isRarFile(file) ? (
                    <img className="card-img-top" src={ImageConfig['rar']} alt={file.name} />)
                      : (<img className="card-img-top" src={ImageConfig[file.type.split('/').pop()]} alt={file.name} />
                      )} */}
                  </div>
                  <div className="text">
                    <div>
                      <h6>Name: </h6>
                      <p>
                        {/* {file.name} */}
                      
                      {file.name.length > MAX_TEXT_LENGTH ? `${file.name.slice(0, MAX_TEXT_LENGTH)}...` : file.name}
                      
                      </p>
                    </div>
                    <div>
                      <h6>Size: </h6>
                      <p>{(file.size/(1200*1024)).toFixed(2) + "Mb"} </p>
                    </div>
                  </div>
              </div>
              <div className="fileAction">
               <div className="download">
                  <FaDownload
                    // onClick={() => downloadDoc(t.id, t.name)}
                    onClick={() => handleDownloadFile(file)}
                  />
                </div>
                <div className="delete">
                  <RiDeleteBin5Fill
                    // onClick={() => DeleteDoc(t.id, t.name)}
                    onClick={() => handleDeleteFile(file)}
                  />
                </div>
              </div>
                </div>
                </div>
                </div>
               </div>
            // </div>
          ))}
        </div>
      </div>
    );
  };

  const renderUploadedFiles = () => { 
    return (
      <div className="mt-4">
        <h3>Uploaded Files:</h3>
        <div className="row">
          {uploadedFiles.map((file, index) => (
            <div key={index} className="col-lg-12 mb-3">
              <div className="card">
                {/* {isImageFile(file) ? (
                  <img className="card-img-top" src={file.previewURL} alt={file.name} />
                ) :  isRarFile(file) ? (
                  <img className="card-img-top" src={ImageConfig['rar']} alt={file.name} />)
                  : (<img className="card-img-top" src={ImageConfig[file.type.split('/').pop()]} alt={file.name} />
                )} */}
                <div className="card-body">
                  <h5 className="card-title">{file.name}</h5>
                  {/* <button className="btn btn-danger" onClick={() => handleDeleteFile(file)}>Delete</button>
                  <button className="btn btn-primary" onClick={() => handleDownloadFile(file)}>Download</button> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="row align-items-center">
      <div className="col-lg-4 text-dark">
                      <label htmlFor="document" className="font-weight-bold">
                        Document
                      </label>
                    </div>
                    <div className="col-lg-8">
                      <div
                        className={`border-primary d-flex flex-column align-items-center justify-content-center   bg-gray-200 ${styles.height_of_dropbox} ${styles.boderradius__dropbox} ${styles.dashed} ${styles.drop_file_input}`}
                        onDrop={handleFileSelection}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        <p className="display-4 mb-0">
                          <i className="fas fa-cloud-upload-alt text-primary "></i>
                        </p>
                        <p>Drag & Drop an document or Click</p>
                        <input
                          type="file"
                          className="h-100 w-100 position-absolute top-50 start-50 pointer"
                          onChange={handleFileSelection}
                          accept=".png, .jpg, .jpeg, .pdf, .zip, .rar, .doc, .docx, .xls, .xlsx, .csv"
                          multiple
                        />
                      </div>
                    </div>


      {/* {selectedFiles.length > 0 && (
        <div className="mt-4">
          <button className="btn btn-primary" onClick={handleFileUpload}>Upload</button>
        </div>
      )} */}

      {selectedFiles.length > 0 && renderSelectedFiles()}
      {uploadedFiles.length > 0 && renderUploadedFiles()}
    </div>
  );
};

export default MultiFileUploader;
