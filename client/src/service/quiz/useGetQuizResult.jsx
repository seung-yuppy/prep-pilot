import { useQuery } from "@tanstack/react-query";
import getQuizResult from "../../util/quiz/getQuizResult";

const useGetQuizResult = () => {
  return useQuery({
    queryKey: ['getQuizResult'],
    queryFn: getQuizResult,
  }); 
};

export default useGetQuizResult;