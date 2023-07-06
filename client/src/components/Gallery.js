import React, { useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useNavigate } from 'react-router-dom'
import './gallery.css';
import { saveAs } from 'file-saver'

import Popover from './Popover';


function Gallery(props) {

  const navigate = useNavigate();
  // console.log(props);
  const [images, setImages] = useState([]);
  // const [like]
  const { data } = props;

  const downloadImage = (e) => {
    // console.log(e.target.value);
    saveAs(e.target.value, e.target.name);
  }

  function handleHover(e) {
    // console.log(e.target);
    // const {name} = e.target.name;
    // const url = `https://api.unsplash.com/users/${name}/?client_id=${clientKey}`;  
    // fetch(url)
    //   .then(res=>res.json())
    //   .then(response => setImages(response))
    //   .catch(e => console.log(e));
  }

  return (
    <>
      {/* {data[1] && <div className="popoverr">
        <div className='r'>
          <div className="one">
            <img src={data[1].user.profile_image.medium} alt="" />
          </div>
          <div className='two'>
            <h3 className='c' >{data[1].user.name}</h3>
            <p className='c' >{data[1].user.username}</p>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline-secondary">View Profile</button>
      </div>} */}


      <div className='card-container'>
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
        >
          <Masonry gutter={"1.5rem"}>
            {
              data.map(x => {
                return <div className='pos' key={x.id}>
                  <div className='overlay' onClick={() => navigate(`/photos/${x.id}`)}></div>

                  <img className='a' src={x.urls.small} alt='xyz' />
                  <button className='like-btn'>Like</button>
                  <div className='flex-container hidden'>
                    {/* <div className="pop">
                    <Popover />
                  </div> */}
                    <div className='profile' name={x.user.username} onMouseOver={handleHover} onClick={() => navigate(`../user/${x.user.username}`)}>
                      <img className='profile-img' src={x.user.profile_image.small} alt='user' />
                      <span className='profile-name' >{x.user.name}</span>
                    </div>
                    <button className='download-btn' name={x.user.name + '-' + x.id + '.jpg'} value={x.urls.small} onClick={downloadImage}>Download</button>
                  </div>
                </div>
              })
            }
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </>
  )
}

export default Gallery