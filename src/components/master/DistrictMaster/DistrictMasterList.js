import axios from "axios";
// import { data } from "jquery";
import { useState, useEffect, Fragment, useContext } from "react";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import { Loader } from 'rsuite';
//For DataTable
import "jquery/dist/jquery.min.js";
import $ from "jquery";
import "datatables.net-dt/js/dataTables.dataTables";
import "datatables.net-bs4";
import jsZip from "jszip";
import "datatables.net-buttons";
import "datatables.net-buttons/js/dataTables.buttons.js";
import "datatables.net-buttons/js/buttons.colVis.js";
import "datatables.net-buttons/js/buttons.flash.js";
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../storeAuth/auth-context";
import { can } from "../../UserPermission";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
window.JSZip = jsZip;



const DistrictMasterList = () => {
  const [loading, setLoading] = useState(true);
  const [districtList, setDistrictList] = useState([]);
  const { server1: baseUrl } = useBaseUrl();
  const {permission} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    axios.get(`${baseUrl}/api/district`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
          setDistrictList(res.data.district);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [loading]);

  const editHandler = (e, update_id) => {
    e.preventDefault();

    Swal.fire({
      text: "Are You sure, to update this record?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      confirmButtonColor: "#2fba5f",
      cancelButtonColor: "#fc5157",
    }).then((willupdate) => {
      if (willupdate.isConfirmed) {
        navigate(`/tender/master/districtmaster/districtcreation/${update_id}`);
      }
    });
  };

  const deleteHandler = (id, name) => {
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
          axios.delete(`${baseUrl}/api/district/${id}`)
          .then((res) => {
          if (res.data.status === 200) {
            setLoading(true);
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

  useEffect(() => {
    const table = $(`#dataTable`).DataTable({
      dom:
        "<'row'<'col-sm-12   col-md-2 mt-2'l> <'col-sm-12  col-md-4'B> <'col-sm-12 col-md-6 mt-2'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",

      buttons: [],
    });

    return () => {
      table.destroy();
    };
  }, [loading]);

  if (loading) {
    return (
      <Fragment>
   
      <Loader size="lg" backdrop
content="Fetching Data..." />
</Fragment>
    );
  } else {
    var districtList_HTML = districtList.map((districtData, index) => {
      return (
        <tr key={districtData.id}>
          <td className="text-center">{index + 1}</td>
          <td className="pl-3">{districtData.country_name}</td>
          <td className="pl-3">{districtData.state_name}</td>
          <td className="pl-3">{districtData.district_name}</td>
          {districtData.district_status === "Active" && (
                    <td className="text-success font-weight-bold">
                      Active
                    </td>
                  )}
                  {districtData.district_status === "InActive" && (
                    <td className="">Inactive</td>
                  )}
      
          <td className="text-center">
            <span className ="h5" >
              {can('district-edit', (permission || [])) &&  <i
                className="fa fa-edit text-primary mr-4"
                onClick={(e) => editHandler(e, districtData.id)}
               
              ></i>}
              {can('district-delete', (permission || [])) &&<i
                className="fa fa-trash text-danger "
             
                onClick={() => deleteHandler(districtData.id, districtData.district_name)}
              ></i>}
            </span>
          </td>
        </tr>
      );
    });
  }

  return (
    <Fragment>
      <div className="card-body">
        <div className="table-responsive">
          <table
            className="table table-bordered"
            id="dataTable"
            width="100%"
            cellSpacing={0}
          >
            <thead>
              <tr>
                <th className="text-center">SNO</th>
                <th className="text-center">COUNTRY</th>
                <th className="text-center">STATE</th>
                <th className="text-center">DISTRICT NAME</th>
                <th className="text-center">STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>

            <tbody>{districtList_HTML}</tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};
export default DistrictMasterList;
