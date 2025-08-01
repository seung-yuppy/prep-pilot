import { useState } from "react";
import useLogIn from "../service/user/useLogIn";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPW] = useState(false);
  const logInMutation = useLogIn();

  const onLogin = async (e) => {
    e.preventDefault();
    logInMutation.mutate({ username, password });
  };

  const onShow = () => {
    setShowPW((prev) => !prev);
  };

  return (
    <>
      <h2 className="login-title">✨로그인</h2>
      <form className="login-form" onSubmit={onLogin}>
        <div className="input-username">
          <input
            type="text"
            className="log-username"
            name="username"
            placeholder="UserName"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-password">
          <input
            type={showPw ? "text" : "password"}
            className="log-password"
            name="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={onShow}
            className={showPw ? "pw-show-btn" : "pw-hide-btn"}
          ></button>
        </div>
        <button type="submit" className="join-btn">
          로그인
        </button>
      </form>
    </>
  );
}
