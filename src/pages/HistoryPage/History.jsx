import { useAuth } from "../../hooks/auth";
const History =()=>{
    const { logout } = useAuth();
    return (
        <div>
            <h1>History</h1>
            <button onClick={logout}>Logout</button>
        </div>
    )
}
export default History;