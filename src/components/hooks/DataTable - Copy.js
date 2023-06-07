import React, {useState, useEffect, useMemo} from 'react'; 
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import UseExport from './useExport'


const DataTable = ({response}) => {
  const [data, setData] = useState([]);
  // const [columns, setColumns] = useState([]);
  
  useEffect(()=> {
    setData(response)
    // setColumns('data')
  },[])
console.log('response',response);

const columns = useMemo(
  () => [
      {
          Header: "#",
          // accessor: (row, index) => index + 1,
      },
      {
          Header: "COUNTRY",
          accessor: "country_name",
          // defaultCanSort: true,
          sortable: true,
      },
      {
          Header: "STATE",
          accessor: "state_name",
          // defaultCanSort: true,
          sortable: true,
      },
      {
          Header: "DISTRICT NAME",
          accessor: "district_name",
          // defaultCanSort: true,
          sortable: true,
      },
      {
          Header: "STATUS",
          accessor: "district_status",
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
                  {/* <UseExport               
                      data={data} 
                      header={header} 
                      title = {title}    
                  />    */}
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
        <table className="table table-bordered text-center" id="dataTable" width="100%" cellSpacing={0} {...getTableProps()}>
          <thead className="p-3 mb-2 text-center bg-greeny text-white">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
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
