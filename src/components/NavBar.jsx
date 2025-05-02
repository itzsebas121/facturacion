import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/auth';
import './NavBar.css';

const NavBar = (props) => {
    const { logout } = useAuth();
    const username = props.username;
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    Bienvenido, {username}
                </div>
                
                <ul className="navbar-links">
                    
                    <li>
                        <NavLink
                            to="/home"
                            className={({ isActive }) => isActive ? '' : ''}
                        >
                         <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>   
                            Inicio
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/home/sales"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            Sales Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/home/history"
                            className={({ isActive }) => isActive ? 'active' : ''}
                        >
                            <svg className="nav-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            History
                        </NavLink>
                    </li>
                </ul>
                
                <div className="navbar-logout">
                    <button className="logout-button" onClick={logout}>
                        <span>Logout</span>
                        <svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
