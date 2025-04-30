// src/hooks/useAuth.js
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return { logout };
}
