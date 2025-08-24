import { Outlet } from "react-router-dom";
import Header from "./header";
import Popup from "../components/Popup";

export default function BaseLayout() {
  return (
    <>
      <Header />
      <main className="main">
        <Outlet />
      </main>
      <Popup />
    </>
  );
};