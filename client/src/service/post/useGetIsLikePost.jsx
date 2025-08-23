import { useQuery } from "@tanstack/react-query";
import getIsLikePost from "../../util/post/getIsLikePost";

const useGetIsLikePost = (id) => {
  return useQuery({
    queryKey: ['isLikePost', id],
    queryFn: () => getIsLikePost(id),
  })
};

export default useGetIsLikePost;