import { useQuery } from "@tanstack/react-query";
import getTags from "../../util/post/getTags";

const useGetTags = (id) => {
  return useQuery({
    queryKey: ['getTags', id],
    queryFn: () => getTags(id),
  })
};

export default useGetTags;