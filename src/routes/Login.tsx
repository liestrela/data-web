import { useState } from "react";

export function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  // Setar a falha do login deve ser feito no login
  // Seria bom trazer erro de nome de usuario inexiste 
  // senha errada etc
  const [loginFail, setLoginFail] = useState(false)

  const login = () => {

  }

  return (
    <div className="login-page">
      <label htmlFor="username-login">Usuário:</label>
      <input 
        id="username-login"
        type="text"
        value={userName}
        className="subject-input"
        style={{border : 'none'}}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Digite o seu nome de usuário"
        />
      <label htmlFor="password-login">Senha:</label>
      <input
        id="password-login"
        type="password"
        value={password}
        className="subject-input"
        style={{border : 'none'}}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Digite a sua senha"
      />
      <a href="">Esqueceu a senha?</a>
      <button
        className="save-btn"
      >
        Logar
      </button>
      {loginFail && (
        <p className="fail-text">Login falhou</p>
      )}
      <a href="">Não tem uma conta? <br />Clique aqui para registrar.</a>

    </div>
  )
}

export default Login;
