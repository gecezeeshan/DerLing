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
            <th>English - German - Arabic</th>
            <th>Example</th>
            <th>German</th>
            <th>Arabic</th>
          </tr>
        </thead>
        <tbody>
          {categoryData.items.map((item, index) => (
            <tr key={index}>
              <td>{item.english} - {item.german} - {item.arabic}</td>
              <td className="italic">{item.englishUsage}</td>
              <td className="italic">{item.usage}</td>
              <td className="italic text-right">{item.arabicUsage}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="card-view">
        {categoryData.items.map((item, index) => (
          <div key={index} className="card">
            <div><strong></strong> {item.english} -  {item.german} - {item.arabic}</div>
            <div className="italic"><strong></strong> {item.englishUsage}</div>
            <div className="italic"><strong></strong> {item.usage}</div>
            <div className="italic text-right"><strong></strong> {item.arabicUsage}</div>
          </div>
        ))}
      </div>
    </div>


  );
}
