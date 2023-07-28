import React, { useState } from 'react'
import { useSignup } from '../hooks/useSignup';
import './css/styles.css'
import { useNavigate } from 'react-router-dom'

function Signup() {
    const [fName, setFName] = useState('');
    const [lName, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { signup, error, isLoading } = useSignup();
    const navigate = useNavigate();


    const handleSubmit = async function (e) {
        e.preventDefault();
        // console.log(email, password)
        try {
            await signup(fName, lName, email, username, password);
            navigate('/', { replace: true })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="box">
                <div className="flex-container">
                    <h2>Join PicsForAll</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <div>
                                <label className="form-label">First name</label>
                                <input
                                    type='text'
                                    onChange={e => setFName(e.target.value)}
                                    value={fName}
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label className="form-label">Last name</label>
                                <input
                                    type='text'
                                    onChange={e => setLName(e.target.value)}
                                    value={lName}
                                    className="form-control"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Email</label>
                            <input
                                type='email'
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                                className="form-control"
                            />
                        </div>
                        <div>
                            <label className="form-label">Username</label>
                            <input
                                type='text'
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                            />
                        </div>

                        <button className="btn btn-primary" type="submit" disabled={isLoading}>Sign up</button>

                        {error && <div className='error'>{error}</div>}
                    </form>

                    <p className="dark">Already have an account? <a href='/login'>Login</a></p>

                </div>
            </div>
        </>
    )
}

export default Signup