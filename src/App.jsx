import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/Login/LoginForm';
import Home from './pages/HomePage/Home';
import SalesOrders from './pages/SalesOrders/SalesOrders';
import History from './pages/HistoryPage/History';
import useAuth from './hooks/useAuth';
import Loading from './components/Loading';
import Dashboard from './pages/Dashboard/Dashboard';

function App() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return <Loading></Loading>;
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route
            path="/home"
            element={
              <Home />
            }
          >
            <Route index element={<Dashboard></Dashboard>} />
            <Route path="sales" element={<SalesOrders />} />
            <Route path="history" element={<History />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
