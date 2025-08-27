import SERVER_URL from "../../constant/url";

const getMyPosts = async (page) => {
  try {
    const accessToken = localStorage.access;
    const res = await fetch(`${SERVER_URL}posts/my?page=${page}`, {
      method: "GET",
      headers: {
        "access": `${accessToken}`
      },
      credentials: "include",
    });

    if (!res.ok) {
      const response = await fetch(`${SERVER_URL}reissue`, {
        method: "POST",
        credentials: "include",
      });

      // 새 액세스 토큰을 응답 헤더에서 가져옴
      const newAccessToken = response.headers.get("access");
      if (newAccessToken) {
        localStorage.setItem("access", newAccessToken);
      } else {
        throw new Error("액세스 토큰이 응답에 없음");
      }
    };

    const data = await res.json();
    const content = await data.content;
    return { content };
  } catch (error) {
    console.error("My Tags 불러오기 오류", error);
  }
}

export default getMyPosts;