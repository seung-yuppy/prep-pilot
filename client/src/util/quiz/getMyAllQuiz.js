import SERVER_URL from "../../constant/url";

const getMyAllQuiz = async (id) => {
    const accessToken = localStorage.access;
  try {
    const res = await fetch(`${SERVER_URL}${id}/quiz/solved`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access": `${accessToken}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("내가 푼 모든 퀴즈 불러오기 오류", error);
  }
};

export default getMyAllQuiz;