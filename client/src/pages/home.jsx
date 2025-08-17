import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Feed from "../components/feed";
import getPosts from "../util/post/getPosts"; // pageParam 받아야 함
import { useEffect } from "react";

export default function Home() {
  const { scrollYProgress } = useScroll();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["posts"],
      queryFn: ({ pageParam = 0 }) => getPosts(pageParam),
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.last ? undefined : allPages.length;
      },
    });

  // 스크롤 90% 넘으면 다음 페이지 요청
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.9 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  });

  console.log(data);

  const queryClient = useQueryClient();

  useEffect(() => {
      queryClient.invalidateQueries({
        queryKey: ["posts"], 
      });
  },[queryClient]);

  return (
    <ul className="feed-container">
      {data?.pages.map((page) =>
        page.content.map((value) => (
          <li key={value.id}>
            <Feed
              id={value.id}
              title={value.title}
              content={value.content}
              createdAt={value.createdAt}
              nickname={value.nickname}
              commentCounts={value.commentCounts}
              likesCounts={value.likesCounts}
            />
          </li>
        ))
      )}
      {isFetchingNextPage && <h1 className="feed-nocontent">로딩 중...</h1>}
      {!hasNextPage && <h1 className="feed-nocontent">글 목록이 없습니다.</h1>}
    </ul>
  );
}