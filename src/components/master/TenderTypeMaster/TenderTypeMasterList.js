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

const TenderTypeMasterList = () => {
  const [loading, setLoading] = useState(true);
  const [tenderTypeList, setTenderTypeList] = useState([]);
  const { server1: baseUrl } = useBaseUrl();
  const {permission} = useContext(AuthContext)
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    axios.get(`${baseUrl}/api/tendertype`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setTenderTypeList(res.data.tenderType);
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
        navigate(
          `/tender/master/tendertypemaster/tendertypecreation/${update_id}`
        );
      }
    });
  };

  const deleteHandler = (e, id) => {
    e.preventDefault();

    Swal.fire({
      text: "Are You sure, to Delete this record?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      confirmButtonColor: "#2fba5f",
      cancelButtonColor: "#fc5157",
    }).then((willupdate) => {
      if (willupdate.isConfirmed) {
        axios.delete(`${baseUrl}/api/tendertype/${id}`).then((response) => {
          if (response.data.status === 200) {
            Swal.fire({
              //success msg
              icon: "success",
              text: `Tender Type has been removed!`,
              timer: 1500,
              showConfirmButton: false,
            });
            // navigate(`/tender/master/tendertypemaster`);
            window.location.reload();
          } else {
            Swal.fire({
              //success msg
              icon: "error",
              text: `Unable to Remove Tender Type !`,
              timer: 1500,
              showConfirmButton: false,
            });
          }
        });
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
    return (
      <h6 className="text-success ">Loading Tender Type Master List...!!</h6>
    );
  } else {
    var tender_FORM = tenderTypeList.map((item, index) => {
      return (
        <tr key={item.id}>
          <td className="text-center">{index + 1}</td>
          <td className="text-center">{item.tendertype}</td>
          <td
            className={
              item.tendertype_status === "Active"
                ? "text-center text-success"
                : "text-center text-danger"
            }
          >
            {item.tendertype_status}
          </td>
          <td className="text-center">
            <span>
              {!!(permission?.['Tender Types']?.can_edit) && <i
                className="fas fa-edit text-primary h6"
                onClick={(e) => editHandler(e, item.id)}
              ></i>}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
             {!!(permission?.['Tender Types']?.can_delete) && <i
                className="fas fa-trash-alt text-danger h6"
                onClick={(e) => deleteHandler(e, item.id)}
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
                <th className="text-center">TENDER TYPE NAME</th>
                <th className="text-center">STATUS</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>

            <tbody>{tender_FORM}</tbody>
          </table>
        </div>
      </div>
    </Fragment>
  );
};
export default TenderTypeMasterList;
