// pages/medicines.js
import { useEffect, useState } from 'react';
import MedicineCard from '../components/MedicineCard';

export default function Medicines() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/drugs?page=${page}&limit=${limit}`);
        if (response.ok) {
          const data = await response.json();
          setDrugs(data.drugs);
          setTotal(data.total);
        } else {
          throw new Error(`Error fetching data: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching data:', error.message);
        setError(`Error fetching data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (drugs.length === 0) {
    return <p>No drugs found.</p>;
  }

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl font-bold mb-6 text-center">Medicine List</h1>
      <div className="flex flex-wrap justify-center">
        {drugs.map((drug, index) => (
          <MedicineCard key={index} medicine={drug} />
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= total}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
}
