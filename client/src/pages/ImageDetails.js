import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import Avatar from "../components/Avatar";
import heart_black from "../icons/heart_black.svg";
import heart_red from "../icons/heart_red.svg";
import pen from "../icons/pen.svg";
import rectangle_icon from "../icons/rectangle-icon.svg";
import EditModal from "../components/EditModal";

const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function ImageDetails() {
  // console.log(state);
  const { id } = useParams();
  const navigate = useNavigate();
  const url = `${baseUrl}/api/posts/${id}`;
  const [imgDetail, setImgDetail] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuthContext();
  const [modalOpen, setModalOpen] = useState(null);

  useEffect(() => {
    fetch(url, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((response) => setImgDetail(response?.data))
      .catch((e) => console.log(e));
  }, [url, user]);

  function downloadImage(url) {
    const a = document.createElement("a");
    a.href = url.replace("/upload/", "/upload/fl_attachment/");

    // Force download by appending and clicking
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function handleLike(postId, type) {
    if (!user) {
      navigate("/login");
      return;
    }
    fetch(`${baseUrl}/api/posts/${type}/${postId}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      // body: JSON.stringify({ postId, username }),
    })
      .then((res) => res.json())
      .then((response) => {
        // console.log(response);
        setImgDetail(prev => {
          return { ...prev, isLiked: response.data.isLiked }
        });
      })
      .catch((e) => console.log(e.message));
  }

  return (
    <>
      {/* {console.log(imgDetail, 80)} */}
      {/* ------------------------------ NAV (user, download btn) ---------------------- */}
      {imgDetail?.createdBy && (
        <div className="container">
          <div className="d-flex justify-content-between align-items-center my-3">
            <div
              role="button"
              name={imgDetail.createdBy.username}
              onClick={() => navigate(`../user/${imgDetail.createdBy.username}`)}
            >
              <Avatar
                w="32px"
                avatar={imgDetail.createdBy.avatar}
              />
              <span className="ms-2" style={{ fontSize: "1.125rem" }}>
                {imgDetail.createdBy.fName.charAt(0).toUpperCase() +
                  imgDetail.createdBy.fName.slice(1) +
                  " " +
                  imgDetail.createdBy.lName.charAt(0).toUpperCase() +
                  imgDetail.createdBy.lName.slice(1)}
              </span>
            </div>

            <button
              className="btn btn-success"
              onClick={() => downloadImage(imgDetail.image.url)}
            >
              Download
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------- IMAGE ------------------------------- */}
      <img
        className={`img-det ${!isLoaded && "visually-hidden"}`}
        src={imgDetail?.image?.url}
        alt="xyz"
        onLoad={() => setIsLoaded(true)}
      />
      {!isLoaded && (
        <div className=" placeholder-glow">
          <img
            src={rectangle_icon}
            alt="placeholder"
            className="img-det placeholder"
          />
        </div>
      )}

      {/* ------------------------------ LIKE, SHARE and EDIT button ---------------------------- */}

      {imgDetail && (
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mt-2 mb-3 pt-1">
            <div className="d-flex">
              {imgDetail.isLiked ? (
                <button
                  className="btn btn-sm border-danger"
                  onClick={() =>
                    user
                      ? handleLike(imgDetail._id, "unlike")
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
                      ? handleLike(imgDetail._id, "like")
                      : navigate("/login")
                  }
                >
                  <img
                    src={heart_black}
                    alt="heart"
                    className=" d-block opacity-75"
                  />
                </button>
              )}

              {user &&
                user?.username === imgDetail.createdBy?.username && (
                  <button
                    className="btn btn-sm border-secondary ms-3"
                    onClick={() => setModalOpen(imgDetail._id)}
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

          {/* --------------------------- IMAGE DESCRIPTION ---------------------------- */}
          <div className="mb-3">
            {imgDetail?.description && <h4 className="mb-3">{imgDetail.description}</h4>}
            {imgDetail?.location && <div className=" d-flex align-items-center text-secondary">
              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#767676"
                  d="M17.6 4.2C16 2.7 14.1 2 12 2s-4 .7-5.6 2.2C4.8 5.7 4 7.7 4 10.2c0 1.7.7 3.5 2 5.4 1.3 2 3.3 4.1 6 6.4 2.7-2.3 4.7-4.4 6-6.4 1.3-2 2-3.8 2-5.4 0-2.5-.8-4.5-2.4-6zm-1.1 10.1c-1 1.5-2.5 3.2-4.5 5.1-2-1.9-3.5-3.6-4.5-5.1-1-1.5-1.5-2.9-1.5-4.1 0-1.8.6-3.3 1.7-4.5C8.9 4.6 10.3 4 12 4s3.1.6 4.3 1.7c1.2 1.2 1.7 2.6 1.7 4.5 0 1.2-.5 2.5-1.5 4.1zm-2-4.3c0 1.4-1.1 2.5-2.5 2.5S9.5 11.4 9.5 10s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5z"
                ></path>
              </svg>
              <span>{imgDetail.location}</span>
            </div>}
            <div className=" d-flex align-items-center text-secondary">
              <svg className="me-2" width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#767676"
                  d="M21 6v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2zM5 8h14V6H5v2zm14 12V10H5v10h14z"
                ></path>
              </svg>
              <span>
                Updated on {new Date(imgDetail?.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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

          {imgDetail?.tags && (
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
      <EditModal modalOpen={modalOpen} setModalOpen={setModalOpen} setImgDetail={setImgDetail}/>
    </>
  );
}

export default ImageDetails;
