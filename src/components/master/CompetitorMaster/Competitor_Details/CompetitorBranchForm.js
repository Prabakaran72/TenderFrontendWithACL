import { usePageTitle } from "../../../hooks/usePageTitle";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBaseUrl } from "../../../hooks/useBaseUrl";
import Select from "react-select";
import Swal from "sweetalert2";
// import { Loader } from "rsuite";
import CompetitorDetailsBranchList from "./CompetitorDetailsBranchList";
import { data } from "jquery";

let table;

const CompetitorBranchForm = () => {
  const { compid } = useParams();
  usePageTitle("Competitor Creation");
  const initialValue = {
    branchId: null,
    compNo: null,
    country: null,
    state: null,
    district: null,
    city: null,
  };
  const [competitorBranchInput, setCompetitorBranchInput] =
    useState(initialValue);

  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [cityList, setCityList] = useState([]);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const [editableRow, setEditableRow] = useState({
    branchId: null,
    compNo: null,
    country: null,
    state: null,
    district: null,
    city: null,
  });
  // const [isMounted, setIsMounted] = useState(true);
  const [isChanged, setIsChanged] = useState({
    country: false,
    state: false,
    district: false,
    city: false,
  });
  const [hasError, setHasError] = useState({
    country: null,
    state: null,
    district: null,
    city: null,
  });
  let tokenId = localStorage.getItem("token");
  var dataSet = [];
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();

  useEffect(() => {
    getCompNo();
    getCountryList();
    getBranchList();
  }, []);

  const getCompNo = async () => {
    await axios
      .get(`${baseUrl}/api/competitorprofile/getcompno/${compid}`)
      .then((resp) => {
        if (resp.data.status === 200) {
          setCompetitorBranchInput({
            ...competitorBranchInput,
            compNo: resp.data.compNo,
          });
        }
      });
  };
  const getCountryList = async () => {
    await axios.get(`${baseUrl}/api/country/list`).then((resp) => {
      setCountryList(resp.data.countryList);
    });
  };
console.log(competitorBranchInput)
  const getStateList = async () => {

    if (competitorBranchInput.country !== null) {
      await axios
        .get(`${baseUrl}/api/state/list/${competitorBranchInput.country.value}`)
        .then((resp) => {
          setStateList(resp.data.stateList);
          
        });
    }
  };
  const getDistrictList = async () => {
    if (
      competitorBranchInput.country !== null &&
      competitorBranchInput.state !== null
    ) {
      await axios
        .get(
          `${baseUrl}/api/district/list/${competitorBranchInput.country.value}/${competitorBranchInput.state.value}`
        )
        .then((resp) => {
          setDistrictList(resp.data.districtList);
        });
    }
  };
  const getCityList = async () => {
    if (
      competitorBranchInput.country !== null &&
      competitorBranchInput.state !== null &&
      competitorBranchInput.district !== null
    ) {
      await axios
        .get(
          `${baseUrl}/api/city/list/${competitorBranchInput.country.value}/${competitorBranchInput.state.value}/${competitorBranchInput.district.value}/null`
        )
        .then((resp) => {
          setCityList(resp.data.cityList);
        });
    }
  };

  const getBranchList = () => {
    axios
      .get(`${baseUrl}/api/competitorbranch/branchlist/${compid}`)
      .then((resp) => {
        let list = [...resp.data.branch];
        let listarr = list.map((item, index) => ({
          ...item,
          action: `<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
          sl_no: index + 1,
        }));
        setBranchList(listarr);
      });
  };


  const onEdit = (data) => {    
      getCountryList();
      setEditableRow({branchId: data.id,
        compNo: data.compNo,
        country: data.country,
        state: data.state,
        district: data.district,
        city: data.city
      });
  };
  
  //set Country on Edit
  useEffect(()=>{    
    if(editableRow.branchId >0 && editableRow.country!==null && isChanged.country===false && countryList.length >0)
    {

    setCompetitorBranchInput({
      ...competitorBranchInput,
      country: countryList.find((x) => x.value === editableRow.country),
    });
  }
  },[countryList, editableRow]);

  //set Country for New or modification Branch
  useEffect(()=>{
    if(competitorBranchInput.country!==null){
      setStateList([]);
      setCompetitorBranchInput((prev) => {
        return { ...prev, state:null, district: null, city: null };
          });  
      getStateList();
    }
    else if(competitorBranchInput.country===null){
      setStateList([]);
      setCompetitorBranchInput((prev) => {
        return { ...prev, state:null, district: null, city: null };
          });  
    }
  },[competitorBranchInput.country]);

  //set State on Edit
useEffect(()=>{
  if(editableRow.branchId > 0 && editableRow.state && isChanged.country===false && competitorBranchInput.country!==null && stateList.length>0) //on edit
  {
    setCompetitorBranchInput((prev) => {
      return { ...prev,state: stateList.find((x) => x.value === editableRow.state), district: null, city: null };
        }); 
        setDistrictList([]); 
        getDistrictList();
  }
  else{
    setCompetitorBranchInput((prev) => {
      return { ...prev, district: null, city: null };
        }); 
    setDistrictList([]); 
  }
  
},[stateList]);

 //set District for New or modification Branch
 useEffect(()=>{
  if(competitorBranchInput.state!==null)  
  {  getDistrictList();
    setCompetitorBranchInput((prev) => {
      return { ...prev, district: null, city: null };
      });  
  }
  else if(competitorBranchInput.state===null){
    setCompetitorBranchInput((prev) => {
      return { ...prev, district: null, city: null };
      });
        setDistrictList([]);
  }
},[competitorBranchInput.state]);

//set District on Edit
useEffect(()=>{
  if(editableRow.branchId > 0 && editableRow.district && isChanged.state===false && competitorBranchInput.state!==null && districtList.length>0) //on edit
  {
    setCompetitorBranchInput((prev) => {
      return { ...prev,district: districtList.find((x) => x.value === editableRow.district), city: null };
        }); 
        setCityList([]); 
        getCityList();
  }
  else{
    setCompetitorBranchInput((prev) => {
      return { ...prev,  city: null };
        }); 
    setCityList([]); 
  }
},[districtList]);

 //set City for New or modification Branch
 useEffect(()=>{  
  if(competitorBranchInput.district!==null){
  getCityList();
  setCompetitorBranchInput((prev) => {
    return { ...prev, city: null };
      });  
  }
  else if(competitorBranchInput.district===null){
    setCityList([]);
    setCompetitorBranchInput((prev) => {
      return { ...prev, city: null };
        });  
  }
},[competitorBranchInput.district]);


//set City on Edit
useEffect(()=>{
  if(editableRow.branchId > 0 && editableRow.city && isChanged.district===false && competitorBranchInput.district !==null) //on edit
  {
    setCompetitorBranchInput((prev) => {
      return { ...prev,city: cityList.find((x) => x.value === editableRow.city),  branchId: editableRow.branchId, compNo: editableRow.compNo, };
        }); 
  }
  else if(competitorBranchInput.district ===null){
    setCompetitorBranchInput((prev) => {
      return { ...prev,  branchId: editableRow.branchId};
        }); 
  }
},[cityList]);

//check Form is Valid or not
useEffect(() => {
  if (
    hasError.country === false &&
    hasError.state === false &&
    hasError.district === false &&
    hasError.city === false 
  ) {
    setFormIsValid(true);
  }
  else{
    setFormIsValid(false);
  }
}, [hasError]);


  const onDelete = (data) => {
    Swal.fire({
      text: `Are You sure, to delete ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#2fba5f",
      cancelButtonColor: "#fc5157",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        axios
          .delete(`${baseUrl}/api/customercreationcontact/${data.id}`)
          .then((resp) => {
            if (resp.data.status === 200) {
              Swal.fire({
                //success msg
                icon: "success",
                text: `removed!`,
                timer: 1500,
                showConfirmButton: false,
              });
              getBranchList();
            } else if (resp.data.status === 404) {
              Swal.fire({
                // error msg
                icon: "error",
                text: resp.data.message,
                showConfirmButton: true,
              });
            } else {
              Swal.fire({
                icon: "error",
                text: "Something went wrong!",
                timer: 2000,
              });
            }
          });
      } else {
        Swal.fire({
          title: "Cancelled",
          icon: "error",
          timer: 1500,
        });
      }
    });
  };
  const selectInputHandler = (value, action) => {
    switch (action.name) {
      case "country":
        setIsChanged({
          country: true,
          state: true,
          district: true,
          city: true,
        });
        break;
      case "state":
        setIsChanged({
          country: false,
          state: true,
          district: true,
          city: true,
        });
        break;
      case "district":
        setIsChanged({
          country: false,
          state: false,
          district: true,
          city: true,
        });
        break;
      case "city":
        setIsChanged({
          country: false,
          state: false,
          district: false,
          city: true,
        });
        break;
    }
    setCompetitorBranchInput({
      ...competitorBranchInput,
      [action.name]: value,
    });
    if (value === "" || value === null) {
      setHasError({ ...hasError, [action.name]: true });
    } else {
      setHasError({ ...hasError, [action.name]: false });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let tokenId = localStorage.getItem("token");
    const datatosend = {
      compId: compid,
      compNo: competitorBranchInput.compNo,
      country: competitorBranchInput.country.value,
      state: competitorBranchInput.state.value,
      district: competitorBranchInput.district.value,
      city: competitorBranchInput.city.value,
      tokenId: tokenId,
    };
    console.log("datatosend",datatosend);
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      datatosend.country !== null &&
      datatosend.state !== null &&
      datatosend.district !== null &&
      datatosend.city !== null 
    )
    {
      console.log("In Axio");
    axios.post(`${baseUrl}/api/competitorbranch`, datatosend).then((resp) => {
      if (resp.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Competitor Branch",
          text: resp.data.message,
          timer: 2000,
        }).then(function () {
          setLoading(false);
          setCompetitorBranchInput(initialValue);
          getBranchList();
          // setBranchList(updatedBranchList);
          // navigate(`/tender/master/competitorcreation/competitor/details`);
        });
      } else if (resp.data.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Competitor Branch",
          text: resp.data.message,
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
        });
      }
    });
  }
  };

  const updateHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    
    let tokenId = localStorage.getItem("token");
    const datatosend = {
      compId: compid,
      brnachId: competitorBranchInput.branchId,
      compNo: competitorBranchInput.compNo,
      country: competitorBranchInput.country.value,
      state: competitorBranchInput.state.value,
      district: competitorBranchInput.district.value,
      city: competitorBranchInput.city.value,
      tokenId: tokenId,
    };
    console.log('datatosend',datatosend);
    if (
      datatosend.compId !== null &&
      datatosend.compNo !== null &&
      datatosend.country !== null &&
      datatosend.state !== null &&
      datatosend.district !== null &&
      datatosend.city !== null && formIsValid
    )
    {
    axios.put(`${baseUrl}/api/competitorbranch/${competitorBranchInput.branchId}`, data).then((resp) => {
      if (resp.data.status === 200) {
        console.log("resp.data :", resp.data);
        Swal.fire({
          icon: "success",
          title: "Competitor Branch",
          text: resp.data.message,
          timer: 2000,
        }).then(function () {
          setLoading(false);
          setCompetitorBranchInput(initialValue);
          getBranchList();
          // navigate(`/tender/master/competitorcreation/competitor/details`);
        });
      } else if (resp.data.status === 404) {
        Swal.fire({
          icon: "error",
          title: "Competitor Branch",
          text: resp.data.errors,
          confirmButtonColor: "#5156ed",
        }).then(function () {
          setLoading(false);
        });
      }
    });
  }
  };

  return (
    <div className="card-body ">
      <form>
        <div className="row align-items-center">
          <div className="inputgroup col-lg-5 mb-4">
            <div className="row align-items-center">
              <div className="col-lg-4 text-dark">
                <label htmlFor="country" className="font-weight-bold">
                  Country<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="country"
                  id="country"
                  isSearchable="true"
                  isClearable="true"
                  options={countryList}
                  value={competitorBranchInput.country}
                  onChange={selectInputHandler}
                  //   onBlur={onBlurSelectHandler}
                ></Select>
                {hasError.country && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Competitor Country..!
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
                <label htmlFor="state">
                  State/UT<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="state"
                  id="state"
                  isSearchable="true"
                  isClearable="true"
                  options={stateList}
                  onChange={selectInputHandler}
                  // onBlur="{customersubcategoryBlurHandler}"
                  value={competitorBranchInput.state}
                ></Select>
                {hasError.state && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Competitor State..!
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
                <label htmlFor="district" className="font-weight-bold">
                  District<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="district"
                  id="district"
                  isSearchable="true"
                  isClearable="true"
                  options={districtList}
                  onChange={selectInputHandler}
                  //onBlur={district}
                  value={competitorBranchInput.district}
                ></Select>
                {hasError.district && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Competitor District..!
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
                <label htmlFor="city">
                  City<span className="text-danger">&nbsp;*</span>
                </label>
              </div>
              <div className="col-lg-8">
                <Select
                  name="city"
                  id="city"
                  isSearchable="true"
                  isClearable="true"
                  options={cityList}
                  onChange={selectInputHandler}
                  //onBlur="{city}"
                  value={competitorBranchInput.city}
                ></Select>
                {hasError.city && (
                  <div className="pt-1">
                    <span className="text-danger font-weight-bold">
                      Select Competitor City..!
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="inputgroup col-lg-5 mb-4"></div>
          <div className="inputgroup col-lg-2 mb-4 align-items-center">
            <div className="row">
              <button className="btn btn-primary"  disabled={!formIsValid} onClick={!editableRow.branchId ? submitHandler : updateHandler}>
                {!editableRow.branchId
                  ? loading === true
                    ? "Adding...."
                    : "Add"
                  : loading === true
                  ? "Updating...."
                  : "Update"}
              </button>
            </div>
          </div>
          <div className="inputgroup col-lg-5 mb-4"></div>
        </div>
      </form>
      <CompetitorDetailsBranchList
        branchList={branchList}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};
export default CompetitorBranchForm;
