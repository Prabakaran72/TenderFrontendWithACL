import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
import { useNavigate} from "react-router-dom";
import { usePageTitle } from "../../hooks/usePageTitle";
import Select from "react-select";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import axios from "axios";
import Swal from "sweetalert2/src/sweetalert2.js";

const initialState = {
  organisation: "",
  customerName: "",
  nitDate: "",
  tenderType: "",
};

const initialStateErr = {
  organisation: null,
  customerName: null,
  nitDate: null,
  tenderType: null,
};

const Tendercreation = () => {
  usePageTitle("Tender Creation");
  // const { id } = useParams();
  const navigate = useNavigate();

  const { server1: baseUrl } = useBaseUrl();

  const [dataSending, setDataSending] = useState(false);
  const [input, setInput] = useState(initialState);
  const [inputValidation, setInputValidation] = useState(initialStateErr);
  // const [organisationList, setOrganisationList] = useState();
  // const [customerNameList, setCustomerNameList] = useState();
  const [tenderTypeList, setTenderTypeList] = useState({
    value: "",
    label:""
  });
  const [formIsValid, setFormIsValid] = useState(false);
  // const [loading, setLoading] = useState(false);
  let tokenId = localStorage.getItem("token");
  // const [savedData, setSavedData] = useState({});

 

  useEffect(() => {
    // getOrganisationList();
    // getCustomerNameList();
    getTenderTypeList();
  }, []);

  // const getOrganisationList = () => {
  //   axios.get(`${baseUrl}/api/organisation/list`).then((resp) => {
  //     setOrganisationList(resp.data.organisationList);
  //   });
  // };
  // const getCustomerNameList = () => {
  //   axios.get(`${baseUrl}/api/customerName/list`).then((resp) => {
  //     setCustomerNameList(resp.data.customerNameList);
  //   });
  // };

  const getTenderTypeList = () => {
    axios.get(`${baseUrl}/api/tendertype/list`).then((resp) => {
      setTenderTypeList(resp.data.tendertypeList);
    });
  };

  const inputHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
    if(e.target.value === "")
    {
        setInputValidation({...inputValidation, [e.target.name]:true});
    }
    else{
      setInputValidation({...inputValidation, [e.target.name]:false});
    }
  };

  const inputHandlerForSelect = (value, action) => {
    
    setInput({
      ...input,
      [action.name]: value,
    });
    if(value === "" | value === null)
    {
        setInputValidation({...inputValidation, [action.name]:true});
    }
    else{
      setInputValidation({...inputValidation, [action.name]:false});
    }
  };
 
  useEffect(()=>{
    if(input.customerName!=="" && input.nitDate!=="" && input.organisation!=="" && (input.tenderType.value!=="" | input.tenderType.value!==undefined))
    {
      setFormIsValid(true);
    }
  },[input]);

  const postData = (data) => {
    axios.post(`${baseUrl}/api/tendercreation`, data).then((resp) => {
      if (resp.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Tender",
          text:  resp.data.message,
          confirmButtonColor: "#5156ed",
        });
        // setInput(initialState);
      navigate("/tender/bidmanagement/list/main/bidcreationmain/");
      } else if (resp.data.status === 400) {
        Swal.fire({
          icon: "error",
          title: "City",
          text: resp.data.errors,
          confirmButtonColor: "#5156ed",
        });
       
      }
      setDataSending(false);
      setFormIsValid(false);
    });
  };

  // const putData = (data, id) => {
  //   axios.put(`${baseUrl}/api/city/${id}`, data).then((res) => {
  //     if (res.data.status === 200) {
  //       Swal.fire({
  //         icon: "success",
  //         title: "City",
  //         text: "Updated Successfully!",
  //         confirmButtonColor: "#5156ed",
  //       });
  //       setInput(initialState);
  //     } else if (res.data.status === 400) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "City",
  //         text: res.data.errors,
  //         confirmButtonColor: "#5156ed",
  //       });
  //       setDataSending(false);
  //     }
  //   });
  // };

  const submitHandler = (e) => {
    e.preventDefault();
    setDataSending(true); 
    if(input.customerName!=="" && input.nitDate!=="" && input.organisation!=="" && (input.tenderType.value!=="" | input.tenderType.value!==undefined))
    {
      setDataSending(false);
    
      const data = {
        organisation: input.organisation,
        customername: input.customerName,
        nitdate: input.nitDate,
        tendertype: input.tenderType.value,
        tokenId:tokenId
      };
      postData(data)
      // if (!id) {
      //   postData(data);
      // } else {
      //   putData(data, id);
      // }
    }
  };

  // const updateHandler = (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   //Have to write, when need Update option 
  // }
    


  const cancelHandler = () => {
    setInput(initialState);
    setInputValidation(initialStateErr);
    setFormIsValid(false);
    setDataSending(false);
    // setLoading(false);
  };

    return (
    <div className="card-body ">
    <form>
      <div className="row align-items-center">
      <div className="inputgroup col-lg-5 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
              <label htmlFor="organisation" className="font-weight-bold"> Organisation </label>
            </div>
            <div className="col-lg-8">
            <input
                type="text"
                className="form-control"
                id="organisation"
                placeholder="Enter Organisation Name"
                name="organisation"
                value={input.organisation}
                onChange={inputHandler}                  
              />
              
              {inputValidation.organisation && (
                <div className="pt-1">
                  <span className="text-danger font-weight-bold">
                    Enter Valid Input..!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="inputgroup col-lg-1 mb-4"></div>

        <div className="inputgroup col-lg-5 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
              <label htmlFor="customerName" className="font-weight-bold">
              Customer Name
              </label>
            </div>
            <div className="col-lg-8">
            <input
                type="text"
                className="form-control"
                id="customerName"
                placeholder="Enter Customer Name"
                name="customerName"
                value={input.customerName}
                onChange={inputHandler}                  
              />
              
              {inputValidation.customerName && (
                <div className="pt-1">
                  <span className="text-danger font-weight-bold">
                    Enter Valid Input..!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        

        <div className="inputgroup col-lg-5 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
                <label htmlFor="tenderType" className="font-weight-bold">
                  Tender Type<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="tenderType"
                  id="tenderType"
                  isSearchable="true"
                  isClearable="true"
                  options={tenderTypeList}
                  value={input.tenderType}
                  onChange={inputHandlerForSelect}
                  
                ></Select>
                {inputValidation.tenderType && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Tender Type..!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-1 mb-4"></div>

          <div className="inputgroup col-lg-5 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark font-weight-bold">
                <label htmlFor="nitDate">
                  NIT Date<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <input
                  type="date"
                  className="form-control"
                  id="nitDate"
                  name="nitDate"
                  value={input.nitDate}
                  onChange={inputHandler}
                />
                {inputValidation.nitDate && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Valid Date..!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div> 
          <div className="inputgroup col-lg-6 mb-4"></div>
          <div className="inputgroup col-lg-6 mb-4"></div>
          <div className="inputgroup col-lg-12 mb-4 ml-3">
            <div className="row align-items-center">
              <div className="col-lg-10 text-right ">
                <button
                  className="btn btn-primary"
                  disabled={!formIsValid}
                  onClick={submitHandler}
                  >
                    {dataSending === true ? "Submitting...." : "Save & Countinue"}
                {/*//   onClick={!id ? submitHandler : updateHandler}
                // >
                //   { !id ?
                //         loading === true ? "Submitting...." : "Save & Countinue"
                //         : loading === true ? "Updating...." : "Update"
                // */}
                </button>
              </div>
              <div className="col-lg-1 text-left">
                <button className="btn btn-secondary" onClick={cancelHandler}>
                  Cancel
                </button>
              </div>
            </div>
          </div>       
          </div></form></div>
  );
};

export default Tendercreation;
