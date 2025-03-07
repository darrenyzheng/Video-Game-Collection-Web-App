import { useState, useRef } from 'react';
import { IoPerson, IoLockClosed, IoMail, IoGameController, IoCheckmarkOutline, IoCloseSharp, IoWarningOutline, IoCloseCircleSharp } from "react-icons/io5";

const SignUp = () => {

    const [values, setValues] = useState({
        username: '',
        emailAddress: '',
        password: ''
    });

    const [errors, setErrors] = useState({
        username: '',
        emailAddress: '',
        password: ''
    });

    const [toastType, setToastType] = useState();
    const [isVisible, setIsVisible] = useState();
    const timeoutRef = useRef(null);

    const apiUrl = '/api'; 

    const handleChange = (e) => {
        const newValues = { ...values, [e.target.name]: e.target.value }
        setValues(newValues);
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

    const handleValidation = () => {
        let newErrors = {};
        const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/;

        if (!usernameRegex.test(values.username)) {
            newErrors.username = 'Usernames must be between 5 and 16 characters and contains only alphanumeric characters.'
        }
        else {
            newErrors.username = '';
        }
        if (!emailRegex.test(values.emailAddress)) {
            newErrors.emailAddress = 'Please enter a valid email address.'
        }
        else {
            newErrors.emailAddress = '';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (handleValidation()) {
            fetch(`${apiUrl}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            }).then(response => {
                if (response.status === 201) {
                    return (response.json()).then(data => {
                        setToastType('success');
                        handleToast(true);
                    })
                }

                else if (response.status === 409) {
                    return (response.json()).then(data => {
                        let newErrors = {};
                        newErrors = {
                            ...errors,
                        };
                        if (data.duplicates.username) {
                            newErrors.username = data.duplicates.username;
                        }
                        else {
                            newErrors.username = '';
                        }

                        if (data.duplicates.emailAddress) {
                            newErrors.emailAddress = data.duplicates.emailAddress;
                        }
                        else {
                            newErrors.emailAddress = '';
                        }
                        setToastType('warning');
                        setErrors(newErrors);
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

        <div className='card signup'>

            <div className='wrapper'>
                <div className={`toast ${isVisible === undefined ? '' : isVisible ? 'show' : 'hide'} ${toastType}`}>

                    {toastType === 'success' ? (
                        <IoCheckmarkOutline size={15} className='icon success' />
                    ) : toastType === 'warning' ? (
                        <IoWarningOutline size={15} className='icon warning' />
                    ) : (
                        <IoCloseCircleSharp size={15} className='icon failure' />
                    )}
                    <div className='message' aria-describedby='toast'>
                        {toastType === 'success' && (
                            <>
                                <p aria-label="success-title"><b>Success!</b></p>
                                <p aria-label="success-message">User can now log in.</p>
                            </>
                        )}
                        {toastType === 'warning' && (
                            <>
                                <p aria-label="warning-title"><b>Warning!</b></p>
                                <p aria-label="warning-message">Check for errors.</p>
                            </>
                        )}
                        {toastType === 'failure' && (
                            <>
                                <p aria-label="failure-title"><b>Failure!</b></p>
                                <p aria-label="failure-message">Server error.</p>
                            </>
                        )}

                    </div>
                    <IoCloseSharp className='close' aria-label='closeToast' onClick={() => handleToast()} />
                    <div className={`progressBar ${isVisible ? 'active' : 'inactive'} ${toastType}`}>
                    </div>
                </div>

            </div>

            <div className='headings'>
                <h1 className='header'> Create an account </h1>
                <h2 className='header'> Start collecting. </h2>
                <IoGameController size={30} />
            </div>

            <form onSubmit={handleSubmit} action='/users' method='POST'>

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
                        <IoMail className='inputImg' />
                        <input
                            name='emailAddress'
                            id='email'
                            type='text'
                            placeholder='Email Address'
                            onChange={handleChange}
                            required>
                        </input>
                    </div>

                    {errors.emailAddress && <p className='registerError' aria-describedby='emailAddressError' role='alert'> {errors.emailAddress} </p>}
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
                        <b>                         Register
                        </b>
                    </button>

                </div>
            </form>
        </div>
    );
}

export default SignUp;
