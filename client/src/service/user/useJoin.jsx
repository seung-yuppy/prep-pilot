import { useMutation } from "@tanstack/react-query";
import onJoin from "../../util/user/join";

// 직접 상태를 처리하기 위해...
const useJoin = ({ onSuccess, onError}) => {
  return useMutation({
    mutationFn: onJoin,
    onSuccess,
    onError
  })
}

export default useJoin;