import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate } from "react-router-dom";
import "./gallery.css";
// import FileDownload from "js-file-download";
import Avatar from "./Avatar";
import { useAuthContext } from "../hooks/useAuthContext";
import heart_black from "../icons/heart_black.svg";
import heart_red from "../icons/heart_red.svg";
import pen from "../icons/pen.svg";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function Gallery(props) {
  const { user } = useAuthContext();

  const navigate = useNavigate();
  // console.log(props);
  const { data, setData } = props;

  // function downloadImage(id, filename) {
  //   fetch(`${baseUrl}/api/posts/download/${id}`)
  //     .then(res => res.blob())
  //     .then(response => {
  //       FileDownload(response, filename);
  //     })
  //     .catch(e => console.log(e));
  // }

  async function downloadImage(url, id) {
    try {
      console.log(url, id);
      const blob = new Blob([await fetch(url).then((res) => res.blob())]);
      const fileUrl = window.URL.createObjectURL(blob);
      let link = document.createElement("a");
      link.href = fileUrl;
      link.download = "Picsforall-" + id.slice(0, 5) + ".jpg";
      link.click();
    } catch (error) {
      console.log(error);
      console.log(error.message);
    }
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
        const newData = data.map((posts) => {
          if (posts._id === response._id) return response;
          else return posts;
        });
        setData(newData);
        console.log(response);
      })
      .catch((e) => console.log(e.message));
    // setLike(!isLike);
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
        const newData = data.map((posts) => {
          if (posts._id === response._id) return response;
          else return posts;
        });
        setData(newData);
        console.log(response);
      })
      .catch((e) => console.log(e.message));
    // setLike(!isLike);
  }

  return (
    <>
      <div className="container">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter={"1.5rem"}>
            {data
              ? data.map((x) => {
                  return (
                    <div className="pos position-relative" key={x._id}>
                      <div className="card border border-0">
                        <div
                          className="overlay"
                          onClick={() =>
                            navigate(`/photos/${x._id}`, {
                              state: {
                                isLike: x.liked_by.includes(x.user.username),
                              },
                            })
                          }
                        ></div>
                        <div className="card-header bg-transparent p-2">
                          <div
                            className="profile"
                            name={x.user.username}
                            onClick={() =>
                              navigate(`../user/${x.user.username}`)
                            }
                          >
                            <Avatar
                              w="25px"
                              ch={x.user.fName[0]}
                              str={x.user.username}
                            />
                            <span className="ms-2">
                              {x.user.fName + " " + x.user.lName}
                            </span>
                          </div>
                        </div>

                        <img
                          className="card-img-top d-block"
                          src={x.image}
                          loading="lazy"
                          alt="..."
                          style={{ minHeight: "180px" }}
                          onClick={() =>
                            navigate(`/photos/${x._id}`, {
                              state: {
                                isLike: x.liked_by.includes(x.user.username),
                              },
                            })
                          }
                        />

                        <div className="card-body p-2">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex edit-like-btn">
                              {user && x.liked_by.includes(user.username) ? (
                                <button
                                  className="btn btn-sm like-btn border-danger"
                                  onClick={() =>
                                    user
                                      ? unlikePost(x._id, user.username)
                                      : navigate("/login")
                                  }
                                >
                                  <img
                                    src={heart_red}
                                    alt="heart"
                                    className=" d-block"
                                  />
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm like-btn border-secondary"
                                  onClick={() =>
                                    user
                                      ? likePost(x._id, user.username)
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

                              {user && user.username === x.user.username && (
                                <button
                                  className="btn btn-sm edit-btn border-secondary ms-2"
                                  onClick={() =>
                                    navigate("/edit", {
                                      state: {
                                        id: x._id,
                                        description: x.description,
                                        tags: x.tags,
                                        location: x.location,
                                      },
                                    })
                                  }
                                >
                                  <span>Edit </span>
                                  <img
                                    className=" pb-1 opacity-75"
                                    src={pen}
                                    alt="pen"
                                  />
                                </button>
                              )}
                            </div>
                            <button
                              className="btn btn-sm border-secondary download-btn"
                              onClick={() => downloadImage(x.image, x._id)}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              : [1, 2, 3, 4, 5, 6].map((x) => {
                  return (
                    <div className=" placeholder-glow ">
                      <div
                        className=" placeholder w-100"
                        style={{ height: "200px" }}
                      ></div>
                    </div>
                  );
                })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </>
  );
}

export default Gallery;
