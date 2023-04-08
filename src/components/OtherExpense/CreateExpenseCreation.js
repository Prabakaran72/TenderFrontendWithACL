import React, { useEffect, useState, useRef } from "react";
import CreateExpenseCreationSubList from "./CreateExpenseCreationSubList";
import Select from "react-select";
import axios from "axios";
import { useBaseUrl } from "../hooks/useBaseUrl";

const selectState = {
    staff: '',
    entryDate: '',
    description: ''
}

const CreateExpenseCreation = () => {

    const {server1: baseUrl} = useBaseUrl();
    const [input, setInput] = useState(selectState);
    const [optionsForStaff, setOptionsForStaff] = useState([]);
    
    const [table, setTable] = useState([]);
    const [currentRow, setCurrentRow] = useState({});
    const [pass, setPass] = useState(false);

  

    useEffect(()=>{
        axios.get(`${baseUrl}/api/user/list`).then((res)=>{           
            if(res.status === 200) {
                setOptionsForStaff(res.data.user);               
            }
        })     

        axios.get(`${baseUrl}/api/otherexpensesub`).then((res)=>{           
          if(res.status === 200) {
              setTable(res.data.otherexpensesub);
          }
        })       

           
    },[])

   
   
    const inputHandlerForSelect = (value, action) => {
        setInput({...input, [action.name]: value})
    }
    
    const inputHandlerForText = (e) => {
      setInput({...input, [e.target.name]: e.target.value});
    }
  
    const handleEdit = (tab) => {   
      setCurrentRow(tab); 
      setPass(true);
    }
    
    const editData = {
      expenseType: {value: currentRow.etid, label: currentRow.expenseType},
      amount: currentRow.amount,
      description: currentRow.description_sub,
      document: currentRow.document,
    }
  
  let incre = 1;         
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
                    <input type="date" name="entryDate" value={input.entryDate} onChange={(e)=>inputHandlerForText(e)} className="form-control" />
                  </div>
                </div>
              </div>
              <hr />
              <div className="otherExpenseMainForm">
                <CreateExpenseCreationSubList pass={pass} setTable={setTable} editData={editData} currentRow={currentRow} input={input} />
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
                     { table.map((tab)=>(
                        <tr>
                          <td key={tab.id}>{incre++}</td>
                          <td>{tab.expenseType}</td>
                          <td>{tab.amount}</td>
                          <td>{tab.description_sub}</td>
                          <td><img src={tab.originalfilename} alt="" /></td>
                          <td><button onClick={()=>{handleEdit(tab)}}>Edit</button></td>
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
}

export default CreateExpenseCreation;
