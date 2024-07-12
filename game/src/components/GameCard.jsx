import React, { useState, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoAdd, IoCloseCircle, IoCheckmarkOutline, IoCloseCircleSharp, IoWarningOutline, IoCloseSharp } from "react-icons/io5";
import { FaBoxOpen, FaBox } from 'react-icons/fa';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom';

const GameCard = ({ id, name, rating, cover, genres, platforms, summary, screenshots, search, onClose }) => {
  const [activeScreenshot, setActiveScreenshot] = useState(0);
  const [toastType, setToastType] = useState();
  const [isVisible, setIsVisible] = useState();
  const timeoutRef = useRef(null);
  const { toggleLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Function to handle changing the active screenshot
  const increaseScreenshot = () => {
    setActiveScreenshot((activeScreenshot + 1) % screenshots.length);
  };

  const decreaseScreenshot = () => {
    setActiveScreenshot((prevIndex) =>
      (prevIndex - 1 + screenshots.length) % screenshots.length);
  };

  const handleToast = (boolean) => {
    setIsVisible(boolean);
    const progressBar = document.querySelector('.progressBar');

    if (boolean === true) {

      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 5000);
      setTimeout(() => {
        if (progressBar) {
          progressBar.classList.add('active');
        }
      }, 0); // Start the animation immediately after setting the timeout
    }

    else {
      clearTimeout(timeoutRef.current);
      if (progressBar) {
        progressBar.classList.remove('active');
      }
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById('gameDetails');
    const formData = new FormData(form);

    const condition = formData.get('condition[]');
    const platform = formData.get('platform');

    const game = {
      id: id,
      name: name,
      rating: rating,
      cover: cover,
      genres: genres,
      platforms: platforms,
      platform: platform,
      condition: condition,
      summary: summary,
      screenshots: screenshots,
    };

    const token = localStorage.getItem('access');
    if (token === null) {
      navigate("/login");
      toggleLoggedIn(false);
      return;
    };
    fetch('http://localhost:5000/addGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`
      },
      body: JSON.stringify(game)
    }).then(response => {
      if (response.status === 401) {
        navigate("/login");
        localStorage.removeItem('access');
        toggleLoggedIn(false);
        return;
      }
      return response.json();
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
    <div className="gamecard">
      <div className='wrapperGameCard'>
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
                <p> Game successfully added! </p>
              </>
            )}
            {toastType === 'warning' && (
              <>
                <p><b>Warning!</b></p>
                <p> This game and condition already exist in the database. </p>
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

      <div className='coverContainer'>

        {cover && <img src={`//images.igdb.com/igdb/image/upload/t_1080p/${cover.image_id}.jpg`} alt={name} />}
        <div className='miscallenous'>
          {genres && (
            <div className='genreContainer'>
              <h3 className='genreHeader'>Genres</h3>
              <ul>
                {genres.map((g, index) => (
                  <li className='genreItems' key={index}>{g.name}</li>
                ))}
              </ul>
            </div>
          )}
          {platforms && (
            <div className='platformContainer'>
              <h3 className='platformHeader'>Platforms</h3>
              <ul>
                {platforms.map((platform, index) => (
                  <li className='platformItems' key={index}>{platform.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className='rightSide'>
        <div className='info'>
          {rating && (
            <span className='ratingContainer'>   {Math.round(rating)} </span>)}
          {name && <h2 className='nameHeader'> {name} </h2>}
          {summary && <div className='summaryContainer'> <h2> Summary:</h2>
            <p> {summary} </p>
          </div>}

          <div className='screenshotContainer'>
            {screenshots && screenshots.length > 0 && (
              <div className='screenshot'>
                {screenshots.length > 1 && <FaArrowLeft className='leftArrow' size={30} onClick={decreaseScreenshot} />}
                <img
                  key={activeScreenshot}
                  src={`//images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshots[activeScreenshot].image_id}.jpg`}
                  alt={`Screenshot ${activeScreenshot + 1}`}

                />
                {screenshots.length > 1 && <FaArrowRight className='rightArrow' size={30} onClick={increaseScreenshot} />}
                {screenshots.length > 0 && <div className='paginationDots'>
                  {screenshots.map((screenshots, index) => (
                    <span
                      className={index === activeScreenshot ? 'dots active' : 'dots'}>
                    </span>

                  ))}
                </div>
                }
              </div>
            )}
          </div>
        </div>
        {search && <form onSubmit={handleSubmit} className='addContainer' id='gameDetails'>
          {platforms && (
            <div className="itemCondition">
              {platforms.map((platform, index) => (
                <div className="itemConditionContainer">
                  <input type="radio" name="platform" value={platform.name} required />
                  <div className='radioTile'>
                    <span className="radio-label-console"> {platform.name} </span>
                  </div>
                </div>

              ))}
            </div>
          )}
          <div className="itemCondition">
            <div className="itemConditionContainer">
              <input type="radio" name="condition[]" value="loose" required />
              <div className='radioTile'>
                <FaBoxOpen />
                <span className="radio-label"> &nbsp; Loose </span>
              </div>
            </div>
            <div className="itemConditionContainer">
              <input type="radio" name="condition[]" value="complete" />
              <div className='radioTile'>
                <FaBox />

                <span className="radio-label"> &nbsp; Complete </span>
              </div>
            </div>
          </div>


          <div className='collection'>

            <button type='submit' className='addButton'>
              <IoAdd size={20} />

              Add to Collection </button>
          </div>
        </form>}


      </div >
      <IoCloseCircle className='closeModal' size={30} onClick={onClose} />
    </div >

  );
};

export default GameCard;