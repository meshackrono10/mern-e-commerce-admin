import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Product.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BalanceIcon from "@mui/icons-material/Balance";
import Spinner from "../../components/spinner/Spinner";
import { useGetOneProductQuery } from "../../slices/products/productsApiSlice";

const Product = () => {
  const { id } = useParams();

  const { data, isLoading } = useGetOneProductQuery({ id });
  const [selectedImg, setSelectedImg] = useState(data?.images[0]);

  const handleImageClick = (img) => {
    setSelectedImg(img);
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return null; // or render a loading state or an error message
  }
  console.log(data);
  return (
    <>
      <div className="product">
        <div className="left">
          <div className="images">
            <img
              src={data?.images[0]}
              alt="t-Shirt"
              onClick={() => handleImageClick(data?.images[0])}
            />
            <img
              src={data?.images[1]}
              alt="t-Shirt"
              onClick={() => handleImageClick(data?.images[1])}
            />
            <img
              src={data?.images[2]}
              alt="t-Shirt"
              onClick={() => handleImageClick(data?.images[2])}
            />
          </div>
          <div className="mainImg">
            <img src={selectedImg || data?.images[0]} alt="t-Shirt" />
          </div>
        </div>
        <div className="right">
          <h1>{data?.name}</h1>
          <span className="price">${data?.price}</span>
          <p>{data?.desc}</p>

          <div className="links">
            <Link to="/" style={{ textDecoration: "none" }}>
              <div className="item">
                <FavoriteBorderIcon /> ADD TO WISH LIST
              </div>
            </Link>

            <div className="item">
              <BalanceIcon /> ADD TO COMPARE
            </div>
          </div>
          <div className="info">
            <span>Vendor: Polo</span>
            <span>Product Type: T-Shirt</span>
            <span>Tag: T-Shirt, Women, Top</span>
          </div>
          <hr />
          <div className="info">
            <span>CATEGORY :{data?.mainCategory} </span>
            <hr />
            <span>SUB CATEGORY :{data?.subCategory}</span>
            <hr />
            <span>SALES : {data?.sales}</span>
            <hr />
            <span>STOCK : {data?.stock}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
