import { Link } from "react-router-dom";
import Feed from "../components/feed";
import Menubar from "../components/menubar";
import useGetPosts from "../service/post/useGetPosts";
import Header from "../layout/header";

export default function Home() {
  const { data: posts } = useGetPosts();

  return (
    <>
      <div className="feed-container">
        {posts ? (
          posts?.content.map((value, index) => (
            <Feed
              key={index}
              id={value?.id}
              title={value?.title}
              content={value?.content}
              createdAt={value?.createdAt}
              nickname={value?.nickname}
            />
          ))
        ) : (
          <h1 className="feed-nocontent">글 목록이 없습니다.</h1>
        )}
      </div>
    </>
  );
}
