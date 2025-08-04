import { useMutation } from "@tanstack/react-query";
import postComment from "../../util/comment/postComment";

const usePostComment = (id, { onSuccess, onError }) => {
  return useMutation({
    mutationFn: (content) => postComment(id, content),
    onSuccess,
    onError,
  });
};

export default usePostComment;
