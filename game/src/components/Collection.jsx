import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoFilter, IoTrashSharp, IoFunnelOutline, IoCheckmarkOutline, IoCloseCircleSharp, IoCloseSharp } from "react-icons/io5";
import GameCover from "./GameCover";
import Filter from './Filter';
import GameCard from "./GameCard";
import { useAuth } from "../contexts/AuthContext";


const Collection = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredGames, setFilteredGames] = useState([]);
    const [filter, setFilter] = useState(null);
    const filterBarRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState();
    const [platforms, setPlatforms] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filters, setFilters] = useState({});
    const filterRef = useRef(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const dialogRef = useRef(null);
    const [toastType, setToastType] = useState();
    const [isVisible, setIsVisible] = useState();
    const timeoutRef = useRef(null);
    const { toggleLoggedIn } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token === null) {
            navigate("/login");
            toggleLoggedIn(false);
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
            }).then(data => {

                setGames(data.collection);
                const allGenres = data.collection.map(game => game.genres).filter(genre => genre !== undefined);
                const allPlatforms = data.collection.map(game => game.platformOwned).filter(platform => platform !== undefined);
                const uniqueGenres = [...new Set(allGenres.flatMap(genreArray => genreArray.map(obj => obj.name)))];
                const uniquePlatforms = [...new Set(allPlatforms.flatMap(obj => Object.keys(obj)))];

                setPlatforms(uniquePlatforms);
                setGenres(uniqueGenres);
                setFilteredGames(data.collection);

            })
            .catch(error => {
                console.error('Fetch error:', error);
                setToastType('failure');
                handleToast(true);
            });
    }, [navigate, toggleLoggedIn]);
    useEffect(() => {
        if (!selectedGame) {
            return;
        }
        const currentRef = dialogRef.current;
        dialogRef.current?.showModal();
        dialogRef.current?.addEventListener('close', closeModal);
        return () => {
            currentRef.removeEventListener('close', closeModal);
        }
    }, [selectedGame]);

    useEffect(() => {
        if (!filter) {
            return;
        }
        const currentRef = dialogRef.current;
        filterRef.current?.showModal();
        filterRef.current?.addEventListener('close', closeFilter)
        return () => {
            currentRef.removeEventListener('close', closeFilter);
        }
    }, [filter]);

    const showFilter = () => {
        setFilter(true);
    }

    const closeFilter = () => {
        filterRef.current?.close();
        setFilter(false);
    }
    const handleClick = (game) => {
        setSelectedGame(game);
    }

    const addFilters = (filter) => {
        setFilters(filter);
        const gamesWithGenresPlatforms = games.filter((game => game.genres && game.platforms));

        const filteredGames = gamesWithGenresPlatforms.filter(game => {
            const { platforms, genres } = filter;
            return (
                platforms.length === 0 || Object.keys(game.platformOwned).some(platform => platforms.includes(platform))
            ) && (
                    genres.length === 0 || game.genres.some(genre => genres.includes(genre.name))
                );
        });
        setFilteredGames(filteredGames);
        setSearchQuery(!searchQuery);
    }
    const handleSearchFilter = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        if (searchTerm === "") {
            setFilteredGames(games);
        } else {
            const filteredResults = games.filter(game =>
                game.name.toLowerCase().includes(searchTerm)
            );
            setFilteredGames(filteredResults);
            setFilters();
        }
    };

    function closeModal() {
        dialogRef.current?.close();
        setSelectedGame(null);
    }

    const deleteGame = (e, gameToDelete) => {
        e.stopPropagation();
        const token = localStorage.getItem('access');
        fetch('http://localhost:5000/deleteGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`
            },
            body: JSON.stringify(gameToDelete)
        }).then(response => {
            if (response.status === 401) {
                navigate("/login");
                localStorage.removeItem('access');
                toggleLoggedIn(false);
                return;
            }
            return response.json();
        }).then(data => {
            setGames(data.collection);
            setToastType('success');
            handleToast(true);
            const allGenres = data.collection.map(game => game.genres).filter(genre => genre !== undefined);
            const allPlatforms = data.collection.map(game => game.platformOwned).filter(platform => platform !== undefined);
            const uniqueGenres = [...new Set(allGenres.flatMap(genreArray => genreArray.map(obj => obj.name)))];
            const uniquePlatforms = [...new Set(allPlatforms.flatMap(obj => Object.keys(obj)))];

            setPlatforms(uniquePlatforms);
            setGenres(uniqueGenres);
            const newFilteredGames = filteredGames.filter(game => game.id !== gameToDelete.id)
            setFilteredGames(newFilteredGames);
        })
            .catch(error => {
                console.error(`Error: ${error}`)
                setToastType('failure');
                handleToast(true);
            })
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

    const clearFilters = () => {
        setFilters();
        setSearchQuery();
        setSearchTerm('');
        if (filterBarRef.current) {
            filterBarRef.current.value = '';
        }
    }

    return (
        <div className='collectionComponent'>

            <h1 className='collectionHeader'> Collection </h1>
            <div>
                <div className="collectionFilter">
                    <input
                        type="text"
                        name='filter'
                        placeholder='Filter'
                        ref={filterBarRef}

                        onChange={handleSearchFilter}
                    />
                    <div className='filterSvgContainer'>
                        <IoFilter size={30}
                            onClick={showFilter} />
                    </div>
                </div>
            </div>
            <div className='wrapperCollectionSettings'>
                <div className={`toast ${isVisible === undefined ? '' : isVisible ? 'show' : 'hide'} ${toastType}`}>

                    {toastType === 'success' ? (
                        <IoCheckmarkOutline size={15} className='icon success' />
                    ) : (
                        <IoCloseCircleSharp size={15} className='icon failure' />
                    )}
                    <div className='message'>
                        {toastType === 'success' && (
                            <>
                                <p><b>Success!</b></p>
                                <p> Game successfully deleted! </p>
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
            <dialog ref={filterRef}>
                {filter && (<Filter platforms={platforms} genres={genres} onFilter={addFilters} onClose={closeFilter} />)}
            </dialog>
            <dialog ref={dialogRef}>
                {selectedGame && (
                    <GameCard
                        dialogRef={dialogRef}
                        id={selectedGame.id}
                        name={selectedGame.name}
                        rating={selectedGame.rating}
                        cover={selectedGame.cover}
                        releaseDate={selectedGame.release_dates}
                        genres={selectedGame.genres}
                        platforms={selectedGame.platforms}
                        summary={selectedGame.summary}
                        screenshots={selectedGame.screenshots}
                        search={false}
                        onClose={closeModal}
                    />
                )}
            </dialog>
            {filters && filters.genres && filters.genres.length > 0 && <p className='filterText'> Selected genre: {filters.genres.join(', ')}  </p>}
            {filters && filters.platforms && filters.platforms.length > 0 && <p className='filterText'> Selected platform: {filters.platforms.join(', ')} </p>}
            {(searchTerm || searchQuery !== undefined) && <button className='clearFilterButton' onClick={clearFilters}>
                <IoFunnelOutline />
                <p>
                    Clear Filters
                </p>
            </button>}
            <div className="gamesList">
                {searchTerm || searchQuery !== undefined ? (
                    filteredGames.map(filteredGame => (
                        <div key={filteredGame.id}>
                            {filteredGame.cover && (
                                <div className='gameWrapper'>

                                    <GameCover
                                        key={filteredGame.id}
                                        cover={filteredGame.cover}
                                    />
                                    <div className='gameInfo'
                                        onClick={() => handleClick(filteredGame)}
                                    >
                                        <IoTrashSharp size={30} className='trashCan' onClick={(e) => deleteGame(e, filteredGame)} />
                                        <p> Consoles owned: </p>
                                        {Object.entries(filteredGame.platformOwned).map(([console, owned], index) => (
                                            <p key={console}>{console}, {owned.join(' ')} </p>
                                        ))}

                                    </div>

                                    <h5>{filteredGame.name}</h5>

                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    games.map(game => (
                        <div key={game.id}>
                            {game.cover && (
                                <div className='gameWrapper'>
                                    <GameCover
                                        className='gameCover'
                                        key={game.id}
                                        cover={game.cover}
                                    />
                                    <div className='gameInfo'
                                        onClick={() => handleClick(game)}
                                    >
                                        <IoTrashSharp size={30} className='trashCan' onClick={(e) => deleteGame(e, game)} />

                                        <p> Consoles owned: </p>
                                        {Object.entries(game.platformOwned).map(([console, owned], index) => (
                                            <p key={console}>{console}, {owned.join(' ')} </p>
                                        ))}

                                    </div>

                                    <h5>{game.name}</h5>



                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default Collection;
