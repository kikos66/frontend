import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
        const [password, setPassword] = useState('');
    
        const handleMouseDown = () => {
            setShowPassword(true);
        };
    
        const handleMouseUp = () => {
            setShowPassword(false);
        };

        const [formData, setFormData] = useState({
            username: '',
            email: '',
            password: ''
        });
        
        const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        };

        const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                formData,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            console.log(response.data); // User registered successfully
            if (response.status === 201) {
                navigate('/login');
            } else {
                navigate('/register');
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
        }
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
            <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div class="sm:mx-auto sm:w-full sm:max-w-sm">
                    <form class="space-y-12" onSubmit={handleSubmit}>
                        <div class="border-b border-gray-900/10 pb-12">
                            <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div class="sm:col-span-4 mx-auto"> <label for="email" class="label">Email</label> <div class="mt-2">
                                        <div class="input-container">
                                            <input onChange={handleChange} value={formData.email} id="email" type="email" name="email" placeholder="Your email" class="input-field" required/>
                                        </div>
                                    </div>
                                </div>
                                <div class="sm:col-span-4 mx-auto"> <label for="username" class="label">Username</label> <div class="mt-2">
                                        <div class="input-container">
                                            <input onChange={handleChange} value={formData.username} id="username" type="text" name="username" placeholder="Your username" class="input-field" required/>
                                        </div>
                                    </div>
                                </div>
                                <div class="sm:col-span-4 mx-auto"> <label for="password" class="label">Password</label> <div class="mt-2">
                                        <div class="relative flex input-container">
                                            <input value={formData.password} onChange={handleChange} id="password" type={togglePasswordType} name="password" placeholder="Your password" class="input-field" required/>
                                            <button type="button" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onTouchStart={handleMouseDown} onTouchEnd={handleMouseUp} className="absolute right-0 h-full px-3 text-lg text-gray-500 hover:text-gray-800 transition duration-150 focus:outline-none" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                                {icon} 
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-6 flex items-center justify-center sm:justify-end gap-x-6"> 
                                <button type="submit" class="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Register</button>
                            </div>
                        </div>
                    </form>
                    <a href="/Login" className="font-semibold text-indigo-400 hover:text-indigo-300">Already have an account?</a>
                </div>
            </div>
        )
}

export default Register;