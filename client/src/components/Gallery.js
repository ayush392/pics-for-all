import React, { useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useNavigate } from 'react-router-dom'
import './gallery.css';
import { saveAs } from 'file-saver'

// import Popover from './LoginModal';


function Gallery(props) {

  const navigate = useNavigate();
  // console.log(props);
  const [images, setImages] = useState([]);
  // const [like]
  const { data } = props;

  const downloadImage = (e) => {
    console.log(e);
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
              data && data.map(x => {
                return <div className='pos' key={x._id}>
                  <div className='overlay' onClick={() => navigate(`/photos/${x._id}`)}></div>

                  <img className='a' src={x.image} alt='xyz' />
                  {/* <button className='like-btn'>Like</button> */}
                  <button className='like-btn' onClick={() => navigate('/edit', {
                    state: {
                      id: x._id,
                      description: x.description,
                      tags: x.tags,
                      location: x.location
                    }
                  })}>
                    edit
                  </button>
                  <div className='flex-container hidden'>
                    {/* <div className="pop">
                    <Popover />
                  </div> */}
                    <div className='profile' name={x.user.username} onMouseOver={handleHover} onClick={() => navigate(`../user/${x.user.username}`)}>
                      <img className='profile-img' width="25px" src="https://png.pngtree.com/png-clipart/20210520/ourmid/pngtree-small-eye-handsome-boys-colorless-character-avatar-png-image_3286527.jpg" alt='user' />
                      <span className='profile-name' >{x.user.fName + " " + x.user.lName}</span>
                    </div>
                    <button className='download-btn' onClick={() => downloadImage(x.image)}>Download</button>
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