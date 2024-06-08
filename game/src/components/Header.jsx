import { IoMenu, IoLogInOutline, IoSearch } from "react-icons/io5";
import {Routes, Route, Link} from 'react-router-dom';


const Header = () => {
    return (
    <header className = 'header'> 
        <IoMenu className = 'icons'/>
        <input 
        type='text' 
        className='search'
        placeholder="Search for games!"></input>
    <Link to = "/register" ><IoLogInOutline className="icons"/>
      </Link> 

    </header>
    );
}

export default Header;