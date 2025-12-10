import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

//Ikony zobrane z https://heroicons.com/
function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate("/Profile");
        } catch (e) {
            setError("Invalid email or password.");
        }
    };

    const handleMouseDown = () => {
        setShowPassword(true);
    };

    const handleMouseUp = () => {
        setShowPassword(false);
    };

    const togglePasswordType = showPassword ? 'text' : 'password';

    const icon = showPassword ? 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
    : 
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>;

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {error && (
                    <p className="text-red-600 text-center mb-4 font-medium">
                    {error}
                    </p>
                )}
                <form className="space-y-12" onSubmit={handleSubmit}>
                    <div className="border-b border-gray-900/10 pb-12">
                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4 mx-auto"> 
                                <label htmlFor="email" className="label">Email</label>
                                    <div className="mt-2">
                                        <div className="input-container">
                                            <input value={email} 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                id="email"
                                                type="email" 
                                                name="email" 
                                                placeholder="Your email" 
                                                className="input-field" 
                                                required
                                            />
                                        </div>
                                    </div>
                            </div>
                            <div className="sm:col-span-4 mx-auto"> 
                                <label htmlFor="password" className="label">Password</label>
                                    <div className="mt-2">
                                        <div className="relative flex input-container">
                                            <input value={password} 
                                                onChange={(e) => setPassword(e.target.value)}
                                                id="password" 
                                                type={togglePasswordType} 
                                                name="password" 
                                                placeholder="Your password" 
                                                className="input-field" 
                                                required
                                            />
                                            <button type="button" 
                                                onMouseDown={handleMouseDown} 
                                                onMouseUp={handleMouseUp} 
                                                onTouchStart={handleMouseDown} 
                                                onTouchEnd={handleMouseUp} 
                                                className="password-show-element" 
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                                {icon} 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center sm:justify-end gap-x-6"> 
                            <button type="submit" 
                            className="my-button">Login</button>
                        </div>
                    </div>
                </form>
                <a href="/Register"
                    className="font-semibold text-indigo-400 hover:text-indigo-300">Don't have an account yet?
                </a>
            </div>
        </div>
    )
}

export default Login