import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { DataGrid } from "@mui/x-data-grid";
import { useGetUserQuery } from "../slices/users/usersApiSlice";
import { useGetProductsQuery } from "../slices/products/productsApiSlice";
import { useGetAllOrdersQuery } from "../slices/orders/ordersApiSlice";

function Dashboard() {
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [pages, setPages] = useState(5);

  const { data: users = [] } = useGetUserQuery();
  const { data: products = [] } = useGetProductsQuery();
  const { data: orders = [] } = useGetAllOrdersQuery();
  useEffect(() => {
    fetchRecentTransactions();
    fetchRecentCustomers();
  }, []);

  const fetchRecentTransactions = async () => {
    try {
      const response = await axios.get(
        "https://api.stripe.com/v1/payment_intents",
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_STRIPE_KEY}`,
          },
          params: {
            limit: 10, // Change the limit as per your requirement
          },
        }
      );
      setRecentTransactions(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRecentCustomers = async () => {
    try {
      const response = await axios.get("https://api.stripe.com/v1/customers", {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_STRIPE_KEY}`,
        },
        params: {
          limit: 10, // Change the limit as per your requirement
        },
      });
      setRecentCustomers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const calculateRevenue = () => {
    const revenue = recentTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );
    return `$${revenue}`;
  };

  const calculateUsers = () => {
    return users.length;
  };

  const calculateTotalProducts = () => {
    return products.length;
  };

  const calculateTotalOrders = () => {
    return orders.length;
  };

  const transactionColumns = [
    {
      field: "amount",
      headerName: "Amount",
      width: 200,
      cellClassName: "white-text",
      headerClassName: "white-header",
    },
    {
      field: "currency",
      headerName: "Currency",
      width: 250,
      cellClassName: "white-text",
      headerClassName: "white-header",
    },
    {
      field: "status",
      headerName: "Payment Status",
      width: 300,
      cellClassName: "white-text",
      headerClassName: "white-header",
    },
  ];

  const customerColumns = [
    {
      field: "email",
      headerName: "Email",
      width: 400,
      cellClassName: "white-text",
      headerClassName: "white-header",
    },
    {
      field: "balance",
      headerName: "Balance",
      width: 200,
      cellClassName: "white-text",
      headerClassName: "white-header",
    },
    {
      field: "address.country",
      headerName: "Country",
      width: 200,
      cellClassName: "white-text",
      headerClassName: "white-header",
    },
  ];

  return (
    <div className="dashboard-parent">
      <section className="dashboard-parent-main">
        <div className="dashboard-parent-card">
          <h2>Orders</h2>
          <p>{calculateTotalOrders()}</p>
        </div>
        <div className="dashboard-parent-card">
          <h2>Users</h2>
          <p>{calculateUsers()}</p>
        </div>
        <div className="dashboard-parent-card">
          <h2>Revenue</h2>
          <p>{calculateRevenue()}</p>
        </div>
        <div className="dashboard-parent-card">
          <h2>Total Products</h2>
          <p>{calculateTotalProducts()}</p>
        </div>
      </section>
      <div className="left">
        <section className="dashboard-parent-transactions">
          <h2>Recent Transactions</h2>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={recentTransactions}
              columns={transactionColumns}
              pageSize={pages}
              rowsPerPageOptions={[5, 10, 15, 20, 25]}
              onPageSizeChange={(pageSize) => {
                setPages(pageSize);
              }}
              className="datagrid"
            />
          </div>
        </section>
        <section className="dashboard-parent-customers">
          <h2>Recent Customers</h2>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={recentCustomers}
              columns={customerColumns}
              pageSize={pages}
              rowsPerPageOptions={[5, 10, 15, 20, 25]}
              onPageSizeChange={(pageSize) => {
                setPages(pageSize);
              }}
              className="datagrid"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
