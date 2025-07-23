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
      
      const accessToken = res.headers.get("access");
      if (accessToken) {
        localStorage.setItem("access", accessToken);
      }
      return accessToken;
  } catch (error) {
    console.error("로그인 에러 발생", error);
  }
}

export default onLogIn;