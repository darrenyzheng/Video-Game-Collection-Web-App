import React, { useState, useRef, useEffect } from 'react';
import { IoSearch, IoFilter, IoFunnelOutline } from "react-icons/io5";
import GameCover from "./GameCover";
import GameCard from "./GameCard";
import Filter from './Filter';

const Search = () => {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [platforms, setPlatforms] = useState([]);
    const [genres, setGenres] = useState([]);
    const filterBarRef = useRef(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [filter, setFilter] = useState(null);
    const dialogRef = useRef(null);
    const filterRef = useRef(null);
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState();

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
        const currentRef = filterRef.current;
        filterRef.current?.showModal();
        filterRef.current?.addEventListener('close', closeFilter)
        return () => {
            currentRef.removeEventListener('close', closeFilter);
        }
    }, [filter]);

    function closeModal() {
        dialogRef.current?.close();
        setSelectedGame(null);
    }

    const closeFilter = () => {
        filterRef.current?.close();
        setFilter(false);
    }

    const handleSubmit = (event) => {
        setSearchTerm('');

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const objectFormData = Object.fromEntries(formData.entries());
        const jsonObjectFormData = JSON.stringify(objectFormData);

        fetch('http://localhost:5000/api/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonObjectFormData,
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).then(data => {
            setGames(data);
            setSearchQuery();

            const allGenres = data.flatMap(game => game.genres).filter(genre => genre !== undefined);
            const uniqueGenres = Array.from(new Set(allGenres.map(genre => genre.name)));

            const allPlatforms = data.flatMap(game => game.platforms).filter(platform => platform !== undefined);
            const uniquePlatforms = Array.from(new Set(allPlatforms.map(platform => platform.name)));

            setPlatforms(uniquePlatforms);
            setGenres(uniqueGenres);
            setFilters();
            setSearchTerm('');

            if (filterBarRef.current) {
                filterBarRef.current.value = '';
            }

        }).catch(error => {
            console.error('Fetch error:', error);
        });
    };

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

    const handleClick = (game) => {
        setSelectedGame(game);
    }

    const showFilter = () => {
        if (games.length > 0) {
            setFilter(true);
        }
    }

    const addFilters = (filter) => {
        setFilters(filter);

        const gamesWithGenresPlatforms = games.filter((game => game.genres && game.platforms));

        const filteredGames = gamesWithGenresPlatforms.filter(game => {
            const { platforms, genres } = filter;
            return (
                platforms.length === 0 || game.platforms.some(platform => platforms.includes(platform.name))
            ) && (
                    genres.length === 0 || game.genres.some(genre => genres.includes(genre.name))
                );
        });
        setFilteredGames(filteredGames);
        setSearchQuery(!searchQuery);
    }

    const clearFilters = () => {
        setFilters();
        setSearchQuery();
        setSearchTerm('');
        if (filterBarRef.current) {
            filterBarRef.current.value = '';
        }
    }
    return (
        <div className='searchComponent'>
            <h1 className='searchHeader'> Search </h1>
            <dialog ref={dialogRef}>
                {selectedGame && (
                    <GameCard
                        dialogRef={dialogRef}
                        id={selectedGame.id}
                        name={selectedGame.name}
                        rating={selectedGame.rating}
                        cover={selectedGame.cover}
                        genres={selectedGame.genres}
                        platforms={selectedGame.platforms}
                        summary={selectedGame.summary}
                        screenshots={selectedGame.screenshots}
                        search={true}
                        onClose={closeModal}
                    />
                )}
            </dialog>

            <dialog aria-label='FilterModal' ref={filterRef}>
                {filter && (<Filter platforms={platforms} genres={genres} onFilter={addFilters} onClose={closeFilter} />)}
            </dialog>
            <form onSubmit={handleSubmit} className='searchQuery'>
                <div className='searchableFilterableDiv'>
                    <div className="searchField">
                        <input
                            type="text"
                            name='search'
                            placeholder='Search'
                        />
                        <button type="submit" aria-label="Search">
                            <IoSearch size={30} />
                        </button>
                    </div>
                    <div className="filterField">
                        <input
                            type="text"
                            name='filter'
                            placeholder='Filter'
                            ref={filterBarRef}

                            onChange={handleSearchFilter}
                        />

                        <div className='filterSvgContainer'>
                            <IoFilter size={30}
                                onClick={showFilter} aria-label="Filter Modal Button" />
                        </div>
                    </div>
                </div>

            </form>

            <div className='filterData'>
            {(searchTerm || searchQuery !== undefined) &&
                <button className='clearFilterButton' onClick={clearFilters}>
                    <IoFunnelOutline />
                    <p>
                        Clear Filters
                    </p>
                </button>
            }
            {filters && filters.genres && filters.genres.length > 0 && <p className='filterText'> Selected genre: {filters.genres.join(', ')}  </p>}
            {filters && filters.platforms && filters.platforms.length > 0 && <p className='filterText'> Selected platform: {filters.platforms.join(', ')} </p>}
            </div>
            {games.length && (<div className="gamesList" aria-label='List of Games'>
                {searchTerm || searchQuery !== undefined ? (
                    filteredGames.map(filteredGame => (
                        <div key={filteredGame.id}>
                            {filteredGame.cover && (
                                <div className='gameWrapper' aria-label='game' onClick={() => handleClick(filteredGame)}>
                                    <GameCover
                                        key={filteredGame.id}
                                        cover={filteredGame.cover}
                                        
                                    />
                                    <h5>{filteredGame.name}</h5>

                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    games.map(game => (
                        <div key={game.id}>
                            {game.cover && (
                                <div className='gameWrapper' aria-label='game'onClick={() => handleClick(game)}>
                                    <GameCover
                                        key={game.id}
                                        cover={game.cover}
                                        
                                    />
                                    <h5>{game.name}</h5>

                                </div>

                            )}
                        </div>
                    ))
                )}
            </div>
            )}

        </div>
    );
};

export default Search;