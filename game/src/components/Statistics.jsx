import PieChart from "./PieChart";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Statistics = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [platforms, setPlatforms] = useState(new Map());
  const [genres, setGenres] = useState(new Map());
  const [totalGames, setTotalGames] = useState(0);
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
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        return response.json();
      }).then(data => {
        setGames(data.collection);
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
      });
  }, [navigate]); // Empty dependency array means this effect runs once on mount


  return (

    <div className='statisticsComponent'>
      <h1 className='statisticsHeader'> Statistics </h1>
      <PieChart conditions={platforms} totalGames={totalGames} title={'Platforms'}/>
      <PieChart conditions={genres} title = {'Genres'} />

    </div>
  )
}
export default Statistics;