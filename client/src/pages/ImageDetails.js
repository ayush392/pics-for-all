import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { saveAs } from 'file-saver'
// import Error from './Error';
import { clientKey } from '../ApiKey/keys';


function ImageDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const url = `https://api.unsplash.com/photos/${id}?client_id=${clientKey}`;
    const [imgDetail, setImgDetail] = useState([]);
    const [isLike, setLike] = useState(false);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(response => setImgDetail(response))
            .catch(e => console.log(e));
    }, [id, url]);


    const downloadImage = (e) => {
        // console.log(e.target.value);
        saveAs(e.target.value, e.target.name);
    }

    function toggleLike() {
        setLike(!isLike);
    }


    return (
        <>
            {console.log(imgDetail)}
            {imgDetail.user &&
                <div className='flex-container'>
                    <div className='profile' onClick={() => navigate(`../user/${imgDetail.user.username}`)}>
                        <img className='profile-img' src={imgDetail.user.profile_image.small} alt='user' />
                        <span className='profile-name' >{imgDetail.user.name}</span>
                    </div>

                    <div>
                        <button className={isLike === false ? 'btn btn-outline-secondary me-2' : 'btn btn-outline-danger me-2'} onClick={toggleLike} > ❤ </button>
                        <button type="button" className="btn btn-success dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            Download free
                        </button>
                        <ul className="dropdown-menu">
                            <li><button className="dropdown-item" name={imgDetail.user.name + '-' + imgDetail.id + '.jpg'} value={imgDetail.urls.thumb} onClick={downloadImage}>Small</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.name + '-' + imgDetail.id + '.jpg'} value={imgDetail.urls.small} onClick={downloadImage}>Medium</button></li>
                            <li><button className="dropdown-item" name={imgDetail.user.name + '-' + imgDetail.id + '.jpg'} value={imgDetail.urls.regular} onClick={downloadImage}>Large</button></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li><button className="dropdown-item" name={imgDetail.user.name + '-' + imgDetail.id + '.jpg'} value={imgDetail.urls.full} onClick={downloadImage}>Original Size</button></li>
                        </ul>
                    </div>
                </div>
            }

            {imgDetail.urls && <img className='img-det' src={imgDetail.urls.regular} alt='xyz'/>}



            {imgDetail &&
                <div className='flex-container'>
                    <div>
                        <span className='pe-5'>Views: {imgDetail.views}</span>
                        <span>Downloads: {imgDetail.downloads}</span>
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
                <h4>{imgDetail.alt_description}</h4>
                {imgDetail.description && <p>{imgDetail.description}</p>}

                {imgDetail.location && imgDetail.location.name && <p>📍 {imgDetail.location.name}</p>}
                {imgDetail.created_at && <p>📅 Published on {imgDetail.created_at}</p>}
                {imgDetail.exif && imgDetail.exif.name && <p>📷 {imgDetail.exif.name}</p>}
                <p>🛡 Free to use under the PicsForAll License</p>
            </div>

            {imgDetail.tags &&
                <div className='m-1 p-3 pt-0'>
                    {(imgDetail.tags).map((x, index) => <span className='tags' key={index}>{
                        x.type !== 'landing_page' ?
                            x.title.charAt(0).toUpperCase() + x.title.slice(1)
                            : x.source.title
                    }
                    </span>)}
                </div>
            }


            <br />
        </>
    )
}

export default ImageDetails