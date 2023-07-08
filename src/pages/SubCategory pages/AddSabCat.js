import React, { useRef, useState } from "react";
import { Card, Col, Form, Row } from "react-bootstrap";
import { useAddSubCatMutation } from "../../slices/subCat/subCatApiSlice";
import { setSubCat } from "../../slices/subCat/subCatSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Spinner } from "../../components";
import axios from "axios";
import imageCompression from "browser-image-compression";
import "./AddSabCat.css";
import { useGetCatQuery } from "../../slices/category/catApiSlice";
import ImageUploader from "../../components/cloudinary/ImageUploader";

function AddSubCat() {
  const [url, setUrl] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const types = ["image/png", "image/jpeg", "image/jpg"];
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [widget, setWidget] = useState(null);


  const dispatch = useDispatch();
  const [addSubCat, { isLoading, isError }] = useAddSubCatMutation();
  // Get single category
  const [categoryDataValue, setCategoryDataValue] = useState("");
  const { data: categories = [], refetch } = useGetCatQuery();

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
      toast.error(error.message, {
        className: "toast-message",
      });
      setLoading(false);
    }
  };

  const addCategory = async (event) => {
    event.preventDefault();
    try {
      if (!name || !image) {
        toast.error("Please provide a category name and select an image.", {
          className: "toast-message",
        });
        return;
      }

      const res = await addSubCat({
        name: name,
        image: url,
        status: "enable",
        SUB_CAT_URL: categoryId,
      }).unwrap();
      await refetch(); // Refetch subcategories after adding a new one

      dispatch(setSubCat({ ...res }));
      if (isError) {
        toast.error("failed to upload because there was an error", {
          className: "toast-message",
        });
      } else {
        // Reset form values
        setName("");
        setImage(null);
        setImagePreview("");
        setUrl("");
        imageButtonRef.current.value = ""; // Reset file input

        toast.success("Category added successfully!", {
          className: "toast-message",
        });
      }
    } catch (error) {
      toast.error(error.message, {
        className: "toast-message",
      });
    }
  };

  if (isLoading || loading) return <Spinner />;

  return (
    <div className="dashboard-parent-div">
      <Row>
        <Col lg={2}>{/* <Sidebar /> */}</Col>
        <Col className="add-category-content" lg={10}>
          <h4>Add Category</h4>
          <p>
            Please fill in the Sub category details in the form below to add a
            new category.
          </p>
          <Card className="add-product-form-card">
            <div className="add-category-image-div">
              <div className="category-image-div">
              {url ? (
                  <>
                   <img src={url} alt="preview" />
                  </>
                ) : (
                  <button className="add-button" onClick={showWidget}>Upload Image</button>
                )}
              </div>
            </div>

            <div className="add-product-input-div">
              <p>Sub category Name</p>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <select
              className="add-subCat-dropdown"
              name="category"
              id="category"
              value={categoryDataValue || "select category"} // Assign value prop to the select element
              onChange={(e) => {
                setCategoryDataValue(e.target.value);
                const selectedCategoryId =
                  e.target.options[e.target.selectedIndex].dataset.categoryId;
                setCategoryId(selectedCategoryId);
              }} // Assign onChange prop to update the selected category
            >
              <option value="">select Category</option>
              {categories.map((cat) => (
                <option
                  key={cat._id}
                  className="add-subCat-dropdown-option"
                  value={cat.catName}
                  data-category-id={cat._id}
                >
                  {cat.catName}
                </option>
              ))}
            </select>

            <button onClick={addCategory} className="add-category-btn">
              Add Category
            </button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default AddSubCat;
