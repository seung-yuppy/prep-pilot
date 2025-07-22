import { useState } from "react";

export default function Join() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errUsername, setErrUsername] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errName, setErrName] = useState("");
  const [showPw, setShowPW] = useState(false);

  const onJoin = async (e) => {
    e.preventDefault();
    setErrEmail("");
    setErrName("");
    setErrUsername("");
    setErrPassword("");
    try {
      const response = await fetch("http://localhost:8080/join",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email, name }),
      });
      const data = await response.json();
      console.log(data);
      if(data.username) 
        setErrUsername(data.username);
      if(data.password)
        setErrPassword(data.password);
      if(data.email)
        setErrEmail(data.email);
      if(data.name)
        setErrName(data.name);
    } catch (error) {
      console.error(error);
    }
  };

  const onShow = () => {
    setShowPW((prev) => !prev);
  };

  return(
    <>
      <div>
        <h2 className="login-title">✨회원가입</h2>
        <form className="login-form" onSubmit={onJoin}>
          <div className="input-username">
            <input type="text" className="log-username" name="username" placeholder="UserName" onChange={(e) => setUsername(e.target.value)} />  
            <span className="alert-msg">{errUsername}</span>
          </div>     
          <div className="input-password">
            <input type={showPw ? "text" : "password"} className="log-password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={onShow} className="pw-btn">👁️</button>
            <span className="alert-msg">{errPassword}</span>
          </div>
          <div className="input-username">
            <input type="email" className="log-email" name="email" placeholder="E-Mail" onChange={(e) => setEmail(e.target.value)} />
            <span className="alert-msg">{errEmail}</span>
          </div>
          <div className="input-username">
            <input type="text" className="log-name" name="name" placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <span className="alert-msg">{errName}</span>
          </div>
          <button type="submit" className="join-btn">회원가입</button>
        </form>
      </div>
    </>
  )
}