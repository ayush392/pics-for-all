import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Gallery from '../components/Gallery';
import Avatar from '../components/Avatar';
import { useAuthContext } from "../hooks/useAuthContext";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function UserProfile() {
  const { username } = useParams();
  const [userInfo, setUserInfo] = useState();
  const [likedPosts, setLikedPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [openTab, setOpenTab] = useState("photos");
  const { user } = useAuthContext();

  useEffect(() => {
    fetch(`${baseUrl}/api/user/info/${username}`, {
      method: "GET",
      headers:{
        "Content-type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      }
    })
      .then((res) => res.json())
      .then((response) => {
        setUserInfo(response?.data?.userInfo);
        setUserPosts(response?.data?.userPosts);
        setLikedPosts(response?.data?.likedPosts);
        // console.log(response);
      })
      .catch((e) => console.log(e));
  }, [username, user?.token]);

  // console.log(user);
  // console.log(user.photos);
  // const data = user.photos;
  return (
    userInfo && <>
      <div className="container my-3 my-md-4">
        <div
          className=" d-flex flex-column flex-md-row m-auto"
          style={{ width: "fit-content" }}
        >
          <div className="me-1 me-md-3 me-lg-4 ">
            {userInfo && (
              <Avatar
                w="9.3rem"
                avatar={userInfo?.avatar}
              />
            )}
          </div>

          <div className="ms-0 ms-md-3 ms-lg-4 ">
            <h1 className="mb-0">{`${userInfo.fName} ${userInfo.lName}`}</h1>
            <h5 className="text-secondary mt-0">{`@${userInfo.username}`}</h5>
            <h6 className="my-2 fw-normal">{`Download free, beautiful high-quality photos curated by ${userInfo?.fName} ${userInfo?.lName}.`}</h6>
            <div className=" d-flex align-items-center text-secondary">
              <svg className="me-2" width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#767676"
                  d="M5.988 15.637C7.313 17.596 9.317 19.717 12 22c2.683-2.283 4.688-4.404 6.013-6.363C19.338 13.679 20 11.867 20 10.2c0-2.5-.804-4.492-2.413-5.975C15.979 2.742 14.117 2 12 2c-2.117 0-3.979.742-5.587 2.225C4.804 5.708 4 7.7 4 10.2c0 1.667.663 3.479 1.988 5.437ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                ></path>
              </svg>
              <span className="fs-6">India</span>
            </div>
          </div>
        </div>
      </div>
      <br />

      <div className="mx-3 d-flex align-items-center">
        <div
          className={`${openTab === 'photos' ? "active-topic topic-link" : "topic-link"}`}
          onClick={() => setOpenTab('photos')}
        >
          <div className="d-flex align-items-center">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M20 3H4c-.6 0-1 .4-1 1v16c0 .6.4 1 1 1h16c.6 0 1-.4 1-1V4c0-.6-.4-1-1-1ZM5 18l3.5-4.5 2.5 3 3.5-4.5 4.5 6H5Z"></path>
            </svg>
            <span className="ms-2">Photos</span>
          </div>
        </div>

        <div
          className={`${openTab === 'likes' ? "active-topic topic-link" : "topic-link"}`}
          onClick={() => setOpenTab('likes')}
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
        </div>
      </div>
      <hr className="mt-0" />
      <br />
      {openTab === 'likes' ?
        <Gallery data={likedPosts} setData={setLikedPosts} />
        : <Gallery data={userPosts} setData={setUserPosts} />}

    </>
  );
}

export default UserProfile