// pages/search.js
import { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [drugInfo, setDrugInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return; // Avoid searching empty query
    setLoading(true);
    setError('');
    setDrugInfo(null);

    try {
      const response = await axios.get(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${searchQuery}"`);
      if (response.status === 200 && response.data.results) {
        setDrugInfo(response.data.results[0]);
      } else {
        setError('No information found for this drug.');
      }
    } catch (err) {
      setError('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const renderDrugInfo = (info) => {
    return Object.keys(info).map((key) => {
      const value = info[key];
      return (
        <div key={key} className="mb-4">
          <h3 className="text-lg font-semibold text-blue-900 capitalize">{key.replace(/_/g, ' ')}:</h3>
          {Array.isArray(value) ? (
            value.map((item, index) => (
              <p key={index} className="text-gray-700">{item}</p>
            ))
          ) : typeof value === 'object' && value !== null ? (
            renderDrugInfo(value)
          ) : (
            <p className="text-gray-700">{value}</p>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col justify-center items-start p-4 bg-transparent" style={{ minHeight: 'calc(100vh - 64px)', paddingBottom: '10rem', paddingTop: '0rem', paddingRight: '5rem', paddingLeft: '5rem' }}>
      <h1 className="text-6xl font-bold mb-4 text-blue-900">Search OpenFDA</h1>
      <p className="text-lg mb-8 text-gray-700">
        Search high-level information about various drugs quickly and easily, available in OPENFDA.<br></br>
        <em>Disclaimer: Information provided here is only for educational purposes, it is advised to refer to a professional before committing to definitive choices.</em>
      </p>
      <div className="w-full">
        <div className="relative">
          <input
            type="text"
            className="w-full border-2 border-blue-500 rounded-lg px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="Search here, try 'aspirin'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSearch} className="absolute right-0 top-0 mt-3 mr-4 text-blue-500">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {loading && <p className="mt-4 text-blue-500">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {drugInfo && (
        <div className="mt-8 p-4 border border-blue-500 rounded-lg w-full">
          {renderDrugInfo(drugInfo)}
        </div>
      )}
    </div>
  );
}
