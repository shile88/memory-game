import React, { useState } from "react";
import "../assets/styles/Modal.css";

export const Modal = ({ setModal, turns }) => {
  const [playerName, setPlayerName] = useState("");
  const storage = JSON.parse(localStorage.getItem("playerData"));

  const closeAndReset = () => {
    setModal(false);
  };

  const handleClick = () => {
    const newData = [...storage];
    for (let i = 0; i < newData.length; i++) {
      if (newData[i].moves === 0 || newData[i].moves > turns) {
        newData.push({
          name: playerName,
          moves: turns,
          time: new Date().toLocaleString(),
        });
        break;
      }
    }
    newData.sort(function (a, b) {
      if (a.moves === 0) {
        return 1;
      }

      if (b.moves === 0) {
        return -1;
      }

      if (a.moves === b.moves) {
        return 0;
      }

      return a.moves < b.moves ? -1 : 1;
    });
    const top10 = newData.slice(0, 10);
    localStorage.setItem("playerData", JSON.stringify(top10));
    setModal(false);
  };

  return (
    <div className="backshadow">
      <div className="custom-modal">
        <p id="top-msg">
          Well done! You're in the top 10 now! Please add your name here:{" "}
        </p>
        <input
          type="text"
          name="player"
          placeholder="Player's name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          required
        ></input>
        {playerName === "" && (
          <p id="input-msg">Input field can not be empty! </p>
        )}
        <div className="buttons">
          <button id="ok" onClick={handleClick} disabled={!playerName}>
            OK
          </button>
          <button id="cancel" onClick={closeAndReset}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
