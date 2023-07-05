import React, { useRef, useState } from "react";
import { Card, Col, Form, Row, Spinner } from "react-bootstrap";

import "./AddProduct.css";
import { useGetCatQuery } from "../../slices/category/catApiSlice";
import { useGetAllSubCatsQuery } from "../../slices/subCat/subCatApiSlice";
import { toast } from "react-toastify";
import { useAddProductMutation } from "../../slices/products/productsApiSlice";
import ImageUploader from "../../components/cloudinary/ImageUploader";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  // get a categories
  const [categoryId, setCategoryId] = useState("");
  const [categoryDataValue, setCategoryDataValue] = useState("");
  const { data: categories = [], refetch: fetchCategories } = useGetCatQuery();

  // get a single sub category
  const [subCategoryId, setSubCategoryId] = useState("");
  const [subcategoryDataValue, setSubCategoryDataValue] = useState("");
  const { data: subcategories = {} } = useGetAllSubCatsQuery({
    SUB_CAT_URL: categoryId,
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: categoryDataValue,
    desc: "",
    subCategory: subcategoryDataValue,
  });
  const [url, setUrl] = useState([]);
  const [error, setError] = useState();

  const imageButtonRef = useRef();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    e.preventDefault();
  };

  const [productAdd, { isLoading, isSuccess }] = useAddProductMutation();
  const addProduct = async (event) => {
    event.preventDefault();
    try {
      if (
        !newProduct.name ||
        !newProduct.price ||
        !newProduct.stock ||
        !newProduct.category ||
        !newProduct.subCategory ||
        url.length !== 3 // Check if there are exactly three images
      ) {
        toast.error("Please provide all required product details.", {
          className: "toast-message",
        });
        return;
      }

      const data = {
        name: newProduct.name,
        price: newProduct.price,
        stock: newProduct.stock,
        desc: newProduct.desc,
        mainCategory: newProduct.category,
        subCategory: newProduct.subCategory,
        images: url,
      };

      const res = await productAdd(data).unwrap();
      console.log(res);
      navigate("/products");
      if (isSuccess) {
        navigate("/products");
        toast.success("You have successfully created a product", {
          className: "toast-message",
        });
        return;
      }
    } catch (err) {
      console.log("Error: " + err.message);
    }
  };

  if (isLoading || loading) {
    return <Spinner />;
  }
  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        <Col className="add-product-content" lg={10}>
          <h4>Add Product</h4>
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
              <section className="product-img-container">
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
            <button onClick={addProduct} className="add-product-btn">
              Add Product
            </button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddProduct;
