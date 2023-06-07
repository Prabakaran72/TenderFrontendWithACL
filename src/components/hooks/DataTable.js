import React, {useState, useEffect, useMemo, useRef, useContext} from 'react'; 
import { useTable, useSortBy, usePagination, useGlobalFilter, actions } from 'react-table';
import UseExport from './useExport'
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from "sweetalert2/src/sweetalert2";
import axios from 'axios';
import AuthContext from "../../storeAuth/auth-context";



const DataTable = ({ response, accessor, header, getPermission, navigation, deletion, title, count, handleCount}) => {
  
  const [data, setData] = useState([]);  
  const [newResponse, setNewResponse] = useState([]);  
  const [id, setId] = useState(0);  
  const navigate = useNavigate();   
  const {permission} = useContext(AuthContext);

  let keyName = 'action';  // For Object KeyName

  const editpermission = permission?.[getPermission]?.can_edit == 1;
  const deletepermission = permission?.[getPermission]?.can_delete == 1;  

  response.forEach(res=> {  
    let editBtn = editpermission ? <i className="fas fa-edit icon-edit mr-3" onClick={()=>getRow(res)}></i> : "";
    let deleteBtn = deletepermission ? <i className="fas fa-trash-alt icon-delete" onClick={()=>getDelete(res)}></i> : "";

    res[keyName] = [editBtn, deleteBtn]; // Add New Object Keys & Value
  });


  function getRow(res) {
    // console.log('getRow',res.id);
    navigate(`${navigation}${res.id}`);      
  }
  
  function getDelete(res) {    
    axios.delete(`${deletion}${res.id}`).then((res) => {      
    })  

    const newCount = count + 1; 
    handleCount(newCount)  // pass the data to parent component via parameter
  } 
  

  useEffect(()=> {    
    setData(response);       
  },[(response || getPermission), id]) 


  const columns = useMemo(() => {     
    const columnArray = header.map((headerItem, i) => {            
      return { 
        Header: headerItem,
        accessor: accessor[i],   
      };      
    });   

    columnArray.unshift({
      Header: 'S.No',
      accessor: (row, index) => index + 1,
    });   
    
    (editpermission || deletepermission) && (columnArray.push({
      Header: 'Action',
      accessor: 'action'
    })); 
  
    return columnArray;
  }, [response]); // success
  
  
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


  // Print the Data ********

  const dataTableRef = useRef(null);
  
  const handlePrint = () => {
    const dataTable = dataTableRef.current;
    console.log('dataTable',dataTableRef);
    if (dataTable) {
      setTimeout(() => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`<html><head><title>${title}</title>`);
        printWindow.document.write('<style>');
        printWindow.document.write(`
          .title {
            display: block;
            width: 100%;            
          }
          table {
            border-collapse: collapse;
            width: 100%;            
          }          
          th, td {
            padding: 8px;
            text-align: left;
            border: 1px solid #ddd;
            vertical-align: middle;
            text-align: center;
          }
          th {
            background-color: #f2f2f2;
          }          
        `);
        printWindow.document.write(`</style></head><body><div class="title"><h1>${title}</h1></div><table>`);
        printWindow.document.write(dataTable.outerHTML);
        printWindow.document.write('</table></body></html>');
        printWindow.document.close();
        printWindow.print();
      }, 200);
    }
  };

  return (
    <>
      <div className="react-table-headers">
          <div className="list-and-btns">
              <div>
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
              <div>
                  <UseExport               
                      data={data} 
                      header={header}
                      accessor={accessor} 
                      title = {title}    
                  />   
                   <button className='print-icon btn-rmv-border' onClick={handlePrint}><i className="fas fa-print"></i></button>
              </div>            
          </div>                
          <div className="search">                                     
              <input
                  value={globalFilter || ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Search..."
                  className="form-control"
              />
          </div>
      </div>  
      <div className='table-responsive'>      
        <table ref={dataTableRef} className="table table-bordered text-center" id="dataTable" width="100%" cellSpacing={0} {...getTableProps()}>
          <thead className="p-3 mb-2 text-center bg-greeny text-white">
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} key={index} >
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ?  <i className="fas fa-sort-up ml-2"></i> : <i className="fas fa-sort-down ml-2"></i>) : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, i) => {
                    return <td {...cell.getCellProps()} key={i}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="react-table-footers">
          <div className="pagination">
              <div className="btns">
                  <button
                      className="btn btn-sm mr-3 bg-greeny text-white font-weight-bold"
                      onClick={() => previousPage()}
                      disabled={!canPreviousPage}
                  >
                  <i className="fas fa-chevron-circle-left" />
                  </button>
                  <button
                      className="btn btn-sm mr-1 bg-greeny text-white font-weight-bold"
                      onClick={() => nextPage()}
                      disabled={!canNextPage}
                  >
                      <i className="fas fa-chevron-circle-right" />
                  </button>
              </div>                
              <div className="noOfPage">
                  <span>
                      Page{" "}
                      <strong>
                          {pageIndex + 1} of {pageOptions.length}
                      </strong>{" "}
                  </span>                    
              </div>
          </div>
          <div className="find-page">                    
              <span> {"| "} &nbsp;&nbsp;Go to page: </span>
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
    </>
  );
};

export default DataTable;
