import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function EditModal({ modalOpen, setModalOpen, setImgDetail }) {
  const [data, setData] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthContext();
  // const id = state?.id;
  // const imageUrl = state?.url;
  const navigate = useNavigate();
  // console.log(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/posts/${modalOpen}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();
        setData(json.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    modalOpen && fetchData();
  }, [modalOpen])

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) {
      alert("Please Login");
      setIsUpdating(false);
      return;
    }
    setIsUpdating(true);
    try {
      const response = await fetch(`${baseUrl}/api/posts/${modalOpen}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ description: data.description, location: data.location }),
      });
      const json = await response.json();
      if (setImgDetail){
        setImgDetail(prev => {return {...prev, location: json.data.location, description: json.data.description}})
      }

      alert("Post updated successfully");
      setModalOpen(null)
    } catch (error) {
      setIsUpdating(false);
      alert(error.message);
      console.log(error);
    }
  }

  async function handleDelete() {
    if (!user) {
      alert("please login");
      return;
    }
    if (!window.confirm("Do you want to delete this image?")) {
      return;
    }
    try {
      setIsDeleting(true);
      const response = await fetch(`${baseUrl}/api/posts/${modalOpen}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      console.log(json);
      if (json) {
        alert("Post deleted successfully");
        setModalOpen(null);
      }
    } catch (error) {
      setIsDeleting(false);
      alert(error.message);
      console.log(error);
    }
  }

  return (
    <>
      {
        modalOpen && !user && alert("Please Login")
      }
      {modalOpen && data && user &&
        <div>
          <div className={`position-fixed top-0 start-0 d-flex align-items-center bg-dark bg-opacity-50 h-100 w-100 p-3`} style={{ backdropFilter: 'blur(8px)', zIndex: '5' }}>
            <div className="container position-relative bg-light rounded p-4 w-auto" style={{ zIndex: '6', maxHeight: '80vh' }}>

              <h2 className=" pb-3 pb-md-3 ">Edit post</h2>

              <div className="d-md-flex">
                <div className={`${data?.height > data?.width ? "w-75" : 'w-100'}`}>
                  <img src={data?.image?.thumbnail} alt="imgPreview" className="d-block ms-auto me-auto rounded img-fluid" />
                </div>
                <div className="w-100 mt-4 mt-md-0 ms-md-4 ms-lg-5 d-flex flex-column justify-content-between">
                  <form>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        value={data.description}
                        onChange={(e) => setData(prev => ({ ...prev, ["description"]: e.target.value }))}
                        type="text"
                        className="form-control"
                        rows="4"
                      />
                    </div>
                    {/* <div className="mb-3">
                      <label className="form-label">Tags</label>
                      <input
                        value={data.tags}
                        onChange={(e) => setData(prev => ({ ...prev, ["tags"]: e.target.value }))}
                        type="text"
                        className="form-control"
                      />
                    </div> */}
                    <div className="mb-3">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        value={data.location}
                        onChange={(e) => setData(prev => ({ ...prev, ["location"]: e.target.value }))}
                        className="form-control"
                      />
                    </div>
                  </form>
                  <div className={`ms-auto ${data?.height < data?.width && 'mt-4'}`}>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger me-4 fs-6 px-3"
                      onClick={handleDelete}
                      disabled={isDeleting || isUpdating}
                    >
                      Delete Post
                    </button>
                    <button
                      type="submit"
                      className="btn btn-sm  btn-dark fs-6 px-3"
                      onClick={handleSubmit}
                      disabled={isDeleting || isUpdating}
                    >
                      Update post
                    </button>
                  </div>
                </div>
              </div>

              <button type="button" className="btn-close d-inline position-absolute top-0 left-0 end-0 me-4 mt-4" aria-label="Close" onClick={() => setModalOpen(null)}></button>

            </div>
          </div>
        </div>
      }
    </>
  );
}

export default EditModal;
