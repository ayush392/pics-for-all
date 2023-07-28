import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../hooks/useAuthContext';

function UploadImage() {
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [location, setLocation] = useState('');

  const { user } = useAuthContext();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return
    }

    let formData = new FormData();
    formData.append('username', user.username);
    formData.append('description', description);
    formData.append('tags', tags);
    formData.append('location', location);
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:4000/api/posts', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
      })
      const json = await response.json();
      console.log(json);
      if (json)
        navigate(-1);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="container m-10">
        <h1>Submit a photo</h1>
        <br />
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="mb-3">
            <label className="form-label">Default file input example</label>
            <input
              className="form-control"
              onChange={e => setImage(e.target.files[0])}
              type="file"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Tags</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Location</label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
    </>
  )
}

export default UploadImage