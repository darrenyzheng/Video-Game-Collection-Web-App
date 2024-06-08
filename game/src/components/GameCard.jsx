import platformDict from '../constants/platforms.js';



const GameCard = ({name, rating, cover, releaseDate, genre, platform, summary, screenshots }) => {
    return <div className="gamecard">
        { name && <h1> Name {name} </h1> } 
        { rating && <p> Rating {rating} </p> } 
        {cover && <img src = {cover.url} /> }
        {releaseDate && releaseDate.map((release, index) => (
  <span key={index}>
    <p>{release.human}</p>
    <p>{release.platform.name}</p>
    <p>{platformDict.get(release.region)}</p>
  </span> ))}        
  { genre && genre.map(genre => genre.name).join('\n') } 
        {platform && platform.map(platform => platform.name).join()}
        { summary && <p> Summary {summary} </p> } 
        { screenshots && screenshots.map(screenshots => (
            < img src = {screenshots.url} /> ) ) }  
    </div>
}

export default GameCard;