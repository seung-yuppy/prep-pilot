import Feed from "../components/feed";
import Menubar from "../components/menubar";
import useGetPosts from "../service/post/useGetPosts";

export default function Home() {
  const { data: posts } = useGetPosts();

  return (
    <>
      <div className="home-wrapper">
        <div className="home-container">
          <h1 className="home-title">✨Prep Pilot</h1>
          <Menubar />
        </div>

        <div className="feed-container">
          {posts ? (
            posts?.content.map((value, index) => (
              <Feed
                key={index}
                id={value?.id}
                title={value?.title}
                content={value?.content}
                createdAt={value?.createdAt}
              />
            ))
          ) : (
            <h1 className="feed-nocontent">글 목록이 없습니다.</h1>
          )}
        </div>
      </div>
    </>
  );
}
