import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Gallery from '../components/Gallery'
const baseUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:4000' : 'https://picsforall-backend.onrender.com';

function SearchPage() {
  const { query } = useParams();
  const url = `${baseUrl}/api/posts/search/${query}`;
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((response) => {
        setData(response);
        // console.log(response);
      })
      .catch((e) => {
        alert(e.message);
        console.log(e.message);
      });
  }, [query, url]);

  console.log(data);

  return (
    <div className="container">
      {data.length === 0 ? (
        <>
          <h3 className="mt-3 mt-md-4 text-black opacity-75">
            No results found for {query}
          </h3>
          <h4 className="text-secondary">try searching for something else</h4>
        </>
      ) : (
        <>
          <h4 className="my-3 my-md-4 text-black opacity-75">
            Showing search results for {query}:
          </h4>
          {data && <Gallery data={data} setData={setData} />}
        </>
      )}
    </div>
  );
}

export default SearchPage