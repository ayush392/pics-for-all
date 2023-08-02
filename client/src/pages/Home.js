import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';
// import Header from '../components/Header';
import { useAuthContext } from '../hooks/useAuthContext'
// "proxy": "http://localhost:4000",
const baseUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:4000' : 'https://picsforall-backend.onrender.com';

function Home() {
  const [data, setData] = useState([]);
  const url = `${baseUrl}/api/posts`;
  console.log(url);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(response => {
        setData(response)
        // console.log(response);
      })
      .catch(e => console.log(e.message));
  }, [url]);

  return (
    <div>
      <img src={'./banner.jpg'} className="d-block object-fit-cover w-100 banner" alt="..." />
      <br />
      {data && <Gallery data={data} setData={setData} />}
    </div>
  )
}

export default Home