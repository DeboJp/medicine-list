import { useEffect, useState } from 'react';

export default function Home() {
  const [drugs, setDrugs] = useState([]);
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
          console.error('Error fetching data');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [page]);

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <button onClick={handleNextPage} disabled={page * limit >= total}>
          Next
        </button>
      </div>
    </div>
  );
}
