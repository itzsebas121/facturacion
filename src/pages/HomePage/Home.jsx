import { jwtDecode } from 'jwt-decode';
import NavBar from '../../components/NavBar';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const Home = () => {
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const decoded = jwtDecode(token);
            setUsername(decoded.username);
        } catch (e) {
            console.error('Invalid token', e);
        }
    }, []);

    return (
        <div>
            <NavBar />

            <Outlet />
        </div>
    );
};

export default Home;
