import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FileDownload from 'js-file-download';
// import Error from './Error';
import { useAuthContext } from '../hooks/useAuthContext';


function ImageDetails() {
    const { state } = useLocation();
    const [isLike, setIsLike] = useState(state ? state.isLike : false);
    const { id } = useParams();
    const navigate = useNavigate();
    const url = `https://picsforall-backend.onrender.com/api/posts/photos/${id}`;
    const [imgDetail, setImgDetail] = useState([]);
    const { user } = useAuthContext();
    const avatarUrl = "https://png.pngtree.com/png-clipart/20210520/ourmid/pngtree-small-eye-handsome-boys-colorless-character-avatar-png-image_3286527.jpg"

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(response => setImgDetail(response))
            .catch(e => console.log(e));
    }, [url, user]);


    function downloadImage(id, filename) {
        fetch(`https://picsforall-backend.onrender.com/api/posts/download/${id}`)
            .then(res => res.blob())
            .then(response => {
                FileDownload(response, filename);
            })
            .catch(e => console.log(e));
    }

    function likePost(postId, username) {
        if (!user) {
            navigate('/login');
            return
        }
        fetch('https://picsforall-backend.onrender.com/api/posts/like', {
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
                setIsLike(true);
            })
            .catch(e => console.log(e.message))
    }
    function unlikePost(postId, username) {
        if (!user) {
            navigate('/login');
            return
        }
        fetch('https://picsforall-backend.onrender.com/api/posts/unlike', {
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
                setIsLike(false);
            })
            .catch(e => console.log(e.message))
    }

    return (
        <>
            {console.log(imgDetail, 80)}
            {/* {setIsLike(imgDetail.liked_by.includes(user.username))} */}
            {imgDetail.user &&
                <div className='flex-container'>
                    <div className='profile' onClick={() => navigate(`../user/${imgDetail.user.username}`)}>
                        <img width="50px" className='profile-img' src={avatarUrl} alt='user' />
                        <span className='profile-name' >{imgDetail.user.fName + " " + imgDetail.user.lName}</span>
                    </div>

                    <div>
                        {
                            (user && isLike) ?
                                <button className='btn btn-outline-danger me-2' onClick={() => user ? unlikePost(imgDetail._id, user.username) : navigate('/login')} > ❤ </button>
                                :
                                <button className='btn btn-outline-secondary me-2' onClick={() => user ? likePost(imgDetail._id, user.username) : navigate('/login')} > ❤ </button>
                        }
                        <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Download free
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" onClick={() => downloadImage(imgDetail._id, imgDetail.user.fName + '-' + imgDetail._id + '.jpg')}>Small</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} >Medium</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} >Large</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" name={imgDetail.user.fName + '-' + imgDetail._id + '.jpg'} value={imgDetail.image} >Original Size</button></li>
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
                {imgDetail.description && <h4>{imgDetail.description}</h4>}
                {imgDetail.location && <p>📍 {imgDetail.location}</p>}
                {imgDetail.date && <p>📅 Published on {new Date(imgDetail.date).toLocaleDateString()}</p>}
                <p>🛡 Free to use under the PicsForAll License</p>
            </div>

            {imgDetail.tags &&
                <div className='m-1 p-3 pt-0'>
                    {imgDetail.tags.map((x, i) => {
                        return <span className="tags" key={i}>{x}</span>
                    })}
                </div>
            }
            <br />
        </>
    )
}

export default ImageDetails