import { Outlet } from "react-router-dom";
import Header from "./header";

export default function BaseLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};