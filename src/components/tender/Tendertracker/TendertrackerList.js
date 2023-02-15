import { Fragment, useEffect, useState } from "react";
import PreLoader from "../../UI/PreLoader";

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

import axios from "axios";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import Swal from "sweetalert2";
import { usePageTitle } from "../../hooks/usePageTitle";



let table;

const TendertrackerList = (props) => {

    usePageTitle('List of Tender Tracker');

    const [TendertrackerList, setTendertrackerList] = useState([])
    const { server1: baseUrl } = useBaseUrl();
    const navigate = useNavigate()
    const location = useLocation();

   

    useEffect(() => {
        table =  $('#dataTable').DataTable({
            data : TendertrackerList,
            columns: [
                { data: 'sl_no' },
                { data: 'location' },
                { data: 'state_code' },
                { data: 'quality' },
                { data: 'unit' },
                { data: 'priceperunit' },
                { data: 'estprojectvalue' },
                { data: 'tenderfeevalue' },
                { data: 'emdamt' },
                { data: 'emdmode' },
                { data: 'prebiddate' },
                { data: 'submissiondate' },
            ],
            dom:
            //   "<'row'<'col-sm-12'l>>" +
              "<'row'<'col-sm-12   col-md-6 pl-4'l>  <'col-sm-12 col-md-6 pr-4'f>>" +
              "<'row'<'col-sm-12'tr>>" +
              "<'row'<'col-sm-12 col-md-5 pl-4'i><'col-sm-12 col-md-7 pr-4'p>>",
    
        })
    
      
    
      }, [])

      useEffect(() => {
        props.getlist()
      }, [])

      useEffect(() => {
        if(Array.isArray(props.list)){
          table.clear().rows.add(props.list).draw();
        }
      }, [props.list])

      const deleteList = async (data) => {
        Swal.fire({
          text: `Are You sure, to delete records of '${data.customer_name}'?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: 'Yes, delete it!',
          cancelButtonText: 'No, cancel!',
          confirmButtonColor: '#2fba5f',
          cancelButtonColor: '#fc5157'
      }).then(async (willDelete) => {
        if(willDelete.isConfirmed){
          let response =  await axios.delete(`${baseUrl}/api/bidcreation/creation/${data.tenderid}`);
          if(response.data.status === 200){
            props.getlist()
            toast.success( response.data.message , {
              position: toast.POSITION.TOP_CENTER
            });
          }else{
            toast.error("Unable to Delete!" , {
              position: toast.POSITION.TOP_CENTER
            });
          }
        }
      })
    
    
      }

    return (
        <Fragment>
            <PreLoader loading={props.loading}>
                <ToastContainer />
                <div className="table-responsive pb-3">
                    <table
                        className="table text-center"
                        id="dataTable"
                        width="100%"
                        cellSpacing={0}
                    >
                        <thead className="text-center bg-gray-200 text-primary">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Location Name</th>
                                <th scope="col">State</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Unit</th>
                                <th scope="col">Price per unit</th>
                                <th scope="col">Estimate Project value(INR)</th>
                               
                                <th scope="col">Tender / Processing Fee(INR)</th>
                                <th scope="col">EMD(INR)</th>
                                <th scope="col">EMD Mode</th>
                                <th scope="col">Per Bid Date</th>
                                <th scope="col">Submission Date</th>
                            </tr>
                        </thead>
                        <tbody>

                        </tbody>
                    </table>
                </div>
            </PreLoader>
        </Fragment>
    )
}

export default TendertrackerList