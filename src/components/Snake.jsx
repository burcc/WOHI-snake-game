import React from "react";

const Snake = ({ segments }) => {
  return (
    <>
      {segments.map((segment, index) => (
        <div
          key={index}
          className="snake-segment"
          style={{
            gridRowStart: segment[1] + 1,
            gridColumnStart: segment[0] + 1,
          }}
        />
      ))}
    </>
  );
};

export default Snake;
