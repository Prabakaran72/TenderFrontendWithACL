import axios from "axios";
import React, { useState, useMemo, useEffect, useRef  } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    useTable,
    useSortBy,
    usePagination,
    useGlobalFilter,
} from "react-table";
import { useBaseUrl } from "../../hooks/useBaseUrl";
import Swal from "sweetalert2";
import UseExport from "../../hooks/useExport";


// const data = [
//     { call_no: 'John', customer_name: 25, call_type: 'John', status: 25, next_follow_up_date: 'John', started: 25, finished: 25 },
//     { call_no: 'david', customer_name: 25, call_type: 'John', status: 25, next_follow_up_date: 'David', started: 25, finished: 25, },
//     // Add more data objects as needed
//   ];

const HolidayList = () => {
    const {server1: baseUrl} = useBaseUrl();
    const navigate = useNavigate();    
    const [header, setHeader] = useState([]);
    const [data, setData] = useState([]);      
    const [getRowData, setGetRowData] = useState(0); 
    const [newHeader,setNewHeader] = useState([]);
    const [newData,setNewData] = useState([]);

    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, index) => index + 1,
            },
            {
                Header: "Occasion",
                accessor: "occasion",
                // defaultCanSort: true,
                sortable: true,
            },
            {
                Header: "Date",
                accessor: "date",
                // defaultCanSort: true,
                sortable: true,
            },
            {
                Header: "Remarks",
                accessor: "remarks",
                // defaultCanSort: true,
                sortable: true,
            },
            {
                Header: "Action",
                accessor: "action",
                // defaultCanSort: true,
                sortable: true,
            },           
        ],
        []
    );

    const tableInstance = useTable( { columns, data, }, useGlobalFilter, useSortBy, usePagination );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize, globalFilter },
        setGlobalFilter,
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        pageCount,
        setPageSize,
    } = tableInstance;


    useEffect(()=> {                 
        axios.get(`${baseUrl}/api/holidays`).then((resp)=> { 
            const holidaysList = resp.data.holidaylist.map((hod)=> {                                      
                return {
                occasion : hod.occasion,
                date: hod.date,
                remarks : hod.remarks,
                action : (
                    <div>
                      <button onClick={() => getRow(hod)} className="mr-2"><i className="fas fa-edit icon-edit" /></button>
                      <button onClick={() => deleteRow(hod)}><i className="fas fa-trash-alt icon-trash" /></button>
                    </div>
                  )   
                };                               
            })              
            setData(holidaysList);                     
            console.log('data+++', holidaysList);     
        })
    },[]);

    useEffect(()=> {
        let HeadersList = [];
  
        columns.map((col)=> {        
            HeadersList.push(col.accessor);
        })
        // console.log('HeadersList',HeadersList);
      setHeader(HeadersList);     


      const HeaderList = ['occasion', 'date', 'remarks'];
      const newDatas = data.map((val)=> {
        return {
               occasion : val.occasion,
               date : val.date,
               remarks : val.remarks,
               action : ''
        }        
      })
        setNewHeader(HeaderList);
        setNewData(newDatas);
      console.log('newData',newData);
      },[])

    //   useEffect(()=> {
    //   },[data])

     useEffect(()=> {                 
        console.log('success');
    },[getRowData]);

    const getRow = (hod) => {
        navigate(`/tender/hr/holiday/edit/${hod.id}`);
        console.log('hod', hod);
    }     

    const deleteRow = (hod) => {     
        setGetRowData(hod);    
        console.log('hod', hod);
        axios.delete(`${baseUrl}/api/holidays/${hod.id}`).then((resp)=> { 
            console.log('delete',resp);
            if (resp.data.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Holiday",
              text: "Deleted Successfully!",
              confirmButtonColor: "#5156ed",
            });            
            navigate('/tender/hr/holiday')
          } else if (resp.data.status === 400) {
            Swal.fire({
              icon: "error",
              title: "Holiday",
              text: resp.data.errors,
              confirmButtonColor: "#5156ed",
            });            
          }
        })
    }  
        
    
       
    return (        
        <div className="table-responsive pb-3">
            <div className="d-flex justify-content-between mb-2">
                <div className="">
                    <select
                        className="form-control"
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="d-flex ">  
                    <UseExport               
                        data={data} 
                        header={header} 
                        title = {'HOLIDAY LIST'}    
                    />                  
                    <input
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                        className="form-control"
                    />
                </div>
            </div>
            <table
                className="table table-bordered text-center"
                id="dataTable"
                width="100%"
                cellSpacing={0}
                {...getTableProps()}
            >
                <thead className="p-3 mb-2 text-center bg-greeny text-white">
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render("Header")}
                                    <span className="text-right">
                                        {column.defaultCanSort && column.isSorted ? (
                                            column.isSortedDesc ? (
                                                <i className="fas fa-sort-amount-asc text-white"></i>
                                            ) : (
                                                <i className="fas fa-sort-amount-desc text-white"></i>
                                            )
                                        ) : (
                                            <span></span>
                                        )}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="row align-items-center">
                <div className="col-auto">
                    <button
                        className="btn btn-sm mr-1 bg-greeny text-white font-weight-bold"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                       <i className="fas fa-chevron-circle-left" />
                    </button>
                </div>
                <div className="col-auto">
                    <button
                        className="btn btn-sm mr-1 bg-greeny text-white font-weight-bold"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        <i className="fas fa-chevron-circle-right" />
                    </button>
                </div>
                <div className="col-auto">
                    <span>
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                </div>
                <div className="col-auto">
                    <span> {"| "} &nbsp;&nbsp;Go to page: </span>
                </div>
                <div className="col-sm-1">
                    <input
                        className="form-control"
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={(e) => {
                            const pageNumber = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(pageNumber);
                        }}
                    />
                </div>
            </div>           
        </div>

    );
};
export default HolidayList;
