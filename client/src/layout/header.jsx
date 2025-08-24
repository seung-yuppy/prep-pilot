import { Link } from "react-router-dom";
import Menubar from "../components/menubar";

export default function Header() {
  return (
    <>
      <div className="home-container">
        <Link to={"/"}>
          <h1 className="home-title">✈️Prep Pilot</h1>
        </Link>
        <Menubar />
      </div>
    </>
  );
}
