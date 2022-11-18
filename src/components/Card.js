import React from "react";
import "../assets/styles/Card.css";

export const Card = ({ card, handleChoice, flipped, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };

  return (
    <div className="card">
      <div className={flipped ? "flipped" : "card"}>
        <img src={card.src} alt="card front" className="front" />
        <img
          src="assets/images/back1.png"
          alt="card back"
          className="back"
          onClick={handleClick}
        />
      </div>
    </div>
  );
};
