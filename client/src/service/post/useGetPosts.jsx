import { useQuery } from "@tanstack/react-query";
import getPosts from "../../util/post/getPosts";

const useGetPosts = (page = 0) => {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => getPosts(page),
  });
};

export default useGetPosts;
