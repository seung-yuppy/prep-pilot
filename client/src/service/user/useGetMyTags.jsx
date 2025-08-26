import { useQuery } from "@tanstack/react-query";
import getMyTags from "../../util/user/getMyTags";

const useGetMyTags = (userId) => {
  return useQuery({
    queryKey: ["myTags", userId],
    queryFn: () => getMyTags(userId),
    enabled: !!userId, 
  });
};

export default useGetMyTags;