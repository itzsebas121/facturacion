import NavBar from '../../components/NavBar';
import { Outlet } from 'react-router-dom';

const Home = () => {
    
    return (
        <div>
            <NavBar />
            <Outlet />
        </div>
    );
};

export default Home;
