import SERVER_URL from "../../constant/url";

const getMyAllQuizList = async () => {
  const accessToken = localStorage.access;
  try {
    const res = await fetch(`${SERVER_URL}quiz/info`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "access": `${accessToken}`,
      },
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("내 퀴즈 불러오기 오류", error);
  }
};

export default getMyAllQuizList;
