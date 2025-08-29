import { useQuery } from "@tanstack/react-query"
import getMyAllQuiz from "../../util/quiz/getMyAllQuiz"

const useGetMyAllQuiz = (id) => {
  return useQuery({
    queryKey: ['getMyAllQuiz', id],
    queryFn: () => getMyAllQuiz(id),
    enabled: !!id,
  });
};

export default useGetMyAllQuiz;