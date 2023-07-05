import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
// import Sidebar from "../../Components/Sidebar";
import { DataGrid } from "@mui/x-data-grid";

import "./Orders.css";
import { Link } from "react-router-dom";
import { useGetAllOrdersQuery } from "../../slices/orders/ordersApiSlice";
function Orders() {
  const [pages, setPages] = useState(5);

  const { data: orders = [] } = useGetAllOrdersQuery();

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      width: 200,
      renderCell: (params) => {
        return <Link to={`/orders/${params.value}`}>{params.value}</Link>;
      },
    },
    {
      field: "userId",
      headerName: "Customer ID",
      width: 200,
      renderCell: (params) => {
        return <p>{params.value}</p>;
      },
    },
    {
      field: "userName",
      headerName: "Customer name",
      width: 240,
    },
    {
      field: "userPhone",
      headerName: "Customer Phone",
      width: 200,
    },
    {
      field: "status",
      headerName: "Order Status",
      width: 160,
    },
    {
      field: "orderAmount",
      headerName: "Order Amount",
      width: 160,
    },
    {
      field: "orderedAt",
      headerName: "Order Date",
      width: 160,
    },
  ];

  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        <Col className="orders-content" lg={10}>
          <h4>Orders</h4>
          <p>Here is the list of all the orders placed on your website</p>
          <hr />
          {orders && (
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={orders.map((order) => {
                  return {
                    id: order?._id,
                    userId: order?.userId,
                    userName: order?.billingAddress?.firstName,
                    userPhone: order?.phoneNumber,
                    status:
                      order.status === "processing"
                        ? "Processing"
                        : order.status === "shipped"
                        ? "Shipped"
                        : order.status === "delivered"
                        ? "Delivered"
                        : "Cancelled",
                    orderAmount: `Rs. ${order.amount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/-`,
                    orderedAt: order.createdAt,
                  };
                })}
                columns={columns}
                pageSize={pages}
                className="orders-data-grid"
                rowsPerPageOptions={[5, 10, 15, 20, 25]}
                onPageSizeChange={(pageSize) => {
                  setPages(pageSize);
                }}
              />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Orders;
