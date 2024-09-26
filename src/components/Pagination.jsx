import React, { useState } from "react";

const Pagination = ({
  numberOfPages,
  handlePageChange,
  handleNummberOfPageChange,
  metaData,
  page,
  pageSize,
}) => {
  const [value, setValue] = useState(5);
  const disabledNext =
    metaData?.totalCount - metaData?.currentOffset <= pageSize;
  const disabledPrev = metaData?.currentOffset === 0;
  const handleChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (newValue <= 10) {
      setValue(newValue);
    } else {
      setValue(10); // Ensure the value never exceeds 10
    }
  };
  return (
    <div className="pagination">
      {/* {pages.map((item) => (
        <button className="page-item" onClick={handlePageChange}>
          {item}
        </button>
      ))} */}
      <label
        className={`page-button ${disabledPrev ? "disabled" : ""}`}
        onClick={() => !disabledPrev && handlePageChange("prev")}
      >{`< Prev`}</label>
      <label
        className={`page-button ${disabledNext ? "disabled" : ""}`}
        onClick={() => !disabledNext && handlePageChange("next")}
      >{` Next >`}</label>
      <input
        placeholder=""
        value={value}
        onKeyDown={(e) => {
          if (e.code === "Enter") {
            handleNummberOfPageChange(value);
          }
        }}
        type="number"
        onChange={handleChange}
        max="10"
        className="page-size"
      />
      /page
    </div>
  );
};

export default Pagination;
