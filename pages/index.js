import { useEffect, useState } from 'react';

export default function Home() {
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);  
  const [total, setTotal] = useState(0);
  const limit = 10;

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
        setError(error.message);
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
    <div>
      <h1>Medicine List</h1>
      <ul>
        {drugs.map((drug, index) => (
          <li key={index}>
            <a href={drug.Href} target="_blank" rel="noopener noreferrer">
              {drug.Text}
            </a>
            <p><strong>Description:</strong> {drug.Description}</p>
            <p><strong>Before Using:</strong> {drug.Before_Using}</p>
            <p><strong>Proper Use:</strong> {drug.Proper_Use}</p>
            <p><strong>Precautions:</strong> {drug.Precautions}</p>
            <p><strong>Side Effects:</strong> {drug.Side_Effects}</p>
          </li>
        ))}
      </ul>
      <div>
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)} disabled={page * limit >= total}>
          Next
        </button>
      </div>
    </div>
  );
}
