import { useEffect, useState } from "react";
import useInputValidation from "../../hooks/useInputValidation";
import { isNotEmpty, isNotNull } from "../CommonFunctions/CommonFunctions";
import Select from "react-select";
import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import LegacystatementList from "./LegacystatementList";
import { usePageTitle } from "../../hooks/usePageTitle";

const initialOptions = {
	options: [],
	isLoading: false,
}


const statusOptions = [
	
	{ value: 'To be Opened', label: 'To be Opened' },
    { value: 'Technical Evaluation in Progress', label: 'In Technical Evaluation' },
    { value: 'Financial Bid Opening in Progress', label: 'In Financial Evaluation' },
	{ value: 'LoA yet to be awarded', label: 'LoA yet to be awarded' },
    { value: 'Awarded', label: 'Awarded' },
	{ value: 'Tender Cancelled', label: 'Tender Cancelled' },
    { value: 'Retendered', label: 'Retendered' },
	
	
  ]

function Legacystatement() {

	usePageTitle('Legacy Statement')

	// const [statusOptions, setstatusOptions] = useState(initialOptions);
	// const [stateOptions, setstateOptions] = useState(initialOptions);
	const [typeofprojectOptions, settypeofprojectOptions] = useState(initialOptions);
	const [typeofcustomerValue, settypeofcustomerValue] = useState(null);
	const [tenderparticipationValue, settenderparticipationValue] = useState(null);
	const [StateOptions, setStateOptions] = useState(initialOptions);

	const [loading, setLoading] = useState(false);
	const [list, setListarr] = useState([])
	const { server1: baseUrl } = useBaseUrl();


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

	const {
		value: statusValue,
		isValid: statusIsValid,
		hasError: statusHasError,
		valueChangeHandlerForReactSelect: statusChangeHandler,
		inputBlurHandler: statusBlurHandler,
		setInputValue: setStatus,
		reset: resetstatus,
	} = useInputValidation(isNotNull);

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
		value: typeofprojectValue,
		isValid: typeofprojectIsValid,
		hasError: typeofprojectHasError,
		valueChangeHandlerForReactSelect: typeofprojectChangeHandler,
		inputBlurHandler: typeofprojectBlurHandler,
		setInputValue: settypeofproject,
		reset: resettypeofproject,
	} = useInputValidation(isNotNull);

	let filterValid = true;

	const goHandler = () => {
		let data = {
			fromdate			: fromdateValue,
			todate				: todateValue,
			status				: (statusValue) ? statusValue.value : null,
			state				: (stateValue)  ? stateValue.value : null,
			typeofproject		: (typeofprojectValue) ? typeofprojectValue.value : null,
			typeofcustomer		: typeofcustomerValue,
			tenderparticipation	: tenderparticipationValue,
		}

		getlist(data)
	}

	const typeofcustomerhandler = (e) => {
		settypeofcustomerValue(e.target.value);
	};
	const tenderparticipationhandler = (e) => {
		settenderparticipationValue(e.target.value);
	};
	
	const generateListArray = async (response) =>{
		let list = [...response.data.legacylist];
		let listarr = list.map((item, index, arr)=> ({
		  ...item,
		  NITdate:FormattedDate(item.nitdate),
		  quality: (item.quality) ? item.quality.toLocaleString('en-IN') : '',
		  projectvalue: (item.estprojectvalue) ? item.estprojectvalue.toLocaleString('en-IN') : '',
		  status:`<span class="font-weight-bold" style="color:orange;">${item.tenderStatus}</span>`,
		//   action:`
		//   <i class="fa fa-print text-info mr-2 h6" style="cursor:pointer; font-size: 1.25rem" title="Print"></i>`,
		//   <i class="fas fa-edit text-success mx-2 h6" style="cursor:pointer" title="Edit"></i> 
		//   <i class="fa fa-trash-o  text-danger h6  mx-2" style="cursor:pointer; font-size: 1.25rem"  title="Delete"></i>
		
		  sl_no : index+1
		}))
	
		return listarr;
	  }

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

	const getlist = async (data = null) => {
		setLoading(true)

		let response =  await axios.post(`${baseUrl}/api/legacystatement`, data);
		// console.log(response.data.legacylist)
		// console.log(response.data.sql)
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
	
	const getTypeofProjectList = () => {
		settypeofprojectOptions((c) => {
			return { ...c, isLoading: true };
		});
		axios.get(`${baseUrl}/api/projecttype/list`).then((resp) => {
			settypeofprojectOptions({options : resp.data.projectTypeList, isLoading: false});
		});
	  };

	useEffect(() => {
		getlist();
		getStateListOptions();
		getTypeofProjectList();
	}, [])

	return (
		<>
			{/* Page Heading */}
			<div className="container-fluid p-0">
				<div className="row">
					<div className="col-lg-12">
						<div className="card shadow mb-4 pt-2">
							<div className="card-body">
								<div className="row d-flex">
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-3 text-dark font-weight-bold">
											<label htmlFor="From">From :</label>
										</div>
										<div className="col-lg-9">
											<input
												type="date"
												className="form-control"
												id="fromdate"
												placeholder="From Date"
												name="fromdate"
												value={fromdateValue}
												onChange={fromdateChangeHandler}
												max={todateValue}
											/>
										</div>
									</div>
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-3 text-dark font-weight-bold">
											<label htmlFor="From">To :</label>
										</div>
										<div className="col-lg-9">
											<input
												type="date"
												className="form-control"
												id="todate"
												placeholder="To Date"
												name="todate"
												value={todateValue}
												onChange={todateChangeHandler}
												min={fromdateValue}
											/>
										</div>
									</div>
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-3 text-dark font-weight-bold">
											<label htmlFor="Status">Status :</label>
										</div>
										<div className="col-lg-9">
											<Select
												name="status"
												id="status"
												isSearchable="true"
												isClearable="true"
												options={statusOptions}
												onChange={(selectedOptions) => {
													statusChangeHandler(selectedOptions);
													// getcustno(selectedOptions);
												}}
												onBlur={statusBlurHandler}
												value={statusValue}
											></Select>
										</div>
									</div>
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-3 text-dark font-weight-bold">
											<label htmlFor="state">State :</label>
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
											<label htmlFor="typeofproject">Type of project :</label>
										</div>
										<div className="col-lg-9">
											<Select
												name="typeofproject"
												id="typeofproject"
												isSearchable="true"
												isClearable="true"
												options={typeofprojectOptions.options}
												onChange={(selectedOptions) => {
													typeofprojectChangeHandler(selectedOptions);
													// getcustno(selectedOptions);
												}}
												onBlur={typeofprojectBlurHandler}
												value={typeofprojectValue}
												isLoading={typeofprojectOptions.isLoading}

											></Select>
										</div>
									</div>
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-4 text-dark font-weight-bold">
											<label htmlFor="typeofcustomer">Type of customer :</label>
										</div>
										<div className="col-lg-8">
											<div className="form-check form-check-inline mr-5">
												<label className="form-check-label" htmlFor="typeofcustomer_public">
													<input
														className="form-check-input"
														type="radio"
														name="typeofcustomer"
														id="typeofcustomer_public"
														checked={"Public" === typeofcustomerValue}
														value="Public"
														onChange={(e) => {
															typeofcustomerhandler(e);
															// getcustno(stateValue)
														}}
													/>
													Public
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label" htmlFor="typeofcustomer_private">
													<input
														className="form-check-input"
														type="radio"
														name="typeofcustomer"
														id="typeofcustomer_private"
														checked={"Private" === typeofcustomerValue}
														value="Private"
														onChange={(e) => {
															typeofcustomerhandler(e);
															//  getcustno(stateValue)
														}}
													/>
													Private
												</label>
											</div>
										</div>
									</div>
									<div className="col-sm-4 row d-flex align-items-center mb-4">
										<div className="col-lg-4 text-dark font-weight-bold">
											<label htmlFor="tenderparticipation">Tender Participation :</label>
										</div>
										<div className="col-lg-8">
											<div className="form-check form-check-inline mr-5">
												<label className="form-check-label" htmlFor="tenderparticipation_public">
													<input
														className="form-check-input"
														type="radio"
														name="tenderparticipation"
														id="tenderparticipation_public"
														checked={"Yes" === tenderparticipationValue}
														value="Yes"
														onChange={(e) => {
															tenderparticipationhandler(e);
															// getcustno(stateValue)
														}}
													/>
													Yes
												</label>
											</div>
											<div className="form-check form-check-inline">
												<label className="form-check-label" htmlFor="tenderparticipation_private">
													<input
														className="form-check-input"
														type="radio"
														name="tenderparticipation"
														id="tenderparticipation_private"
														checked={"No" === tenderparticipationValue}
														value="No"
														onChange={(e) => {
															tenderparticipationhandler(e);
															//  getcustno(stateValue)
														}}
													/>
													No
												</label>
											</div>
										</div>
									</div>
									<div className="col-sm-3 row d-flex align-items-center mb-4">
									<div className="col-sm-2">
										<button className={`btn ${(!filterValid) && 'btn-outline-primary' } ${(filterValid) && 'btn-primary' } rounded-pill px-4`} onClick={goHandler} disabled={!filterValid}> Go </button>
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

							</div>
							<div>
								{/* <BidManagementList loading={loading} list={list} getlist={getlist}/> */}
								<LegacystatementList  loading={loading} list={list}  getlist={getlist}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Legacystatement;