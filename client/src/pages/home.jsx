import Feed from "../components/feed";
import Menubar from "../components/menubar";

export default function Home() {
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <>
      <div className="home-container">
        <h1 className="home-title">✨Prep Pilot</h1>
        <Menubar />
      </div>

      <div className="feed-container">
        {arr.map(() => (
          <Feed />
        ))} 
      </div>
    </>
  );
}
