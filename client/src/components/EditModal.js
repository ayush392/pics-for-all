import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

function EditModal() {
    const { state } = useLocation();
    console.log(state);
    const [description, setDescription] = useState(state.description);
    const [tags, setTags] = useState(state.tags);
    const [location, setLocation] = useState(state.location);
    const id = state.id;
    const navigate = useNavigate();
    console.log(id);

    async function handleSubmit(e) {
        e.preventDefault();
        const response = await fetch(`/api/posts/${id}`, {
            method: 'PATCH',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ description, tags, location })
        })
        const json = await response.json();
        console.log(response);
        if (response.ok)
            navigate(-1);
    }

    async function handleDelete() {
        if (window.confirm("Do you want to delete this image?") == false) {
            return;
        }
        const response = await fetch(`/api/posts/${id}`, {
            method: 'DELETE',
        })
        const json = await response.json();
        console.log(json)
        if (json)
            navigate(-1);
    }

    return (
        <>
            <h1>Edit post</h1>
            <form>
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
            </form>
            <button type="button" className='btn btn-outline-danger me10' onClick={handleDelete}>Delete</button>
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
        </>
    )
}

export default EditModal