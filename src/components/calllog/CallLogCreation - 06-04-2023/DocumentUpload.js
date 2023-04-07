import axios from "axios";
import { useState } from "react";
import DocumentList from "./DocumentList";
import Swal from "sweetalert2";

const DocumentUpload = (props) =>{

    const [file, setFile] = useState({});
    const [fileCheck, setFileCheck] = useState(null);
    const [fileListCheck, setFileListCheck] = useState(null);
    const [fileData, SetFileData] = useState([]);


    const objectData = {
        name: file.name,
        size: file.size,
        pic: file.src,
      };

    const handleFileAdd = (e) => {
        e.preventDefault();
        let updated = [...fileData];
        console.log("file",file);
        updated.push(objectData);
    //$$$
        SetFileData(updated);
        setFileListCheck(true);
        setFileCheck(false);
        Swal.fire({
          text: "Uploaded Successfully",
          icon: "success",
          confirmButtonColor: "#12c350",
        });
      };
    
      const removePreview = (e) => {
        e.preventDefault();
        setFileCheck(false);
      };
    
 
    return (
        <div className="row align-items-center">
        <div className="col-lg-4">
          <label className="font-weight-bold">Preview</label>
        </div>
        <div className="col-lg-8">
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
                    <img src={file.src} />
                  </div>
                </div>
              </div>
              <div className="btns">
                <button
                  className="btn btn-info mr-2"
                  onClick={(e) => handleFileAdd(e)}
                >
                  Add
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
        <DocumentList id={props}/>
      </div>
  
  






    
    
    )
}

export default DocumentUpload;