import CustomNavbar from "../../Common/CustomNavbar/Index";
import { CUSTOMER_API_URL, BASE_URL  } from "../../utils/contants";
import axios from "axios";
import { useCallback } from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import * as React from 'react';



const columns = [
  { id: 'fullName', label: 'Name', minWidth: 170 },
  { id: 'email', label: 'Email', minWidth: 100 },
  {
    id: 'country',
    label: 'Country',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'username',
    label: 'Username',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toLocaleString('en-US'),
  },
  {
    id: 'phone',
    label: 'Phone No.',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'company',
    label: 'Company',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
  {
    id: 'img',
    label: 'Image',
    minWidth: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },

];

function createData(fullName, email, country, username , phone, company) {
  return { fullName, email, country, username , phone, company };
}



const CustomersAccounts = () => {

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

const [customers, setcustomers] = useState([]);
    useEffect(() => {
        axios
          .get( CUSTOMER_API_URL)
          .then(res => setcustomers(res.data))
          .then(err => console.log(err));
      }, []);
      const deleteCustomer = useCallback(async (customer) => {
        axios.delete( CUSTOMER_API_URL + `/${customer._id}`).then((response) => {
          toast('Customer Deleted Successfully')
          axios
            .get( CUSTOMER_API_URL)
            .then(res => setcustomers(res.data))
            .then(err => console.log(err));
        })
          .catch((error) => {
            toast('There was an error while deleting Customer')
            console.log('error while deleting Customer :', error)
          })
      }, [])

    return (
        <div className="">
            <CustomNavbar/>
            <h3 className="text-center m-3">Customers Accounts</h3>
            <div className="container">
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, textTransform:"uppercase", fontWeight:"bolder" }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}
                         align={column.align}                    >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                    <img style={{width:"80px", height:"80px", marginLeft:"-80px"}} src={BASE_URL + row?.image?.url} />
                    <button onClick={() => deleteCustomer(row)} className="btn btn-danger btn-md" style={{ marginLeft:"50px" }}>Delete</button>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={customers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    </div>

        </div>
    );
}

export default CustomersAccounts;
