import React, { useState, useEffect } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { clientKey } from '../ApiKey/keys';
import Avatar from './Avatar';

function UserInfoBox() {
  const { username } = useParams();
  const userUrl = `/api/user/info/${username}`;

  const [userInfo, setUserInfo] = useState([]);

  useEffect(() => {
    fetch(userUrl)
      .then(res => res.json())
      .then(response => {
        setUserInfo(response[0]);
        console.log(response[0], 17);
      })
      .catch(e => console.log(e));
  }, [userUrl]);

  return (
    <>
      <div className='box'>
        <div className="inner-box">
          <div>
            {console.log(userInfo, 27)}
            {userInfo && <Avatar w='150px' ch={userInfo.fName ? userInfo.fName[0] : ' '} str={username} />}
          </div>
          <div>
            <div>
              <h1>{`${userInfo.fName} ${userInfo.lName}`}</h1>
              <button>share</button>
            </div>
            <p>{`@${userInfo.username}`}</p>
            <p>{
              `Download free, beautiful high-quality photos curated by ${userInfo.fName}.`
            }</p>
            {
              userInfo.tags && userInfo.tags.custom.length > 0 && <>
                <p>Interests</p>
                {userInfo.tags.custom.map((x, index) => <span key={index} className='tags'>{x.title.charAt(0).toUpperCase() + x.title.slice(1)}</span>)}
              </>
            }
          </div>
        </div>
      </div>

      {/* <br /> */}

      <br />
    </>
  )
}

export default UserInfoBox