import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import EditModal from '../components/EditModal'

function Home2() {
    const [test, setTest] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(response => {
                setTest(response)
                // console.log(test)
            })
            .catch(e => console.log(e.message))

    }, []);

    function renderEditModel(e) {
        console.log(e);
    }

    return (
        <div>
            <Navbar />
            {
                test.map(d => {
                    return <div className="container">
                        <h3>{d.location}</h3>
                        <img src={`${d.imageUrl}`} alt="fks" />
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
                        {/* <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editModal">
                            edit
                        </button> */}
                        <br />
                    </div>
                })
            }
        </div>
    )
}

export default Home2