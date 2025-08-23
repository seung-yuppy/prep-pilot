import { useMutation } from "@tanstack/react-query"
import onLogOut from "../../util/user/logout"
import useUserStore from "../../store/useUserStore";

const useLogOut = () => {
  const { logOut } = useUserStore();

  return useMutation({
    mutationFn: onLogOut,
    onSuccess: () => {
      logOut();
      alert("로그아웃 하였습니다.");
    },
    onError: (error) => {
      console.log("로그아웃 에러 발생", error);
    }
  });
};

export default useLogOut;