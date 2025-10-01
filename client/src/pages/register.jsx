import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/v1/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: user.username,
                    email: user.email,
                    password: user.password
                })
            });

            const data = await res.json();
            if (res.ok) {
                navigate('/login');
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen p-4'>
            <div className='w-full max-w-md p-8 bg-white shadow-xl rounded-2xl'>
                <h1 className='text-4xl font-bold text-center text-gray-800'>Register</h1>
                <p className='text-center text-gray-600 mt-2'>Create a new account!</p>
                <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
                    <input
                        type='text'
                        placeholder='Username'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='username'
                        value={user.username}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='email'
                        placeholder='Email'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='email'
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Password'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='password'
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type='password'
                        placeholder='Confirm Password'
                        className='w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow'
                        name='confirmPassword'
                        value={user.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type='submit'
                        className='p-3 w-full bg-blue-500 text-white font-semibold text-lg rounded-lg hover:bg-blue-600 transition-colors shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed'
                        disabled={isLoading}
                    >
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                    <div className='text-center mt-2'>
                        <p className='text-gray-600 text-sm'>
                            Already have an account?{' '}
                            <Link to='/login' className='text-blue-500 hover:underline'>
                                Click here
                            </Link>
                        </p>
                    </div>
                </form>

                {error && (
                    <div className='mt-4 p-3 w-full bg-red-100 border border-red-400 text-red-700 rounded-md text-center'>
                        <p>{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
