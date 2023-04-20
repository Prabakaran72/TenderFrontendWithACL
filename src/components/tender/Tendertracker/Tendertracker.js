import axios from "axios";
import { useEffect,useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty,isNotNull } from "../CommonFunctions/CommonFunctions";
import TendertrackerList from "./TendertrackerList";

import Select from "react-select";

function Tendertracker(props) {
	const initialOptions = {
		options: [],
		isLoading: false,
	  };
  const { server1: baseUrl } = useBaseUrl();
  const [loading, setLoading] = useState(false);
  const [StateOptions, setStateOptions] = useState(initialOptions);
 
  const [list, setListarr] = useState([])
  const {
    value: qtyValue,
    isValid: qtyIsValid,
    hasError: qtyHasError,
    valueChangeHandlerForReactSelect: qtyChangeHandler,
    inputBlurHandler: qtyBlurHandler,
    setInputValue: setqty,
    reset: resetqty,
  } = useInputValidation(isNotNull);



  const Quantity = [
	{ label: ">50,000", value: 'morethan50' },
	{ label: "50,000 - 1,00,000", value: 'between' },
	{ label: "< 1,00,000", value: 'lessthan1lk' },
	
  ];
  
  const {
    value: stateValue,
    isValid: stateIsValid,
    hasError: stateHasError,
    valueChangeHandlerForReactSelect: stateChangeHandler,
    inputBlurHandler: stateBlurHandler,
    setInputValue: setState,
    reset: resetstate,
  } = useInputValidation(isNotNull);

  const {
    value: todateValue,
    isValid: todateIsValid,
    hasError: todateHasError,
    valueChangeHandler: todateChangeHandler,
    inputBlurHandler: todateBlurHandler,
    setInputValue: settodateValue,
    reset: resettodate,
  } = useInputValidation(isNotEmpty);


  let filterValid = false;
  if(stateIsValid || qtyIsValid){
    filterValid = true;
  }
 

  const goHandler = async () => {
    setLoading(true)
    let data = {
      state : stateValue?.value,
      quality : qtyValue?.value,
    }


    let response = await axios.post(`${baseUrl}/api/tendertrack/creation/tracklist`, data)
    let listarr = await generateListArray(response)
    
     setListarr(listarr)
    setLoading(false)
  }

  const generateListArray = async (response) =>{
	let list = [...response.data.tendertracker];
	let listarr = list.map((item, index, arr)=> ({
	  ...item,
	 
	  submissiondate:(item.submissiondate) ? FormattedDate(item.submissiondate) : '',
	  pre_bid_date:(item.prebiddate)?FormattedDate(item.prebiddate):'',
	  estprojectvalue:(item.estprojectvalue)?item.estprojectvalue.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	  tenderfeevalue:(item.tenderfeevalue)?item.tenderfeevalue.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	  emdamt:(item.emdamt)?item.emdamt.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	  quality:(item.quality)?item.quality.toLocaleString(undefined, {maximumFractionDigits:2}):'',
	 
	  
	//   number2.toLocaleString(undefined, {maximumFractionDigits:2}) 
	 sl_no : index+1
	}))

	return listarr;
  }

  const getlist = async () => {
	setLoading(true)
	let response =  await axios.get(`${baseUrl}/api/tendertrack/list`);
	let listarr = await generateListArray(response)
	
	setListarr(listarr)
	setLoading(false)
  }
  const getStateData = async (savedState) => {
    let response = await axios.get(`${baseUrl}/api/state-list/${savedState}`);
    return { options: response.data.stateList, isLoading: false };
  };

  const getStateListOptions = async (savedState = null) => {
    setStateOptions((c) => {
      return { ...c, isLoading: true };
    });
    let StateList = await getStateData(savedState);
    setStateOptions(StateList);
  };
  useEffect(() => {
    getStateListOptions();
   

    
  }, []);

  const FormattedDate = (date) => {
    const targetdate = new Date(date);
    const yyyy = targetdate.getFullYear();
    let mm = targetdate.getMonth() + 1; // Months start at 0!
    let dd = targetdate.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedDate = dd + '-' + mm + '-' + yyyy;
    return formattedDate
  }
  

  return (
    <>
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-12 row">
                    <div className="col-lg-4 row d-flex align-items-center">
                      <div className="col-lg-4 text-dark font-weight-bold">
                        <label htmlFor="From">Quantity :</label>
					
                      </div>
                      <div className="col-sm-8">
					  <Select
                    name="qty"
                    id="qty"
                    isSearchable="true"
                    isClearable="true"
                    options={Quantity}
					onChange={(selectedOptions) => {
						qtyChangeHandler(selectedOptions);
						// getcustno(selectedOptions);
					  }}
					  value={qtyValue}
                  
                    
                   
                    
                  ></Select>
                      </div>
                    </div>
                    <div className="col-lg-1 row d-flex align-items-center"></div>
                    <div className="col-lg-4 row d-flex align-items-center">
                    <div className="col-lg-3 text-dark font-weight-bold">
                        <label htmlFor="From">State :</label>
                      </div>
                      <div className="col-lg-8">
					  <Select
                    name="state"
                    id="state"
                    isSearchable="true"
                    isClearable="true"
                    options={StateOptions.options}
                    onChange={(selectedOptions) => {
						stateChangeHandler(selectedOptions);
						// getcustno(selectedOptions);
					  }}
					  value={stateValue}
                  
                    
                    isLoading={StateOptions.isLoading}
                    
                  ></Select>
                      </div>
                    </div>
                    <div className="col-sm-2">
                      <button className={`btn ${(!filterValid) && 'btn-outline-primary' } ${(filterValid) && 'btn-primary' } rounded-pill`} onClick={goHandler} disabled={!filterValid}> Go </button>
                    </div>
                  </div>
                  <div className="col-lg-5  d-flex align-items-end flex-column">
                    {/* <Link to="main/bidcreationmain" className="rounded-pill btn btn-primary btn-icon-split">
                      <span className="icon text-white-50">
                        <i className="fas fa-plus-circle" />
                      </span>
                      <span className="text">New</span>
                    </Link> */}
                  </div>
                </div>

              </div>
              <div>
                <TendertrackerList loading={loading} list={list} getlist={getlist}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Tendertracker;