import { useMutation } from "@tanstack/react-query";
import onWrite from "../../util/posts/write";

// 직접 상태를 처리하기 위해...
const useWrite = ({ onSuccess, onError}) => {
  
  return useMutation({
    mutationFn: onWrite,
    onSuccess,
    onError
  })
}

export default useWrite;