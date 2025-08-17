import { useMutation } from "@tanstack/react-query";
import postLikePost from "../../util/post/postLikePost";

const usePostLikePost = (id) => {
  return useMutation({
    mutationFn: () => postLikePost(id),
    onSuccess: () => alert("이 게시글을 좋아합니다."),
    onError: (error) => alert("게시글 좋아요 에러 발생", error)
  })
};

export default usePostLikePost;