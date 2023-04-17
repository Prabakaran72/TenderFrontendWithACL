import React, { useEffect, useState, useRef, } from "react";
import CreateExpenseCreationSubList from "./CreateExpenseCreationSubList";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
import { useBaseUrl } from "../../hooks/useBaseUrl";
import {useImageStoragePath} from "../../hooks/useImageStoragePath";
import { ImageConfig } from "../../hooks/Config";

const initailState = {
  staff: "",
  entryDate: "",
  description: "",
};

const CreateExpenseCreation = () => {
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
  const {expense : filePath} = useImageStoragePath();
  
  useEffect(() => {
    const imgFile = [];
    axios.get(`${baseUrl}/api/user/list`).then((res) => {
      if (res.status === 200) {
        setOptionsForStaff(res.data.user);
      }
    });

    axios.get(`${baseUrl}/api/otherexpensesub`).then((res) => {
      if (res.status === 200) {
        // console.log(res);

        let filelist = [];
        for(let key in res.data.otherexpensesub){
          
    let fileExt =res.data.otherexpensesub[key].filetype.split("/")[res.data.otherexpensesub[key].filetype.split("/").length - 1];
    let fileMIME = res.data.otherexpensesub[key].filetype.split("/")[0];    
  
    let fileobject = { 
            id: res.data.otherexpensesub[key].id,
            mainid: res.data.otherexpensesub[key].mainid,
            need_call_against_expense:res.data.otherexpensesub[key].need_call_against_expense,
            customer_id: res.data.otherexpensesub[key].customer_id,
            call_no: res.data.otherexpensesub[key].call_no,
            expense_type_id: res.data.otherexpensesub[key].expense_type_id,
            filetype: res.data.otherexpensesub[key].filetype,
            amount : res.data.otherexpensesub[key].amount,
            description_sub: res.data.otherexpensesub[key].description_sub,
            expenseType: res.data.otherexpensesub[key].expenseType,
            // oesid: res.data.otherexpensesub[key].oesid,
            etid: res.data.otherexpensesub[key].etid,
            hasfilename: res.data.otherexpensesub[key].hasfilename,
            originalfilename: res.data.otherexpensesub[key].originalfilename,
            name: res.data.otherexpensesub[key].originalfilename,
            filesize: res.data.otherexpensesub[key].filesize,
            pic: fileMIME === "image"
              ? filePath+""+res.data.otherexpensesub[key].hasfilename
              : fileMIME === "octet-stream" && fileExt === "csv"
              ? ImageConfig["csv"]
              : fileMIME === "octet-stream" && fileExt === "rar"
              ? ImageConfig["rar"]
              : (res.data.otherexpensesub[key].filetype ==="text/plain" && res.data.otherexpensesub[key].originalfilename.split(".")[res.data.otherexpensesub[key].originalfilename.split(".").length - 1] ==="csv") ? ImageConfig["csv"]
              :ImageConfig[fileExt],
          };
          filelist.push(fileobject);
      }
      setTable(filelist);

      }
    });
  }, []);

  // useEffect(()=> {
  //   axios.get(`${baseUrl}/api/otherexpensesub`)
  //   .then((res)=>{           
  //     if(res.status === 200) {
  //       setTable(res.data.otherexpensesub);
  //       // console.log('del',del);  
  //     }
  //   })     
  // },[del]) // del state gets true this hook will render *** initially works in handleDel

  const inputHandlerForSelect = (value, action) => {
    setInput({ ...input, [action.name]: value });
  };

  const inputHandlerForText = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleEdit = (tab,index) => {
    // console.log("Edit ", tab);
    setCurrentRow(tab,index);
    // console.log('tab,index',index)
    setPass(true);
    setEditCheck(true);
  };

  const handleDel = (tab) => {
    // console.log("Delete ", tab);
    setCurrentRow(tab);
    setDel(true);    
    axios.delete(`${baseUrl}/api/otherexpensesub/${currentRow.oesid}`)
    .then((res) => {
      if (res.data.status === 200) {
          Swal.fire({
            icon: "delete",
            title: "SubExpense",
            text: "Deleted Successfully!",
            confirmButtonColor: "#e30e32",
          });                 
        } else if (res.data.status === 400) {
          Swal.fire({
            icon: "error",
            title: "New SubExpense",
            text: res.data.message,
            confirmButtonColor: "#e30e32",
          });          
      }
    });
  };

  const editData = {
    expenseType: { value: currentRow.etid, label: currentRow.expenseType },
    amount: currentRow.amount,
    description: currentRow.description_sub,
    document: currentRow.document,  
  };

  let incre = 1;
//  console.log("Table", table);
  // console.log("currentRow", currentRow);
  return (
    <>
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
              </div>
              <hr />
              <div className="otherExpenseMainForm">
                <CreateExpenseCreationSubList
                  pass={pass}
                  setTable={setTable}
                  editData={editData}
                  currentRow={currentRow}
                  input={input}
                  img={img}
                  editCheck={editCheck}
                  setEditCheck={setEditCheck}
                />
              </div>
              <div className="row mt-3 px-2">
                <div className="table-responsive">
                  <table
                    className="table table-bordered text-center"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                  >
                    <thead className="text-center">
                      <tr>
                        <th className="">Sl.No</th>
                        <th className="">Expense Type </th>
                        <th className="">Amount</th>
                        <th className="">Description</th>
                        <th className="">Document</th>
                        <th className="">Action</th>
                      </tr>
                    </thead>
                    <tbody>
     {/* {img.map((pic)=> ( */}
                        {/* <tr key={tab.oesid}>
                          <td>{incre++}</td>
                          <td>{tab.expenseType}</td>
                          <td>{tab.amount}</td>
                          <td>{tab.description_sub}</td>                            
                          <td>
                            <img
                              // src={img[index]}
                              src={tab.pic}
                              alt="uploaded img"
                              width={50}
                              height={50}
                            />
                          </td>                              
                          <td>
                            <button
                              onClick={() => {
                                handleEdit(tab,index);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDel(tab);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr> */}
                 {/* ))} */}

                      {table.map((tab,index) => (
                       
                        <tr key={tab.id}>
                          <td>{tab.id}</td>
                          <td>{tab.expenseType}</td>
                          <td>{tab.amount}</td>
                          <td>{tab.description_sub}</td>                            
                          <td>
                            <img
                              // src={img[index]}
                              src={tab.pic}
                              alt="Uploaded img"
                              width={50}
                              height={50}
                            />
                          </td>                              
                          <td>
                            <button
                              onClick={() => {
                                handleEdit(tab,index);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleDel(tab);
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>                    
                      ))}                                            
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="row mt-3">
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
              </div>
              <div className="d-flex justify-content-center align-content-between">
                <button className="btn btn-success mr-3">Save</button>
                <button className="btn btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateExpenseCreation;
