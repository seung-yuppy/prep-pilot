import SERVER_URL from "../../constant/url";

const getQuizResult = async () => {
    const accessToken = localStorage.access;
  try {
    const res = await fetch(`${SERVER_URL}quiz/stat`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access": `${accessToken}`,
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("퀴즈 통계 불러오기 오류", error);
  }
};

export default getQuizResult;