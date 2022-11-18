import React, { useEffect, useState, useRef } from "react";
import images from "../assets/images";
import "../assets/styles/Main.css";
import { Card } from "./Card";
import _ from "lodash";
import { Modal } from "./Modal";

export const Board = () => {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(2);
  const [winner, setWinner] = useState(false);
  const [modal, setModal] = useState(false);
  const storage = JSON.parse(localStorage.getItem("playerData")) || [];

  function fyShuffle(newGrid) {
    const array = [...images];
    const gameArray = _.sampleSize(array, newGrid);
    const shuffledCards = [...gameArray, ...gameArray].map((card) => ({
      ...card,
      id: Math.random(),
    }));
    let i = shuffledCards.length;
    while (--i > 0) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      [shuffledCards[randIndex], shuffledCards[i]] = [
        shuffledCards[i],
        shuffledCards[randIndex],
      ];
    }
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
  }

  useEffect(() => {
    if (storage.length > 0) {
      JSON.parse(localStorage.getItem("playerData"));
    } else {
      localStorage.setItem(
        "playerData",
        JSON.stringify(
          new Array(10).fill({ name: "Unknown", moves: 0, time: "" })
        )
      );
    }
  }, []);

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
    checkWinner(cards);
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    if (level === 1) {
      fyShuffle(2);
    }
    if (level === 2) {
      setTimeout(function () {
        setGridSize(4);
        fyShuffle(4 * level);
      }, 1000);
    }
    if (level === 3) {
      setTimeout(function () {
        setGridSize(6);
        fyShuffle(6 * level);
      }, 1000);
    }
    if (level === 4) {
      setTimeout(function () {
        setGridSize(8);
        fyShuffle(8 * level);
      }, 1000);
    }
  }, [level]);

  const boardRef = useRef(null);

  useEffect(() => {
    boardRef.current.style.setProperty("--grid-size", gridSize);
  }, [gridSize]);

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    setTurns((prevTurns) => prevTurns + 1);
  };

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  };

  const checkWinner = (array) => {
    let matchedCounter = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i].matched === true) {
        matchedCounter++;
      }
      if (matchedCounter === array.length) {
        setLevel(level + 1);
      }
      if (matchedCounter === array.length && level === 4) {
        setTimeout(function () {
          setWinner(true);
          setModal(true);
        }, 1000);
      }
    }
  };

  const newGame = () => {
    setTurns(0);
    setLevel(1);
    setGridSize(2);
    setWinner(false);
    setModal(false);
  };

  return (
    <div className="main-screen">
      <h1>Memory game</h1>
      <div className="info-items">
        <p>Moves: {turns}</p>
        <button hidden={!winner} onClick={newGame}>
          {" "}
          NEW GAME!{" "}
        </button>
        <p>Level: {level}</p>
      </div>

      <div ref={boardRef} className="card-grid">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>

      {winner && (
        <p className="win-msg">
          Congratulations! You found all matches in just {turns} moves!
        </p>
      )}
      {modal && <Modal setModal={setModal} turns={turns} />}
      <div className="top-players">
        <h1>Top 10 players: </h1>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Moves</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {storage.map((data, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.moves}</td>
                  <td>{data.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
