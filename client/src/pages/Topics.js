import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import { useLocation, useParams } from 'react-router-dom';
import Gallery from '../components/Gallery';
import { clientKey } from '../ApiKey/keys';

function Topics() {
    const {state} = useLocation();
    const {title, description} = state;
    const {slugId} = useParams();
    
    const topic_photos_url = `https://api.unsplash.com/topics/${slugId}/photos?client_id=${clientKey}`;
    const [topicData, setTopicData] = useState([]);
    // const url = `https://api.unsplash.com/topics/${slugId}?client_id=${clientKey}`;
    

    useEffect(() => {
        // fetch(url)
        //     .then(res => res.json())
        //     .then(response => {
        //         setData(response);
        //         console.log(response);
        //     })
        //     .catch(e => console.log(e));
        fetch(topic_photos_url)
            .then(res => res.json())
            .then(response => {
                setTopicData(response);
                // console.log(response);
            })
            .catch(e => console.log(e));
    }, [topic_photos_url])

    return (
        <>
            <Navbar/>
            <h1>{title}</h1>
            <p>{description}</p>
            {topicData && <Gallery data = {topicData}/>}
        </>
    )
}

export default Topics