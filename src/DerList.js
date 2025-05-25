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
    <div className="max-w-4xl mx-auto p-4">
    <h2 className="text-2xl font-bold mb-4 text-center">{categoryData.category}</h2>
  
    {/* Table for medium and up screens */}
    <div className="hidden md:block overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">English</th>
            <th className="border border-gray-300 px-4 py-2 text-left">German</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Usage</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Arabic</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Arabic Usage</th>
          </tr>
        </thead>
        <tbody>
          {categoryData.items.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">{item.english}</td>
              <td className="border border-gray-300 px-4 py-2">{item.german}</td>
              <td className="border border-gray-300 px-4 py-2 italic text-gray-600">{item.usage}</td>
              <td className="border border-gray-300 px-4 py-2">{item.arabic}</td>
              <td className="border border-gray-300 px-4 py-2 italic text-right text-gray-600">{item.arabicUsage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* Cards for small screens 
    <div className="block md:hidden space-y-4">
      {categoryData.items.map((item, index) => (
        <div key={index} className="border rounded-xl p-4 shadow bg-white">
          <div className="mb-2">
            <strong>English:</strong> {item.english}
          </div>
          <div className="mb-2">
            <strong>German:</strong> {item.german}
          </div>
          <div className="mb-2 italic text-gray-600">
            <strong>Usage:</strong> {item.usage}
          </div>
          <div className="mb-2">
            <strong>Arabic:</strong> {item.arabic}
          </div>
          <div className="italic text-right text-gray-600">
            <strong>Arabic Usage:</strong> {item.arabicUsage}
          </div>
        </div>
      ))}
    </div>*/}
  </div>
  
  );
}
