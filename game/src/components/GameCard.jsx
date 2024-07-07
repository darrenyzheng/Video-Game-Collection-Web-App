import React, { useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoAdd, IoCloseCircle } from "react-icons/io5";
import { FaBoxOpen, FaBox } from 'react-icons/fa';

const GameCard = ({ id, name, rating, cover, genres, platforms, summary, screenshots, search, onClose }) => {
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  // Function to handle changing the active screenshot
  const increaseScreenshot = () => {
    setActiveScreenshot((activeScreenshot + 1) % screenshots.length);
  };

  const decreaseScreenshot = () => {
    setActiveScreenshot((prevIndex) =>
      (prevIndex - 1 + screenshots.length) % screenshots.length);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = document.getElementById('gameDetails');
    const formData = new FormData(form);

    const condition = formData.get('condition[]');
    const platform = formData.get('platform');
    console.log(platform);

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
    fetch('http://localhost:5000/addGame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer: ${token}`
      },
      body: JSON.stringify(game)
    }).
      catch(error => {
        console.error(`Error: ${error}`)
      })
  }
  return (
    <div className="gamecard">
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