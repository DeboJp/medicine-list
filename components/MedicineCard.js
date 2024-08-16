import React, { useState } from 'react';

const parseContent = (content) => {
  if (!content) {
    return null;
  }
  const lines = content.split(/(\[[^\]]+\])/).filter(Boolean);
  const elements = [];
  let skip = false;

  console.log("Parsing content:", content); // Debugging statement

  for (let i = 0; i < lines.length; i++) {
    console.log("Processing line:", lines[i]); // Debugging statement

    if (lines[i].startsWith('[')) {
      const tag = lines[i].replace(/[\[\]]/g, '');

      if (tag === 'ol') {
        skip = true;
        continue;
      }

      if (skip && tag !== 'li') {
        skip = false;
      }

      if (!skip) {
        let nextContent = lines[++i];
        if (nextContent) {
          if (tag.startsWith('h')) {
            elements.push(React.createElement(tag, { key: i, className: 'font-bold' }, nextContent));
          } else {
            elements.push(React.createElement(tag, { key: i }, nextContent));
          }
        }
      }
    } else {
      if (!skip) {
        elements.push(<p key={i}>{lines[i]}</p>);
      }
    }
  }

  console.log("Parsed elements:", elements); // Debugging statement

  return elements;
};

const MedicineCard = ({ medicine }) => {
  const [page, setPage] = useState(0);

  const pages = [
    { title: medicine.Text, content: parseContent(medicine.Description) },
    { title: "Before Using", content: parseContent(medicine.Before_Using) },
    { title: "Proper Use", content: parseContent(medicine.Proper_Use) },
    { title: "Precautions", content: parseContent(medicine.Precautions) },
    { title: "Side Effects", content: parseContent(medicine.Side_Effects) },
  ];

  const nextPage = () => setPage((page + 1) % pages.length);
  const prevPage = () => setPage((page - 1 + pages.length) % pages.length);

  console.log("Current page content:", pages[page].content); // Debugging statement

  return (
    <div className="relative flex flex-col border-2 border-blue-500 rounded-lg shadow-lg p-4 m-4 w-full md:w-1/3 lg:w-1/4 bg-blue-100">
      <div className="absolute inset-0 border-2 border-blue-300 rounded-lg pointer-events-none"></div>
      <div className="flex justify-between items-center mb-2 border-b-2 border-blue-300 pb-2">
        <button onClick={prevPage} className="text-blue-800 font-bold text-xl">&lt;</button>
        <h2 className="text-lg font-bold text-blue-900">{pages[page].title}</h2>
        <button onClick={nextPage} className="text-blue-800 font-bold text-xl">&gt;</button>
      </div>
      <div className="overflow-auto h-72 font-light text-sm text-blue-900">
        {pages[page].content}
      </div>
    </div>
  );
};

export default MedicineCard;
