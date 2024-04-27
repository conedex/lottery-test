import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Select } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import HighScoreImage from "../images/highscorewhiteblackbg.png";
import scoresData from "../json/scores.json";
import "./HighScore.css";

const HighScore = () => {
  const [sortedScores, setSortedScores] = useState([]);
  const [sortKey, setSortKey] = useState("version");

  useEffect(() => {
    const sortScores = () => {
      let sorted;
      if (sortKey === "amount") {
        sorted = [...scoresData].sort(
          (a, b) =>
            parseInt(b.amountInNumber, 10) - parseInt(a.amountInNumber, 10)
        );
      } else if (sortKey === "combinedAmount") {
        // Combine scores by wallet and sum amountInNumber, also update amount string
        const combinedScores = scoresData.reduce((acc, curr) => {
          const wallet = curr.wallet;
          if (!acc[wallet]) {
            acc[wallet] = {
              ...curr,
              amountInNumber: parseInt(curr.amountInNumber, 10),
            };
          } else {
            acc[wallet].amountInNumber += parseInt(curr.amountInNumber, 10);
            // Update the amount string to reflect the new combined total
            acc[wallet].amount = acc[wallet].amountInNumber
              .toLocaleString("en-US")
              .replace(/,/g, ".");
          }
          return acc;
        }, {});
        sorted = Object.values(combinedScores).sort(
          (a, b) => b.amountInNumber - a.amountInNumber
        );
      } else {
        sorted = [...scoresData].sort((a, b) => a.version - b.version);
      }
      setSortedScores(sorted);
    };

    sortScores();
  }, [sortKey]);

  const handleSortChange = (value) => {
    setSortKey(value);
  };

  return (
    <div className="highscore-app">
      <div>
        <Link to="/" className="highscore-back">
          <LeftCircleOutlined
            style={{
              fontSize: "2rem",
              color: "white",
              marginRight: "90%",
              marginTop: "1%",
            }}
          />
        </Link>
        <div className="highscore-header">
          <img
            src={HighScoreImage}
            alt="High Score"
            className="highscore-image"
          />
        </div>
        <div>
          <Select
            className="highscore-select"
            defaultValue="version"
            onChange={handleSortChange}
            options={[
              { value: "version", label: "Sort by Version" },
              { value: "amount", label: "Sort by Amount" },
              { value: "combinedAmount", label: "Sort by Combined Amount" },
            ]}
          />
          <div className="highscore-headers">
            <span>{sortKey === "version" ? "Version" : "Rank"}</span>
            <span>Amount</span>
            <span>Address</span>
            {sortKey !== "version" && sortKey !== "combinedAmount" && (
              <span>Version</span>
            )}
          </div>
          <ol className="highscore-list">
            {sortedScores.map((score, index) => (
              <li key={index} className="highscore-item">
                <span>{sortKey === "version" ? score.version : index + 1}</span>
                <span>{score.amount}</span>
                <span>{score.wallet}</span>
                {sortKey !== "version" && sortKey !== "combinedAmount" && (
                  <span>{score.version}</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HighScore;
