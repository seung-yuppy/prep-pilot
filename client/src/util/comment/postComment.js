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
      throw new Error("댓글 작성 요청에 실패하였습니다.");
    };

    return res;
  } catch (error) {
    console.error("댓글 작성 에러", error);
    throw new error;
  }
};

export default postComment;