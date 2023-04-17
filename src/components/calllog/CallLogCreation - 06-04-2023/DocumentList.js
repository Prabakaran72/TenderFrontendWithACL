import axios from "axios";

const DocumentList = (props) =>{

    console.log("Props Document List ", props);

    return (


        
  <div className="inputgroup col-lg-12 mb-4 ">
  <div className="row align-items-center">
    <div className="col-lg-12">
      {fileListCheck && (
        <h6 className="listOfupload">
          List of Uploaded documents
        </h6>
      )}
    </div>
    <div className="col-lg-12">
      <DocumentUpload id={id} fileData={fileData} />
      {fileListCheck && (
        
          <div className="file_Documents">
            {fileData.map((t, i) => (
        
                <div className="card" key={i}>
                  <div className="card-body">
                    <div className="noOfFiles" >
                      {fileCount++}
                    </div>
                    <div className="fileDetails">
                      <div className="pic">
                        <img src={t.pic} alt="" />
                      </div>
                      <div className="text">
                        <div>
                          <h6>Name: </h6>
                          <p>{t.name}</p>
                        </div>
                        <div>
                          <h6>Size: </h6>
                          <p>{t.size}</p>
                        </div>
                      </div>
                    </div>
                    <div className="fileAction">
                      <div className="download">
                        <a href="#" download>
                          <FaDownload />
                        </a>
                      </div>
                      <div className="edit">
                        <FiEdit />
                      </div>
                      <div className="delete">
                        <RiDeleteBin5Fill />
                      </div>
                    </div>
                  </div>
                </div>
              
            ))}
          </div>
        
      )}
    </div>
  </div>
</div>
    )
}

export default DocumentList;