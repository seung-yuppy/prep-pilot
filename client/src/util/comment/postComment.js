import SERVER_URL from "../../constant/url";

const postComment = async (id, content) => {
  try {
    const accessToken = localStorage.access;
    const res = await fetch(`${SERVER_URL}${id}/comment`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'access': `${accessToken}`
      },
      body: JSON.stringify(content),
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
    console.error("댓글 작성 에러", error);
    throw new error;
  }
};

export default postComment;