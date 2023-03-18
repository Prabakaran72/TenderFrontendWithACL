import { usePageTitle } from "../../hooks/usePageTitle";
import { Link } from "react-router-dom";
import { Fragment, useCallback, useEffect, useState} from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

//For DataTable
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs4";
import jsZip from "jszip";
import "datatables.net-buttons-bs4";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { motion } from "framer-motion";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = jsZip;


var tableData = [];
let table;

const CompetitorCreation = () => {
  useDocumentTitle("Competitor Creation");
  usePageTitle("Competitor Creation");
  const { server1: baseUrl } = useBaseUrl();
  const navigate = useNavigate();
  //Id is the Last submited form id
  const { id } = useParams();

  const [competitorList, setCompetitorList] = useState([]);

  const loadData = useCallback(async () => {
    if ($.fn.DataTable.isDataTable("#dataTable")) {
      table.destroy();
    }

    const resOfCompetitorList = await axios.get(`${baseUrl}/api/competitorprofile/`);

    if (
      resOfCompetitorList.status === 200 &&
      resOfCompetitorList.data.status === 200
    ) {
      setCompetitorList(resOfCompetitorList.data.competitor);
    }
  }, [baseUrl]);

  useEffect(() => {
    table = $(`#dataTable`).DataTable({
      dom:
         //   "<'row'<'col-sm-12'l>>" +
         "<'row '<'col-sm-12   col-md-6 'l>  <'col-sm-12 col-md-6 'f>>" +
         "<'row'<'col-sm-12'tr>>" +
         "<'row '<'col-sm-12 col-md-5 'i><'col-sm-12 col-md-7 'p>>",

      buttons: [
        // {
        //   extend: "print",
        //   text: '<i class="fa fa-print  mx-1" aria-hidden="true"></i> Print',
        //   className: "btn btn-info",
        // },
        // {
        //   extend: "excel",
        //   text: '<i class="fa fa-file-excel-o mx-1" aria-hidden="true"></i> Excel',
        //   className: "btn btn-success",
        // },
        // {
        //   extend: "pdf",
        //   text: '<i class="fa fa-file-pdf-o  mx-1" aria-hidden="true"></i> PDF',
        //   className: "btn btn-dark",
        // },
      ],
    });

    return () => {
      if ($.fn.DataTable.isDataTable("#dataTable")) {
        table.destroy();
      }
    };
  }, [competitorList]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deletehandler=(id)=> 
    axios.delete(`${baseUrl}/api/competitorprofile/${id}`).then((res)=>{
      if(res.data.status === 200)
      {
      Swal.fire({
        icon: "success",
        title: "Competitor",
        text: res.data.message,
        timer: 2000,
        // confirmButtonColor: "#5156ed",
      }).then(function (){
      navigate("/tender/master/competitorcreation");
      });
    }
      else{
        Swal.fire({
          icon: "success",
          title: "Competitor",
          text: res.data.message,
          confirmButtonColor: "#5156ed",
          timer: 3000,
      });
    }
    });



  tableData = competitorList.map((item, index) => {
    return (
      <tr key={item.id}>
        <td>{index + 1}</td>
        <td> {item.compNo} </td>
        <td> {item.compName} </td>
        <td> {item.mobile} </td>
        <td> {item.email} </td>
        <td>
          <Link to={`competitor/profile/${item.id}`}>
            <i className="fas fa-edit text-primary"></i>
          </Link>
          { <Link onClick={() => deletehandler(item.id)}><i className="fas fa-trash text-danger mx-3"></i></Link> }
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      {/* Page Heading */}
      {/* <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow mb-4">
              <div className="card-body">
                <div className="float-right">
                  <Link
                    to={id ? "competitor/profile/${id}" : "competitor/profile"}
                    className="btn btn-primary btn-icon-split"
                  >
                    <span className="icon text-white-50">
                      <i className="fas fa-plus-circle" />
                    </span>
                    <span className="text">New</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-lg-12">
            <motion.div className="card shadow t-card mb-4" initial={{scale: 0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:'tween'}}>
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="float-right">
                        <Link
                          to={id ? "competitor/profile/${id}" : "competitor/profile"}
                          className="btn btn-primary btn-icon-split mb-3"
                        >
                          <span className="icon text-white-50">
                            <i className="fas fa-plus-circle" />
                          </span>
                          <span className="text">New</span>
                        </Link>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="competitorListTable pb-4">
                    <table
                      className="table table-bordered text-center"
                      id="dataTable"
                      width="100%"
                      cellSpacing={0}
                    >
                      <thead className="text-center bg-greeny text-white">
                        <tr>
                          <th className="w-5">Sl.No</th>
                          <th className="w-15">Competitor No</th>
                          <th className="w-25">Competitor Name</th>            
                          <th className="w-15">Mobile Number</th>
                          <th className="w-25"> Email Id</th>
                          <th className="w-15">Action</th>
                        </tr>
                      </thead>
                      <tbody>{tableData}</tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CompetitorCreation;
