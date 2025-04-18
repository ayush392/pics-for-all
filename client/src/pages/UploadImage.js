import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
const baseUrl = process.env.REACT_APP_BACKEND_URI

function UploadImage() {
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [previewURL, setPreviewURL] = useState(null);


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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (["image/jpg", "image/jpeg", "image/png", "image/webp"].includes(file.type) === false) {
        // toast.error("Please select a valid image file (jpg, jpeg, png)");
        alert(file.type)
        return;
      }
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

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
          <div className='w-100'>
            {/* <img src={data?.image?.thumbnail} alt="imgPreview" className="d-block ms-auto me-auto rounded img-fluid" /> */}
            <div className="d-flex flex-column align-items-center mt-4">
              <label
                htmlFor="fileInput"
                className="upload-box border border-secondary rounded d-flex justify-content-center align-items-center overflow-hidden"
                style={{
                  width: '150px',
                  height: '150px',
                  cursor: 'pointer',
                  backgroundColor: '#f8f9fa',
                  position: 'relative',
                }}
              >
                {previewURL ? (
                  <img
                    src={previewURL}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    fill="currentColor"
                    className="text-secondary"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                )}
              </label>

              <input
                type="file"
                id="fileInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />

              {/* {fileName && <small className="mt-2 text-muted">{fileName}</small>} */}
            </div>
          </div>
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
