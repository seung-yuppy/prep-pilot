import SERVER_URL from "../../constant/url";

const postMyQuiz = async (id, userAnswer, isCorrect) => {
  const accessToken = localStorage.access;
  try {
    const res = await fetch(`${SERVER_URL}quiz/${id}/save`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'access': `${accessToken}`
      },
      body: JSON.stringify({ userAnswer, isCorrect })
    });
    return res;
  } catch (error) {
    console.error("내 퀴즈 정답 처리 오류", error);  
  }
};

export default postMyQuiz;