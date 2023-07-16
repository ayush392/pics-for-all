import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveAs } from 'file-saver'
// import Error from './Error';
import { useAuthContext } from '../hooks/useAuthContext';


function ImageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const url = `/api/posts/photos/${id}`;
    const [imgDetail, setImgDetail] = useState([]);
    const [isLike, setLike] = useState(false);
    const { user } = useAuthContext();
    const avatarUrl = "https://png.pngtree.com/png-clipart/20210520/ourmid/pngtree-small-eye-handsome-boys-colorless-character-avatar-png-image_3286527.jpg"

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(response => setImgDetail(response))
            .catch(e => console.log(e));
    }, [url, user]);


    const downloadImage = (e) => {
        // console.log(e.target.value);
        saveAs(e.target.value, e.target.name);
    }

    function likePost(postId, username) {
        if (!user) {
            navigate('/login');
            return
        }
        fetch('/api/posts/like', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ postId, username })
        })
            .then(res => res.json())
            .then(response => {
                console.log(response)
            })
            .catch(e => console.log(e.message))
        // setLike(!isLike);
    }
    function unlikePost(postId, username) {
        if (!user) {
            navigate('/login');
            return
        }
        fetch('/api/posts/unlike', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ postId, username })
        })
            .then(res => res.json())
            .then(response => {
                console.log(response)
            })
            .catch(e => console.log(e.message))
        // setLike(!isLike);
    }

    return (
        <>
            {console.log(imgDetail)}
            {imgDetail.user &&
                <div className='flex-container'>
                    <div className='profile' onClick={() => navigate(`../user/${imgDetail.user.username}`)}>
                        <img width="50px" className='profile-img' src={avatarUrl} alt='user' />
                        <span className='profile-name' >{imgDetail.user.fName + " " + imgDetail.user.lName}</span>
                    </div>

                    <div>
                        <button className='btn btn-outline-secondary me-2' onClick={() => likePost(imgDetail._id, imgDetail.user.username)} > ❤ </button>
                        <button className='btn btn-outline-danger me-2' onClick={() => unlikePost(imgDetail._id, imgDetail.user.username)} > ❤ </button>
                        <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Download free
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} onClick={downloadImage}>Small</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} onClick={downloadImage}>Medium</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} onClick={downloadImage}>Large</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} onClick={downloadImage}>Original Size</button></li>
                        </ul>
                    </div>
                </div>
            }

            <img className='img-det' src={imgDetail?.image} alt='xyz' />

            {imgDetail &&
                <div className='flex-container'>
                    <div>
                        <span className='pe-5'>Views: {imgDetail?.views}</span>
                        <span>Downloads: {imgDetail?.downloads}</span>
                    </div>

                    <div>
                        <button className='btn me-2 btn-outline-secondary' onClick={() => {
                            navigator.clipboard.writeText(`${window.location.href}`);
                            alert('Link copied to clipboard');
                        }}>➦ Share</button>

                        <button className="btn me-2 btn-outline-secondary">ℹ Info</button>
                    </div>
                </div>
            }

            <div className='m-1 ps-3 pe-3'>
                <h4>{imgDetail.description}</h4>
                {imgDetail.description && <p>{imgDetail.description}</p>}

                {imgDetail?.location && <p>📍 {imgDetail.location}</p>}
                <p>📅 Published on {Date.now()}</p>
                {/* {imgDetail.exif && imgDetail.exif.name && <p>📷 {imgDetail.exif.name}</p>} */}
                <p>🛡 Free to use under the PicsForAll License</p>
            </div>

            {/* {imgDetail.tags &&
                <div className='m-1 p-3 pt-0'>
                    {(imgDetail.tags.split()).map((x, index) => <span className='tags' key={index}>{
                        x.type !== 'landing_page' ?
                            x.title.charAt(0).toUpperCase() + x.title.slice(1)
                            : x.source.title
                    }
                    </span>)}
                </div>
            } */}
            <h6>{imgDetail?.tags}</h6>

            <br />
        </>
    )
}

export default ImageDetails