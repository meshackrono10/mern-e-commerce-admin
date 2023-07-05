import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { RiDeleteBin3Line } from "react-icons/ri";
import { AiOutlineEye } from "react-icons/ai";
import "./Products.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../slices/products/productsApiSlice";

function Products() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: products = [],
    isLoading,
    isError,
    refetch,
  } = useGetProductsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [deleteProductApi] = useDeleteProductMutation();

  async function deleteProduct(productId) {
    try {
      await deleteProductApi({ id: productId }).unwrap();
      toast.success("You have successfully deleted the product", {
        className: "toast-message",
      });
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while deleting the product", {
        className: "toast-message",
      });
    }
  }

  const searchQueryChangeHandler = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProductList = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div>
        <Spinner animation="border" />
      </div>
    );
  }

  if (isError) {
    return <div>Error occurred while fetching products.</div>;
  }

  if (filteredProductList.length === 0) {
    return (
      <div style={{ textAlign: "center", fontSize: "3rem" }}>
        No Products available.
      </div>
    );
  }

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 19) {
      return words.slice(0, 19).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        <Col className="products-content" lg={10}>
          <Row>
            <Col lg={8}>
              <h4>Products</h4>
              <p>Below are the products currently added to your website.</p>
            </Col>
            <Col className="product-search-col">
              <div className="product-search-div">
                <p>Search Product</p>
                <input
                  type="text"
                  name="search"
                  value={searchQuery}
                  onChange={searchQueryChangeHandler}
                />
              </div>
            </Col>
          </Row>
          <hr />
          <Row className="products-row">
            <Col
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
              lg={3}
            >
              {filteredProductList.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  deleteProduct={deleteProduct}
                  truncateDescription={truncateDescription}
                />
              ))}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

const ProductCard = ({ product, deleteProduct, truncateDescription }) => {
  const [showMore, setShowMore] = useState(false);

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <Card className="product-card">
      <img src={product?.images[0]} alt="preview" />
      <h2 className="product-card-title">{product.name}</h2>
      <div className="product-card-info">
        <h4 className="product-card-price">Cost ${product.price}</h4>
        <h4 className="product-card-sales">Sales {product.sales}</h4>
        <h4 className="product-card-stock">Stock {product.stock}</h4>
      </div>
      <p className="product-card-desc">
        {showMore ? product.desc : truncateDescription(product.desc)}
      </p>
      {product.desc.length > 300 && (
        <button className="show-more-button" onClick={toggleShowMore}>
          {showMore ? "Show Less" : "Read More"}
        </button>
      )}
      <div className="product-card-icons">
        <Link to={`/product/${product._id}`}>
          <AiOutlineEye className="product-card-icon edit-icon" />
        </Link>
        <RiDeleteBin3Line
          onClick={() => deleteProduct(product._id)}
          className="product-card-icon delete-icon"
        />
      </div>
    </Card>
  );
};

export default Products;
