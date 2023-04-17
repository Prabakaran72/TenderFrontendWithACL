import axios from "axios";

import { useEffect, useContext, useState } from "react";
import { Link, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import AuthContext from "../../../storeAuth/auth-context";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";
import Select from "react-select";
import ReimbursementList from "./ReimbursementList";
 


function ReimbursementAdmin(props) {
	const initialOptions = {
		options: [],
		isLoading: false,
	}
	const { server1: baseUrl } = useBaseUrl();
	const [loading, setLoading] = useState(false);
	const [list, setListarr] = useState([])
	const { permission } = useContext(AuthContext)
	const [StateOptions, setStateOptions] = useState(initialOptions);
	const [CategoryOptions, setCategoryOptions] = useState(initialOptions);
	const [groupOptions, setgroupOptions] = useState(initialOptions);
	const {
		value: fromdateValue,
		isValid: fromdateIsValid,
		hasError: fromdateHasError,
		valueChangeHandler: fromdateChangeHandler,
		inputBlurHandler: fromdateBlurHandler,
		setInputValue: setfromdateValue,
		reset: resetfromdate,
	} = useInputValidation(isNotEmpty);

	const {
		value: todateValue,
		isValid: todateIsValid,
		hasError: todateHasError,
		valueChangeHandler: todateChangeHandler,
		inputBlurHandler: todateBlurHandler,
		setInputValue: settodateValue,
		reset: resettodate,
	} = useInputValidation(isNotEmpty);


	let filterValid = true;

	
	const cust_category = [

		{ value: "state", label: "State" },
		{ value: "unionterritory", label: "Union Territory" },

	];
	const Group = [

		{ value: "yes", label: "Smart City" },
		{ value: "no", label: "Non Smart City" },

	];
	const getStateData = async (savedState) => {
		let response = await axios.get(`${baseUrl}/api/state-list/${savedState}`);
		return { options: response.data.stateList, isLoading: false };

	};

	const getStateListOptions = async (savedState = null) => {
		let category = { options: cust_category, isLoading: false };
		setStateOptions((c) => {
			return { ...c, isLoading: true };
		});
		let StateList = await getStateData(savedState);
		setStateOptions(StateList);
		setCategoryOptions(category);
	};
	const {
		value: stateValue,
		isValid: stateIsValid,
		hasError: stateHasError,
		valueChangeHandlerForReactSelect: stateChangeHandler,
		inputBlurHandler: stateBlurHandler,
		setInputValue: setstate,
		reset: resetstate,
	} = useInputValidation(isNotNull);
	const {
		value: catValue,
		isValid: catIsValid,
		hasError: catHasError,
		valueChangeHandlerForReactSelect: catChangeHandler,
		inputBlurHandler: catBlurHandler,
		setInputValue: setcat,
		reset: resetcat,
	} = useInputValidation(isNotNull);

	const {
		value: groupValue,
		isValid: groupIsValid,
		hasError: groupHasError,
		valueChangeHandlerForReactSelect: groupChangeHandler,
		inputBlurHandler: groupBlurHandler,
		setInputValue: setgroup,
		reset: resetgroup,
	} = useInputValidation(isNotNull);

	// if(stateIsValid || catIsValid || groupIsValid){
	//   filterValid = true;
	// }
	useEffect(() => {


		getStateListOptions();

	}, [])


	const goHandler = async () => {
console.log('grp',groupValue?.value);
		// setLoading(true)
		if(catValue?.value==null){
			var value1='';
		}
		else{
			var value1=catValue.value;
		}

		if(stateValue?.value==null){
			var value2='';
		}
		else{
			var value2=stateValue.value;
		}
		
		if(groupValue?.value==null){
			var value3='';
		}
		else{
			var value3=groupValue.value;
		}
		
		let data = {
			category: value1,
			State: value2,
			group: value3,
		}

		let response = await axios.post(`${baseUrl}/api/ulbreport/ulblists`, data)
		let listarr = await generateListArray(response)

		setListarr(listarr)
		setLoading(false)
	}

	const generateListArray = async (response) => {

		let list = [...response.data.list];

		let listarr = list.map((item, index, arr) => {

			 let ViewCustomer = item.customers;
// let ViewCustomer =  <UlbViewCity />;
// let editbtn ='<i calss="customer" style="cursor:pointer">'+item.customers+'</i> ';
let cust =  '<i class=" customer" style="cursor:pointer" >'+item.customers+'</i> ' ;

let m20 =  '<i class=" m20" style="cursor:pointer" >'+item.more_20+'</i> ' ;
let b10_20 =  '<i class=" b10_20" style="cursor:pointer" >'+item.btw_10_20+'</i> ' ;
let b_5_10 =  '<i class=" b_5_10" style="cursor:pointer" >'+item.btw_5_10+'</i> ' ;
let b_3_5 =  '<i class=" b_3_5" style="cursor:pointer" >'+item.btw_3_5+'</i> ' ;
let b_1_3 =  '<i class=" b_1_3" style="cursor:pointer" >'+item.btw_1_3+'</i> ' ;
let b_1 =  '<i class=" b_1" style="cursor:pointer" >'+item.bel_1+'</i> ' ;

      
			return {
				...item, 
				ulblist: item.customersubcategory,
				customers:cust ,
				more_20: m20,
				btw_10_20: b10_20,
				btw_5_10: b_5_10,

				btw_3_5: b_3_5,
				btw_1_3: b_1_3,
				bel_1: b_1,
				filter_cat:catValue?.value,
				filter_state:stateValue?.value,
				filter_group:groupValue?.value,
				popup: [],



				//   sl_no : index+1
			}
		})
		// <i class="fa fa-print text-info mr-2 h6" style="cursor:pointer; font-size: 1.25rem" title="Print"></i>  -- To add @ line 72 
		return listarr;
	}



	//   const FormattedDate = (date) => {
	//     const targetdate = new Date(date);
	//     const yyyy = targetdate.getFullYear();
	//     let mm = targetdate.getMonth() + 1; // Months start at 0!
	//     let dd = targetdate.getDate();

	//     if (dd < 10) dd = '0' + dd;
	//     if (mm < 10) mm = '0' + mm;

	//     const formattedDate = dd + '-' + mm + '-' + yyyy;
	//     return formattedDate
	//   }

	return (
		<>
			<div className="container-fluid p-0">
				<div className="row">
					<div className="col-lg-12">
						<div className="card shadow mb-4 pt-2">
							<div className="card-body">
								<div className="row d-flex">
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-3 text-dark font-weight-bold">
											<label htmlFor="From">Category :</label>
										</div>
										<div className="col-lg-9">
											<Select
												name="cat"
												id="cat"
												isSearchable="true"
												isClearable="true"
												options={cust_category}
												onChange={(selectedOptions) => {
													catChangeHandler(selectedOptions);
													// getcustno(selectedOptions);
												}}
												onBlur={catBlurHandler}
												value={catValue}
												isLoading={CategoryOptions.isLoading}

											></Select>
										</div>
									</div>
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-3 text-dark font-weight-bold">
											<label htmlFor="From">State :</label>
										</div>
										<div className="col-lg-9">
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
												onBlur={stateBlurHandler}
												value={stateValue}
												isLoading={StateOptions.isLoading}

											></Select>
										</div>
									</div>
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-3 text-dark font-weight-bold">
											<label htmlFor="Group">Group :</label>
										</div>
										<div className="col-lg-9">
											<Select
												name="group"
												id="group"
												isSearchable="true"
												isClearable="true"
												options={Group}
												onChange={(selectedOptions) => {
													groupChangeHandler(selectedOptions);
													// getcustno(selectedOptions);
												}}
												onBlur={groupBlurHandler}
												value={groupValue}
												isLoading={groupOptions.isLoading}

											></Select>
										</div>
									</div>




									<div className="col-sm-3 row d-flex align-items-center mb-4">
										<div className="col-sm-2">
											<button className={`btn ${(!filterValid) && 'btn-outline-primary'} ${(filterValid) && 'btn-primary'} rounded-pill px-4`} onClick={goHandler} disabled={!filterValid}> Go </button>
										</div>
									</div>
									<div className="col-lg-7 row">

										{/* <div className="col-sm-2">
										<button className={`btn ${(!filterValid) && 'btn-outline-primary' } ${(filterValid) && 'btn-primary' } rounded-pill`} onClick={goHandler} disabled={!filterValid}> Go </button>
										</div> */}
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
								
								
								
	<ReimbursementList loading={loading} list={list} getlist={goHandler} />
	
							</div>
							<div>
								{/* <BidManagementList loading={loading} list={list} getlist={getlist}/> */}

							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default ReimbursementAdmin;