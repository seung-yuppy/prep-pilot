import { useMutation } from "@tanstack/react-query";
import postLikePost from "../../util/post/postLikePost";

const usePostLikePost = (id, { onSuccess, onError }) => {
  return useMutation({
    mutationFn: () => postLikePost(id),
    onSuccess,
    onError,
  })
};

export default usePostLikePost;