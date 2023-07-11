import React from 'react'
import { useAuthContext } from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';


function Plus() {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    function handlePayment() {
        // if (!user) {
        // navigate("/login", { replace: true })
        // <LoginModal/>
        // }
        // else {
        fetch('/checkout-session', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ id: 1, quantity: 1 })
        })
            .then(res => {
                if (res.ok)
                    return res.json();
                return res.json().then(json => Promise.reject(json))
            })
            .then(({ url }) => window.location.href = url)
            .catch(e => console.log(e));
        // }
    }

    return (
        <>
            <div className='container'>
                <h1>Plus membership</h1>
                {
                    user ?
                        <button className='btn btn-success' onClick={handlePayment}>Buy Now</button>
                        :
                        <>
                            <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                Launch demo modal
                            </button>
                            <LoginModal doNextTask={handlePayment} />
                        </>
                }
            </div>

            <br /><br /><br />

        </>
    )
}

export default Plus