import React from 'react'

function Plus() {
    function handlePayment() {
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
    }

    return (
        <>
            <div className='container'>
                <h1>Plus membership</h1>
                <button className='btn btn-success' onClick={handlePayment}>Buy Now</button>
            </div>
        </>
    )
}

export default Plus