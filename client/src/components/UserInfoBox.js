import React, { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { clientKey } from '../ApiKey/keys';

function UserInfoBox() {
  const { userName } = useParams();
  const userUrl = `https://api.unsplash.com/users/${userName}/?client_id=${clientKey}`;

  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    fetch(userUrl)
      .then(res => res.json())
      .then(response => {
        setUserInfo(response);
        console.log(response);
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <>
      <div className='box'>
        <div className="inner-box">
          <div>
            {userInfo.profile_image && <img className='profile-img' src={`${userInfo.profile_image.large}`} alt="..." />}
          </div>
          <div>
            <div>
              <h1>{`${userInfo.name}`}</h1>
              <button>share</button>
            </div>
            <p>{`@${userInfo.username}`}</p>
            <p>{
              userInfo.bio ? userInfo.bio : `Download free, beautiful high-quality photos curated by ${userInfo.name}.`
            }</p>
            {userInfo.tags && userInfo.tags.custom.length > 0 && <>
              <p>Interests</p>
              {userInfo.tags.custom.map((x, index) => <span key={index} className='tags'>{x.title.charAt(0).toUpperCase() + x.title.slice(1)}</span>)}
            </>
            }
          </div>
        </div>
      </div>

      {/* <br /> */}
      <div className="underline">

        <NavLink
          className={({ isActive }) => isActive ? 'active-topic topic-link' : 'topic-link'}
          to={`./`}
        >
         🖼 Photos {userInfo.total_photos}
        </NavLink>
        <NavLink
          className={({ isActive }) => isActive ? 'active-topic topic-link' : 'topic-link'}
          to={`likes`}
        >
          ❤ Likes {userInfo.total_likes}
        </NavLink>
      </div>
      <br />
    </>
  )
}

export default UserInfoBox