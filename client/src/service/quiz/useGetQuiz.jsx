import { useQuery } from "@tanstack/react-query";
import getQuiz from "../../util/quiz/getQuiz";

const useGetQuiz = (id, text, page) => {
  return useQuery({
    queryKey: ['getquiz', id, text, page],
    queryFn: () => getQuiz(id, text, page),
  });
};

export default useGetQuiz;
