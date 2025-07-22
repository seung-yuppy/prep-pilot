import { useState } from "react";
import useModalStore from "../store/useModalStore";

export default function Join() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState(""); 
  const [errUsername, setErrUsername] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errName, setErrName] = useState("");
  const [errNickname, setErrNickname] = useState("");
  const [showPw, setShowPW] = useState(false);
  const { closeModal } = useModalStore();

  const onJoin = async (e) => {
    e.preventDefault();
    setErrEmail("");
    setErrName("");
    setErrUsername("");
    setErrPassword("");
    setErrNickname("");
    try {
      const response = await fetch("http://localhost:8080/join",{
        method:"POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email, name, nickname }),
      });
      const data = await response.json();
      if(response.status === 200 || response.status === 201) {
        alert("회원가입이 완료되었습니다.");
        closeModal("join");
      };
      if(data.error === "이미 사용중인 아이디입니다.")
        setErrUsername(data.error);
      if(data.error === "이미 사용중인 이메일입니다.")
        setErrEmail(data.error);
      if(data.error === "이미 사용중인 닉네임입니다.")
        setErrNickname(data.error);
      if(data.username) 
        setErrUsername(data.username);
      if(data.password)
        setErrPassword(data.password);
      if(data.email)
        setErrEmail(data.email);
      if(data.name)
        setErrName(data.name);
      if(data.nickname)
        setErrNickname(data.nickname)
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
          </div>     
          <span className="alert-msg">{errUsername}</span>
          <div className="input-password">
            <input type={showPw ? "text" : "password"} className="log-password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={onShow} className={showPw ? "pw-show-btn":"pw-hide-btn"}></button>
          </div>
          <span className="alert-msg">{errPassword}</span>
          <div className="input-username">
            <input type="email" className="log-email" name="email" placeholder="E-Mail" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <span className="alert-msg">{errEmail}</span>
          <div className="input-username">
            <input type="text" className="log-name" name="name" placeholder="Name" onChange={(e) => setName(e.target.value)} />
          </div>
          <span className="alert-msg">{errName}</span>
          <div className="input-username">
            <input type="text" className="log-nickname" name="nickname" placeholder="NickName (a.k.a)" onChange={(e) => setNickname(e.target.value)} />
          </div>
          <span className="alert-msg">{errNickname}</span>
          <button type="submit" className="join-btn">회원가입</button>
        </form>
      </div>
    </>
  )
}