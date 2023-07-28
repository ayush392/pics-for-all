import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { useNavigate } from 'react-router-dom'
import './gallery.css';
import FileDownload from 'js-file-download';
import Avatar from './Avatar';
import { useAuthContext } from '../hooks/useAuthContext';


// import Popover from './LoginModal';


function Gallery(props) {
  const { user } = useAuthContext();

  const navigate = useNavigate();
  // console.log(props);
  const { data, setData } = props;

  function downloadImage(id, filename) {
    fetch(`https://picsforall-backend.onrender.com/api/posts/download/${id}`)
      .then(res => res.blob())
      .then(response => {
        FileDownload(response, filename);
      })
      .catch(e => console.log(e));
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

  function likePost(postId, username) {
    if (!user) {
      navigate('/login');
      return
    }
    fetch('https://picsforall-backend.onrender.com/api/posts/like', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ postId, username })
    })
      .then(res => res.json())
      .then(response => {
        const newData = data.map(posts => {
          if (posts._id == response._id)
            return response;
          else
            return posts
        })
        setData(newData);
        console.log(response);
      })
      .catch(e => console.log(e.message))
    // setLike(!isLike);
  }
  function unlikePost(postId, username) {
    if (!user) {
      navigate('/login');
      return
    }
    fetch('https://picsforall-backend.onrender.com/api/posts/unlike', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ postId, username })
    })
      .then(res => res.json())
      .then(response => {
        const newData = data.map(posts => {
          if (posts._id == response._id)
            return response;
          else
            return posts
        })
        setData(newData);
        console.log(response);
      })
      .catch(e => console.log(e.message))
    // setLike(!isLike);
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
                  <div className='overlay' onClick={() => navigate(`/photos/${x._id}`, {
                    state: {
                      isLike: (x.liked_by.includes(x.user.username))
                    }
                  })}></div>

                  <img className='a' src={x.image} alt='xyz' />

                  {user && (user.username === x.user.username) && <button className='edit-btn' onClick={() => navigate('/edit', {
                    state: {
                      id: x._id,
                      description: x.description,
                      tags: x.tags,
                      location: x.location
                    }
                  })}>
                    Edit 🖋
                  </button>}

                  {user && x.liked_by.includes(user.username)
                    ?
                    <button className='like-btn red' onClick={() => user ? unlikePost(x._id, user.username) : navigate('/login')} > ❤ </button>
                    :
                    <button className='like-btn' onClick={() => user ? likePost(x._id, user.username) : navigate('/login')} > ❤ </button>
                  }


                  <div className='flex-container hidden'>

                    <div className='profile' name={x.user.username} onMouseOver={handleHover} onClick={() => navigate(`../user/${x.user.username}`)}>
                      <Avatar w='25px' ch={x.user.fName[0]} str={x.user.username} />
                      <span className='ms-2 profile-name' >{x.user.fName + " " + x.user.lName}</span>
                    </div>
                    <button className='download-btn' onClick={() => downloadImage(x._id, x.user.fName + '-' + x._id + '.jpg')}>Download</button>
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