'use client';

import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export default function DataTable() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState(5); // Default filter is 5 minutes
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    socket.on("update", (newData) => {
      console.log("Data diterima dari backend:", newData);
      setData(newData);
      applyFilter(newData, filter);  // Apply filter based on new data and active filter
    });

    return () => {
      socket.off("update");
    };
  }, [filter]);

  const applyFilter = (data, selectedFilter) => {
    const now = new Date().getTime(); // Take time now
    // Range based on filter
    let timeLimit = 0;
    if (selectedFilter === 5) timeLimit = 5 * 60 * 1000; // 5 minutes
    if (selectedFilter === 15) timeLimit = 15 * 60 * 1000; // 15 minutes
    if (selectedFilter === 30) timeLimit = 30 * 60 * 1000; // 30 minutes
    if (selectedFilter === 60) timeLimit = 60 * 60 * 1000; // 1 hour

    // Filter data based on selected range 
    const filtered = data.filter(item => {
      const itemTime = new Date(item.time).getTime();
      return now - itemTime <= timeLimit; // Data with valid time range
    });

    // filter by desc
    const sortedData = filtered.sort((a, b) => new Date(b.time) - new Date(a.time));

    setFilteredData(sortedData); // Set data
  };

  const handleFilterChange = (value) => {
    setFilter(value);  // set filter
    setShowDropdown(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="overflow-x-auto">
        <div className="flex justify-end mb-2">
          <div className="relative">
            <button
              className="bg-[#b0a698] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#7d6759]"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Refresh ⏳
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-[#b0a698] border border-gray-300 rounded-lg shadow-lg">
                <button className="block w-full text-left px-4 py-2 hover:bg-[#7d6759]" onClick={() => handleFilterChange(5)}>5 menit yang lalu</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-[#7d6759]" onClick={() => handleFilterChange(15)}>15 menit yang lalu</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-[#7d6759]" onClick={() => handleFilterChange(30)}>30 menit yang lalu</button>
                <button className="block w-full text-left px-4 py-2 hover:bg-[#7d6759]" onClick={() => handleFilterChange(60)}>Satu jam</button>
              </div>
            )}
          </div>
        </div>

        <table className="w-full border-collapse border border-black-700 bg-white shadow-lg">
          <thead>
            <tr className="bg-[#d8c3a5] text-gray-900">
              <th className="border border-gray-400 p-3">Time</th>
              <th className="border border-gray-400 p-3">Location</th>
              <th className="border border-gray-400 p-3">Temperature (°C)</th>
              <th className="border border-gray-400 p-3">Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="text-center bg-white hover:bg-gray-200 font-medium opacity-100">
                  <td className="border border-gray-400 p-3 text-gray-900">
                    {item.time ? new Date(item.time).toLocaleString() : "Invalid Date"}
                  </td>
                  <td className="border border-gray-400 p-3 text-gray-900">{item.location}</td>
                  <td className="border border-gray-400 p-3 text-gray-900">{item.temperature?.toFixed(2)}</td>
                  <td className="border border-gray-400 p-3 text-gray-900">{item.humidity?.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-3 text-gray-500">
                  Tidak ada data tersedia
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
