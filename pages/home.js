import { useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/predict', { symptoms: searchQuery.split(',') });
      const { predictions } = response.data;
      setResults(predictions);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-start p-4 bg-transparent" style={{ minHeight: 'calc(100vh - 64px)', paddingBottom: '10rem', paddingTop: '2rem', paddingRight: '5rem', paddingLeft: '5rem' }}>
      <h1 className="text-6xl font-bold mb-4 text-blue-900">Search Medicines</h1>
      <p className="text-lg mb-8 text-gray-700">
        Share your symptoms and find comprehensive information about various medicines quickly and easily.
      </p>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <input
            type="text"
            className="w-full border-2 border-blue-500 rounded-lg px-6 py-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="Put your symptoms in the following format(from a scale of 1-10): 'fever:0, headache:10, etc...'"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-0 top-0 mt-3 mr-4 text-blue-500">
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
      </form>
      <div className="mt-8 w-full">
        {results.map((result, index) => (
          <div key={index} className="mb-4 p-4 border rounded-lg shadow-lg bg-white">
            <h2 className="text-2xl font-bold mb-2 text-blue-800">Disease: {result[0]}</h2>
            <p className="text-lg text-gray-700">Probability: {result[1].toFixed(4)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
