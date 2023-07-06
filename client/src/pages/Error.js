import React from 'react'
import { Link } from 'react-router-dom'

function Error() {
    return (
        <>
            <h1>ERROR 404</h1>
            <h3>Page not found</h3>
            <button>
                <Link to={'/'} > Go Home </Link>
            </button>
        </>

    )
}

export default Error