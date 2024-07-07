import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoFilter, IoTrashSharp } from "react-icons/io5";
import GameCover from "./GameCover"; // Ensure correct import for GameCover
import Filter from './Filter';
import GameCard from "./GameCard"; // Ensure correct import for GameCover


const Collection = () => {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State to track search status
    const [filteredGames, setFilteredGames] = useState([]); // State for filtered games
    const [filter, setFilter] = useState(null);
    const filterBarRef = useRef(null);
    const [searchQuery, setSearchQuery] = useState();
    const [platforms, setPlatforms] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filters, setFilters] = useState({});
    const filterRef = useRef(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const dialogRef = useRef(null);

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
                const uniqueGenres = [...new Set(allGenres.flatMap(genreArray => genreArray.map(obj => obj.name)))];
                const uniquePlatforms = [...new Set(allPlatforms.flatMap(obj => Object.keys(obj)))];
                
                setPlatforms(uniquePlatforms);
                setGenres(uniqueGenres);

            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
    }, [navigate]); // Empty dependency array means this effect runs once on mount

    useEffect(() => {
        if (!selectedGame) {
            return;
        }
        dialogRef.current?.showModal();
        dialogRef.current?.addEventListener('close', closeModal);
        return () => {
            dialogRef.current?.removeEventListener('close', closeModal);
        }
    }, [selectedGame]);

    useEffect(() => {
        if (!filter) {
            return;
        }

        filterRef.current?.showModal();
        filterRef.current?.addEventListener('close', closeFilter)
        return () => {
            filterRef.current?.removeEventListener('close', closeFilter);
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
        setFilters(filter); // Update filters state with selected filters
        // Apply filters to games based on selected platforms and genres
        const gamesWithGenresPlatforms = games.filter((game => game.genres && game.platforms));

        const filteredGames = gamesWithGenresPlatforms.filter(game => {
            const { platforms, genres } = filter;
            return (
                platforms.length === 0 || Object.keys(game.platformOwned).some(platform => platforms.includes(platform))
            ) && (
                    genres.length === 0 || game.genres.some(genre => genres.includes(genre.name))
                );
        });
        setFilteredGames(filteredGames); // Update filtered games state
        setSearchQuery(!searchQuery);
        console.log(filteredGames);
    }
    const handleSearchFilter = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        if (searchTerm === "") {
            setFilteredGames(games); // Reset to original games if search term is empty
        } else {
            const filteredResults = games.filter(game =>
                game.name.toLowerCase().includes(searchTerm)
            );
            setFilteredGames(filteredResults); // Update filtered games with filtered results
            setFilters();
        }
    };

    function closeModal() {
        dialogRef.current?.close();
        setSelectedGame(null);
    }

    const deleteGame = (e, game) => {
        e.stopPropagation();
        const token = localStorage.getItem('access');
        fetch('http://localhost:5000/deleteGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer: ${token}`
            },
        }).
            catch(error => {
                console.error(`Error: ${error}`)
            })
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
                        ref={filterBarRef} // Assign ref to the input field

                        onChange={handleSearchFilter}
                    />
                    <div className='filterSvgContainer'>
                        <IoFilter size={30}
                            onClick={showFilter} />
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
                                    <h5>{filteredGame.name}</h5>
                                    <div className='gameInfo'
                                        onClick={() => handleClick(filteredGame)}
                                    >
                                        <IoTrashSharp size={30} className='trashCan' handleClick={(e) => deleteGame(e, filteredGame)} />
                                        <p> Consoles owned: </p>
                                        {Object.entries(filteredGame.platformOwned).map(([console, owned], index) => (
                                            <p key={console}>{console}, {owned.join(' ')} </p>
                                        ))}

                                    </div>


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
