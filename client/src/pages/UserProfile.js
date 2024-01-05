import { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import Gallery from '../components/Gallery';
import UserInfoBox from '../components/UserInfoBox';

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function UserProfile({ val }) {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState([]);
  // const userUrl = `https://api.unsplash.com/users/${userName}/${val}?client_id=${clientKey}`;

  useEffect(() => {
    fetch(`${baseUrl}/api/user/${val}/${username}`)
      .then((res) => res.json())
      .then((response) => {
        setUserInfo(response);
        console.log(response);
      })
      .catch((e) => console.log(e));
  }, [val, username]);

  // console.log(user);
  // console.log(user.photos);
  // const data = user.photos;
  return (
    <>
      <UserInfoBox />

      <nav className="mx-3 d-flex align-items-center">
        <NavLink
          className={({ isActive }) =>
            isActive ? "active-topic topic-link" : "topic-link"
          }
          to={`../user/${username}`}
        >
          <div className="d-flex align-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M20 3H4c-.6 0-1 .4-1 1v16c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1ZM5 18l3.5-4.5 2.5 3 3.5-4.5 4.5 6H5Z"></path>
            </svg>
            <span className="ms-2">Photos</span>
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive ? "active-topic topic-link" : "topic-link"
          }
          to={`../likes/${username}`}
        >
          <div className="d-flex align-items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="16"
              viewBox="0 0 512 512"
            >
              <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
            </svg>
            <span className="ms-2">Likes</span>
          </div>
        </NavLink>
      </nav>
      <hr className="mt-0" />
      <br />
      {userInfo && <Gallery data={userInfo} setData={setUserInfo} />}
    </>
  );
}

export default UserProfile