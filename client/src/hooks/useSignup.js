import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
const baseUrl = (process.env.NODE_ENV === 'development') ? 'http://localhost:4000' : 'https://picsforall-backend.onrender.com';

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext();

    const signup = async function (fName, lName, email, username, password) {
        setIsLoading(true);
        setError(null);
        if(!fName || !lName || !email || !username || !password) {
            setIsLoading(false);
            setError("Please fill all the fields")
            return
        }
        if (password.length < 6) {
            setIsLoading(false);
            setError("Password must be at least 6 characters long")
            return
        }
        if (username.length < 6) {
            setIsLoading(false);
            setError("Username must be at least 6 characters long")
            return
        }
        if (!username.match(/^[a-zA-Z0-9]+$/)) {
            setIsLoading(false);
            setError("Username must be alphanumeric")
            return
        }
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            setIsLoading(false);
            setError("Please enter a valid email address")
            return
        }
        if (!fName.match(/^[a-zA-Z]+$/)) {
            setIsLoading(false);
            setError("First name must be alphabetic")
            return
        }
        if (!lName.match(/^[a-zA-Z]+$/)) {
            setIsLoading(false);
            setError("Last name must be alphabetic")
            return
        }

        const response = await fetch(`${baseUrl}/api/user/signup`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ fName, lName, email, username, password })
        })

        const json = await response.json();
        // console.log(json);

        if (!response.ok) {
            setIsLoading(false);
            setError(json.message);
            throw Error(json.message);
        }

        if (response.ok) {
            //save user to local storage
            localStorage.setItem('user', JSON.stringify(json.data))

            // update authContext
            dispatch({ type: 'LOGIN', payload: json.data })

            setIsLoading(false);
            return true;
        }
    }

    return { signup, isLoading, error }
}
