import React from "react";
import "../css/rating.css";

function  Rating({rating, readOnly = true, onChange}){
    const stars = [1, 2, 3, 4, 5]

    function handleClick(value){
        if (!readOnly && onChange) {
            onChange(value)
        }
    }
    return (
    <div className="star-rating">
      {stars.map((value) => (
        <span
          key={value}
          className={value <= rating ? "star filled" : "star"}
          onClick={() => handleClick(value)}
          style={{ cursor: readOnly ? "default" : "pointer" }}
        >
          ★
        </span>
      ))}
    </div>

    )

}
 export default Rating;