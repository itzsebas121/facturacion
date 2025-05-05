import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';
import useAuth from '../hooks/useAuth';
import { useEffect } from 'react';

const NavBar = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate('/'); 
        }
    }, [isAuthenticated, navigate]);

    const logout = () => {
        localStorage.removeItem("token");
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo">
                    <h2>Bienvenido</h2>
                </div>

                <ul className="navbar-links">
                    <li>
                        <NavLink to="/home">Inicio</NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/sales">Sales Orders</NavLink>
                    </li>
                    <li>
                        <NavLink to="/home/history">History</NavLink>
                    </li>
                </ul>

                <div className="navbar-logout">
                    <button className="logout-button" onClick={logout}>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
