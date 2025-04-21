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
  const [loadedImages, setLoadedImages] = useState({});
  const [modalOpen, setModalOpen] = useState(null);
  const { user } = useAuthContext();

  const navigate = useNavigate();
  // console.log(props);
  const { data, setData } = props;

  const handleImageLoad = (id) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

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

      if (props.setRefetch) {
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
        {
          data && data.length === 0 && props.setRefetch && <div>
            <h3 className="text-center mt-4 text-secondary">
              No image found.
            </h3>
          </div>
        }
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
          <Masonry gutter={"1.5rem"}>
            {data &&
              data.map((x) => {
                return (
                  <div className="pos position-relative" key={x._id}>
                    <img
                      src={x.image.thumbnail.replace(
                        "upload/f_auto,q_auto:eco,w_380/",
                        "upload/f_auto,e_blur:1000,q_1,w_20/"
                      )}
                      alt="blur"
                      className={`img-fluid position-absolute top-0 start-0 w-100 h-100 object-fit-cover transition-opacity ${loadedImages[x._id] ? "opacity-0" : "opacity-100"}`}
                      style={{ zIndex: 1 }}
                    />

                    <div className={`card border-0 position-relative bg-white transition-opacity ${!loadedImages[x._id] ? "opacity-0" : ""}`}
                      style={{ zIndex: 2 }}>
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
                        className="d-block w-100"
                        src={x.image.thumbnail}
                        alt="..."
                        style={{ minHeight: "180px", objectFit: "cover" }}
                        onLoad={() => handleImageLoad(x._id)}
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
                    {/* {!loadedImages[x._id] && (
                      <img src={x.image.thumbnail.replace("upload/f_auto,q_auto,w_400", "upload/q_1,e_blur:200,w_20/")}
                        alt="blur placeholder"
                        className={`img-fluid bg-danger position-absolute top-0 start-0 w-100 h-100 object-fit-cover ${loadedImages[x._id] ? "opacity-0" : "opacity-100"}`}
                      />
                    )} */}
                  </div>
                );
              })}

          </Masonry>
        </ResponsiveMasonry>
      </div>
      {modalOpen && <EditModal modalOpen={modalOpen} setModalOpen={setModalOpen} />}
    </>
  );
}

export default Gallery;
