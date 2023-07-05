import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import {
  RiMailLine,
  RiPhoneLine,
  RiHome2Line,
  RiUser3Line,
  RiUserLocationLine,
  RiCalendarEventLine,
  RiCalendarTodoLine,
  RiCalendarCheckLine,
  RiMoneyDollarCircleLine,
  RiQuestionLine,
} from "react-icons/ri";

import "./Order.css";
import { useNavigate, useParams } from "react-router";
import {
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} from "../../slices/orders/ordersApiSlice";

function Order(props) {
  const [order, setOrder] = useState({});
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const navigate = useNavigate();
  const [updateOrder] = useUpdateOrderMutation();
  const [deleteSingleOrder] = useDeleteOrderMutation();

  const { orderId } = useParams();
  useEffect(() => {
    const getOrder = () => {
      axios({
        method: "get",
        url: `https://t-brand-api.onrender.com/api/orders/find/order/${orderId}`,
      }).then((response) => {
        setOrder(response.data);
        console.log(response.data);
      });
    };
    getOrder();
  }, []);

  const updateOrderStatus = async (event, status, shippedAt, deliveredAt) => {
    event.preventDefault();
    try {
      const data = {
        status: status,
        shippedAt: shippedAt,
        deliveredAt: deliveredAt,
      };
      const res = await updateOrder({ id: orderId, data: data });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteOrder = async (event) => {
    event.preventDefault();
    await deleteSingleOrder({ orderId }).then(() => {
      navigate("/orders");
    });
  };

  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        <Col className="single-order-content" lg={10}>
          {order && order.userId && (
            <Card className="order-card">
              <Row className="order-user-details">
                <Col>
                  <Row>
                    <Col className="user-detail-col">
                      <p>
                        <RiUser3Line className="user-icon" /> -{" "}
                        {order.billingAddress.firstName}{" "}
                        {order.billingAddress.lastName}
                      </p>
                      <p>
                        <RiPhoneLine className="user-icon" />{" "}
                        {order.phoneNumber}
                      </p>
                      <p>
                        <RiMailLine className="user-icon" /> {order.email}
                      </p>
                      <p>
                        <RiHome2Line className="user-icon" />{" "}
                        {order?.shippingAddress?.street1},{" "}
                        {order?.shippingAddress?.city} -
                      </p>
                      <p>
                        <RiUserLocationLine className="user-icon" />{" "}
                        {order?.shippingAddress?.state}
                      </p>
                    </Col>
                    <Col className="order-detail-col">
                      <p>
                        <RiQuestionLine className="order-icon" />{" "}
                        {order.status === "processing"
                          ? "Processing"
                          : order.status === "shipped"
                          ? "Shipped"
                          : order.status === "delivered"
                          ? "Delivered"
                          : "Cancelled"}
                      </p>
                      <p>
                        <RiMoneyDollarCircleLine className="order-icon" />{" "}
                        {`USD. ${order?.amount
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}/-`}
                      </p>
                      <p>
                        <RiCalendarEventLine className="order-icon" />{" "}
                        {order?.createdAt}
                      </p>
                      <p>
                        <RiCalendarTodoLine className="order-icon" />{" "}
                        {order?.shippedAt}
                      </p>
                      <p>
                        <RiCalendarCheckLine className="order-icon" />{" "}
                        {order?.deliveredAt}
                      </p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="order-actions">
                <Col>
                  <button
                    onClick={(e) => {
                      let date = new Date();
                      const day = weekday[date.getDay()];
                      updateOrderStatus(
                        e,
                        "shipped",
                        `${day}, ${date.getDate()} ${
                          month[date.getMonth()]
                        } ${date.getFullYear()}`,
                        "Not yet delivered"
                      );
                    }}
                  >
                    Order Shipped
                  </button>
                </Col>
                <Col>
                  <button
                    onClick={(e) => {
                      let date = new Date();
                      const day = weekday[date.getDay()];
                      updateOrderStatus(
                        e,
                        "delivered",
                        order.shippedAt,
                        `${day}, ${date.getDate()} ${
                          month[date.getMonth()]
                        } ${date.getFullYear()}`
                      );
                    }}
                  >
                    Order Delivered
                  </button>
                </Col>
                <Col>
                  <button
                    onClick={(e) => {
                      updateOrderStatus(
                        e,
                        "cancelled",
                        order.shippedAt,
                        order.deliveredAt
                      );
                    }}
                  >
                    Order Cancelled
                  </button>
                </Col>
                <Col>
                  <button onClick={deleteOrder}>Delete Order</button>
                </Col>
              </Row>
              <div className="order-products-div">
                {order?.products &&
                  order?.products?.map((item) => {
                    return (
                      <Card key={item?._id} className="order-product-card">
                        <Row className="product-card-row">
                          <Col className="product-image-col">
                            <img src={item.image} alt={item.name} />
                          </Col>
                          <Col className="product-order-details" lg={10}>
                            <Row>
                              <Col>
                                <Row className="product-order-details-row">
                                  <Col lg={2}>
                                    <p>Product ID :</p>
                                  </Col>
                                  <Col>
                                    <p>
                                      <strong>{item.productId}</strong>
                                    </p>
                                  </Col>
                                </Row>
                                <Row className="product-order-details-row">
                                  <Col lg={2}>
                                    <p>Name :</p>
                                  </Col>
                                  <Col>
                                    <p>
                                      <strong>{item.name}</strong>
                                    </p>
                                  </Col>
                                </Row>
                                {/* <Row>
                                  <Col lg={2}>
                                    <p>Price :</p>
                                  </Col>
                                  <Col>
                                    <p>
                                      <strong>
                                        Rs.{" "}
                                        {item?.price
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )}
                                        /-
                                      </strong>
                                    </p>
                                  </Col>
                                </Row> */}
                                <Row className="product-order-details-row">
                                  <Col lg={2}>
                                    <p>Category ID :</p>
                                  </Col>
                                  <Col>
                                    <p>
                                      <strong>{item._id}</strong>
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                              <Col>
                                <Row className="product-order-details-row">
                                  <Col lg={2}>
                                    <p>Quantity :</p>
                                  </Col>
                                  <Col>
                                    <p>
                                      <strong>{item.quantity}</strong>
                                    </p>
                                  </Col>
                                </Row>
                                <Row className="product-order-details-row">
                                  <Col lg={2}>
                                    <p>Item Total :</p>
                                  </Col>
                                  <Col>
                                    <p>
                                      <strong>
                                        Rs.&nbsp;
                                        {order.amount
                                          .toString()
                                          .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                          )}
                                        /-
                                      </strong>
                                    </p>
                                  </Col>
                                </Row>
                                <Row className="product-order-details-row">
                                  <Col lg={2}>
                                    <p>Description :</p>
                                  </Col>
                                  <Col>
                                    <p>
                                      <strong>{item?.description}</strong>
                                    </p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Card>
                    );
                  })}
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Order;
