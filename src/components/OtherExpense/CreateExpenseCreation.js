import React, { useEffect, useState, useRef, } from "react";
import CreateExpenseCreationSubList from "./CreateExpenseCreationSubList";
import Select from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams } from 'react-router-dom';
import { useBaseUrl } from "../hooks/useBaseUrl";

const selectState = {
  staff: "",
  entryDate: "",
  description: "",
};

const CreateExpenseCreation = () => {
  const { id } = useParams();
  const { server1: baseUrl } = useBaseUrl();
  const [input, setInput] = useState(selectState);
  const [optionsForStaff, setOptionsForStaff] = useState([]);

  const [table, setTable] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [pass, setPass] = useState(false);

  const [del, setDel] = useState(false);
  const [editCheck, setEditCheck] = useState(false);

  const [img, setImg] = useState([]);

  useEffect(() => {
    const imgFile = [];
    axios.get(`${baseUrl}/api/user/list`).then((res) => {
      if (res.status === 200) {
        setOptionsForStaff(res.data.user);
      }
    });

    axios.get(`${baseUrl}/api/otherexpensesub`).then((res) => {
      if (res.status === 200) {
        setTable(res.data.otherexpensesub);
        res.data.otherexpensesub.map((t) => {
          const splitHasFileName = t.hasfilename;
          const hasfilename = splitHasFileName.split(".").slice(0, -1).join(".");          
          axios({
            url: `${baseUrl}/api/otherexpsubfiledownload/${t.oesid}/${hasfilename}`,
            method: "get",
            responseType: "blob",
          }).then((res) => {
            if (res.status === 200) {
              const img = URL.createObjectURL(res.data); 
              imgFile.push(img);                           
               setImg(imgFile);             
            }
          });        
        });
      }
    });
  }, []);

  useEffect(()=> {
    axios.get(`${baseUrl}/api/otherexpensesub`)
    .then((res)=>{           
      if(res.status === 200) {
        setTable(res.data.otherexpensesub);
        console.log('del',del);  
      }
    })     
  },[del]) // del state gets true this hook will render *** initially works in handleDel

  const inputHandlerForSelect = (value, action) => {
    setInput({ ...input, [action.name]: value });
  };

  const inputHandlerForText = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleEdit = (tab,index) => {
    setCurrentRow(tab,index);
    console.log('tab,index',index)
    setPass(true);
    setEditCheck(true);
  };

  const handleDel = (tab) => {
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
                        <th className="">Document Upload</th>
                        <th className="">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.map((tab,index) => (
                        <>
                        {/* {img.map((pic)=> ( */}
                        <tr key={tab.oesid}>
                          <td>{incre++}</td>
                          <td>{tab.expenseType}</td>
                          <td>{tab.amount}</td>
                          <td>{tab.description_sub}</td>                            
                          <td>
                            <img
                              src={img[index]}
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
                        </tr>
                        {/* ))} */}
                        </>
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
