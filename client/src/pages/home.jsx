import Feed from "../components/feed";
import Menubar from "../components/menubar";
import useGetPosts from "../service/post/useGetPosts";

export default function Home() {
  // const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const { data: posts } = useGetPosts();

  return (
    <>
      <div className="home-wrapper">
        <div className="home-container">
          <h1 className="home-title">✨Prep Pilot</h1>
          <Menubar />
        </div>

        <div className="feed-container">
          {/* {arr.map((_, index) => (
          <Feed key={index} />
        ))}  */}
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
