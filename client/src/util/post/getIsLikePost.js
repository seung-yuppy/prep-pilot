import SERVER_URL from "../../constant/url";

const getIsLikePost = async (id) => {
  try {
    const accessToken = localStorage.access;
    const res = await fetch(`${SERVER_URL}${id}/isLike`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",
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
    return data;
  } catch (error) {
    console.error("좋아요 유무 찾기 에러", error);
  }
}

export default getIsLikePost;