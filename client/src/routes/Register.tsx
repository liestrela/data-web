import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "../styles/main.css";
import "../styles/login-register.css";

export function Register() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordLength, setPasswordLenght] = useState(0);
  const [passwordRepeat, setPasswordRepeat] = useState("");
  // Os existem devem ser verificados quando o registro for realizado
  const [emailExists, setEmailExists] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [passwordEqual, setPasswordEqual] = useState(false);

  const navigate = useNavigate();

  const { login: authLogin } = useAuth();

  const registerUser = async () => {
    if (passwordRepeat !== password) {
      setPasswordEqual(false);
      return;
    }

    if (email === "") {
      return;
    }

    if (userName === "") {
      return;
    }

    const url = "http://localhost:3001/api/auth/register";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName, email: email, password : password})
      })

      if (!response.ok) {
        throw new Error(`Response register status: ${response.status}`)
      }

      const result = await response.json();

      if (result.message === "ok") {
        await authLogin(userName, password);
        navigate("/");
      } else if (result.message === "name") {
        setUserExists(true);
      } else if (result.message === "email") {
        setEmailExists(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }

  return (
    <div className="app">
      <h1>Registrar</h1>
      <div className="login-container">
        <label htmlFor="username-register">Usuário:</label>
        <input 
          id="username-register"
          type="text"
          value={userName}
          className="login-input"
          style={{border : 'none'}}
          onChange={(e) => {
            setUserName(e.target.value);
            setUserExists(false);
          }}
          placeholder="Digite o nome de usuário"
          />
        {userExists && (
          <p className="fail-text">Usuário já cadastrado</p>
        )}
      </div>

      <div className="login-container">
        <label htmlFor="email-register">Email:</label>
        <input 
          id="email-register"
          type="email"
          value={email}
          className="login-input"
          style={{border : 'none'}}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailExists(false);
          }}
          placeholder="Digite seu email"
          />
        {emailExists && (
          <p className="fail-text">Email já cadastrado</p>
        )}
      </div>

      <div className="login-container">
        <label htmlFor="password-register">Senha:</label>
        <input
          id="password-register"
          type="password"
          value={password}
          className="login-input"
          style={{border : 'none'}}
          onChange={(e) =>{      
            if (e.target.value === passwordRepeat)
              setPasswordEqual(true);
            else
              setPasswordEqual(false);

            setPasswordLenght(e.target.value.length);
            setPassword(e.target.value);
            }}
          placeholder="Digite a senha"
        />
        {password && passwordLength < 8 && (
          <p className="fail-text">No mínimo 8 caracteres</p>
        )}
      </div>

      <div className="login-container">
        <label htmlFor="password-register-repeat">Repita sua senha:</label>
        <input
          id="password-register-repeat"
          type="password"
          value={passwordRepeat}
          className="login-input"
          style={{border : 'none'}}
          onChange={(e) => {
            if (e.target.value === password)
              setPasswordEqual(true);
            else
              setPasswordEqual(false);

            setPasswordRepeat(e.target.value);
          }}
          placeholder="Digite sua senha novamente"
        />
        {(!passwordEqual && passwordRepeat.length > 0) && (
          <p className="fail-text">Senhas diferentes</p>
        )}
      </div>
      <button
        className="login-btn"
        onClick={registerUser}
      >
        Registrar
      </button>
    </div>
  )
}

export default Register;
