import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function EditModal() {
  const { state } = useLocation();
  const [description, setDescription] = useState(state?.description);
  const [tags, setTags] = useState(state?.tags);
  const [location, setLocation] = useState(state?.location);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthContext();
  const id = state?.id;
  const imageUrl = state?.url;
  const navigate = useNavigate();
  // console.log(id);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsUpdating(true);
    if (!user) {
      alert("Please Login");
      setIsUpdating(false);
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/api/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ description, tags, location }),
      });
      // const json = await response.json();
      // console.log(response);
      if (response.ok) {
        alert("Post updated successfully");
        navigate(-1);
      }
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
      const response = await fetch(`${baseUrl}/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();
      console.log(json);
      if (json) {
        alert("Post deleted successfully");
        navigate(-1);
      }
    } catch (error) {
      setIsDeleting(false);
      alert(error.message);
      console.log(error);
    }
  }

  return (
    <>
      {(!state || !user) && navigate("/error")}
      <div className="container vh-100">
        <h1 className=" py-3 py-md-4 ">Edit post</h1>
        <div className="d-md-flex" style={{ minHeight: "85%" }}>
          <div className="w-100 me-md-4 me-lg-5  ">
            <img src={imageUrl} alt="imgPreview" className="d-block w-100" />
          </div>
          <div className="w-100 mt-4 mt-md-0 ms-md-4 ms-lg-5 ">
            <form>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control"
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Tags</label>
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  type="text"
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="form-control"
                />
              </div>
            </form>
            <div className="mt-3 pt-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-danger me-2 fs-6 px-3"
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
      </div>
    </>
  );
}

export default EditModal;
