import axios from "axios";
import { Fragment, useCallback, useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { useBaseUrl } from "../../hooks/useBaseUrl";


pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = jsZip;


let table;

const StateMasterList = () => {
  const [stateList, setStateList] = useState([]);
  const {server1 : baseUrl} = useBaseUrl()

  const loadData = useCallback(async () => {
    if ( $.fn.DataTable.isDataTable( '#dataTable' ) ) {
        table.destroy();
    }

    const resOfStateList = await axios.get(
      `${baseUrl}/api/state`
    );

    if (resOfStateList.status === 200 && resOfStateList.data.status === 200) {
      setStateList(resOfStateList.data.state)
    }
  }, [baseUrl])

 
  useEffect(() => {  
      table = $(`#dataTable`).DataTable({
        dom:"<'row'<'col-sm-12   col-md-2 mt-2'l> <'col-sm-12  col-md-4'B> <'col-sm-12 col-md-6 mt-2'f>>" +
          "<'row'<'col-sm-12'tr>>" +
          "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        buttons: [],
      });
      
      // return () => {
      //     if ($.fn.DataTable.isDataTable( '#dataTable' ) ) {
      //       table.destroy();
      //       console.log("unset")
      //     }
      // };
  }, [stateList]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const deleteState =  (id,name) => {
   
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
            axios.delete(`${baseUrl}/api/state/${id}`)
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
              <th className="">S.NO</th>
              <th className="">COUNTRY</th>
              <th className="">STATE NAME</th>
              <th className="">CATEGORY</th>
              <th className="">STATE CODE</th>
              <th className="">STATUS</th>
              <th className="">ACTION</th>
            </tr>
          </thead>
          <tbody>
          {stateList.map((item, index) => {
            return (
              <tr key={item.id}>
                <td> {index + 1}</td>
                <td> {item.country_name} </td>
                <td> {item.state_name} </td>
                <td> {item.category} </td>
                <td> {item.state_code} </td>
                {item.state_status==='Active' && <td className="text-success font-weight-bold">Active</td>}
                {item.state_status==='InActive' && <td className="">Inactive</td>}
                
                <td>
                <Link to = {`statecreation/${item.id}`}><i className="fas fa-edit text-primary"  ></i></Link>
                <Link onClick={() => deleteState(item.id, item.state_name)}><i className="fas fa-trash text-danger mx-3"></i></Link>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};

export default StateMasterList;
