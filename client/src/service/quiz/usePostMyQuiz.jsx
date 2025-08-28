import { useMutation } from "@tanstack/react-query";
import postMyQuiz from "../../util/quiz/postMyQuiz";

const usePostMyQuiz = (id) => {
    return useMutation({
    mutationFn: () => postMyQuiz(id),
    onSuccess:{},
    onError:{},
  });
};

export default usePostMyQuiz;
