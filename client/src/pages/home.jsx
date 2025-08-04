import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion"; // eslint-disable-line no-unused-vars
import Feed from "../components/feed";
import useGetPosts from "../service/post/useGetPosts";

export default function Home() {
  const [page, setPage] = useState(0);
  const [postList, setPostList] = useState([]);
  const [isEnd, setIsEnd] = useState(false); // 마지막 페이지 여부
  const [loading, setLoading] = useState(false); // 중복 요청 방지

  const { scrollYProgress } = useScroll();
  const { data: posts, isFetching } = useGetPosts(page);

  // 스크롤 95% 이상일 때 로딩 트리거
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > 0.90 && !loading && !isEnd && !isFetching) {
      setLoading(true);
    }
  });

  // 새 데이터 오면 누적
  useEffect(() => {
    if (posts?.content?.length) {
      setPostList((prev) => [...prev, ...posts.content]);

      // 마지막 페이지 여부 판단
      if (posts.last) {
        setIsEnd(true);
      }
    }
    setLoading(false); // 다음 요청 허용
  }, [posts]);

  // loading이 true가 되면 다음 페이지 로드
  useEffect(() => {
    if (loading && !isFetching && !isEnd) {
      setPage((prev) => prev + 1);
    }
  }, [isEnd, isFetching, loading]);

  return (
    <ul className="feed-container">
      {postList.length > 0 ? (
        postList.map((value) => (
          <motion.li
            initial={{ opacity: 0, y: +30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "tween", delay: 0.1 }}
            whileHover={{
              scale: 1.05,
              cursor: "pointer",
              transition: {
                duration: 0.2,
              },
            }}
          >
            <Feed
              key={value.id}
              id={value.id}
              title={value.title}
              content={value.content}
              createdAt={value.createdAt}
              nickname={value.nickname}
            />
          </motion.li>
        ))
      ) : (
        <h1 className="feed-nocontent">글 목록이 없습니다.</h1>
      )}

      {/* ⏳ 로딩 중일 때 표시 */}
      {loading && <p className="feed-loading">로딩 중...</p>}
      {/* ✅ 끝났을 때 표시 */}
      {isEnd && <p className="feed-end">더 이상 글이 없습니다.</p>}
    </ul>
  );
}
