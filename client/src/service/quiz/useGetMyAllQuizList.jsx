import { useQuery } from "@tanstack/react-query";
import getMyAllQuizList from "../../util/quiz/getMyAllQuizIist";

const useGetMyAllQuizList = () => {
  return useQuery({
    queryKey: ['getMyAllQuizList'],
    queryFn: getMyAllQuizList
  });
};

export default useGetMyAllQuizList;