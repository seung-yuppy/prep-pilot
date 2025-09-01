import { useState } from "react";
import useJoin from "../service/user/useJoin";
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

  const joinMutation = useJoin({
    onSuccess: (response) => {
      setErrEmail("");
      setErrName("");
      setErrUsername("");
      setErrPassword("");
      setErrNickname("");
      
      // 중복검사
      if (response.data.error === "이미 사용중인 아이디입니다.")
        setErrUsername(response.data.error);
      if (response.data.error === "이미 사용중인 이메일입니다.")
        setErrEmail(response.data.error);
      if (response.data.error === "이미 사용중인 닉네임입니다.")
        setErrNickname(response.data.error);

      // 유효성 검사
      if (response.data.username) setErrUsername(response.data.username);
      if (response.data.password) setErrPassword(response.data.password);
      if (response.data.email) setErrEmail(response.data.email);
      if (response.data.name) setErrName(response.data.name);
      if (response.data.nickname) setErrNickname(response.data.nickname);

      // 회원가입 성공
      if (response.response.status === 201) {
        alert("회원가입 완료");
        closeModal("join");
      }
    },
    onError: (error) => {
      console.log("회원가입 서버 오류", error);
    },
  });

  const joining = async (e) => {
    e.preventDefault();
    joinMutation.mutate({ username, password, email, name, nickname });
  };

  const onShow = () => {
    setShowPW((prev) => !prev);
  };

  return (
    <div className="join-wrapper">
      <h2 className="join-title">✨ 회원가입</h2>
      <form className="join-form" onSubmit={joining}>
        <div className="input-username">
          <input 
            type="text" 
            className="log-username" 
            name="username" 
            placeholder="사용자명을 입력하세요" 
            onChange={(e) => setUsername(e.target.value)} 
          />  
        </div>     
        <span className="alert-msg">{errUsername}</span>
        <div className="input-password">
          <input 
            type={showPw ? "text" : "password"} 
            className="log-password" 
            name="password" 
            placeholder="비밀번호를 입력하세요" 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button type="button" onClick={onShow} className={showPw ? "pw-show-btn":"pw-hide-btn"}></button>
        </div>
        <span className="alert-msg">{errPassword}</span>
        <div className="input-email">
          <input 
            type="email" 
            className="log-email" 
            name="email" 
            placeholder="이메일을 입력하세요" 
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <span className="alert-msg">{errEmail}</span>
        <div className="input-name">
          <input 
            type="text" 
            className="log-name" 
            name="name" 
            placeholder="실명을 입력하세요" 
            onChange={(e) => setName(e.target.value)} 
          />
        </div>
        <span className="alert-msg">{errName}</span>
        <div className="input-nickname">
          <input 
            type="text" 
            className="log-nickname" 
            name="nickname" 
            placeholder="닉네임을 입력하세요" 
            onChange={(e) => setNickname(e.target.value)} 
          />
        </div>
        <span className="alert-msg">{errNickname}</span>
        <button type="submit" className="join-btn">회원가입</button>
      </form>
    </div>
  );
}
