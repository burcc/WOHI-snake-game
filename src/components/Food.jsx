import React from "react";

const Food = ({ position }) => {
  return (
    <div
      className="food"
      style={{
        gridRowStart: position[1] + 1,
        gridColumnStart: position[0] + 1,
      }}
    />
  );
};

export default Food;
