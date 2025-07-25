import SERVER_URL from "../../constant/url";

const onLogOut = async () => {
  try {
    await fetch(`${SERVER_URL}logout`, {
      method: "POST",
      credentials: "include",
    })
  } catch (error) {
    console.error("로그아웃 에러 발생", error);
  }
}

export default onLogOut;