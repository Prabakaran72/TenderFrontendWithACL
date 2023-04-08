import React from "react";
import OtherExpenseMainList from "./OtherExpenseMainList";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Select from "react-select";
import { usePageTitle } from "../hooks/usePageTitle";


function OtherExpenseMain() {
  usePageTitle('Other Expense');

  const optionsForExecutive = {
    value: 1,
    label: "Dharmaraj B",
    value: 2,
    label: "Villan",
  };
  return (
    <>
      <div className="OtherExpenseMain">
        <div className="container-fluid p-0">
          <motion.div
            className="card shadow mb-4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "tween" }}
          >
            <div className="card-body">
              <div className='otherExpenseMainForm'>
                <div className="row d-flex">
                    <div className="col-sm-3 row d-flex align-items-center mb-4">
                      <div className="from">
                        <div className="mr-3">
                            <label htmlFor="from">From</label>
                        </div>
                        <div className="">
                          <input type="date" name="from" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-3 row  align-items-center mb-4">
                      <div className="to">
                        <div className="mr-3">
                            <label htmlFor="to">To</label>
                        </div>
                        <div className="">
                          <input type="date" name="to" className="form-control" />
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-4 row d-flex align-items-center mb-4">
                        <div className="col-lg-5 text-dark font-weight-bold">
                            <label htmlFor="executive">Executive Name</label>
                        </div>
                        <div className="col-lg-7">
                          <Select
                            name="executiveName"
                            id="executiveName"
                            isSearchable="true"
                            isClearable="true"
                            options={optionsForExecutive}                          
                            // value={input.procurement}
                            // onChange={inputHandlerForSelect}
                          ></Select>      
                        </div>
                    </div>
                    <div className="col-sm-2 row d-flex align-items-center justify-content-center mb-4">                        
                      <button className='btn btn-success go'>Go</button>
                      <Link to='/tender/otherExpense/create'>
                        <button className='btn btn-success new'>New</button>
                      </Link>                       
                    </div>
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-lg-12">
                  <OtherExpenseMainList />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default OtherExpenseMain;
