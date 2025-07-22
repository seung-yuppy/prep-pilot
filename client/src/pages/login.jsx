import { useState } from "react";
import useModalStore from "../store/useModalStore";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPW] = useState(false);
  const { closeModal } = useModalStore();

  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("로그인 실패");
      }
      const accessToken = res.headers.get("access");
      if (accessToken) {
        localStorage.setItem("access", accessToken);
        alert("로그인 하였습니다.");
        closeModal("login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onShow = () => {
    setShowPW((prev) => !prev);
  };

  return (
    <>
      <div>
        <h2 className="login-title">✨로그인</h2>
        <form className="login-form" onSubmit={onLogin}>
          <div className="input-username">
            <input type="text" className="log-username" name="username" placeholder="UserName" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="input-password">
            <input type={showPw ? "text" : "password"} className="log-password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={onShow} className={showPw ? "pw-show-btn":"pw-hide-btn"}></button>
          </div>
          <button type="submit" className="join-btn">로그인</button>
        </form>
      </div>
    </>
  );
}
