import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkOutline, IoCloseCircleSharp, IoWarningOutline, IoCloseSharp } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";

const Settings = () => {
    const [tab, setTab] = useState(1);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({ username: '', emailAddress: '', password: '', favoriteGenre: '', favoriteGame: '', firstName: '', lastName: '', birthday: '' });
    let today = new Date().toISOString().split('T')[0];
    const [toastType, setToastType] = useState();
    const [isVisible, setIsVisible] = useState();
    const timeoutRef = useRef(null);
    const { toggleLoggedIn } = useAuth();

    const handleTab = (index) => {
        setTab(index);
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

    const handleChange = (e) => {
        const newValues = { ...userData, [e.target.name]: e.target.value }
        setUserData(newValues);
    }

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token === null) {
            navigate("/login");
            toggleLoggedIn(false);
            return;
        };
        fetch('https://videogamecollectionwebapp.vercel.app/settings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(response => {
                if (response.status === 401) {
                    navigate("/login");
                    localStorage.removeItem('access');
                    toggleLoggedIn(false);
                    return; 
                }
                return response.json();
            })
            .then(data => {
                let copyData = { ...data.user };
                copyData.password = '';
                if (copyData.birthday) {
                    const birthDayObject = new Date(copyData.birthday).toISOString().split('T')[0];
                    copyData.birthday = birthDayObject;
                }
                else {
                    copyData.birthday = '';
                }
                setUserData(copyData);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setToastType('failure');
                handleToast(true);
            });
    }, [navigate, toggleLoggedIn]); 

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access');
        fetch('https://videogamecollectionwebapp.vercel.app/settings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(userData)
        }).then(response => {
            if (response.status === 401) {
                navigate("/login");
                localStorage.removeItem('access');
                toggleLoggedIn(false);
                return; 
            }
            return response
        }).then(response => {
            if (response.status === 200) {
                return (response.json()).then(data => {
                    setToastType('success');
                    handleToast(true);
                });
            }
            else if (response.status === 409) {
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
    return (
        <div className='settingsComponent'>
            <form className='acctForm' onSubmit={handleSubmit} >
                <>
                    <h2 className='settingsHeader'> Settings </h2>
                    <p className='settingsParagraph'> Manage your account and profile settings. </p>
                </>
                <span className='bar' />
                <div className='wrapperCollectionSettings'>
                    <div className={`toast ${isVisible === undefined ? '' : isVisible ? 'show' : 'hide'} ${toastType}`}>

                        {toastType === 'success' ? (
                            <IoCheckmarkOutline size={15} className='icon success' />
                        ) : toastType === 'warning' ? (
                            <IoWarningOutline size={15} className='icon warning' />
                        ) : (
                            <IoCloseCircleSharp size={15} className='icon failure' />
                        )}
                        <div className='message'>
                            {toastType === 'success' && (
                                <>
                                    <p><b>Success!</b></p>
                                    <p> Account details successfully saved. </p>
                                </>
                            )}
                            {toastType === 'warning' && (
                                <>
                                    <p><b>Warning!</b></p>
                                    <p> Email already exists in the database. </p>
                                </>
                            )}
                            {toastType === 'failure' && (
                                <>
                                    <p><b>Failure!</b></p>
                                    <p> Server error. </p>
                                </>
                            )}

                        </div>
                        <IoCloseSharp className='close' onClick={() => handleToast()} />
                        <div className={`progressBar ${isVisible ? 'active' : 'inactive'} ${toastType}`}>
                        </div>
                    </div>


                </div>
                <div className='tabContainer'>
                    <div className={tab === 1 ? "tabs active-tab" : "tabs"} onClick={() => handleTab(1)}> Account  </div>
                    <div className={tab === 2 ? "tabs active-tab" : "tabs"} onClick={() => handleTab(2)}> Profile  </div>
                    <div className={tab === 3 ? "tabs active-tab" : "tabs"} onClick={() => handleTab(3)}> Personal  </div>
                </div>

                <div className={tab === 1 ? "content active-content" : "content"}>
                    <div className='container'>
                        <div className='leftUserNameContainer'>
                            <label htmlFor="acctUsername" className='label'> Username</label>
                        </div>


                        <div className='rightContainer'>
                            <p className='validation'> Usernames must be between 5 - 16 characters. </p>
                            <input
                                name='username'
                                type='text'
                                className='acctUsername'
                                value={userData.username}
                                readOnly
                            />
                        </div>
                    </div>
                    <span className='bar' >  </span>

                    <div className='container'>
                        <div className='leftEmailContainer'>
                            <label htmlFor="acctEmail" className='label'> Email Address </label>
                            <p className='text'> Update your email address.  </p>
                        </div>
                        <div className='rightContainer'>
                            <p className='validation'> Emails must have an @ and a domain. </p>
                            <input
                                name='emailAddress' type='email' className='acctEmail'
                                value={userData.emailAddress} onChange={handleChange}
                            />
                        </div>
                    </div>
                    <span className='bar' >  </span>

                    <div className='container'>
                        <div className='leftPasswordContainer'>
                            <label htmlFor="acctPassword" className='label'> Password </label>
                            <p className='text'> Update your password. </p>
                        </div>

                        <div className='rightContainer'>
                            <p className='validation'> Passwords must be between 6-16 characters and have a digit, a letter, and a character from the set. </p>
                            <input type="password" name='password' className='acctPassword' value={userData.password} pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$"

                                onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <div className={tab === 2 ? "content active-content" : "content"}>

                    <div className='container'>
                        <div className='leftFavoriteGenreContainer'>
                            <label htmlFor="acctFavoriteGenre" className='label'> Favorite Genre</label>
                            <p className='text'> Update your favorite genre. </p>
                        </div>
                        <input name='favoriteGenre' type='text' className='acctFavoriteGenre' value={userData.favoriteGenre} onChange={handleChange} minLength={2} maxLength={10} />
                    </div>
                    <span className='bar' >  </span>

                    <div className='container'>
                        <div className='leftFavoriteGameContainer'>
                            <label htmlFor="acctFavoriteGenre" className='label'> Favorite Game </label>
                            <p className='text'> Update your favorite game.</p>
                        </div>

                        <input name='favoriteGame' type='text' className='acctFavoriteGame' value={userData.favoriteGame} onChange={handleChange} minLength={2} maxLength={25} />
                    </div>

                </div>


                <div className={tab === 3 ? "content active-content" : "content"}>
                    <div className='container'>
                        <div className='leftFirstNameContainer'>
                            <label htmlFor="acctFirstName" className='label'> First Name</label>
                            <p className='text'> Update your first name. </p>
                        </div>
                        <div className='rightContainer'>
                            <input name='firstName' type="text" className="acctFirstName" value={userData.firstName} onChange={handleChange} minLength={2} maxLength={20} />
                        </div>

                    </div>
                    <span className='bar' />


                    <div className='container'>
                        <div className='leftLastNameContainer'>
                            <label htmlFor="acctLastName" className='label'> Last Name</label>
                            <p className='text'> Update your last name. </p>
                        </div>
                        <div className='rightContainer'>
                            <input name='lastName' type="text" className="acctLastName" minLength={2} maxLength={20}
                                value={userData.lastName} onChange={handleChange} />
                        </div>
                    </div>
                    <span className='bar' />



                    <div className='container'>
                        <div className='leftBirthdayContainer'>
                            <label htmlFor="acctBirthday" className='label'> Birthday</label>
                            <p className='text'> Update your birthday. </p>
                        </div>
                        <div className='rightContainer'>
                            <input type="date" name='birthday' className='acctBirthday' value={userData.birthday} onChange={handleChange} max={today} />
                        </div>
                    </div>
                </div>


                <button className='form-button settings'
                    type='submit'
                >
                    <b>                         Save
                    </b>
                </button>
            </form>
        </div>
    )
}

export default Settings;