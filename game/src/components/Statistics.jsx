import PieChart from "./PieChart";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";
import { IoCheckmarkOutline, IoCloseCircleSharp, IoWarningOutline, IoCloseSharp } from "react-icons/io5";


const Statistics = () => {
  const navigate = useNavigate();
  const [platforms, setPlatforms] = useState(new Map());
  const [genres, setGenres] = useState(new Map());
  const [totalGames, setTotalGames] = useState(0);
  const { toggleLoggedIn } = useAuth();
  const [toastType, setToastType] = useState();
  const [isVisible, setIsVisible] = useState();
  const timeoutRef = useRef(null);


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

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token === null) {
      navigate("/login");
      return;
    };
    fetch('http://localhost:5000/collection', {
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
        const allGenres = data.collection.map(game => game.genres).filter(genre => genre !== undefined);
        const allPlatforms = data.collection.map(game => game.platformOwned).filter(platform => platform !== undefined);
        const uniqueGenres = [...new Set(allGenres.flatMap(genreArray => genreArray.map(obj => obj.name)))].sort();
        const uniquePlatforms = [...new Set(allPlatforms.flatMap(obj => Object.keys(obj)))].sort();
        let platformMap = new Map();
        let genreMap = new Map();
        for (let platform of uniquePlatforms) {
          platformMap.set(platform, 0);
        }

        for (let genre of uniqueGenres) {
          genreMap.set(genre, 0);
        }
        let totalGames = 0;

        for (let game of data.collection) {
          for (let platform of Object.keys(game.platformOwned)) {
            if (platformMap.has(platform)) {
              let num = platformMap.get(platform);
              num++;
              totalGames++;
              platformMap.set(platform, num);
            }
          }

          for (let genres of game.genres) {
            if (genreMap.has(genres.name)) {
              let num = genreMap.get(genres.name)
              num++;
              genreMap.set(genres.name, num);
            }
          }
        }
        setGenres(genreMap);
        setPlatforms(platformMap);
        setTotalGames(totalGames);


      })
      .catch(error => {
        console.error('Fetch error:', error);
        setToastType('failure');
        handleToast(true);
      });
  }, [navigate, toggleLoggedIn]); // Empty dependency array means this effect runs once on mount


  return (

    <div className='statisticsComponent'><div className='wrapperSettings'>
      <div className={`toast ${isVisible === undefined ? '' : isVisible ? 'show' : 'hide'} ${toastType}`}>

        {toastType === 'success' ? (
          <IoCheckmarkOutline size={15} className='icon success' />
        ) : toastType === 'warning' ? (
          <IoWarningOutline size={15} className='icon warning' />
        ) : (
          <IoCloseCircleSharp size={15} className='icon failure' />
        )}
        <div className='message'>
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
      <h1 className='statisticsHeader'> Statistics </h1>
      <PieChart conditions={platforms} totalGames={totalGames} title={'Platforms'} />
      <PieChart conditions={genres} title={'Genres'} />

    </div>
  )
}
export default Statistics;