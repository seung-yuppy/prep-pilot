import { useMutation } from "@tanstack/react-query";
import onLogIn from "../../util/user/login";
import useModalStore from "../../store/useModalStore";

const useLogIn = () => {
  const { closeModal } = useModalStore();

  return useMutation({
    // mutationFn에는 함수 호출만 해야한다.
    // 인자를 넘길 때에는 mutate()를 호출할 때 넘긴다. 
    mutationFn: onLogIn,
    onSuccess: () => {
      alert("로그인 하였습니다.");
      closeModal("login");
    },
    onError: (error) => {
      console.log("로그인 에러 발생", error);
    }
  });
};

export default useLogIn;