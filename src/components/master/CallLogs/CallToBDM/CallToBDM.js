import axios from "axios";
import { Fragment, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2/src/sweetalert2.js";
import Select from "react-select";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { useBaseUrl } from "../../../hooks/useBaseUrl";


const initialState = {
    staffName: "",
    customer: ""
}

const initialStateErr = {
    staffName: '',
    customer: ""
}

const CallToBDM = () => {

    usePageTitle('Assign Calls to BDM');

    const navigate = useNavigate();
    const { id } = useParams();

    const { server1: baseUrl } = useBaseUrl();
    const [input, setInput] = useState(initialState);
    const [inputValidation, setInputValidation] = useState(initialStateErr);
    const [userOptions, setUserOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [dataSending, setDataSending] = useState(false);

    useEffect(() => {
        axios.get(`${baseUrl}/api/userOptions`).then((response) => {
            if (response.data.status === 200) {
                generateOptions(response.data.user);
            }
        });

        if(id){
            getSavedData()
        }
    }, [])

    useEffect(() => {
        if(input.staffName !== "" && input.staffName !== null){
            axios.get(`${baseUrl}/api/customerOptions`).then((response) => {
                if (response.status === 200) {
                    setCustomerOptions(response.data.customerList);
                }
            });
        }
    }, [input.staffName])

    const getSavedData = () => {
        axios.get(`${baseUrl}/api/calltobdm/${id}`).then((response) => {
            if (response.data.status === 200) {
                // console.log(response.data)
                // let savedData = {
                //     staffName   : response.data.user_id,
                //     customer    : response.data.customer_id
                // }

                setInput((prev) => ({
                    ...prev,
                    staffName : response.data.calltobdm.user_id,
                    customer  : response.data.calltobdm.customer_id
                }))
            }
        });
    }

    const resetCusomer = () => {

        setInput((prev) => ({
            ...prev,
            customer: null,
        }));

        setCustomerOptions(null)
    }

    const generateOptions = (userList) => {
        let options = userList.map((item, index) => ({
            value: item.id,
            label: item.name,
        }))

        setUserOptions(options)
    }


    const inputHandlerForSelect = (value, action) => {
        setInput((prev) => ({
            ...prev,
            [action.name]: value,
        }));
        if (value === "" | value === null) {
            setInputValidation({ ...inputValidation, [action.name]: true });
        }
        else {
            setInputValidation({ ...inputValidation, [action.name]: false });
        }
    }

    console.log(input)
    let formIsValid = false;

    if(input.staffName && input.customer){
        formIsValid = true;
    }

    const postData = (data) => {
        setDataSending(true)

        axios.post(`${baseUrl}/api/calltobdm`, data).then((resp) => {
            if(resp.data.status === 200){
                Swal.fire({
                    icon: "success",
                    title: "Call to BDM",
                    text:  resp.data.message,
                    confirmButtonColor: "#5156ed",
                });
                  
                navigate(`/tender/calllog/calltobdm`);

            }else{
                Swal.fire({
                    icon    : "error",
                    title   : "Call to BDM",
                    text    :  (resp.data.error || 'Unable to process'),
                    confirmButtonColor  : "#5156ed",
                })
            }
            setDataSending(false);
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "Call to BDM",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
              setDataSending(false);
          });
    }

    const putData = (data, id) => {
        setDataSending(true)
        axios.put(`${baseUrl}/api/calltobdm/${id}`, data).then((resp) => {
            if(resp.data.status === 200){
                Swal.fire({
                    icon: "success",
                    title: "Call to BDM",
                    text:  resp.data.message,
                    confirmButtonColor: "#5156ed",
                });
                  
                navigate(`/tender/calllog/calltobdm`);

            }else{
                Swal.fire({
                    icon    : "error",
                    title   : "Call to BDM",
                    text    :  (resp.data.error || 'Unable to process'),
                    confirmButtonColor  : "#5156ed",
                })
            }
            setDataSending(false);
        }).catch((err) => {
            Swal.fire({
                icon: "error",
                title: "Call to BDM",
                text:  (err.response.data.message || err),
                confirmButtonColor: "#5156ed",
              })
            setDataSending(false);
        });
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if(!formIsValid){
            return
        }

        let data = {
            staffName   : input.staffName.value,
            customer    : input.customer,
            tokenid     : localStorage.getItem("token")
        }

        if(id){
            putData(data, id);
        }else{
            postData(data)
        }
    }

    const cancelHandler = () => {
        navigate(`/tender/calllog/calltobdm`);
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
                                            onChange={(value, action) => { inputHandlerForSelect(value, action); resetCusomer()}}
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
                                            isMulti
                                            onChange={(value, action) => { inputHandlerForSelect(value, action); }}
                                            closeMenuOnSelect={false}
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
                            <div className="inputgroup col-lg-12 mb-4 ml-3 mt-3">
                                <div className="row align-items-center">
                                    <div className="col-lg-12 text-right ">
                                        <button
                                            className="btn btn-primary"
                                            disabled={!formIsValid}
                                            onClick={submitHandler}
                                        >
                                            {dataSending && <span className="spinner-border spinner-border-sm mr-2"></span>}
                                            {dataSending === true ? ((id) ? 'Updating...' : "Submitting....") : ((id) ? 'Update' : "Save")}

                                        </button>
                                        <button className="btn btn-secondary mx-3" onClick={cancelHandler} disabled={dataSending}>
                                            Cancel
                                        </button>
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