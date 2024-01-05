import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:4000"
    : "https://picsforall-backend.onrender.com";

function UploadImage() {
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsUploading(true);
    if (!user) {
      navigate("/login");
      return;
    }

    if (!description || !tags || !image) {
      alert("All fields must be filled");
      setIsUploading(false);
      return;
    }

    let formData = new FormData();
    formData.append("username", user.username);
    formData.append("description", description);
    formData.append("tags", tags);
    formData.append("location", location);
    formData.append("image", image);
    formData.append("height", imgDimensions.height);
    formData.append("width", imgDimensions.width);
    try {
      const response = await fetch(`${baseUrl}/api/posts`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();
      if (!response.ok) {
        setIsUploading(false);
        throw new Error("Something went wrong. Please try again Later");
      } else {
        setIsUploading(false);
        alert("Image uploaded successfully");
        navigate(-1, { replace: true });
      }
      // (json) ? navigate(-1) : alert('Something went wrong. Please try again')
    } catch (error) {
      alert(error.message);
    }
  }

  async function validateAndSetDimensions(file, e) {
    const allowedFileTypes = [
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];
    try {
      if (!allowedFileTypes.includes(file.type)) {
        setImage("");
        e.target.value = "";
        throw new Error("File type not supported");
      }
      let img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();
      setImgDimensions({ width: img.width, height: img.height });
    } catch (error) {
      alert(error.message);
    }
    console.log(file);
  }

  return (
    <>
      <div className="container">
        <h1 className="m-4 text-center">Submit a photo</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Upload an image</label>
            <input
              className="form-control"
              type="file"
              onChange={async (e) => {
                setImage(e.target.files[0]);
                await validateAndSetDimensions(e.target.files[0], e);
                // setImgDimensions({ width, height });
              }}
            />
            <label className=" form-text text-secondary">
              Allowed file formats are .jpg, .jpeg, .png, .gif, .webp
            </label>
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control"
              rows="3"
              placeholder="Short description of an image"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">
              Tags
              <small className="text-secondary"> (separated by comma)</small>
            </label>
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
          <div className="mb-3 mt-4">
            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={isUploading}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UploadImage;
