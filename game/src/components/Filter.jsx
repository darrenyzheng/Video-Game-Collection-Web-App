import { useState } from 'react';

const Filter = ({ platforms, genres }) => {
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
        </div>
    );
};

export default Filter;