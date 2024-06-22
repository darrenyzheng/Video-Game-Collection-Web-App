import React, { useState } from 'react';
import platformDict from '../constants/platforms'; // Assuming platformDict is correctly imported
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { IoAdd } from "react-icons/io5";
import { FaBoxOpen, FaBox } from 'react-icons/fa';

const GameCard = ({ name, rating, cover, releaseDate, genre, platforms, summary, screenshots, onClose }) => {
  const [activeScreenshot, setActiveScreenshot] = useState(0);

  // Function to handle changing the active screenshot
  const increaseScreenshot = () => {
    setActiveScreenshot((activeScreenshot + 1) % screenshots.length);
  };

  const decreaseScreenshot = () => {
    setActiveScreenshot((prevIndex) =>
      (prevIndex - 1 + screenshots.length) % screenshots.length);
  };

  return (
    <div className="gamecard">
      <div className='coverContainer'>

        {cover && <img src={`//images.igdb.com/igdb/image/upload/t_1080p/${cover.image_id}.jpg`} alt={name} />}
        <div className='miscallenous'>
          {genre && (
            <div className='genreContainer'>
              <h3 className='genreHeader'>Genres</h3>
              <ul>
                {genre.map((g, index) => (
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
      {/* <div className='releaseDateContainer'>
        <p><b>Release Dates</b></p>
        {releaseDate && releaseDate.map((release, index) => (
          <div key={index}>
            <p>{release.human}</p>
            <p>{release.platform.name}</p>
            <p>
              <img src={platformDict.get(release.region).flag} alt={`${release.country} flag`} />
              {' '}
              {platformDict.get(release.region).country}
            </p>
          </div>
        ))}
      </div> */}
      <div className='rightSide'>
        <div className='info'>
          {name && <h2 className='nameHeader'> {name} </h2>}
          {summary && <div className='summaryContainer'> <h2> Summary:</h2>
            <p> {summary} </p>
          </div>}
          <div className='screenshotContainer'>
            {screenshots && screenshots.length > 0 && (
              <div className='screenshot'>
                {screenshots.length > 1 && <FaArrowLeft size={30} onClick={decreaseScreenshot} />}
                <img
                  key={activeScreenshot}
                  src={`//images.igdb.com/igdb/image/upload/t_screenshot_big/${screenshots[activeScreenshot].image_id}.jpg`}
                  alt={`Screenshot ${activeScreenshot + 1}`}

                />
                {screenshots.length > 1 && <FaArrowRight size={30} onClick={increaseScreenshot} />}
                {/* {rating && <p>Rating: {Math.round(rating)}</p>} */}

              </div>
            )}
          </div>
        </div>
        <form action="" className='addContainer'>
          {platforms && (
            <div class="itemCondition">
              {platforms.map((platform, index) => (
                <div className="itemConditionContainer">
                  <input type="radio" name="platform" value={platform.name} />
                  <div className='radioTile'>
                    <span className="radio-label-console"> {platform.name} </span>
                  </div>
                </div>

              ))}
            </div>
          )}
          <div className="itemCondition">
            <div className="itemConditionContainer">
              <input type="radio" name="condition[]" value="loose" />
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
            <button className='addButton'>
              <IoAdd size={20} />
              Add to Collection </button>
          </div>
        </form>

      </div >
    </div >

  );
};

export default GameCard;