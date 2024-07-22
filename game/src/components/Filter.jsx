import { useState } from 'react';
import { IoFilterOutline, IoCloseCircle } from "react-icons/io5";

const Filter = ({ platforms, genres, onFilter, onClose }) => {
    const [platformFilters, setPlatformFilters] = useState([]);
    const [genreFilters, setGenreFilters] = useState([]);

    const passFilter = (e) => {
        e.preventDefault();
        const filters = {
            platforms: platformFilters,
            genres: genreFilters
        }

        onFilter(filters);
        onClose()
    }
    const handlePlatform = (e) => {
        const platform = e.target.value;
        if (platformFilters.includes(platform)) {
            setPlatformFilters(prevFilters => prevFilters.filter(item => item !== platform));
        } else {
            setPlatformFilters(prevFilters => [...prevFilters, platform]);
        }
    }
    const handleGenre = (e) => {
        const genre = e.target.value;
        if (genreFilters.includes(genre)) {
            setGenreFilters(prevFilters => prevFilters.filter(item => item !== genre));
        } else {
            setGenreFilters(prevFilters => [...prevFilters, genre]);
        }
    }


    return (
        <div className='filterComponent'>
            <h1 className='filterHeaders'> Filter on Genre and Platform</h1>
            <IoCloseCircle className='closeFilter' size={30} onClick={onClose} aria-label='Close filter'/>

            <form action="" className='filterForm'>
                <h2 className='filterHeaders'> Platforms </h2>
                <div className='filterPlatformContainer'>

                    {platforms.map((platform, index) => (
                        <div className="platformFilter">
                            <input type="checkbox" className="platformFilterOption" name="platform" value={platform} onChange={handlePlatform} aria-label={platform} />
                            <div className='radioTile'>
                                <span className="radio-label-console"> {platform} </span>
                            </div>
                        </div>
                    ))}

                </div>
                <h2 className='filterHeaders'> Genres </h2>
                <div className='filterGenreContainer'>
                    {genres.map((genre, index) => (
                        <div className="genreFilter">
                            <input type="checkbox" name="genre" className="genreFilterOption" value={genre} onChange={handleGenre} aria-label={genre} />
                            <div className='radioTile'>
                                <span className="radio-label-console"> {genre} </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='filterButton'>
                    <button className='addButton'
                        onClick={passFilter}>
                        <IoFilterOutline size={20} />
                        Filter </button>
                </div>            </form >

        </div>
    );

};

export default Filter;