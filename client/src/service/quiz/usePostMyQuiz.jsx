import { useMutation } from "@tanstack/react-query";
import postMyQuiz from "../../util/quiz/postMyQuiz";

const usePostMyQuiz = () => {
    return useMutation({
    // 👇 mutationFn은 단일 인자(객체)를 받도록 수정합니다.
    // 받은 객체를 분해해서 postMyQuiz 함수에 전달합니다.
    mutationFn: ({ id, userAnswer, isCorrect }) => 
      postMyQuiz(id, userAnswer, isCorrect),
    onSuccess: () => {
      console.log("퀴즈가 성공적으로 저장되었습니다.");
    },
    onError: (error) => {
      console.error("퀴즈 저장 중 에러 발생:", error);
    },
  });
};

export default usePostMyQuiz;
