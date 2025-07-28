import { useMutation } from "@tanstack/react-query";
import onImageUpload from "../../util/posts/imageUpload";

// 직접 상태를 처리하기 위해...
const useImageUpload = ({ onSuccess, onError}) => {
  return useMutation({
    mutationFn: onImageUpload,
    onSuccess,
    onError
  })
}

export default useImageUpload;