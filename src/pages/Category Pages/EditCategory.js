import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useUpdateCatMutation } from "../../slices/category/catApiSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./EditCategory.css";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Form } from "react-bootstrap";
import { Spinner } from "../../components";

const EditCategory = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const types = ["image/png", "image/jpeg", "image/jpg"];
  const [url, setUrl] = useState("");

  const { image: catImage, catName } = useSelector((state) => state.category);
  const [catValue, setCatValue] = useState(catName);
  const [updateCategory, { isLoading }] = useUpdateCatMutation();
  const { id } = useParams();
  const navigate = useNavigate();

  const handleImageChange = async (event) => {
    let selectedFile = event.target.files[0];

    if (selectedFile && types.includes(selectedFile.type)) {
      const options = {
        maxSizeMB: 0.1, // Set maximum size to 100KB (100MB = 102400KB)
        maxWidthOrHeight: 1920,
      };
      const compressedFile = await imageCompression(selectedFile, options);
      console.log(compressedFile.size / 1024 / 1024);
      setImage(compressedFile);
      setImagePreview(URL.createObjectURL(compressedFile));
    } else {
      setImage(null);
    }
  };

  const handleImageUpload = async () => {
    setLoading(true);

    try {
      const file = new FormData();
      file.append("file", image);
      file.append("upload_preset", "eCommerce");

      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/meshkkr91/image/upload",
        file
      );
      setUrl(data.url);
      setLoading(false);
    } catch (error) {
      toast.error(error, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    setCatValue(catName);
  }, [catName]);
  if (isLoading || loading) {
    <Spinner />;
  }
  async function handleUpdate() {
    try {
      const { data } = await updateCategory({
        id,
        catName: catValue,
        image: url,
      });

      if (data) {
        toast.success("Category updated successfully", {
          className: "toast-message",
        });
        navigate("/categories");
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
  }

  return (
    <div className="editCategory">
      <div className="editCat-container">
        <div className="edit_image">
          <div className="add-category-image-div" style={{ height: "600px" }}>
            <div
              onClick={() => {
                imageButtonRef.current.click();
              }}
              className="category-image-div"
            >
              <Form.Control
                ref={imageButtonRef}
                style={{ display: "none", width: "700px" }}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="edit_image-img">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" />
                ) : (
                  <img src={catImage} alt="preview" />
                )}
              </div>
            </div>
          </div>
          <button onClick={handleImageUpload} className="uploadImage-btn">
            upload image
          </button>
        </div>

        <section className="editCategory-text">
          <label>Category</label>
          <input
            type="text"
            value={catValue}
            onChange={(e) => setCatValue(e.target.value)}
          />
          <button className="editCategory-btn" onClick={() => handleUpdate()}>
            submit
          </button>
        </section>
      </div>
    </div>
  );
};

export default EditCategory;
