import React, { useState, useEffect } from "react";

export default function DerList({ selectedCategory }) {
    // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([]);
  const [categoryData, setCategoryData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/data.json");
      const json = await res.json();
      setData(json);
  
      // Moved inside useEffect and depends on selectedCategory
      const cat = json.find(
        (c) => c.category.toLowerCase() === selectedCategory?.toLowerCase()
      );
  
      setCategoryData(cat);
    }
  
    if (selectedCategory) {
      fetchData();
    }
  }, [selectedCategory]);
  

  if (!categoryData || !categoryData.items || categoryData.items.length === 0) {
    return <p className="text-center text-gray-500">No data available for "{selectedCategory}"</p>;
  }

  return (
  
    
  <div className="table-container">
      <h2>{categoryData.category}</h2>

      <table className="responsive-table">
        <thead>
          <tr>
            <th>English</th>
            <th>German</th>
            <th>Usage</th>
            <th>Arabic</th>
            <th>Arabic Usage</th>
          </tr>
        </thead>
        <tbody>
          {categoryData.items.map((item, index) => (
            <tr key={index}>
              <td>{item.english}</td>
              <td>{item.german}</td>
              <td className="italic">{item.usage}</td>
              <td>{item.arabic}</td>
              <td className="italic text-right">{item.arabicUsage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card-view">
        {categoryData.items.map((item, index) => (
          <div key={index} className="card">
            <div><strong>English:</strong> {item.english}</div>
            <div><strong>German:</strong> {item.german}</div>
            <div className="italic"><strong>Usage:</strong> {item.usage}</div>
            <div><strong>Arabic:</strong> {item.arabic}</div>
            <div className="italic text-right"><strong>Arabic Usage:</strong> {item.arabicUsage}</div>
          </div>
        ))}
      </div>
    </div>

  
  );
}
