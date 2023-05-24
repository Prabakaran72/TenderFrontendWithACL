import React from 'react'
import { useEffect } from 'react';


// const [header, setHeader] = useState([]);  //  ***** Use this useState for Excel Export and Import this on your desired Component *****  //
// useEffect(()=> {      //  ***** Use this useEffect for Excel Export and Import this on your desired Component *****  //
//   let HeadersList = [];
//   columns.map((col)=> {        
//       HeadersList.push(col.accessor);
//   })  
//   setHeader(HeadersList);     
// },[])


const UseExport = ({ data, header, title }) => {

  console.log('data',data);
  console.log('header',header);

  function capitalizeArr(array) {
    const sno = 'S.No';
    const ArrSlice = array.slice(1);
    const Array = [sno].concat(ArrSlice);
    return Array.map((str) => {
      if (typeof str !== 'string') {
        return str; // Return the element as is if it's not a string
      }
      const words = str.split('_');
      const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
      return capitalizedWords.join(' ');
    })
  }

  const toLower = title.toLowerCase();
  const toCamel = toLower.charAt(0).toUpperCase() + toLower.slice(1);
  const titleDownloadName = toCamel.split(' ').join('_');

  const myArray = header;
  const Header = capitalizeArr(myArray);

  useEffect(() => {   // This useEffect only for testing
    data.map((row, index) => {      
      const rowData = `${index + 1} ${header.map((column) => row[column] == '[object Object]' ? '' : row[column])}`;      
    })
  }, [])

  const handleExport = () => {   // OnClick from Excel Button  
    // const headers = ['Sno', 'Customer Name', 'Country', 'State', 'District', 'City','BDM Name','Assign Status']; 
    let i=1;       
    const csv = [
      title,
      Header.map((head)=> {return head == 'Action' ? '' : head}),
      ...data.map((row, index) => {  
        console.log('rowdata',row);
        //this if condition for Call assign, if  Cusotmer is checked the assign_status=1 or 0. So we have to display either Assigned or not by using value. it will return other field data without changes, 
        // this returns current row if the header not has assign_status accesor
        if (row.assign_status == '1') {
          // return `${index + 1},${row.customer_name},${row.country_name},${row.state_name},${row.district_name}, ${row.city_name},${userName.current},"Assigned"`;               
          const rowData_AssignCall = `${i++} ${header.map((column) => (row[column] == '1' ? 'Assigned' : row[column]))}`;          
          
          return rowData_AssignCall;
        }
        else {
          if (row.action) {
            const rowData = `${i++} ${header.map((column) => row[column] == '[object Object]' ? '' : row[column])}`;            
            
            return rowData;
          }
          else {
            return null; // Return null for the empty row
          }          
        }
      })
    ].filter(row => row !== null) // Filter out the null values
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', titleDownloadName + '.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };



  return (
    <>
      <button name="export" className="btn" onClick={handleExport}>
        <i className="fas fa-file-excel fa-lg text-success" />
      </button>
    </>
  )
}

export default UseExport;