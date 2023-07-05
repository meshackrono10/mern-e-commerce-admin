import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "../../slices/users/usersApiSlice";

import "./Users.css";

function Users() {
  const [pages, setPages] = useState(5);

  const { data: users = [] } = useGetUserQuery();

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      width: 200,
      renderCell: (params) => {
        return <Link to={`/users/${params.value}`}>{params.value}</Link>;
      },
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return <p>{params.value}</p>;
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 240,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 200,
    },
  ];

  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}></Col>
        <Col className="users-content" lg={10}>
          <h4>Users</h4>
          <p>Below are the customers that have registered on your website.</p>
          <hr />
          {users && (
            <div style={{ height: 600, width: "100%" }}>
              <DataGrid
                rows={users.map((user) => ({
                  id: user?._id,
                  name: user?.name,
                  email: user?.email,
                  phone: user?.phone,
                }))}
                columns={columns}
                pageSize={pages}
                className="users-data-grid"
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

export default Users;
