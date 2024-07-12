import { IoLogOutOutline, IoSettings, IoFileTrayStacked, IoLogInOutline, IoCreateOutline,  IoBarChartSharp, IoSearch } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const Sidebar = () => {
    const location = useLocation();
    const { isLoggedIn, toggleLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedIn = () => {
            const token = localStorage.getItem('access');
            if (token === null || token === undefined) {
                toggleLoggedIn(false);
            }
            else {
                toggleLoggedIn(true);
            }
        };

        checkLoggedIn();


    }, [toggleLoggedIn]);

    const logout = () => {
        toggleLoggedIn(false);
        localStorage.removeItem('access');
        navigate('/login');
    }

    return (
        <nav className='sideBar'>
            <div className='middleNavigation'>
                {isLoggedIn ? <ul className='list'>
                    <li className={`row ${location.pathname === '/collection' ? 'row-active' : ''}`}>
                        <IoFileTrayStacked className='icons' />
                        <Link to='/collection' className='navlinks'  >
                            Collection
                        </Link>
                    </li>
                    <li className={`row ${location.pathname === '/statistics' ? 'row-active' : ''}`}>
                        <IoBarChartSharp className='icons' />
                        <Link to='/statistics' className='navlinks'  >
                            Statistics
                        </Link>
                    </li>

                    <li className={`row ${location.pathname === '/search' ? 'row-active' : ''}`}>
                        <IoSearch className='icons' />
                        <Link to='/search' className='navlinks'  >
                            Search
                        </Link>
                    </li>



                    <li className={`row ${location.pathname === '/settings' ? 'row-active' : ''}`}>
                        <IoSettings className='icons' />
                        <Link to='/settings' className='navlinks'>
                            Settings
                        </Link>
                    </li>

                    <li className='row' onClick={logout}>
                        <IoLogOutOutline className='icons' />
                        <label className='navlinks'>
                            Logout
                        </label>
                    </li>
                </ul> :
                    <ul className='list'>
                        <li className={`row ${location.pathname === '/register' ? 'row-active' : ''}`}>
                            <IoCreateOutline className='icons' />
                            <Link to='/register' className='navlinks'>
                                Register
                            </Link>

                        </li>
                        <li className={`row ${location.pathname === '/login' ? 'row-active' : ''}`}>
                            <IoLogInOutline className='icons' />
                            <Link to='/login' className='navlinks'>
                                Login
                            </Link>
                        </li>
                    </ul>
                }


            </div>


        </nav>
    )
}
export default Sidebar;