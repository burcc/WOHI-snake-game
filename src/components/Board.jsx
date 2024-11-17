import React from "react";
import Snake from "./Snake";
import Food from "./Food";
import "./Board.css";

const Board = ({ snake, food, boardSize }) => {
  return (
    <div
      className="board"
      style={{
        gridTemplateRows: `repeat(${boardSize}, 1fr)`,
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
      }}
    >
      <Snake segments={snake} />
      <Food position={food} />
    </div>
  );
};

export default Board;
