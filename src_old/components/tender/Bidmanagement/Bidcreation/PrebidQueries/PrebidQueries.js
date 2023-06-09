import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { useBaseUrl } from "../../../../hooks/useBaseUrl";
import useInputValidation from "../../../../hooks/useInputValidation";
import CollapseCard from "../../../../UI/CollapseCard";
import { isNotEmpty } from "../../../CommonFunctions/CommonFunctions";
import ReadyToUploadPreBid from "./ReadyTouploadPreBid";
import styles from './UploadDocPrebid.module.css';
import Swal from "sweetalert2";
import DocListPreBid from "./DocListPreBid";
import LockCard from "../../../../UI/LockCard";
import PreLoader from "../../../../UI/PreLoader";
import { acceptedFileTypes } from "../../../../master/FileConfig";

const PrebidQueries = () => {

    const [file, setFile] = useState(null);
    const [isDatasending, setdatasending] = useState(false);
    const [FetchLoading, setFetchLoading] = useState(false);
    const [isEditbtn, setisEditbtn] = useState(false)
    const [UploadDocId, setUploadDocId] = useState(null);
    const [dragover, setdragover] = useState(false);
    const [progress, setProgressCompleted] = useState(0)
    const [toastSuccess, toastError, setBidManagementMainId, bidManageMainId] = useOutletContext();
    const [totalSize, setTotal_size] = useState(0)

    const wrapperRef = useRef(null);
    const ref = useRef()
    const { id } = useParams();
    const { server1: baseUrl } = useBaseUrl();

    const {
        value: DateValue,
        isValid: DateIsValid,
        hasError: DateHasError,
        valueChangeHandler: DateChangeHandler,
        inputBlurHandler: DateBlurHandler,
        setInputValue: setDateValue,
        reset: resetDate,
    } = useInputValidation(isNotEmpty);

    useEffect(() => {

    }, [])

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

        let filetypes = newFile.type

        let uploadSize =0;
        if(!isEditbtn){
            uploadSize = (totalSize + (newFile.size/1000))/1000; 
        }

        if(file && isEditbtn){
            // console.log('yes')
            uploadSize = (totalSize + (newFile.size/1000) - (file.size/1000))/1000; 
        }

        // console.log('total size' , totalSize/1000)
        // console.log('newfile', newFile.size/(1000*1000))
        // console.log('fiel', file?.size/(1000*1000))
        // console.log('uploaded size',  uploadSize)
        

        let MaxSize = 50;
        if(uploadSize > MaxSize){
            alert('Maximun upload size (50 MB) limit reached');
            return;
        }


        if (acceptedFileTypes.includes(filetypes) || filetypes.split('/')[0] === "image" || newFile.name.split('.').pop() === 'rar' ){
            setFile(newFile);
        } else {
            alert("File format not suppoted. Upload pdf, doc, docx, csv, xlsx, zip, rar and images only")
        }

    }

    var config = {
        onUploadProgress: function (progressEvent) {
            var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgressCompleted(percentCompleted)
        }

    }


    const resetform = () => {
        resetDate();
        setFile(null)
        setisEditbtn(false)
        setUploadDocId(null)
    }


    let formIsValid = false;

    if (
        DateIsValid &&
        (file !== null)
    ) {
        formIsValid = true;
    }

    const postData = (data) => {

        axios.post(`${baseUrl}/api/bidcreation/prebidqueries/docupload`, data, config).then((resp) => {
            if (resp.data.status === 200) {
                ref.current.getDocList()
                resetform()
                toastSuccess(resp.data.message)
                // resetall()
                //   navigate("/tender/bidmanagement/list/main/bidcreationmain/"+resp.data.id);
                //   myRef.current.scrollIntoView({ behavior: 'smooth' })    
                // window.history.replaceState({},"Bid Creation", "/tender/bidmanagement/list/main/bidcreationmain/"+resp.data.id);
            } else if (resp.data.status === 400) {
                toastError(resp.data.message)
            } else {
                toastError("Unable to upload the document")
            }
            setdatasending(false)
        }).catch((err) => {

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
            })
            setdatasending(false)
        });
    }
    const putData = (data, UploadDocId) => {
        axios.post(`${baseUrl}/api/bidcreation/prebidqueries/docupload/${UploadDocId}`, data, config).then((resp) => {
            if (resp.data.status === 200) {
              ref.current.getDocList()
              resetform()
              toastSuccess(resp.data.message)
              // resetall()
              //   navigate("/tender/bidmanagement/list/main/bidcreationmain/"+resp.data.id);
              //   myRef.current.scrollIntoView({ behavior: 'smooth' })    
              // window.history.replaceState({},"Bid Creation", "/tender/bidmanagement/list/main/bidcreationmain/"+resp.data.id);
            } else if (resp.data.status === 400) {
              toastError(resp.data.message)
            }else {
              toastError("Unable to update")
            }
            setdatasending(false)
          }).catch((err) => {
           
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
            })
            setdatasending(false)
          });
    }

    const submitHandler = (e) => {
        e.preventDefault()

        setdatasending(true);

        if (!formIsValid) {
            setdatasending(false);
            return;
        }

        const formdata = new FormData();

        let data = {
            date: DateValue,
            file: file,
            tokenid: localStorage.getItem("token"),
            bid_creation_mainid: id,
        }

        if (file instanceof Blob) {
            data.file = new File([file], file.name);
        }

        for (var key in data) {
            formdata.append(key, data[key]);
        }


        if (id && UploadDocId === null && !isEditbtn) {
            postData(formdata)
        } else if (id && UploadDocId !== null && isEditbtn) {
            // postData(formdata)
            putData(formdata, UploadDocId)
        }

    }

    const editHandler = (item) => {
        setFetchLoading(true)
        setisEditbtn(true)
        setUploadDocId(item.id)

        axios({
            url: `${baseUrl}/api/download/prebidqueriesdocs/${item.id}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            if (response.status === 200) {
                response.data.name = item.file_original_name
                setFile(response.data)
                setDateValue(item.date)
            } else {
                alert("Unable to Process Now!")
            }
            setFetchLoading(false)
        });
    }
    
    return (
        <CollapseCard id={"PrebidQueries"} title={"Prebid Queries"}>
            <LockCard locked={!id}>
                <PreLoader loading={FetchLoading}>
                <form onSubmit={submitHandler} encType="multipart/form-data">
                    <div className="row align-items-baseline">
                        <div className="inputgroup col-lg-6 mb-4 ">
                            <div className="row align-items-center font-weight-bold">
                                <div className="col-lg-4 text-dark">
                                    <label htmlFor="Date" className="pr-3">
                                        Date <span className="text-danger">*</span> : 
                                    </label>
                                </div>
                                <div className="col-lg-8">
                                    <input
                                        type="Date"
                                        className="form-control"
                                        id="Date"
                                        placeholder="Enter Date"
                                        name="Date"
                                        value={DateValue}
                                        onChange={DateChangeHandler}
                                        onBlur={DateBlurHandler}
                                        disabled={false}
                                    />
                                    {DateHasError && (
                                        <div className="pt-1">
                                            <span className="text-danger font-weight-normal">
                                                Date is required
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {(file !== null) && <div className="row">
                                <div className="col-lg-4 text-dark font-weight-bold mt-4">
                                    <label htmlFor="docname" className="pr-3 mt-3 ">
                                        (Ready to Upload)
                                    </label>
                                </div>
                                <div className="col-lg-8 text-dark mt-1">
                                    <ReadyToUploadPreBid file={file} date={DateValue} />
                                </div>
                            </div>}
                        </div>
                        <div className="inputgroup col-lg-6 mb-4">
                            <div className="row ">
                                <div className="col-lg-4 text-dark font-weight-bold">
                                    <label htmlFor="customername">Document Upload <span className="text-danger">*</span> :</label>
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
                                        <input type="file" value="" className="h-100 w-100 position-absolute top-50 start-50 pointer" accept={`${acceptedFileTypes.join()}`} onChange={onFileDrop} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 d-flex justify-content-center">
                            {!isEditbtn &&
                                <button
                                    className={(!formIsValid) ? "btn btn-outline-primary rounded-pill px-4" : "btn btn-primary rounded-pill px-4"}
                                    disabled={!formIsValid || isDatasending || FetchLoading}
                                >
                                    {isDatasending && <span className="spinner-border spinner-border-sm mr-2"></span>}
                                    {isDatasending && progress + '% Uploaded'}
                                    {!isDatasending && 'Add'}
                                </button>}
                            {isEditbtn &&
                                <button
                                    className={(!formIsValid) ? "btn btn-outline-primary rounded-pill px-4" : "btn btn-primary rounded-pill px-4"}
                                    disabled={!formIsValid || isDatasending || FetchLoading}
                                >
                                    {isDatasending && <span className="spinner-border spinner-border-sm mr-2"></span>}
                                    {isDatasending && progress + '%  Updating...'}
                                    {!isDatasending && 'Update'}
                                </button>}

                            <button
                                className="btn  btn-outline-dark rounded-pill mx-3"
                                onClick={resetform}
                                disabled={isDatasending || FetchLoading}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </form>
                </PreLoader>
                <DocListPreBid ref={ref} BidCreationId={id} onEdit={editHandler} setTotalSize={setTotal_size}/>
            </LockCard>
          
        </CollapseCard>
    )
}
export default PrebidQueries;