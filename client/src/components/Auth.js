import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const Auth = () => {
    // eslint-disable-next-line
    const [cookies, setCookie, removeCookies] = useCookies(null);

    const [error, setError] = useState(null);
    const [isLogin, setIsLogin] = useState(true);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const viewLogin = (status) => {
        setError(null);
        setIsLogin(status);
    };

    useEffect(() => {}, [error]);
    const handleSubmit = async (e, endpoint) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords dont match');
            return;
        }
        const response = await fetch(
            `${process.env.REACT_APP_SERVER_URL}/${endpoint}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            }
        );
        const data = await response.json();

        if (data.detail) {
            setError(data.detail);
        } else {
            setCookie('email', data.email);
            setCookie('token', data.token);

            window.location.reload();
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-container-box">
                <form
                    onSubmit={(e) =>
                        handleSubmit(e, isLogin ? 'login' : 'signup')
                    }>
                    <h2>{isLogin ? 'Log In' : 'Sign Up'}</h2>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin && (
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            required
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    )}
                    <input
                        type="submit"
                        value={'SUBMIT'}
                        className="create"
                        style={{ cursor: 'pointer' }}
                    />
                    {error && <p>{error}</p>}
                </form>
                <div className="auth-options">
                    <button
                        onClick={() => viewLogin(false)}
                        style={{
                            backgroundColor: !isLogin
                                ? 'rgb(255,255,255)'
                                : 'rgb(188,188,188)',
                        }}>
                        Sign Up
                    </button>
                    <button
                        onClick={() => viewLogin(true)}
                        style={{
                            backgroundColor: !isLogin
                                ? 'rgb(188,188,188)'
                                : 'rgb(255,255,255)',
                        }}>
                        Log In
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
