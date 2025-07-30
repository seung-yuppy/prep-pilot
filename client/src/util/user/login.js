import SERVER_URL from "../../constant/url";

const onLogIn = async ({ username, password}) => {
  try {
    const res = await fetch(`${SERVER_URL}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
        }
        throw new Error("로그인 요청에 실패했습니다.");
      }
      
      const accessToken = res.headers.get("access");
      if (accessToken) {
        localStorage.setItem("access", accessToken);
      }
      if (!accessToken) {
        throw new Error("access 토큰이 존재하지 않습니다. 로그인 실패");
      }    
      return accessToken;
  } catch (error) {
    console.error("로그인 에러 발생", error);
    throw error;
  }
}

export default onLogIn;