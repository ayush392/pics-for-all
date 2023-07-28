import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';
import Navbar from '../components/Navbar';
// import Header from '../components/Header';
import { useAuthContext } from '../hooks/useAuthContext'
// "proxy": "http://localhost:4000",
function Home() {
  const [data, setData] = useState([]);
  const url = 'https://picsforall-backend.onrender.com/api/posts';
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
      <Navbar />
      {/* {console.log(data)} */}
      {data && <Gallery data={data} setData={setData} />}
    </div>
  )
}

export default Home