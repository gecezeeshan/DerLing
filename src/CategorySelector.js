import React from "react";

const CategorySelector = ({ data, categoryIndex, roundCount, setCategoryIndex, setRoundCount, onStart }) => {
  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h1>Vocabia</h1>

      <div style={{ marginBottom: 10 }}>
        <select onChange={(e) => setCategoryIndex(parseInt(e.target.value))}>
          <option value="0">All Categories</option>
          {data.sort((a, b) => a.category.localeCompare(b.category))
            .map((cat, idx) => (
              <option key={idx} value={idx + 1}>{cat.category}</option>
            ))}
        </select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Number of Rounds: </label>
        <input
          type="number"
          min="1"
          max="20"
          value={roundCount || ""}
          onChange={(e) => setRoundCount(parseInt(e.target.value))}
        />
      </div>

      <button disabled={!roundCount} onClick={() => onStart("de")}>Start Game DE</button>
      &nbsp;&nbsp;
      <button disabled={!roundCount} onClick={() => onStart("ar")}>Start Game AR</button>
      &nbsp;&nbsp;
      <button  onClick={() => onStart("de",true)}>Show List</button>
    </div>
  );
};

export default CategorySelector;
