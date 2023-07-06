import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Gallery from '../components/Gallery';
import Navbar from '../components/Navbar';
// import Header from '../components/Header';
import { clientKey } from '../ApiKey/keys';

function Home() {
  const [data, setData] = useState([]);
  // const url = `https://api.unsplash.com/search/photos/?query=tree&client_id=${clientKey}`;
  const url = `https://api.unsplash.com/photos/?client_id=${clientKey}`;
  const navigate = useNavigate();


  useEffect(()=>{
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
        <Navbar/>
        <Gallery data={data} />
    </div>
  )
}

export default Home