import { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom';
import { IoPerson, IoPeople } from "react-icons/io5";
const Settings = () => {
    const [tab, setTab] = useState(1);
    const [userData, setUserData] = useState([{
    }
    ]);
    const navigate = useNavigate();

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
            method: 'POST',
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
                setUserData(data);
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
                    <div className={tab === 4 ? "tabs active-tab" : "tabs"} onClick={() => handleChange(4)}> Collection  </div>
                    <div className={tab === 5 ? "tabs active-tab" : "tabs"} onClick={() => handleChange(5)}> Activity   </div>
                    <div className={tab === 6 ? "tabs active-tab" : "tabs"} onClick={() => handleChange(6)}> Information  </div>

                </div>

                <div className={tab === 1 ? "content active-content" : "content"}>
                    <div className='userNameContainer'>
                        <div className='leftUserNameContainer'>
                            <label htmlFor="acctUsername" className='label1'> Username</label>
                            <p className='acctUsernameText'> Update your username. </p>
                        </div>


                        <div className='rightUserNameContainer'>
                            <p className='userNameValidation'> Usernames must be between 5 - 16 characters. </p>
                            <input type='text' className='acctUsername' />
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
                            <input type='email' className='acctEmail' />
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
                    <div className='privacyContainer'>
                        <div className='leftPrivacyContainer' >
                            <label htmlFor="acctPrivacy" className='privacyLabel'> Privacy </label>
                            <p className='acctPrivacyText'> Update privacy settings. </p>
                        </div>

                        <div className='rightPrivacyContainer'>
                            <input type="radio" id='publicPrivacy' name='privacy' value='public' />
                            <label htmlFor="publicPrivacy"> Public </label>
                            <IoPerson />
                            <p> Only you can see your profile. </p>
                            <input type="radio" id='privatePrivacy' name='privacy' value='private' />
                            <label htmlFor="privatePrivacy"> Private </label>
                            <IoPeople />
                            <p> Everyone can see your profile.</p>
                        </div>
                    </div>
                    <span className='bar' >  </span>

                    <div className='favoriteGenreContainer'>
                        <label htmlFor="acctFavoriteGenre" className='acctFavoriteGenreLabel'> Favorite Genres: </label>
                        <p className='acctFavoriteGenreText'> Update your favorite genre. </p>
                        <input type='select' className='acctFavoriteGenre' />
                    </div>

                    <div className='bioContainer'>
                        <div className='leftBioContainer'>
                            <label htmlFor="acctBio" className='acctBioLabel'> Bio: </label>
                            <p className='acctBioText'> Update your biography.</p>
                        </div>

                        <input type='textarea' className='acctBio' />
                    </div>

                    <div className='profilePictureContainer'>
                        <div className='leftProfilePictureContainer'>
                            <label htmlFor="acctProfilePicture" className='acctProfilePictureLabel'> Profile Picture: </label>
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
                            <label htmlFor="acctFirstName" className='acctFirstNameLabel'> First Name:</label>
                            <p className='acctFirstNameText'> Update your first name. </p>
                        </div>
                    </div>

                    <div className='rightFirstNameContainer'>
                        <input type="text" name="" id="acctFirstName" />
                    </div>

                    <div className='lastNameContainer'>
                        <div className='leftLastNameContainer'>
                            <label htmlFor="acctLastName" className='acctLastNameLabel'> Last Name:</label>
                            <p className='acctLastNameText'> Update your last name. </p>
                        </div>
                    </div>

                    <div className='rightLastNameContainer'>
                        <input type="text" name="" id="acctLastName" />
                    </div>

                    <div className='birthdayContainer'>
                        <div className='leftBirthdayContainer'>
                            <label htmlFor="acctBirthday" className='acctBirthdayLabel'> Birthday:</label>
                            <p className='acctBirthdayText'> Update your birthday. </p>
                        </div>
                        <div className='rightBirthdayContainer'>
                            <input type="date" id='acctBirthday' />
                        </div>
                    </div>
                </div>

                <div className={tab === 4 ? "content active-content" : "content"}>
                    <div className='collectionPrivacyContainer'>
                        <div className='leftCollectionPrivacyContainer'>
                            <label html='acctCollectionPrivacy' className='acctCollectionPrivacyLabel'> Privacy: </label>
                            <p className='acctCollectionPrivacyText'> Update the privacy of your collection. </p>
                        </div>

                        <div className='rightCollectionPrivacyContainer'>

                        </div>
                    </div>

                    <div className='collectionDetailsContainer'>
                        <div className='leftCollectionDetailsContainer'>
                            <label htmlFor="acctCollectionDetails" className='acctCollectionDetailsLabel'> Details: </label>
                            <p className='acctCollectionDetailsText'> Update the details. </p>
                        </div>

                    </div>
                </div>


            </form>
        </div>
    )
}

export default Settings;