import { useEffect, useState } from 'react';

export default function Home() {
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    fetch('/api/drugs')
      .then((response) => response.json())
      .then((data) => setDrugs(data));
  }, []);

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
    </div>
  );
}
