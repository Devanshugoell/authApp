import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/api";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      // Step 1: Login and get tokens
      const response = await api.post("/login", {
        email,
        password,
      });

      const { access_token, refresh_token } = response.data;

      // Step 2: Fetch user profile with new access token
      const profileResponse = await api.get("/profile", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const user = profileResponse.data;

      // Step 3: Save tokens + user into AuthContext
      login(access_token, refresh_token, user);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert("Login failed! Please check your credentials.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="username"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
