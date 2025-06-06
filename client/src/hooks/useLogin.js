import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
const baseUrl = process.env.REACT_APP_BACKEND_URI;

export const useLogin = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext();

    const login = async function (email, password, role) {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${baseUrl}/api/user/login`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        })
        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.message);
            throw new Error(json.message);
        }

        // console.log(json, "useLogin22");
        localStorage.setItem('user', JSON.stringify(json.data))

        // update authContext
        dispatch({ type: 'LOGIN', payload: json.data })

        setIsLoading(false);
        return true;
    }

    return { login, isLoading, error }
}
