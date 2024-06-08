import { IoHome, IoSettings, IoFileTrayStacked, IoLogInOutline, IoCreateOutline, IoSunnyOutline, IoSunny, IoMoon, IoMoonOutline } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom'

const Sidebar = () => {
    const location = useLocation();

    return (
        <nav className='sideBar'>
            <div className='middleNavigation'>
                <ul className='list'>
                    <li className={`row ${location.pathname === '/' ? 'row-active' : ''}`}>
                        <IoHome className='icons' />
                        <Link index className='navlinks' >
                            Home

                        </Link>
                    </li>

                    <li className={`row ${location.pathname === '/collection' ? 'row-active' : ''}`}>
                        <IoFileTrayStacked className='icons' />
                        <Link to='/collection' className='navlinks'  >
                            Collection
                        </Link>
                    </li>



                    <li className={`row ${location.pathname === '/settings' ? 'row-active' : ''}`}>
                        <IoSettings className='icons' />
                        <Link to='/settings' className='navlinks'>
                            Settings
                        </Link>
                    </li>
                </ul>
            </div>
            <div className='bottomNavigation'>
                <div className='signupLogin'>
                    <Link to='/register'          className={`links ${location.pathname === '/register' ? 'active-link' : ''}`}
        >

                        <IoCreateOutline className='bottomLinks'/>
                        Register
                    </Link>
                    <Link to='/login'    className={`links ${location.pathname === '/login' ? 'active-link' : ''}`}>
                        <IoLogInOutline className='bottomLinks'/>
                        Login
                    </Link>
                </div>
                <div className='modeContainer'>
                    <IoSunnyOutline />
                    <IoMoonOutline />
                </div>
            </div>

        </nav>
    )
}
export default Sidebar;