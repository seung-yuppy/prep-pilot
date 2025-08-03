import { useQuery } from "@tanstack/react-query"
import getPost from "../../util/post/getPost"

const useGetPost = (id) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPost(id),
  });
};

export default useGetPost;