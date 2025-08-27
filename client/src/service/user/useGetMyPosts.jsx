import { useQuery } from "@tanstack/react-query";
import getMyPosts from "../../util/user/getMyPosts";

const useGetMyPosts = () => {
  return useQuery({
    queryKey: ["myPosts"],
    queryFn: getMyPosts,
  });
};

export default useGetMyPosts;