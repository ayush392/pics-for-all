import { useState } from 'react'
import { useLogin } from '../hooks/useLogin';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async function (e) {
        e.preventDefault();
        try {
            await login(email, password)
            navigate(-1, { replace: true })
        } catch (error) {
            console.log(error);
        }
    }

    return (

        <form className='login' onSubmit={handleSubmit}>
            <h3>Login</h3>

            <label>Email:</label>
            <input
                type='email'
                onChange={e => setEmail(e.target.value)}
                value={email}
            />

            <label>Password:</label>
            <input
                type='password'
                onChange={e => setPassword(e.target.value)}
                value={password}
            />

            <button className='btn btn-dark' disabled={isLoading}>Login</button>

            {error && <div className='error'>{error}</div>}
            <p className="dark">Don't have an account? <a href='/signup'>Sign Up</a></p>

        </form>
    )
}

export default Login