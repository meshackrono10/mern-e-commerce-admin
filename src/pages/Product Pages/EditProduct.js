import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";

import "./AddProduct.css";
import { useGetCatQuery } from "../../slices/category/catApiSlice";
import { useGetAllSubCatsQuery } from "../../slices/subCat/subCatApiSlice";
import { toast } from "react-toastify";
import {
  useGetOneProductQuery,
  useUpdateProductMutation,
} from "../../slices/products/productsApiSlice";
import ImageUploader from "../../components/cloudinary/ImageUploader";
import { useNavigate, useParams } from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const [skipQuery, setSkipQuery] = useState(true); // Set initial skip value to true

  // get a categories
  const [categoryId, setCategoryId] = useState("");
  const [categoryDataValue, setCategoryDataValue] = useState("");
  const { data: categories = [] } = useGetCatQuery();

  // get a single sub category
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subcategoryDataValue, setSubCategoryDataValue] = useState("");
  const { data: subcategories = {} } = useGetAllSubCatsQuery({
    SUB_CAT_URL: categoryId,
  });

  // get a product
  const { data: product = [] } = useGetOneProductQuery({
    id: id,
    skip: skipQuery, // Skip the initial query
  });
  useEffect(() => {
    setSkipQuery(false); // Toggle skip to false after component mounts
  }, []);

  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
    category: product.category,
    subCategory: product.subCategory,
    desc: product.desc,
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prev) => {
      if (name === "category" && value === categoryDataValue) {
        // If category is not changed, keep the original value
        return { ...prev, [name]: product.category };
      } else if (name === "subCategory" && value === subcategoryDataValue) {
        // If subCategory is not changed, keep the original value
        return { ...prev, [name]: product.subCategory };
      } else {
        // Set the updated value for other fields
        return { ...prev, [name]: value };
      }
    });
  };

  const [url, setUrl] = useState(product.images);

  const [updateProduct, { isLoading }] = useUpdateProductMutation();
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const data = {
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        desc: newProduct.desc,
        mainCategory: newProduct.category,
        subCategory: newProduct.subCategory,
        images: url,
      };
      const res = await updateProduct({
        id,
        data,
      });

      if (res) {
        toast.success("Product updated successfully", {
          className: "toast-message",
        });
        navigate("/products");
      } else {
        toast.error("Failed to update category", {
          className: "toast-message",
        });
      }
    } catch (err) {
      toast.error(err.message, {
        className: "toast-message",
      });
    }
  };

  if (isLoading) {
    return <Spinner />;
  }
  console.log(product);
  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        <Col className="add-product-content" lg={10}>
          <h4>Edit Product</h4>
          <p>Please fill in the product details to add a new product.</p>
          <Card className="add-product-form-card">
            <Row>
              <Col>
                <div className="add-product-input-div">
                  <p>Product Name</p>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleChange}
                  />
                </div>
              </Col>
              <Col>
                <div className="add-product-input-div">
                  <p>Product Price</p>
                  <input
                    type="text"
                    name="price"
                    value={newProduct.price}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              {/* <Col>
                <div className="add-product-image-div">
                  <div className="product-image-div">
                    <section
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                      }}
                      className="product-img-container"
                    >
                      <Col>
                        <div>
                          <div className="product-img">
                            {url[0] ? (
                              <img src={url[0]} alt="preview" />
                            ) : (
                              <ImageUploader
                                url={url}
                                setUrl={setUrl}
                                error={error}
                                setError={setError}
                              />
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div>
                          <div className="product-img">
                            {url[1] ? (
                              <img src={url[1]} alt="preview" />
                            ) : (
                              <ImageUploader
                                url={url}
                                setUrl={setUrl}
                                error={error}
                                setError={setError}
                              />
                            )}
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <div>
                          <div className="product-img">
                            {url[2] ? (
                              <img src={url[2]} alt="preview" />
                            ) : (
                              <ImageUploader
                                url={url}
                                setUrl={setUrl}
                                error={error}
                                setError={setError}
                              />
                            )}
                          </div>
                        </div>
                      </Col>
                    </section>
                  </div>
                </div>
              </Col> */}
              <Col>
                <div className="add-product-input-div">
                  <p style={{ marginBottom: "10px" }}>Product Category</p>
                  <select
                    className="add-product-dropdown"
                    name="category"
                    id="category"
                    value={categoryDataValue || ""}
                    onChange={(e) => {
                      setCategoryDataValue(e.target.value);
                      const selectedCategoryId =
                        e.target.options[e.target.selectedIndex].dataset
                          .categoryId;
                      setCategoryId(selectedCategoryId);
                      setNewProduct((prevProduct) => ({
                        ...prevProduct,
                        category: e.target.value, // Set the selected category value
                      }));
                    }}
                  >
                    <option disabled value="">
                      Please select a product category
                    </option>
                    {categories.map((cat) => (
                      <option
                        key={cat._id}
                        value={cat.catName}
                        data-category-id={cat._id}
                      >
                        {cat.catName}
                      </option>
                    ))}
                  </select>
                </div>
              </Col>
              <Col>
                <div className="add-product-input-div">
                  <p style={{ marginBottom: "10px" }}>Product Sub-Category</p>
                  <select
                    className="add-product-dropdown"
                    name="subcategory"
                    id="subcategory"
                    value={subcategoryDataValue || ""}
                    onChange={(e) => {
                      setSubCategoryDataValue(e.target.value);
                      const selectedSubCategoryId =
                        e.target.options[e.target.selectedIndex].dataset
                          .categoryId;
                      setSubCategoryId(selectedSubCategoryId);
                      setNewProduct((prevProduct) => ({
                        ...prevProduct,
                        subCategory: e.target.value, // Set the selected subcategory value
                      }));
                    }}
                  >
                    <option disabled value="">
                      Please select a product Sub-Category
                    </option>
                    {subcategories.subCategories &&
                      subcategories.subCategories.map((sub_category) => (
                        <option
                          key={sub_category.id}
                          data-category-id={sub_category._id}
                          value={sub_category.name}
                        >
                          {sub_category.name}
                        </option>
                      ))}
                  </select>
                </div>
              </Col>
              <Col>
                <div className="add-product-input-div">
                  <p>Stock Quantity</p>
                  <input
                    type="number"
                    name="stock"
                    min={0}
                    value={newProduct.stock}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="add-product-input-div">
                  <p>Product Description</p>
                  <textarea
                    rows={8}
                    name="desc"
                    value={newProduct.desc}
                    onChange={handleChange}
                  />
                </div>
              </Col>
            </Row>
            <button onClick={handleUpdate} className="add-product-btn">
              Update Product
            </button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default EditProduct;
