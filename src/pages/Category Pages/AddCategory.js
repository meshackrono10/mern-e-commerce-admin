import React, { useRef, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import "./AddCategory.css";
import { useAddCatMutation } from "../../slices/category/catApiSlice";
import { setCategory } from "../../slices/category/catSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Spinner } from "../../components";
import { useNavigate } from "react-router-dom";

function AddCategory() {
  const [loading, setLoading] = useState(false);
  const [catName, setCatName] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [widget, setWidget] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addCat, { isLoading }] = useAddCatMutation();

  const showWidget = () => {
    const uploadWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setUrl(result.info.url);
          console.log(result.info.url);
        }
      }
    );

    setWidget(uploadWidget);
    uploadWidget.open();
  };

  const addCategory = async (event) => {
    event.preventDefault();

    try {
      if (!catName || !url) {
        toast.error("Please provide a category name and select an image.", {
          className: "toast-message",
        });
        return;
      }

      setLoading(true);

      const res = await addCat({
        catName: catName,
        image: url,
      }).unwrap();

      dispatch(setCategory({ ...res }));
      navigate("/categories");

      setCatName("");
      setUrl("");
      setError("");
      setLoading(false);

      toast.success("Category added successfully!", {
        className: "toast-message",
      });
    } catch (error) {
      setLoading(false);
      setError(error.message);

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
                  <>
                    <p>Upload Image</p>
                    <img src={url} alt="preview" />
                  </>
                ) : (
                  <button className="add-button" onClick={showWidget}>Upload Image</button>
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
