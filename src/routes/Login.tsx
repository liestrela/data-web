import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/main.css";

export function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loginFail, setLoginFail] = useState(false)

  const navigate = useNavigate();

  const { login: authLogin } = useAuth();

  const handleLogin = async() => {
    if (userName === "usuario" && password === "senha") {
      setLoginFail(false);
      authLogin("token");
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
        className="save-btn"
        onClick={handleLogin}
      >
        Logar
      </button>
      {loginFail && (
        <p className="fail-text">Usuário ou senha incorretos</p>
      )}
      <a 
        href=""
        onClick={() => navigate("/register")}
      >
        Não tem uma conta?<br/>Clique aqui para registrar.
      </a>
    </div>
  );
}

export default Login;
