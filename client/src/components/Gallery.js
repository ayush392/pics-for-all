import { useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { useNavigate } from "react-router-dom";
import "./gallery.css";
import Avatar from "./Avatar";
import { useAuthContext } from "../hooks/useAuthContext";
import heart_black from "../icons/heart_black.svg";
import heart_red from "../icons/heart_red.svg";
import pen from "../icons/pen.svg";
import EditModal from "./EditModal";
import toast from "react-hot-toast";
const baseUrl = process.env.REACT_APP_BACKEND_URI;

function Gallery(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [modalOpen, setModalOpen] = useState(null);
  const { user } = useAuthContext();

  const navigate = useNavigate();
  // console.log(props);
  const { data, setData } = props;

  function downloadImage(url) {
    const a = document.createElement("a");
    a.href = url.replace("/upload/", "/upload/fl_attachment,");

    // Force download by appending and clicking
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleLike = async (postId, type) => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/api/posts/${type}/${postId}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      })

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message);
      }

      if(props.setRefetch){
        props.setRefetch(prev => !prev);
      }

      const newData = data.map((posts) => {
        if (posts._id === json.data._id) {
          return {
            ...posts,
            isLiked: json.data.isLiked,
          }
        }
        else return posts;
      });

      setData(newData);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  return (
    <>
      <div className="container mb-4 mb-lg-5 ">
        {data.length === 0 && <div>
          <h3 className="text-center mt-4 text-secondary">
            No image found.
          </h3>
          </div>}
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter={"1.5rem"}>
            {data &&
              data.map((x) => {
                return (
                  <div className="pos position-relative" key={x._id}>
                    <div
                      className={`card border border-0 ${!isLoaded && "visually-hidden"
                        }`}
                    >
                      <div
                        className="overlay"
                        onClick={() => navigate(`/photos/${x._id}`)}
                      ></div>
                      <div className="card-header bg-transparent p-2">
                        <div
                          className="profile"
                          name={x.createdBy.username}
                          onClick={() => navigate(`../user/${x.createdBy.username}`)}
                        >
                          <Avatar w={'28px'} avatar={x.createdBy.avatar} />
                          <span className="ms-2">
                            {x.createdBy.fName + " " + x.createdBy.lName}
                          </span>
                        </div>
                      </div>

                      <img
                        className="card-img-top d-block "
                        src={x.image.thumbnail}
                        alt="..."
                        style={{ minHeight: "180px" }}
                        onLoad={() => setIsLoaded(true)}
                        onClick={() => navigate(`/photos/${x._id}`)}
                        loading="lazy"
                      />

                      <div className="card-body p-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex edit-like-btn">
                            {x.isLiked ? (
                              <button
                                className="btn btn-sm like-btn border-danger"
                                onClick={() =>
                                  user
                                    ? handleLike(x._id, "unlike")
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
                                    ? handleLike(x._id, "like")
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

                            {user && user?.username === x.createdBy?.username && (
                              <button
                                className="btn btn-sm edit-btn border-secondary ms-2"
                                onClick={() => setModalOpen(x._id)}
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
                            onClick={() => downloadImage(x.image.thumbnail)}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    </div>
                    {!isLoaded && (
                      <div className=" placeholder-glow">
                        <div
                          className=" placeholder w-100"
                          style={{ height: "200px" }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            {!isLoaded &&
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div className=" placeholder-glow" key={i}>
                  <div
                    className=" placeholder w-100"
                    style={{ height: "250px" }}
                  ></div>
                </div>
              ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
      <EditModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
}

export default Gallery;
