import { getUser, logout } from "../utils/auth";

function Dashboard() {
  const user = getUser();

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user?.name}</h2>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout} style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
