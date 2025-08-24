import { useQuery } from "@tanstack/react-query";
import getTrendingPosts from "../../util/post/getTrendingPosts";

const useGetTrendingPosts = (page = 0) => {
  return useQuery({
    queryKey: ["trendingposts", page],
    queryFn: () => getTrendingPosts(page),
    keepPreviousData: true, // 데이터 누적 중 이전 데이터 유지, 네트워크 요청 없이 캐시 사용
    staleTime: 1000 * 60,
  });
};

export default useGetTrendingPosts;