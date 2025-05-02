import { jwtDecode } from 'jwt-decode';
import NavBar from '../../components/NavBar';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
    const [username, setUsername] = useState('');
    const [authorized, setAuthorized] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username);
        } catch (e) {
            console.error('Invalid token', e);
            setAuthorized(false);
        }
    }, []);

    if (!authorized) {
        window.location.href = '/';
        return <h1>Cargando..</h1>;
    }

    return (
        <div>
            <NavBar username={username} />
            <Outlet />
        </div>
    );
};

export default Home;
