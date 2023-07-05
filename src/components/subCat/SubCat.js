import React, { useState } from "react";
import "./subCat.css";

const SubCat = () => {
  const [subCatName, setSubCatName] = useState([""]);

  const addSubCat = () => {
    setSubCatName([...subCatName, ""]);
  };

  const handleSubCatChange = (event, idx) => {
    const { value } = event.target;
    const subCatNames = [...subCatName];
    subCatNames[idx] = value;
    setSubCatName(subCatNames);
  };

  return (
    <div>
      <div className="sub_cat">
        <div className="category_container">
          <div className="subCat_header">
            <h1>Phones category</h1>

            <div className="subCat_btn">
              <button type="submit">Submit</button>
            </div>
          </div>
          <div className="subCat_field">
            <label htmlFor="subCategories">Sub Categories</label>

            {subCatName.map((subCatName, idx) => (
              <input
                key={idx}
                // className={isError ? "category_inputError" : "category_input"}
                className="category_input"
                type="text"
                placeholder="Add  Sub Category"
                name="subCatName"
                value={subCatName}
                onChange={(event) => handleSubCatChange(event, idx)}
              />
            ))}
            <button onClick={addSubCat}>Add an input for Sub Category</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCat;
