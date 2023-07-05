import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
// import Sidebar from "../../Components/Sidebar";
import { Link } from "react-router-dom";
import {
  RiMailLine,
  RiPhoneLine,
  RiHome2Line,
  RiShoppingCartLine,
} from "react-icons/ri";

import "./User.css";

function User(props) {
  const [user, setUser] = useState();

  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        {user && (
          <Col className="user-content" lg={10}>
            <Card className="single-user-card">
              <Row>
                <Col className="user-details-col">
                  <img
                    src={`https://ecommerceappcj.herokuapp.com/${user.image}`}
                    alt={user.name}
                  />
                  <h4>{user.name}</h4>
                  <hr />
                  <p>
                    <RiHome2Line className="icon" /> {user.address}, {user.city}
                    , {user.state} - {user.pin}
                  </p>
                  <p>
                    <RiPhoneLine className="icon" /> {user.phone}
                  </p>
                  <p>
                    <RiMailLine className="icon" /> {user.email}
                  </p>
                  <p>
                    <RiShoppingCartLine className="icon" />{" "}
                    {user.orders.length.toString()} order(s) placed so far.
                  </p>
                </Col>
                <Col className="user-orders-col">
                  <h6>Orders</h6>
                  <div className="orders-div">
                    {user.orders.map((order) => {
                      return (
                        <Card className="user-order-card">
                          <Row>
                            {setUser(user)}
                            <Col>
                              <p>
                                Order ID :{" "}
                                <Link to={`/orders/${order._id}`}>
                                  {order._id}
                                </Link>{" "}
                              </p>
                              <p>Order Date : {order.orderedAt}</p>
                              <p>
                                Order Amount : Rs.{" "}
                                {order.orderAmount
                                  .toString()
                                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                /-
                              </p>
                            </Col>
                            <Col>
                              <p>
                                Order Status :{" "}
                                {order.status === "placed"
                                  ? "Placed"
                                  : order.status === "shipped"
                                  ? "Shipped"
                                  : order.status === "delivered"
                                  ? "Delivered"
                                  : "Cancelled"}
                              </p>
                              <p>Shipping Status : {order.shippedAt}</p>
                              <p>Delivery Status : {order.deliveredAt}</p>
                            </Col>
                          </Row>
                        </Card>
                      );
                    })}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}

export default User;
