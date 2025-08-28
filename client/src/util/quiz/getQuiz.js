import SERVER_URL from "../../constant/url";

const getQuiz = async (id, text, page) => {
  try {
    const isQuiz = await fetch(`${SERVER_URL}${id}/quiz/present`, {
      method: "GET",
    })
    const isQuizResult = await isQuiz.text();
    console.log(isQuizResult);

    if (isQuizResult === "false") {
      const quizSave = await fetch(`${SERVER_URL}${id}/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text })
      });
      console.log("quiz 생성", quizSave);
    }

    const res = await fetch(`${SERVER_URL}${id}/quiz?page=${page}`, {
      method: "GET",
    });
    const data = await res.json();
    console.log("quizData는 ", data);
    return data;
  } catch (error) {
    console.error("퀴즈 불러오기 오류", error);
  }
}

export default getQuiz;