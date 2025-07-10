import { useState } from "react";

export default function LogIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      console.log(res);
      console.log(res.headers);
      console.log(res.headers.get("access"));
      const accessToken = res.headers.get("access");
      if (accessToken) {
        localStorage.setItem("access", accessToken);
        alert("로그인 하였습니다.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onLogOut = async () => {
    try {
      await fetch(`http://localhost:8080/logout`, {
        method: "POST",
        credentials: "include",
      })
      localStorage.removeItem("access");
      alert("로그아웃 하였습니다.");
    } catch (error) {
      console.error("로그아웃 에러 발생", error);
    }

  }

  return (
    <>
      <div>
        <h2 className="login-title">✨로그인✨</h2>
        <form className="login-form" onSubmit={onLogin}>
          <input type="text" name="username" placeholder="UserName" onChange={(e) => setUsername(e.target.value)} />
          <input type="password" name="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">로그인</button>
          <button type="button" onClick={onLogOut}>로그아웃</button>
        </form>
      </div>
    </>
  );
}
