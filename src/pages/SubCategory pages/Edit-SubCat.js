import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { Form } from "react-bootstrap";
import { Spinner } from "../../components";
import "./Edit-SubCat.css";
import {
  useUpdateSubCatMutation,
  useGetOneSubCatQuery,
} from "../../slices/subCat/subCatApiSlice";

const EditSubCat = () => {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const imageButtonRef = useRef();
  const types = ["image/png", "image/jpeg", "image/jpg"];
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const { subCatId, id } = useParams();
  // get a single sub category
  const { data: subCategory, isLoading } = useGetOneSubCatQuery({
    id: subCatId,
    SUB_CAT_URL: id,
  });

  const [selectedValue, setSelectedValue] = useState("");
  const [catValue, setCatValue] = useState("");

  useEffect(() => {
    if (subCategory) {
      setSelectedValue(subCategory?.subCategory?.status || "enable");
      setCatValue(subCategory?.subCategory?.name);
    }
  }, [subCategory]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
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
      console.log("successful");
    } catch (error) {
      toast.error(error.message, {
        className: "toast-message",
      });
      setLoading(false);
    }
  };

  const [updateSubCategoryMutation] = useUpdateSubCatMutation();

  const handleUpdate = async () => {
    try {
      const body = {
        name: catValue || subCategory?.subCategory?.name,
        image: url || subCategory?.subCategory?.image,
        status: selectedValue || subCategory?.subCategory?.status,
      };

      const { data } = await updateSubCategoryMutation({
        id: subCatId,
        data: body,
        SUB_CAT_URL: id,
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
  };

  if (isLoading || loading) {
    return <Spinner />;
  }

  return (
    <div className="edit-subCat">
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
                  <img
                    src={subCategory?.subCategory?.image}
                    alt="current preview"
                  />
                )}
              </div>
            </div>
          </div>
          <button onClick={handleImageUpload} className="uploadImage-btn">
            Upload Image
          </button>
        </div>

        <section className="editCategory-text">
          <main>
            <div className="category-drop-down-div">
              <select
                className="edit-category-drop-down"
                value={selectedValue}
                onChange={handleSelectChange}
              >
                <option value="">Select Status</option>
                <option value="enable">Enable</option>
                <option value="disable">Disable</option>
              </select>
            </div>
            <input
              type="text"
              value={catValue}
              onChange={(e) => setCatValue(e.target.value)}
            />
          </main>

          <button className="editCategory-btn" onClick={handleUpdate}>
            Submit
          </button>
        </section>
      </div>
    </div>
  );
};

export default EditSubCat;
