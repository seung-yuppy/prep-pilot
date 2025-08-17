import SERVER_URL from "../../constant/url";

const postLikePost = async (id) => {
  try {
    const accessToken = localStorage.access;
    const res = await fetch(`${SERVER_URL}${id}/likes`, {
      method: "POST",
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
    return res;
  } catch (error) {
    console.error("좋아요 에러", error);
  }
};

export default postLikePost;