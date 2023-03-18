import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

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
pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = jsZip;

var tableData = [];     
let table;




const CountryMasterList = () => {

  const { server1: baseUrl } = useBaseUrl();
  
  useDocumentTitle("Country Master")

  const [countryList, setcountryList] = useState([]);

  const loadData = useCallback (async () => {
    if ( $.fn.DataTable.isDataTable( '#dataTable' ) ) {
        table.destroy();
    }

    const resOfCountryList = await axios.get(
      `${baseUrl}/api/country`
    );

    if (resOfCountryList.status === 200 && resOfCountryList.data.status === 200) {
      setcountryList(resOfCountryList.data.country);
    }
  }, [baseUrl]);

  
  useEffect(() => {
    
      table = $(`#dataTable`).DataTable({
        dom:
        //   "<'row'<'col-sm-12'l>>" +
          "<'row'<'col-sm-12   col-md-2 mt-2'l> <'col-sm-12  col-md-4'B> <'col-sm-12 col-md-6 mt-2'f>>" +
          "<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

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
      if ( $.fn.DataTable.isDataTable( '#dataTable' ) ) {
        table.destroy();
      }
      
    };
  }, [countryList]);
  
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  const deletehandler =  (id,name) => {
    
    Swal.fire({
        text: `Are You sure, to delete ${name}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        confirmButtonColor: '#2fba5f',
        cancelButtonColor: '#fc5157'
    }).then((willDelete) => {

        if(willDelete.isConfirmed){
            axios.delete(`${baseUrl}/api/country/${id}`)
            .then((res) => {
            if (res.data.status === 200) {
              loadData()
              Swal.fire({
                icon: "success",
                text: `${name} has been removed!`,
                timer: 1500 ,
                showConfirmButton: false,               
              });
            } else if (res.data.status === 404) {
              Swal.fire({
                icon: "error",
                text: res.data.message,
                showConfirmButton: true,
              });
            }
          });
        }
        else{
            Swal.fire({
                title: 'Cancelled',
                icon:'error',
                timer: 1500
              });
        }

        });

  }

  tableData = countryList.map((item, index) => {
    return (
      <tr key={item.id}>
        <td >{index + 1}</td>
        <td> {item.country_name} </td>
        {item.country_status==='Active' && <td className="text-success font-weight-bold">Active</td>}
        {item.country_status==='InActive' && <td className="">Inactive</td>}
        <td>
        <Link to = {`countrycreation/${item.id}`}><i className="fas fa-edit text-primary"></i></Link>
        { <Link onClick={() => deletehandler(item.id, item.country_name)}><i className="fas fa-trash text-danger mx-3"></i></Link> }
        </td>
      </tr>
    );
  });

  return (
    <Fragment>
      <div className="table-responsive">
        <table
          className="table table-bordered text-center"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <thead className="text-center bg-greeny text-white">
            <tr>
              <th className="">Sl.No</th>
              <th className="">Country Name</th>
              <th className="">Status</th>
              <th className="">Action</th>
            </tr>
          </thead>
          <tbody>{tableData}</tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default CountryMasterList;
