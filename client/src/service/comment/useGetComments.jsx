import { useQuery } from "@tanstack/react-query"
import getComments from "../../util/comment/getComments";

const useGetComments = (id) => {
  return useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id)
  });
};

export default useGetComments;