import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import validation from './LoginValidation';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const LoginSignup = () => {
    const [action, setAction] = useState("Login");
    const [values, setValues] = useState({ Username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [clickTimeout, setClickTimeout] = useState(null);
    const navigate = useNavigate();

    const handleValidation = () => {
        setErrors(validation(values));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        handleValidation();

        if (Object.keys(errors).length === 0) {
            const endpoint = action === "Login" ? "/login" : "/signup";
            const userData = {
                email: values.email,
                password: values.password,
            };

            if (action === "Sign Up") {
                userData.name = values.Username;
            }

            try {
                const response = await fetch(`http://localhost:3000${endpoint}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userData),
                });

                const data = await response.json();

                if (data.success) {
                    // Store the token in localStorage or state
                    localStorage.setItem('token', data.data.token);

                    // Navigate to the UserInfo page
                    navigate('/userinfo');
                } else {
                    // Handle errors (e.g., display a message to the user)
                    setErrors({ form: data.message });
                }
            } catch (error) {
                setErrors({ form: 'An error occurred. Please try again.' });
            }
        }
    };

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const handleClick = (buttonAction) => {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
            setClickTimeout(null);
            if (buttonAction === "Login") {
                handleValidation();
                navigate('/userinfo'); // Navigate to the UserInfo page on double-click
            }
        } else {
            setClickTimeout(setTimeout(() => {
                setAction(buttonAction);
                setClickTimeout(null);
            }, 300));
        }
    };

    return (
        <div className='Container'>
            <div className='header'>
                <div className='text'>{action}</div>
                <div className='underline'></div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='inputs'>
                    {action === "Login" ? null :
                        <div className='input'>
                            <img src={user_icon} alt='User Icon' />
                            <input type='text' placeholder='Username' name="Username" onChange={handleInput} />
                            {errors.Username && <span className='text-danger'>{errors.Username}</span>}
                        </div>
                    }
                    <div className='input'>
                        <img src={email_icon} alt='Email Icon' />
                        <input type='email' placeholder='Email' name="email" onChange={handleInput} />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className='input'>
                        <img src={password_icon} alt='Password Icon' />
                        <input type='password' placeholder='Password' name="password" onChange={handleInput} />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                </div>
                {errors.form && <span className='text-danger'>{errors.form}</span>}
                <div className='forgot-password'>Lost Password? <span>Click Here</span></div>
                <div className='submit-container'>
                    <button
                        type="submit"
                        className={action === "Login" ? "submit gray" : "submit"}
                        onClick={() => handleClick("Sign Up")}
                    >
                        Sign Up
                    </button>
                    <button
                        type="submit"
                        className={action === "Sign Up" ? "submit gray" : "submit"}
                        onClick={() => handleClick("Login")}
                    >
                        Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginSignup;
