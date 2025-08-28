import SERVER_URL from "../../constant/url";

const getIncorrectQuiz = async (id) => {
  try {
    const res = await fetch(`${SERVER_URL}${id}/quiz/wrong`, {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("오답 퀴즈 불러오기 오류", error);
  }
};

export default getIncorrectQuiz;