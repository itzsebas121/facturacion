import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const verifyToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const decodedToken = jwt_decode(token);
            const expirationTime = decodedToken.exp * 1000;
            const currentTime = Date.now();
            console.log(currentTime+"    -     "+expirationTime);
            if (currentTime >= expirationTime) {
                setIsAuthenticated(false);
                alert("Token expirado, vuelva a iniciar sesión");
                window.location.href = '/';
                localStorage.removeItem('token');
            } else {
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error al decodificar el token:', error);
            setIsAuthenticated(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Verificando token...');
            verifyToken();
        }, 2000);

        return () => clearInterval(interval);
    }, []);




    return { isAuthenticated };
};

export default useAuth;
