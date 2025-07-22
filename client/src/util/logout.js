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

export default onLogOut;