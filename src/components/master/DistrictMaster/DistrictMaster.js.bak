import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { useBaseUrl } from "../../hooks/useBaseUrl";


const DistrictMaster = () => {
  usePageTitle("District Master Creation");

  const navigate = useNavigate();
  const { server1: baseUrl } = useBaseUrl();
  const { id } = useParams();
  const initialState = {
    districtName: "",
    countryId: null,
    stateId: null,
    districtStatus: "Active",
  };

  const [districtInput, setDistrictInput] = useState(initialState);
  const [districtValidation, setDistrictValidation] = useState({
    districtName: "",
    countryId: "",
    stateId: "",
  });
  const [dataSending, setDataSending] = useState(false);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [existingData, setExistingData] = useState({});

  const getExistingData = (id) => {
    axios.get(`${baseUrl}/api/district/${id}`).then((resp) => {
      let getexistingData = {
        district_name: resp.data.district.district_name,
        country_id: resp.data.district.country_id,
        state_id: resp.data.district.state_id,
        district_status: resp.data.district.district_status,
      };
      setExistingData(getexistingData);
    });
  };

  useEffect(() => {
    if (id) {
      axios.get(`${baseUrl}/api/country/list`).then((resp) => {
        setCountryList(resp.data.countryList);
        setStateList([]);
      });
    }
  }, []);

  useEffect(() => {
    
    if (id && districtInput.countryId) {
      
      axios
        .get(`${baseUrl}/api/state/list/${districtInput.countryId.value}`)
        .then((resp) => {
          setStateList(resp.data.stateList);
          setDistrictValidation({
            ...districtValidation,
            countryId: "",
            stateId: "",
          });
        });
    }
  }, [districtInput.countryId]);

  useEffect(()=>{
   
    if(id && districtInput.countryId && stateList.length>0 && existingData)
    {
      setDistrictInput({...districtInput,
        stateId:stateList.find((x)=> x.value=== existingData.state_id),
        districtName:existingData.district_name,
        districtStatus:existingData.district_status,
      })
      setExistingData(null);
    }
  },[districtInput.countryId,stateList]);


  useEffect(() => {
    if (!id) {
      axios.get(`${baseUrl}/api/country/list`).then((resp) => {
        setCountryList(resp.data.countryList);
        setStateList([]);
      });
      if (districtInput.stateId === null && districtInput.countryId) {
        axios
          .get(`${baseUrl}/api/state/list/${districtInput.countryId.value}`)
          .then((resp) => {
            setStateList(resp.data.stateList);
            setDistrictValidation({ ...districtValidation, countryId: "" });
            setDistrictInput({ ...districtInput, stateId: null });
          });
      } else if (districtInput.stateId && districtInput.countryId) {
        setDistrictValidation({ ...districtValidation, stateId: "" });
      } else {
        setStateList([]);
        setDistrictInput({ ...districtInput, stateId: null });
      }
    }
  }, [id, districtInput.countryId, districtInput.stateId]);

  useEffect(() => {
    if (id) getExistingData(id);
  }, []);

  useEffect(() => {
    if (id && countryList && existingData) {
      setDistrictInput((prevState) => {
        return {
          ...prevState,
          countryId: countryList.find(
            (x) => x.value === existingData.country_id
          ),
        };
      });
    }
  }, [countryList, existingData]);

  const inputHandler = (e) => {
    e.persist();
    setDistrictInput({ ...districtInput, [e.target.name]: e.target.value });
    setDistrictValidation({ ...districtValidation, districtName: "" });
  };

  const inputHandlerForSelect = (value, action) => {
    if (action.name === "countryId" && value === null) {
      setStateList([]);
      setDistrictInput({ ...districtInput, stateId: null, countryId: null });
    } else if (action.name === "countryId" && value !== null) {
      setDistrictInput({
        ...districtInput,
        countryId: value,
        stateId: null,
      });
    } else if (action.name === "stateId") {
      setDistrictInput({
        ...districtInput,
        [action.name]: value,
      });
    }
  };

  const submitdistrict = (e) => {
    e.preventDefault();
    setDataSending(true);
    var errors = { ...districtValidation };

    if (districtInput.districtName === "") {
      errors.districtName = "Please Enter District Name..!";
    } else {
      errors.districtName = "";
    }
    if (districtInput.countryId === null) {
      errors.countryId = "Please Select Country Name..!";
    } else {
      errors.countryId = null;
    }
    if (districtInput.stateId === null) {
      errors.stateId = "Please Select District Name..!";
    } else {
      errors.stateId = null;
    }

    const { districtName } = errors;

    setDistrictValidation(errors);
    if (districtName !== "") {
      setDataSending(false);
      return;
    }

    const data = {
      district_name: districtInput.districtName,
      country_id: districtInput.countryId.value,
      state_id: districtInput.stateId.value,
      district_status: districtInput.districtStatus,
    };

    if (!id) {
      axios.post(`${baseUrl}/api/district`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "District",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDistrictInput(initialState);
          navigate("/tender/master/districtmaster");
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "District",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        }
      });
    } else {
      axios.put(`${baseUrl}/api/district/${id}`, data).then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "District",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDistrictInput(initialState);
          navigate("/tender/master/districtmaster");
        } else {
          Swal.fire({
            icon: "error",
            title: "District",
            text: res.data.message,
            confirmButtonColor: "#5156ed",
          });
          setDataSending(false);
        }
      });
    }
  };


  return (
    <div className="container-fluid">
      <div className="card p-4">
        <form onSubmit={submitdistrict} id="district_FORM">
          <div className="row">
            <div className="col-2">
              <label>Country</label>
            </div>
            <div className="col-10 mb-3">
              <div className="row">
                <div className="col-5 mr-5 ">
                  <Select
                    name="countryId"
                    id="countryId"
                    isSearchable="true"
                    isClearable="true"
                    options={countryList}
                    onChange={inputHandlerForSelect}
                    value={districtInput.countryId}
                  ></Select>
                </div>
                <div className="col-6 ml-n5 mt-2">
                  <span style={{ color: "red" }}>
                    {districtValidation.countryId}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-2">
              <label>State</label>
            </div>
            <div className="col-10 mb-3">
              <div className="row">
                <div className="col-5 mr-5 ">
                  <Select
                    name="stateId"
                    id="stateId"
                    isSearchable="true"
                    isClearable="true"
                    options={stateList}
                    onChange={inputHandlerForSelect}
                    value={districtInput.stateId}
                  ></Select>
                </div>
                <div className="col-5 ml-n5 mt-2">
                  <span style={{ color: "red" }}>
                    {districtValidation.stateId}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <label>District Name</label>
            </div>
            <div className="col-10 mb-3">
              <div className="row">
                <div className="col-5 mr-5 ">
                  <input
                    className="form-control "
                    type="text"
                    id="districtName"
                    name="districtName"
                    onChange={inputHandler}
                    value={districtInput.districtName}
                  />
                </div>
                <div className="col-6 ml-n5 mt-2">
                  <span style={{ color: "red" }}>
                    {districtValidation.districtName}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-2">
              <label>Active Status</label>
            </div>

            <div className="col-5 ml-3">
              <div className="row ">
                <div className="col-3">
                  <label
                    className="form-check-label"
                    htmlFor="districtStatusActive"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      id="districtStatusActive"
                      name="districtStatus"
                      value="Active"
                      checked={districtInput.districtStatus === "Active"}
                      onChange={inputHandler}
                    />
                    Active
                  </label>
                </div>
                <div className="col-3">
                  <label
                    className="form-check-label"
                    htmlFor="districtStatusInActive"
                  >
                    <input
                      className="form-check-input"
                      type="radio"
                      id="districtStatusInActive"
                      name="districtStatus"
                      value="InActive"
                      checked={districtInput.districtStatus === "InActive"}
                      onChange={inputHandler}
                    />
                    Inactive
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row text-center">
            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={dataSending}
              >
                {!id
                  ? !dataSending
                    ? "Submit"
                    : "Submitting..."
                  : !dataSending
                  ? "Update"
                  : "Updating..."}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DistrictMaster;
