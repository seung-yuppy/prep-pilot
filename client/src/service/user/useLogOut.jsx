import { useMutation } from "@tanstack/react-query"
import onLogOut from "../../util/user/logout"

const useLogOut = () => {
  return useMutation({
    mutationFn: onLogOut,
    onSuccess: () => {
      localStorage.removeItem("access");
      alert("로그아웃 하였습니다.");
    },
    onError: (error) => {
      console.log("로그아웃 에러 발생", error);
    }
  });
};

export default useLogOut;