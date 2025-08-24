import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useMotionValueEvent, useScroll } from "framer-motion";
import Feed from "../components/feed";
import getPosts from "../util/post/getPosts"; // pageParam 받아야 함
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getTrendingPosts from "../util/post/getTrendingPosts";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const isTrendingPage = location.pathname === "/trending";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: isTrendingPage ? ["trendingposts"] : ["posts"],
      queryFn: ({ pageParam = 0 }) =>       isTrendingPage
        ? getTrendingPosts(pageParam)
        : getPosts(pageParam),
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

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["posts"],
    });
  }, [queryClient]);

  return (
    <>
      <div className="home-category">
        <div className="category-tab">
          <Link to={`/`} className={isTrendingPage ? "inactive-tab" : "active-tab"}>최신</Link>
          <Link to={`/trending`} className={isTrendingPage ? "active-tab" : "inactive-tab"}>트렌딩</Link>
        </div>
        <div className="category-search">
          <form>
            <select>
              <option>제목</option>
              <option>닉네임</option>
              <option>내용</option>
            </select>
            <input 
              type="text" 
              placeholder="검색어를 입력하세요." 
              value={searchText} 
              onChange={(e) =>  setSearchText(e.target.value)} 
            />
            <button type="submit">검색</button>
          </form>
        </div>
      </div>
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
        {!hasNextPage && (
          <h1 className="feed-nocontent">글 목록이 없습니다.</h1>
        )}
      </ul>
    </>
  );
}
