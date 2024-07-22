import { useState, useRef } from 'react';
import { IoPerson, IoLockClosed, IoCloseCircleSharp, IoWarningOutline, IoCloseSharp } from "react-icons/io5";
import { GiSwordsEmblem } from "react-icons/gi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [values, setValues] = useState({
        username: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        password: ''
    });

    const [toastType, setToastType] = useState();
    const [isVisible, setIsVisible] = useState();
    const timeoutRef = useRef(null);
    const { toggleLoggedIn } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const newValues = { ...values, [e.target.name]: e.target.value };
        setValues(newValues);
    }

    const handleValidation = () => {
        let newErrors = {};
        const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;

        if (!usernameRegex.test(values.username)) {
            newErrors.username = 'Usernames must be between 5 and 16 characters and contains only alphanumeric characters.'
        }
        else {
            newErrors.username = '';
        }
        if (!passwordRegex.test(values.password)) {
            newErrors.password = 'Passwords must contain one letter (uppercase or lowercase), a number,  one special character from the set @$!%*?& and be between 6 and 16 characters.'
        }
        else {
            newErrors.password = '';
        }
        newErrors = { ...errors, ...newErrors };
        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    }

    const handleToast = (boolean) => {
        setIsVisible(boolean);
        const progressBar = document.querySelector('.progressBar');

        if (boolean === true) {

            timeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, 2000);
            setTimeout(() => {
                progressBar.classList.add('active');
            }, 0);
        }

        else {
            clearTimeout(timeoutRef.current);
            progressBar.classList.remove('active');
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            fetch('https://videogamecollectionwebapp.vercel.app/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then(response => {
                if (response.status === 201) {
                    return (response.json()).then(data => {
                        navigate("/collection");
                        toggleLoggedIn(true);
                        const token = data.token;
                        localStorage.setItem('access', token);
                    });
                }
                else if (response.status === 401) {
                    return (response.json()).then(data => {
                        setToastType('warning');
                        handleToast(true);
                    });
                }
            })
                .catch((error) => {
                    console.error('Error:', error);
                    setToastType('failure');
                    handleToast(true);
                });
        }
    }
    return (
        <div className='card login'>
            <div className='wrapper'>
                <div className={`toast ${isVisible === undefined ? '' : isVisible ? 'show' : 'hide'} ${toastType}`}>

                    {toastType === 'warning' ? (
                        <IoWarningOutline size={15} className='icon warning' />
                    ) : (
                        <IoCloseCircleSharp size={15} className='icon failure' />
                    )}
                    <div className='message'>
                        {toastType === 'warning' && (
                            <>
                                <p aria-label="warning-title"> <b>Warning!</b></p>
                                <p aria-label="warning-message"> Incorrect username or password. Please try again.</p>
                            </>
                        )}
                        {toastType === 'failure' && (
                            <>
                                <p aria-label="failure-title"><b>Failure!</b></p>
                                <p aria-label="failure-message"> Server error. </p>
                            </>
                        )}

                    </div>
                    <IoCloseSharp className='close' aria-label='closeToast' onClick={() => handleToast()} />
                    <div className={`progressBar ${isVisible ? 'active' : 'inactive'} ${toastType}`}>
                    </div>
                </div>


            </div>

            <div className='headings'>
                <h1 className='header'>Welcome back </h1>
                <h2 className='header'> Continue your adventure. </h2>
                <GiSwordsEmblem size={30} />
            </div>
            <form onSubmit={handleSubmit} action='/login' method='POST'>
                <div className='inputs'>
                    <div className='input'>
                        <IoPerson className='inputImg' />
                        <input
                            name='username'
                            id='username'
                            type='text'
                            placeholder='Username'
                            onChange={handleChange}
                            required>
                        </input>
                    </div>
                    {errors.username && <p className='registerError' aria-describedby='usernameError' role='alert'> {errors.username} </p>}

                    <div className='input'>
                        <IoLockClosed className='inputImg' />
                        <input
                            name='password'
                            id='password'
                            type='password'
                            placeholder='Password'
                            onChange={handleChange}
                            required>
                        </input>
                    </div>
                    {errors.password && <p className='registerError' aria-describedby='passwordError' role='alert'> {errors.password} </p>}

                    <button className='form-button'
                        type='submit'
                    >
                        <b>                         Login
                        </b>
                    </button>

                </div>
            </form>
        </div>
    );
}

export default Login;