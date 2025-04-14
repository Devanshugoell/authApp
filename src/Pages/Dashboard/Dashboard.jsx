import { useAuth } from "../../context/AuthContext";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>hi, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <p>username : {user?.username}</p>
      <button onClick={handleLogout} className="button">
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
