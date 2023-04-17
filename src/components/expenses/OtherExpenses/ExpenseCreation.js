import React, { useEffect, useState, useRef } from "react";
// import CreateExpenseCreationSubList from "./CreateExpenseCreationSubList";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useImageStoragePath } from "../../hooks/useImageStoragePath";
import { ImageConfig } from "../../hooks/Config";

const initailState = {
  staff: "",
  entryDate: "",
  description: "",
};

const ExpenseCreation = () => {
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const [input, setInput] = useState(initailState);
  const [optionsForStaff, setOptionsForStaff] = useState([]);

  const [table, setTable] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [pass, setPass] = useState(false);

  const [del, setDel] = useState(false);
  const [editCheck, setEditCheck] = useState(false);

  const [img, setImg] = useState([]);
  const { expense: filePath } = useImageStoragePath();


//Get Intial Values for rendering Dropdonw data lists
useEffect(() =>{
    axios.get(`${baseUrl}/api/user/list`).then((res) => {
        if (res.status === 200) {
          setOptionsForStaff(res.data.user);
        }
      });

},[])


const inputHandlerForSelect = (value, action) => {
    setInput({ ...input, [action.name]: value });
  };

  const inputHandlerForText = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };


  return (
    <div className="OtherExpenseMain">
      <div className="container-fluid p-0">
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row justify-content-between">
              <div className="col-lg-6 row d-flex align-items-center mb-4">
                <div className="col-lg-3 text-dark font-weight-bold">
                  <label htmlFor="staff">Staff</label>
                </div>
                <div className="col-lg-9">
                  <Select
                    name="staff"
                    id="staff"
                    isSearchable="true"
                    isClearable="true"
                    options={optionsForStaff}
                    value={input.staff}
                    onChange={inputHandlerForSelect}
                  ></Select>
                </div>
              </div>
              <div className="col-lg-6 row d-flex align-items-center mb-4">
                <div className="col-lg-3 text-dark font-weight-bold">
                  <label htmlFor="e_date">Entry Date</label>
                </div>
                <div className="col-lg-9">
                  <input
                    type="date"
                    name="entryDate"
                    value={input.entryDate}
                    onChange={(e) => inputHandlerForText(e)}
                    className="form-control"
                  />
                </div>
              </div>


              <div className="col-sm-6 row d-flex align-items-center mb-4">
                  <div className="col-lg-3 text-dark font-weight-bold">
                    <label htmlFor="descrip">Description</label>
                  </div>
                  <div className="col-lg-9">
                    <textarea
                      type="textarea"
                      name="description"
                      col="40"
                      row="40"
                      className="form-control"
                      value={input.description}
                      onChange={inputHandlerForText}
                    />
                  </div>
                </div>
              {/* <div className="d-flex justify-content-center align-content-between"> */}
              <div className="col-sm-6 row d-flex align-items-center mb-4 float-right">
                <button className="btn btn-success mr-3 float-right">Save</button>
                <button className="btn btn-secondary float-right">Cancel</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExpenseCreation;
