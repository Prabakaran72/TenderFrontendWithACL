import {useState} from 'react';
import ReadyToUpload from "./ReadyToUpload";

const DocumentUploadForm = () =>{


    return (
        <>
 <div className="row">
                                <div className="col-lg-4 text-dark font-weight-bold mt-4">
                                    <label htmlFor="docname" className="pr-3 mt-3 ">
                                        (Ready to Upload)
                                    </label>
                                </div>
                                <div className="col-lg-8 text-dark mt-1">
                                    <ReadyToUpload file={file} date={DateValue} />
                                </div>
                            </div>

                            <div className="inputgroup col-lg-6 mb-4">
                            <div className="row ">
                                <div className="col-lg-4 text-dark font-weight-bold">
                                    <label htmlFor="customername">Document Upload :</label>
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
                <DocListPreBid ref={ref} BidCreationId={id} onEdit={editHandler} setTotalSize={setTotal_size}/>
        </>
    )

}

export default DocumentUploadForm;