import React, { useEffect, useState } from 'react'
import { useAuthContext } from "../hooks/useAuthContext";
import { useParams } from 'react-router-dom'
import Gallery from '../components/Gallery'
import toast from 'react-hot-toast';
const baseUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:4000' : 'https://picsforall-backend.onrender.com';

function SearchPage() {
  const { query } = useParams();
  const [data, setData] = useState([]);
    const { user } = useAuthContext();
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/posts/search/${query}`, {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.message);
        }
        setData(json.data);
      } catch (error) {
        toast.error(error.message);
      }
    }
    fetchData();
  }, [query, user?.token]);

  // console.log(data);

  return (
    <div className="container">
      {data.length === 0 ? (
        <div className='d-flex align-items-center justify-content-center' style={{ height: "80vh" }}>
          <div className='text-center'>
          <h3 className="mt-3 mt-md-4 text-black opacity-75">
            No results found for {query}
          </h3>
          <h5 className="text-secondary mt-2">Try searching with other keyword.</h5>
        </div>
        </div>
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