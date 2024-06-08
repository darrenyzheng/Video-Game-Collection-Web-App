import {IoSearch} from "react-icons/io5";
import {useState} from 'react';
import GameCard from "./GameCard";
import GameCover from "./GameCard";

// formData: common way of bundle data of forms, array of arrays of name / values 
// event.currentTarget refers to the current element that the event handler has been attached to
const Search = () => {  
    const [games, setGames] = useState([]);

    const handleSubmit = (event) => {
        // stop the normal behavior, refreshing and allowing for custom validation 
        event.preventDefault();
        const formData = new FormData(event.currentTarget);     
        
        // create a Javascript object from the entries, key value pairs from the form 
        const objectFormData = Object.fromEntries(formData.entries());

        // converts a Javascript object to JSON before sending
        const jsonObjectFormData = JSON.stringify(objectFormData);
        
        // fetches at this url with post headers, send as JSON data
        fetch('http://localhost:5000/search', { 
            method: 'POST',
            headers: {
                // setting the content type to send JSON type data 
                'Content-Type': 'application/json',
            },
            body: jsonObjectFormData,
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // Handle successful response and take the promise object and turn it into JSON
            else 
                return response.json();
            
        }).then(data => {
            console.log(data);
            setGames(data);
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
        }
    
    return <div className = 'notsearch'>
        <IoSearch/> 
        <form onSubmit = {handleSubmit} >
            <input 
            type = "text"
            name = 'search'
            /> 
            <input type = "submit"
             /> 
            
        </form>

        {games.map(((game) => {
            return (
                <GameCover 
                    cover={game.cover} /> 
            );
        }) )}
        </div>
}

export default Search;