import { useQuery } from "@tanstack/react-query";
import getUserInfo from "../../util/user/getUserInfo";

const useGetUserInfo = () => {
  return useQuery({
    queryKey: ["userinfo"],
    queryFn: getUserInfo,
  });
};

export default useGetUserInfo;