import React, { useRef, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import "./AddCategory.css";
import { useAddCatMutation } from "../../slices/category/catApiSlice";
import { setCategory } from "../../slices/category/catSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Spinner } from "../../components";
import { useNavigate } from "react-router-dom";
import ImageUploader from "../../components/cloudinary/ImageUploader";

function AddCategory() {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const [catName, setCatName] = useState("");
  const [url, setUrl] = useState([]);
  const [error, setError] = useState();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addCat, { isLoading }] = useAddCatMutation();

  const addCategory = async (event) => {
    event.preventDefault();
    try {
      if (!catName || !url) {
        toast.error("Please provide a category name and select an image.", {
          className: "toast-message",
        });
        return;
      }
      const res = await addCat({
        catName: catName,
        image: url, // Access the first element of the url array
      }).unwrap();

      dispatch(setCategory({ ...res }));
      navigate("/categories");
      // Reset form values
      setCatName("");
      setImage(null);
      setImagePreview("");
      setUrl([]);
      imageButtonRef.current.value = ""; // Reset file input

      toast.success("Category added successfully!", {
        className: "toast-message",
      });
    } catch (error) {
      toast.error(error.message, {
        className: "toast-message",
      });
    }
  };

  if (isLoading || loading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        <Col className="add-category-content" lg={10}>
          <h4>Add Category</h4>
          <p>
            Please fill in the category details in the form below to add a new
            category.
          </p>
          <Card className="add-product-form-card">
            <div className="add-category-image-div">
              <div className="category-image-div">
                {url ? (
                  <p>Upload Image</p> || <img src={url} alt="preview" />
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

            <div className="add-product-input-div">
              <p>Category Name</p>
              <input
                type="text"
                name="name"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              ></input>
            </div>

            <button onClick={addCategory} className="add-category-btn">
              Add Category
            </button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddCategory;
