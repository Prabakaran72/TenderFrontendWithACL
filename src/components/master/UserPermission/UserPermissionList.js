import axios from "axios";
import { Fragment,  useContext,  useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";

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
import Swal from "sweetalert2/src/sweetalert2";
import { Loader } from "rsuite";
import AuthContext from "../../../storeAuth/auth-context";
import { can } from "../../UserPermission";

let table;
const UserPermissionList = () => {
    const { server1: baseUrl } = useBaseUrl();
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {permission} = useContext(AuthContext)
    
    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        const userPermissionList = await axios.get(`${baseUrl}/api/userpermissions`);

        var dataSet;
        if (
            userPermissionList.status === 200 
        ) {
          let list = [...userPermissionList.data.roles];
          let listarr = list.map((item, index, arr) => {
            let editbtn = !!(permission?.["User Permissions"]?.can_edit) ? '<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> ' : '';
            let deletebtn =  !!(permission?.["User Permissions"]?.can_delete) ?  '<i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>' : '';
            return {
            ...item,
            // status : (item.activeStatus ===  "active") ? `<span class="text-success font-weight-bold"> Active </span>` : `<span class="text-warning font-weight-bold"> Inactive </span>`,
            // action: `<i class="fas fa-edit text-info mx-2 h6" style="cursor:pointer" title="Edit"></i> <i class="fas fa-trash-alt text-danger h6  mx-2" style="cursor:pointer"  title="Delete"></i>`,
            action:  editbtn + deletebtn ,
            sl_no: index + 1,
          }});
    
          dataSet = listarr;
    
        } else {
           dataSet = [];
        }

        let i = 0;
        table = $("#dataTable").DataTable({
            data: dataSet,
            columns: [
              {
                //data: 'sl_no',
                render: function (data, type, row) {
                  return ++i;
                },
              },
              { data: "name" },
              { data: "action" },
            ],
          })
          setLoading(false)

          $("#dataTable tbody").on("click", "tr .fa-edit", function () {
            let rowdata = table.row($(this).closest("tr")).data();
            navigate(
              `/tender/master/userpermissions/edit/${rowdata.role_id}`
            );
          });
    
    }

    return(
        <Fragment>
            <div>
                {loading && <Loader size="lg" backdrop content="Fetching Data..." />}
            </div>
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
                    <th className="">User Type (Role)</th>
                    <th className="">Action</th>
                    </tr>
                </thead>
                <tbody></tbody>
                </table>
            </div>
        </Fragment>
    )

}

export default UserPermissionList