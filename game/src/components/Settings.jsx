import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Settings = () => {
    const [tab, setTab] = useState(1);
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
    });

    const handleChange = (index) => {
        setTab(index);
    }

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token === null) {
            navigate("/login");
            return;
        };
        fetch('http://localhost:5000/settings', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch');
                }
                return response.json();
            })
            .then(data => {
                setUserData(data.user);
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }, [navigate]); // Empty dependency array means this effect runs once on mount
    return (
        <div className='settingsBig'>
            <form className='acctForm' >
                <div className='settingsDiv'>
                    <h2 className='settingsHeader'> Settings </h2>
                    <p className='settingsParagraph'> Manage your account and profile settings. </p>
                </div>
                <span className='bar' />

                <div className='tabContainer'>
                    <div className={tab === 1 ? "tabs active-tab" : "tabs"} onClick={() => handleChange(1)}> Account  </div>
                    <div className={tab === 2 ? "tabs active-tab" : "tabs"} onClick={() => handleChange(2)}> Profile  </div>
                    <div className={tab === 3 ? "tabs active-tab" : "tabs"} onClick={() => handleChange(3)}> Personal  </div>
                </div>

                <div className={tab === 1 ? "content active-content" : "content"}>
                    <div className='userNameContainer'>
                        <div className='leftUserNameContainer'>
                            <label htmlFor="acctUsername" className='label1'> Username</label>
                            <p className='acctUsernameText'> Update your username. </p>
                        </div>


                        <div className='rightUserNameContainer'>
                            <p className='userNameValidation'> Usernames must be between 5 - 16 characters. </p>
                            <input
                                type='text'
                                className='acctUsername'
                                value={userData.username}
                            />
                        </div>
                    </div>
                    <span className='bar' >  </span>

                    <div className='emailContainer'>
                        <div className='leftEmailContainer'>
                            <label htmlFor="acctEmail" className='label2'> Email Address </label>
                            <p className='acctEmailText'> Update your email address.  </p>
                        </div>
                        <div className='rightEmailContainer'>
                            <p className='emailValidation'> Emails must have an @ and a domain. </p>
                            <input type='email' className='acctEmail'
                                value={userData.emailAddress}
                            />
                        </div>
                    </div>
                    <span className='bar' >  </span>

                    <div className='passwordContainer'>
                        <div className='leftPasswordContainer'>
                            <label htmlFor="acctPassword" className='label3'> Password </label>
                            <p className='acctPasswordText'> Update your password. </p>
                        </div>

                        <div className='rightPasswordContainer'>
                            <p className='passwordValidation'> Passwords must be between 3-16 characters and have a digit, a letter, and a character from the set. </p>
                            <input type="password" className='acctPassword' />
                        </div>
                    </div>
                </div>

                <div className={tab === 2 ? "content active-content" : "content"}>

                    <div className='favoriteGenreContainer'>
                        <div className='leftFavoriteGenreContainer'>
                            <label htmlFor="acctFavoriteGenre" className='acctFavoriteGenreLabel'> Favorite Genre</label>
                            <p className='acctFavoriteGenreText'> Update your favorite genre. </p>
                        </div>
                        <input type='text' className='acctFavoriteGenre' value={userData.favoriteGenre}/>
                    </div>
                    <span className='bar' >  </span>

                    <div className='favoriteGameContainer'>
                        <div className='leftFavoriteGameContainer'>
                            <label htmlFor="acctFavoriteGenre" className='acctFavoriteGameLabel'> Favorite Game </label>
                            <p className='acctFavoriteGameText'> Update your favorite game.</p>
                        </div>

                        <input type='text' className='acctFavoriteGame' value={userData.favoriteGame} />
                    </div>
                    <span className='bar' >  </span>

                    <div className='profilePictureContainer'>
                        <div className='leftProfilePictureContainer'>
                            <label htmlFor="acctProfilePicture" className='acctProfilePictureLabel'> Profile Picture </label>
                            <p className='acctProfilePictureText'> Update your profile picture. </p>
                        </div>
                        <div className='rightProfilePictureContainer'>
                            <input type="file" className='acctProfilePicture' />
                        </div>
                    </div>
                </div>


                <div className={tab === 3 ? "content active-content" : "content"}>
                    <div className='firstNameContainer'>
                        <div className='leftFirstNameContainer'>
                            <label htmlFor="acctFirstName" className='acctFirstNameLabel'> First Name</label>
                            <p className='acctFirstNameText'> Update your first name. </p>
                        </div>
                        <div className='rightFirstNameContainer'>
                            <input type="text" className="acctFirstName" value={userData.firstName} />
                        </div>

                    </div>
                    <span className='bar' />


                    <div className='lastNameContainer'>
                        <div className='leftLastNameContainer'>
                            <label htmlFor="acctLastName" className='acctLastNameLabel'> Last Name</label>
                            <p className='acctLastNameText'> Update your last name. </p>
                        </div>
                        <div className='rightLastNameContainer'>
                            <input type="text" className="acctLastName"
                            value={userData.lastName} />
                        </div>
                    </div>
                    <span className='bar' />



                    <div className='birthdayContainer'>
                        <div className='leftBirthdayContainer'>
                            <label htmlFor="acctBirthday" className='acctBirthdayLabel'> Birthday</label>
                            <p className='acctBirthdayText'> Update your birthday. </p>
                        </div>
                        <div className='rightBirthdayContainer'>
                            <input type="date" className='acctBirthday'  value={userData.birthday}/>
                        </div>
                    </div>
                </div>


                <button className='form-button settings'
                    type='submit'
                >
                    <b>                         Save
                    </b>
                </button>            </form>
        </div>
    )
}

export default Settings;