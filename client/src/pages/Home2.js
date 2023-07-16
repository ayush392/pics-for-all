import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EditModal from '../components/EditModal'
import Gallery from '../components/Gallery';
import { useAuthContext } from '../hooks/useAuthContext'

function Home2() {
    const [test, setTest] = useState([]);
    const navigate = useNavigate();

    const { user } = useAuthContext();

    useEffect(() => {

        fetch('/api/posts', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
            .then(res => res.json())
            .then(response => {
                setTest(response)
                // console.log(response)
            })
            .catch(e => console.log(e.message))


    }, []);

    function renderEditModel(e) {
        console.log(e);
    }

    return (
        <div>
            <Navbar />
            {console.log(test)}
            {test && <Gallery data={test} />}
            {/* {
                test.map((d, i) => {
                    return <div key={i} className="container">
                        <h2>{d.user.username}</h2>
                        <img src={`${d.imageUrl}`} alt="fks" width="120px" />
                        <button onClick={() => navigate('/edit', {
                            state: {
                                id: d._id,
                                description: d.description,
                                tags: d.tags,
                                location: d.location
                            }
                        })}>
                            edit
                        </button>
                         <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editModal">
                            edit
                        </button> 
                        <br />
                    </div>
                })
            }  */}

        </div>
    )
}

export default Home2