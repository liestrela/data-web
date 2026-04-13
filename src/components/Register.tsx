import { useState } from "react";
import './Login-Register.css'

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

  const registerUser = () => {
    if (passwordRepeat !== password) {
      setPasswordEqual(false);
      return;
    }
  }

  return (
    <div className="login-page">
      <label htmlFor="username-register">Usuário:</label>
      <input 
        id="username-register"
        type="text"
        value={userName}
        className="subject-input"
        style={{border : 'none'}}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Digite o nome de usuário"
        />
      {userExists && (
        <p className="fail-text">Usuário já cadastrado</p>
      )}
      <label htmlFor="email-register">Email:</label>
      <input 
        id="email-register"
        type="text"
        value={email}
        className="subject-input"
        style={{border : 'none'}}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Digite seu email"
        />
      {emailExists && (
        <p className="fail-text">Email já cadastrado</p>
      )}
      <label htmlFor="password-register">Senha:</label>
      <input
        id="password-register"
        type="password"
        value={password}
        className="subject-input"
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
      {passwordLength < 8 && (
        <p className="fail-text">No mínimo 8 caracteres</p>
      )}
      <label htmlFor="password-register-repeat">Repita sua senha:</label>
      <input
        id="password-register-repeat"
        type="password"
        value={passwordRepeat}
        className="subject-input"
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
      <button
        className="save-btn"
        onClick={registerUser}
        style={{backgroundColor : (passwordEqual && 
          userName.length > 1 && email.length > 1 &&
          passwordLength >= 8) 
          ? "#45718d" : "gray"}}
      >
        Registar
      </button>
    </div>
  )
}