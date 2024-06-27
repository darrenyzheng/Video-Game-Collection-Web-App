"use client";
import React, { useState, useRef, useEffect } from 'react';
import { IoSearch, IoFilter } from "react-icons/io5";
import GameCover from "./GameCover"; // Ensure correct import for GameCover
import GameCard from "./GameCard"; // Ensure correct import for GameCover
import Filter from './Filter';

const Search = () => {
    const [games, setGames] = useState([]); // State for all games
    const [filteredGames, setFilteredGames] = useState([]); // State for filtered games
    const [searchTerm, setSearchTerm] = useState(''); // State to track search status
    const [platforms, setPlatforms] = useState([]); // State for unique platforms
    const [genres, setGenres] = useState([]); // State for unique genres
    const filterBarRef = useRef(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [filter, setFilter] = useState(null);
    const dialogRef = useRef(null);
    const filterRef = useRef(null);
    const [filters, setFilters] = useState({});
    const [searchQuery, setSearchQuery] = useState(false);


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

    function closeModal() {
        dialogRef.current?.close();
        setSelectedGame(null);
    }

    const closeFilter = () =>  {
        filterRef.current?.close();
        setFilter(false);
    }
    // Function to handle form submission
    const handleSubmit = (event) => {
        setSearchTerm('');

        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const objectFormData = Object.fromEntries(formData.entries());
        const jsonObjectFormData = JSON.stringify(objectFormData);

        fetch('http://localhost:5000/search', {
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
            // Extract unique genres and platforms
            const allGenres = data.flatMap(game => game.genres).filter(genre => genre !== undefined);
            const uniqueGenres = Array.from(new Set(allGenres.map(genre => genre.name)));

            const allPlatforms = data.flatMap(game => game.platforms).filter(platform => platform !== undefined);
            const uniquePlatforms = Array.from(new Set(allPlatforms.map(platform => platform.name)));

            setPlatforms(uniquePlatforms);
            setGenres(uniqueGenres);

            setSearchTerm('');

            if (filterBarRef.current) {
                filterBarRef.current.value = '';
            }
            console.log(games);

        }).catch(error => {
            console.error('Fetch error:', error);
        });
    };

    // Function to handle filtering based on input
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
        }
    };

    const handleClick = (game) => {
        setSelectedGame(game);
    }

    const showFilter = () => {
        setFilter(true);
    }

    const addFilters = (filter) => {
        setFilters(filter); // Update filters state with selected filters
    
        // Apply filters to games based on selected platforms and genres
        const filteredGames = games.filter(game => {
            const { platforms, genres } = filter;
            return (
                platforms.length === 0 || game.platforms.some(platform => platforms.includes(platform.name))
            ) && (
                genres.length === 0 || game.genres.some(genre => genres.includes(genre.name))
            );
        });
        setFilteredGames(filteredGames); // Update filtered games state
        setSearchQuery(searchQuery);
        
        if (filterBarRef.current) {
            filterBarRef.current.value = '';
        }
    }

    return (
        <div className='searchComponent'>
            <form onSubmit={handleSubmit} className='searchQuery'>
                <dialog ref={dialogRef}>
                    {selectedGame && (
                        <GameCard
                            dialogRef={dialogRef}
                            name={selectedGame.name}
                            rating={selectedGame.rating}
                            cover={selectedGame.cover}
                            releaseDate={selectedGame.release_dates}
                            genre={selectedGame.genres}
                            platforms={selectedGame.platforms}
                            summary={selectedGame.summary}
                            screenshots={selectedGame.screenshots}
                            onClose={closeModal}
                        />
                    )}
                </dialog>

                <dialog ref= {filterRef}>
                    {filter && ( <Filter platforms={platforms} genres = {genres} onFilter = {addFilters} onClose={closeFilter} /> ) }
                </dialog> 
                <div className='interactable'>
                    <div className="search">
                        <input
                            type="text"
                            name='search'
                            placeholder='Search'
                        />
                        <button type="submit" aria-label="Search">
                            <IoSearch size={30} />
                        </button>
                    </div>
                    <div className="filter">
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
            </form>

            <div className="gamesList">
                {/* Conditional rendering based on searchTerm */}
                {searchTerm || searchQuery ? (
                    filteredGames.map(filteredGame => (
                        <GameCover key={filteredGame.id} cover={filteredGame.cover}
                            onClick={() => handleClick(filteredGame)} />
                    ))
                ) : (
                    games.map(game => (
                        <GameCover
                            key={game.id}
                            cover={game.cover}
                            onClick={() => handleClick(game)} />
                    ))
                )}
            </div>

        </div>
    );
};

export default Search;