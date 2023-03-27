import axios from "axios";
// import { data } from "jquery";
import { useState, useEffect, Fragment, useContext } from "react";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Swal from "sweetalert2";

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


const UnitMasterList = () => {
  const [loading, setLoading] = useState(true);
  const [unitList, setUnitList] = useState([]);
  const { server1: baseUrl } = useBaseUrl();
  const {permission} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    axios.get(`${baseUrl}/api/unit`).then((res) => {
      if (isMounted) {
        if (res.status === 200) {
            setUnitList(res.data.unit);
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
        navigate(`/tender/master/unitmaster/unitcreation/${update_id}`);
      }
    });
  };

  useEffect(() => {
    const table = $(`#dataTable`).DataTable({
      dom:
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
      table.destroy();
    };
  }, [loading]);

  if (loading) {
    return <h4 className="text-success ">Loading Unit Master List...!!</h4>;
  } else {
    var unitList_HTML = unitList.map((unitData, index) => {
      return (
        <tr key={unitData.id}>
          <td className="text-center">{index + 1}</td>
          <td className="pl-3">{unitData.unit_name}</td>
          <td className="text-center">{unitData.unit_status}</td>
          <td className="text-center">
            <span>
             {!!(permission?.Units?.can_edit) && <i
                className="fas fa-edit text-primary h4"
                onClick={(e) => editHandler(e, unitData.id)}
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
            <thead className="text-center bg-primary text-white">
              <tr>
                <th className="text-center">SNO</th>
                <th className="text-center">UNIT NAME</th>
                <th className="text-center">STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>

            <tbody>{unitList_HTML}</tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};
export default UnitMasterList;
