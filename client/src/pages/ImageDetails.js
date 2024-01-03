import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import FileDownload from "js-file-download";
// import Error from './Error';
import { useAuthContext } from "../hooks/useAuthContext";
import Avatar from "../components/Avatar";
import heart_black from "../icons/heart_black.svg";
import heart_red from "../icons/heart_red.svg";
import pen from "../icons/pen.svg";
import rectangle_icon from "../icons/rectangle-icon.svg";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function ImageDetails() {
  const { state } = useLocation();
  console.log(state);
  const [isLike, setIsLike] = useState(state ? state.isLike : false);
  const { id } = useParams();
  const navigate = useNavigate();
  const url = `${baseUrl}/api/posts/photos/${id}`;
  const [imgDetail, setImgDetail] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((response) => setImgDetail(response))
      .catch((e) => console.log(e));
  }, [url, user]);

  function downloadImage(id, filename) {
    fetch(`${baseUrl}/api/posts/download/${id}`)
      .then((res) => res.blob())
      .then((response) => {
        FileDownload(response, filename);
      })
      .catch((e) => console.log(e));
  }

  function likePost(postId, username) {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`${baseUrl}/api/posts/like`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ postId, username }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        setIsLike(true);
      })
      .catch((e) => console.log(e.message));
  }
  function unlikePost(postId, username) {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`${baseUrl}/api/posts/unlike`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ postId, username }),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        setIsLike(false);
      })
      .catch((e) => console.log(e.message));
  }

  return (
    <>
      {console.log(imgDetail, 80)}
      {/* {setIsLike(imgDetail.liked_by.includes(user.username))} */}
      {imgDetail.user && (
        <div className="container">
          <div className="d-flex justify-content-between mt-3 mb-2 pb-1">
            <div
              role="button"
              name={imgDetail.user.username}
              onClick={() => navigate(`../user/${imgDetail.user.username}`)}
            >
              <Avatar
                w="32px"
                ch={imgDetail.user.username[0].toUpperCase()}
                str={imgDetail.user.username}
              />
              <span className="ms-2" style={{ fontSize: "1.125rem" }}>
                {imgDetail.user.fName.charAt(0).toUpperCase() +
                  imgDetail.user.fName.slice(1) +
                  " " +
                  imgDetail.user.lName.charAt(0).toUpperCase() +
                  imgDetail.user.lName.slice(1)}
              </span>
            </div>

            <button
              className="btn btn-success btn-sm"
              onClick={() =>
                downloadImage(
                  imgDetail._id,
                  imgDetail.user.fName + "-" + imgDetail._id + ".jpg"
                )
              }
            >
              Download
            </button>
          </div>
        </div>
      )}
      {/* <div className='flex-container'>
                    <div className='profil' onClick={() => navigate(`../user/${imgDetail.user.username}`)}>
                        <img width="50px" className='profile-img' src={avatarUrl} alt='user' />
                        <span className='profile-name' >{imgDetail.user.fName + " " + imgDetail.user.lName}</span>
                    </div>

                    <div>
                        {
                            (user && isLike) ?
                                <button className='btn btn-outline-danger me-2' onClick={() => user ? unlikePost(imgDetail._id, user.username) : navigate('/login')} > ❤ </button>
                                :
                                <button className='btn btn-outline-secondary me-2' onClick={() => user ? likePost(imgDetail._id, user.username) : navigate('/login')} > ❤ </button>
                        }
                        <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Download free
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => downloadImage(imgDetail._id, imgDetail.user.fName + '-' + imgDetail._id + '.jpg')}>Small</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} >Medium</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} >Large</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} >Original Size</button></li>
                        </ul>
                    </div>

                </div> */}

      <img
        className={`img-det ${!isLoaded && "visually-hidden"}`}
        src={imgDetail?.image}
        alt="xyz"
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className=" placeholder-glow">
          <img src={rectangle_icon} className="img-det placeholder" />
        </div>
      )}

      {imgDetail && (
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mt-2 mb-3 pt-1">
            <div className="d-flex">
              {
                /* {user && x.liked_by.includes(user.username)} */
                user && isLike ? (
                  <button
                    className="btn btn-sm border-danger"
                    onClick={() =>
                      user
                        ? unlikePost(imgDetail._id, user.username)
                        : navigate("/login")
                    }
                  >
                    <img src={heart_red} alt="heart" className="d-block" />
                  </button>
                ) : (
                  <button
                    className="btn btn-sm border-secondary "
                    onClick={() =>
                      user
                        ? likePost(imgDetail._id, user.username)
                        : navigate("/login")
                    }
                  >
                    <img
                      src={heart_black}
                      alt="heart"
                      className=" d-block opacity-75"
                    />
                  </button>
                )
              }

              {user &&
                imgDetail.user &&
                user.username === imgDetail.user?.username && (
                  <button
                    className="btn btn-sm border-secondary ms-3"
                    onClick={() =>
                      navigate("/edit", {
                        state: {
                          id: imgDetail._id,
                          description: imgDetail.description,
                          tags: imgDetail.tags,
                          location: imgDetail.location,
                        },
                      })
                    }
                  >
                    <span>Edit </span>
                    <img className=" pb-1 opacity-75" src={pen} alt="pen" />
                  </button>
                )}
            </div>

            <button
              className="btn btn-sm border-secondary"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.href}`);
                alert("Link copied to clipboard");
              }}
            >
              <span>Share </span>
              <svg
                className="opacity-75"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                style={{ marginBottom: "2px" }}
              >
                <path d="M13 20v-5.5c-5.556 0-8.222 1-11 5.5C2 13.25 5.222 8.625 13 7.5V2l9 9-9 9Z"></path>
              </svg>
            </button>
          </div>

          <div className="mb-3">
            <h4 className="mb-3">{imgDetail?.description}</h4>
            <div className=" d-flex align-items-center text-secondary">
              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#767676"
                  d="M17.6 4.2C16 2.7 14.1 2 12 2s-4 .7-5.6 2.2C4.8 5.7 4 7.7 4 10.2c0 1.7.7 3.5 2 5.4 1.3 2 3.3 4.1 6 6.4 2.7-2.3 4.7-4.4 6-6.4 1.3-2 2-3.8 2-5.4 0-2.5-.8-4.5-2.4-6zm-1.1 10.1c-1 1.5-2.5 3.2-4.5 5.1-2-1.9-3.5-3.6-4.5-5.1-1-1.5-1.5-2.9-1.5-4.1 0-1.8.6-3.3 1.7-4.5C8.9 4.6 10.3 4 12 4s3.1.6 4.3 1.7c1.2 1.2 1.7 2.6 1.7 4.5 0 1.2-.5 2.5-1.5 4.1zm-2-4.3c0 1.4-1.1 2.5-2.5 2.5S9.5 11.4 9.5 10s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5z"
                ></path>
              </svg>
              <span>{imgDetail?.location}</span>
            </div>
            <div className=" d-flex align-items-center text-secondary">
              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#767676"
                  d="M21 6v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14z"
                ></path>
              </svg>
              <span>
                Published on {new Date(imgDetail?.date).toLocaleDateString()}
              </span>
            </div>
            <div className=" d-flex align-items-center text-secondary">
              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#767676"
                  d="m10 14.2 6.6-6.6L18 9l-8 8-4-4 1.4-1.4 2.6 2.6ZM21 5v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V5l9-4 9 4Zm-2 1.3-7-3.1-7 3.1V11c0 4.5 3 8.7 7 9.9 4-1.2 7-5.4 7-9.9V6.3Z"
                ></path>
              </svg>
              <span>Free to use under the PicsForAll License</span>
            </div>
          </div>

          {imgDetail.tags && (
            <div className="pt-2 mb-2">
              {imgDetail.tags.map((tag, i) => {
                return (
                  <button
                    className="btn btn-light bg-secondary-subtle btn-sm me-2 mb-2"
                    disabled
                    key={i}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
      {/* <div className='flex-container'>
                <div>
                    <span className='pe-5'>Views: {imgDetail?.views}</span>
                    <span>Downloads: {imgDetail?.downloads}</span>
                </div>

                <div>
                    <button className='btn me-2 btn-outline-secondary' onClick={() => {
                        navigator.clipboard.writeText(`${window.location.href}`);
                        alert('Link copied to clipboard');
                    }}>➦ Share</button>

                    <button className="btn me-2 btn-outline-secondary">ℹ Info</button>
                </div>
            </div> */}

      {/* <div className='m-1 ps-3 pe-3'>
                {imgDetail.description && <h4>{imgDetail.description}</h4>}
                {imgDetail.location && <p>📍 {imgDetail.location}</p>}
                {imgDetail.date && <p>📅 Published on {new Date(imgDetail.date).toLocaleDateString()}</p>}
                <p>🛡 Free to use under the PicsForAll License</p>
            </div> */}
    </>
  );
}

export default ImageDetails;
