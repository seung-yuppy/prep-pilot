
import { useMutation } from "@tanstack/react-query";
import onPostTag from "../../util/tags/postTag";

const usePostTag = ({ onSuccess, onError}) => {
  return useMutation({
    mutationFn: onPostTag,
    onSuccess,
    onError
  })
}

export default usePostTag;
