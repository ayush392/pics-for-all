import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Gallery from '../components/Gallery'
import { clientKey } from '../ApiKey/keys';

function SearchPage() {
  const {query} = useParams();
  const url = `https://api.unsplash.com/search/photos/?query=${query}&client_id=${clientKey}`;
  const [data, setData] = useState([]);
  

  useEffect(()=>{
    fetch(url)
            .then(res => res.json())
            .then(x => x.results)
            .then(response => {
              setData(response)
              // console.log(response);
            })
            .catch(e => console.log(e.message));
  }, [query, url]);

  console.log(data);

  return (
    <div>
    <h1>SearchPage</h1>
    {data && <Gallery data={data} />}
    </div>
  )
}

export default SearchPage