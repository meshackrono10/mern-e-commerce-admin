import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useDeleteCatMutation,
  useGetOneCatQuery,
  useUpdateCatMutation,
} from "../../slices/category/catApiSlice";
import { toast } from "react-toastify";
import { setCategory } from "../../slices/category/catSlice";
import "./Category.css";
import { useDeleteSubCatMutation } from "../../slices/subCat/subCatApiSlice";

const Category = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get single category
  const { data: category = {}, refetch } = useGetOneCatQuery({ id });
  const { category: categoryData = {}, subCategories = [] } = category;

  // Set the category details in Redux store
  const { image, catName } = useSelector((state) => state.category);
  useEffect(() => {
    dispatch(
      setCategory({
        image: categoryData.image,
        catName: categoryData.catName,
      })
    );
  }, [categoryData.image, categoryData.catName, dispatch]);

  // Delete category
  const [deleteCat, { error: deleteCatError, isSuccess }] =
    useDeleteCatMutation();

  async function handleDelete(id) {
    try {
      const response = await deleteCat({ id });

      if (Array.isArray(categoryData)) {
        // Check if categoryData is an array
        const updatedCategories = categoryData.filter(
          (category) => category._id !== id
        );
        await refetch(updatedCategories);
      }

      if (isSuccess) {
        toast.success("You have successfully deleted the category", {
          className: "toast-message",
        });
        navigate("/categories");
      } else {
        toast.error(response.error.data.message, {
          className: "toast-message",
        });
      }
    } catch (error) {
      toast.error(deleteCatError, {
        className: "toast-message",
      });
    }
  }

  // Initialize with category status
  const [selectedValue, setSelectedValue] = useState(categoryData.status);
  const [updateCatStatus] = useUpdateCatMutation();

  const handleChange = async (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    try {
      const res = await updateCatStatus({
        id: id,
        status: value,
      }).unwrap();
      console.log(res);
      await refetch();
    } catch (error) {
      toast.error(error, {
        className: "toast-message",
      });
    }
  };

  // Delete subcategory
  const [deleteSubCat] = useDeleteSubCatMutation();

  const handleSubCatDelete = async (subCatId) => {
    try {
      const response = await deleteSubCat({
        id: subCatId,
        SUB_CAT_URL: id,
      });
      console.log(response);
      if (Array.isArray(subCategories)) {
        // Check if subCategories is an array
        const updatedSubCategories = subCategories.filter(
          (subCat) => subCat._id !== subCatId
        );
        await refetch(updatedSubCategories);
      }
      toast.success("You have successfully deleted the subcategory", {
        className: "toast-message",
      });
    } catch (error) {
      toast.error(error, {
        className: "toast-message",
      });
    }
  };

  return (
    <div className="ParentCat_container">
      <div className="cant_main-data">
        <img src={image} alt="category" />
        <div className="cant_main-data-text">
          <h1>{catName} Category</h1>
          <p>Status: {categoryData.status}</p>
          <div className="category-buttons">
            <button onClick={() => handleDelete(categoryData._id)}>
              Delete
            </button>
            <Link to={`/edit-category/${categoryData._id}`}>
              <button>Edit</button>
            </Link>
            <select
              className="drop-down"
              value={selectedValue}
              onChange={handleChange}
            >
              <option value="">{categoryData.status}</option>
              <option value="enable">Enable</option>
              <option value="disable">Disable</option>
            </select>
          </div>
        </div>
      </div>
      <div className="cat-subCat">
        <h4>Sub Categories</h4>
        {subCategories.length === 0 ? (
          <h1>
            There are no sub-categories. You can create one or enable the
            category.
          </h1>
        ) : (
          subCategories.map((subCat) => (
            <div key={subCat._id} className="cat-subCat-dat">
              <div className="cat-subCat-img">
                <img src={subCat.image} alt="category" />
              </div>
              <div className="cat-subCat-name">
                <p>{subCat.name}</p>
              </div>

              <div className="cat-subCat-btn">
                <button>Enable</button>
              </div>
              <div className="cat-subCat-select">
                <button>
                  {/* <Link to={`/edit-sub-category/${subCat._id}/${id}`}>
                    Edit
                  </Link> */}

                  <Link to={`/category/${id}/edit-sub-category/${subCat._id}`}>
                    Edit
                  </Link>
                </button>
                <button onClick={() => handleSubCatDelete(subCat._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Category;
