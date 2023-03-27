import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useBaseUrl } from "../../../hooks/useBaseUrl";


const initialState = {
    staffName: "",
    menu: ""
}

const initialStateErr = {
    staffName: '',
    menu: ""
}

const CallToBDM = () => {

    usePageTitle('Call to BDM');

    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();
    const [input, setInput] = useState(initialState);
    const [inputValidation, setInputValidation] = useState(initialStateErr);
    const [userOptions, setUserOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);

    const inputHandlerForSelect = (value, action) => {

    }

    const submitHandler = (e) => {
        e.preventDefault();
    }

    return (
        <Fragment>
            <div className="container-fluid">
                <div className="card p-4">
                    <form>
                        <div className="row align-items-center">
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="staffName" className="font-weight-bold">User/Staff Name<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="staffName"
                                            id="staffName"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={userOptions}
                                            value={input.staffName}
                                            isDisabled={!!id}
                                            onChange={(value, action) => { inputHandlerForSelect(value, action); }}
                                        ></Select>
                                        {inputValidation.staffName && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter Valid Input..!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup col-lg-6 mb-4">
                                <div className="row align-items-center">
                                    <div className="col-lg-4 text-dark">
                                        <label htmlFor="customer" className="font-weight-bold">Customer<span className="text-danger">&nbsp;*</span> </label>
                                    </div>
                                    <div className="col-lg-8">
                                        <Select
                                            name="customer"
                                            id="customer"
                                            isSearchable="true"
                                            isClearable="true"
                                            options={customerOptions}
                                            value={input.customer}
                                            isDisabled={!!id}
                                            onChange={(value, action) => { inputHandlerForSelect(value, action); }}
                                        ></Select>
                                        {inputValidation.customer && (
                                            <div className="pt-1">
                                                <span className="text-danger font-weight-bold">
                                                    Enter Valid Input..!
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default CallToBDM