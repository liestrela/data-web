import { useState } from "react";
import './Login.css'

export function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="login-page">
      <label htmlFor="username-login">Usuário:</label>
      <input 
        id="username-login"
        type="text"
        value={userName}
        className="username-login"
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Digite o seu nome de usuário"
        />
      <label htmlFor="password-login">Senha:</label>
      <input
        id="password-login" 
        type={isVisible ? "text" : "password"} 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite a sua senha"
      />
      <button onClick={() => setIsVisible(!isVisible)}>
        {isVisible ? "Esconder" : "Mostrar"}
      </button>

    </div>
  )
}