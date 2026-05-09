import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/main.css";
import "../styles/login-register.css";

export function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginFail, setLoginFail] = useState(false)

  const navigate = useNavigate();

  const { login: authLogin } = useAuth();

  const handleLogin = async() => {
    if (await authLogin(userName, password)) {
      setLoginFail(false);
      navigate("/");
    } else {
      setLoginFail(true);
    }
  };

  return (
    <div className="app">
      <h1>Login</h1>
      <div className="login-container">
        <label htmlFor="username-login">Usuário:</label>
        <input 
          id="username-login"
          type="text"
          value={userName}
          className="login-input"
          style={{border : 'none'}}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Digite o seu nome de usuário"
          />
      </div>

      <div className="login-container">
        <label htmlFor="password-login">Senha:</label>
        <input
          id="password-login"
          type="password"
          value={password}
          className="login-input"
          style={{border : 'none'}}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite a sua senha"
        />
      </div>
      <a href="">Esqueceu a senha?</a>
      <button
        className="login-btn"
        onClick={handleLogin}
      >
        Logar
      </button>
      {loginFail && (
        <p className="fail-text">Usuário ou senha incorretos</p>
      )}
      <Link to="/register">
        Não tem uma conta?<br/>Clique aqui para registrar.
      </Link>
    </div>
  );
}

export default Login;
