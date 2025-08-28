import { useQuery } from "@tanstack/react-query";
import getIncorrectQuiz from "../../util/quiz/getIncorrectQuiz";

const useGetIncorrectQuiz = (id) => {
  return useQuery({
    queryKey: ['getincorrectquiz', id],
    queryFn: () => getIncorrectQuiz(id),
  });
};

export default useGetIncorrectQuiz;
