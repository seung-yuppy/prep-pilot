import { useQuery } from "@tanstack/react-query";
import getPosts from "../../util/post/getPosts";

const useGetPosts = (page = 0) => {
  return useQuery({
    queryKey: ["posts", page],
    queryFn: () => getPosts(page),
    keepPreviousData: true, // 데이터 누적 중 이전 데이터 유지, 네트워크 요청 없이 캐시 사용
    staleTime: 1000 * 60,
  });
};

export default useGetPosts;