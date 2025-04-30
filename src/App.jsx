import './App.css';
import LoginForm from './pages/Login/LoginForm';
import Home from './pages/HomePage/Home';
import SalesOrders from './pages/SalesOrders/SalesOrders';
import History from './pages/HistoryPage/History';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          
          <Route path="/home" element={<Home />}>
            <Route index element={<div>Dashboard o pantalla inicial</div>} />
            <Route path="sales" element={<SalesOrders />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
