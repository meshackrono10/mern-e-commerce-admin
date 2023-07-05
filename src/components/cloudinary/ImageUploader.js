import React from "react";
import UploadWidget from "../../components/cloudinary/UploadWidget";
import "../../App.css";

function ImageUploader({ url, setUrl, error, setError }) {
  function handleOnUpload(error, result, widget) {
    if (error) {
      setError(error);
      widget.close({
        quiet: true,
      });
      return;
    }
    setUrl(result?.info?.secure_url);
    console.log(url);
  }

  return (
    <main className="main">
      <div className="container">
        <UploadWidget onUpload={handleOnUpload}>
          {({ open }) => {
            function handleOnClick(e) {
              e.preventDefault();
              open();
            }
            return (
              <button className="img-btn" onClick={handleOnClick}>
                Upload Images
              </button>
            );
          }}
        </UploadWidget>
      </div>
    </main>
  );
}

export default ImageUploader;
