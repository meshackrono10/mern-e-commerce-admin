import React, { useEffect } from "react";
import { useGetCatQuery } from "../../slices/category/catApiSlice";
import "./category_list.css";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCategory } from "../../slices/category/catSlice";
import { Spinner } from "../../components";
import { toast } from "react-toastify";

const CategoryList = () => {
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useGetCatQuery();

  const dispatch = useDispatch();

  useEffect(() => {
    refetch().then((data) => {
      dispatch(setCategory(data));
    });
  }, [refetch, dispatch]);

  if (isLoading) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (isError) {
    toast.error("Error occurred while fetching categories", {
      className: "toast-message",
    });
  }

  if (categories.length === 0) {
    return <div>No categories available.</div>;
  }

  return (
    <div className="categoryList">
      {categories.map((category, index) => (
        <div key={index} className="category_list">
          <div className="category_header">
            <img src={category.image} alt="category" />
            <h1>
              <span>{category.catName}</span> Category
            </h1>
          </div>
          <Link to={`/category/${category._id}`}>
            <button className="categoryList-btn">View</button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
