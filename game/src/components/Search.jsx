"use client";
import React, { useState, useRef, useEffect } from 'react';
import { IoSearch, IoFilter } from "react-icons/io5";
import GameCover from "./GameCover"; // Ensure correct import for GameCover
import GameCard from "./GameCard"; // Ensure correct import for GameCover
import Filter from "./Filter";
const Search = () => {
    const [games, setGames] = useState([]); // State for all games
    const [filteredGames, setFilteredGames] = useState([]); // State for filtered games
    const [searchTerm, setSearchTerm] = useState(''); // State to track search status
    const [platforms, setPlatforms] = useState([]); // State for unique platforms
    const [genres, setGenres] = useState([]); // State for unique genres
    const [filters, setFilters] = useState(false)
    const filterBarRef = useRef(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const dialogRef = useRef(null);



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

    function closeModal() {
        dialogRef.current?.close();
        setSelectedGame(null);
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

    const handleFilter = (e) => {
        return (
            <div>

                <h2>Platform Filter</h2>
                <div className="platforms">
                    {platforms.map(platform => (
                        <div key={platform.id}>
                            <input type="checkbox" id={platform.id} name="platform" />
                            <label htmlFor={platform.id}>{platform.name}</label>
                        </div>
                    ))}
                </div>

                <h2>Genre Filter</h2>
                <div className="genres">
                    {genres.map(genre => (
                        <div key={genre.id}>
                            <input type="checkbox" id={genre.id} name="genre" />
                            <label htmlFor={genre.id}>{genre.name}</label>
                        </div>
                    ))}
                </div>
            </div>);
    }


    const handleClick = (game) => {
        setSelectedGame(game);
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
                        <IoFilter size={30}
                            onClick={handleFilter} />
                    </div>
                </div>
            </form>

            <div className="gamesList">
                {/* Conditional rendering based on searchTerm */}
                {searchTerm ? (
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