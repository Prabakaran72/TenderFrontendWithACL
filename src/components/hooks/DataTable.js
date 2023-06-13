import React from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';

const DataTable = () => {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    setGlobalFilter,
    state: { globalFilter },
  } = useTable(
    // Pass your data and columns to the useTable hook
    {
      data,
      columns,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div>
      <input
        type="text"
        value={globalFilter || ''}
        onChange={e => setGlobalFilter(e.target.value)}
        placeholder="Search..."
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.isSorted}
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? (
                                                    <i className="fa fa-caret-down text-white h6"></i>
                                                ) : (
                                                    <i className="fa fa-caret-down fa-rotate-180 text-white h6"></i>
                                                ))
                                                :  ""}
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
  );
};

export default DataTable;
