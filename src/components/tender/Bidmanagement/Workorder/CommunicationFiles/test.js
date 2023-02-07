{imagePreviews && (
    <div>
      {imagePreviews.map((img, i) => {
        return (
    <div className="card border-left-info shadow py-2 w-100 my-4">
      <div className="card-body">
        <div className="row no-gutters align-items-center">
          <div className="col-md-9">
            <div className="font-weight-bold text-info text-uppercase mb-1">
              {input.date}
            </div>

            <div className="row no-gutters align-items-center ">
              <div className="col-auto">
                <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                  <p className="text-truncate">{file.name}</p>
                  <p>({file.size / 1000} KB)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 d-flex align-items-center justify-content-center">
         
          <img

            className="rounded-circle pointer"
            id="previewImg"
            src={!isPdfFile ? img : "assets/icons/pdf_logo.png"}
            alt="No Image"
                    width="75px"
                    height="75px"
                    onClick={() =>
                      window.open(img, "_blank")
                    }
                    title="Click for Preview"
              />
              
      
      
             &nbsp;&nbsp;&nbsp;
           
              <span
                className="fa fa-close text-danger h4 closebtn"
                onClick={removeImgHandler}
              >
                &nbsp;
              </span>
              
          </div>
        </div>
      </div>
    </div>
    );
})}
</div>
)}

{imagePreviews && (
    <div>
<table
className="table   text-center"

width="100%"
cellSpacing={0}
>
   <thead className="text-center bg-success  text-white">
  <tr>
    <th scope="col">#</th>
    <th scope="col">Image Name</th>
    <th scope="col">Image preview</th>

  </tr>
</thead>
<tbody className="bg-white">
{
imagePreviews.map((img, i) => {
   
 return (
    <tr>
            <td>{index+1}</td>
            <td></td>
            <td><img

className="rounded-circle pointer"
id="previewImg"
src={!isPdfFile ? img : "assets/icons/pdf_logo.png"}
alt="No Image"
        width="75px"
        height="75px"
        onClick={() =>
          window.open(img, "_blank")
        }
        title="Click for Preview"
  /></td>
            <td>
    <span className="fa fa-close text-danger h4 closebtn" onClick={removeImgHandler} ></span>
              </td>
               </tr>
            );

       
           
       })
       
       } 
      </tbody>
</table>
</div>
)}



{file === "" && previewForEdit !== "" && (
  <div className="card border-left-info shadow py-2 w-100 my-4">
    <div className="card-body">
      <div className="row no-gutters align-items-center">
        <div className="col-md-9">
          <div className="font-weight-bold text-info text-uppercase mb-1">
            {/* {competitorQCInput.cerName} */}
          </div>

          {/* <div className="row no-gutters align-items-center ">
              <div className="col-auto">
                  <div className="h6 mb-0 mr-3 font-weight-bold text-gray-800 ">
                      <p className="text-truncate">
                          {file.name}
                      </p>
                      <p>({file.size/1000} KB)</p>
                  </div>
              </div>
          </div> */}
        </div>
        <div className="col-md-3 d-flex align-items-center justify-content-center">
          {previewForEdit !== "" && (
            <img
              className="rounded-circle pointer"
              id="previewImg"
              src={!isPdfFile ? previewForEdit : "assets/icons/pdf_logo.png"}
              alt="No Image"
              width="75px"
              height="75px"
              onClick={() =>
                window.open(previewForEdit, "_blank")
              }
              title="Click for Preview"
            />
          )}
          &nbsp;&nbsp;&nbsp;
          {/* {previewForEdit !== "" && (
            <span
              className="fa fa-close text-danger h4 closebtn"
              onClick={removeImgHandler}
            >
              &nbsp;
            </span>
          )} */}
        </div>
      </div>
    </div>
  </div>
)}