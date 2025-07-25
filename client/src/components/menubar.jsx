import { useState } from "react";
import Join from "../pages/join";
import LogIn from "../pages/login";
import useLogOut from "../service/user/useLogOut";
import useModalStore from "../store/useModalStore";
import Modal from "./modal";

export default function Menubar() {
  const { isOpen, openModal, closeModal } = useModalStore();
  const logOutMutation = useLogOut();
  const [theme, setTheme] = useState("light");

  const onLogout = async (e) => {
    e.preventDefault();
    logOutMutation.mutate();
  };

  const onToggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    setTheme(next);
  };

  return (
    <>
      <nav className="menu-gnb">
        {localStorage.getItem("access") ? (
          <button className="btn-log" onClick={onLogout}>
            로그아웃
          </button>
        ) : (
          <button className="btn-log" onClick={() => openModal("login")}>
            로그인
          </button>
        )}
        {!localStorage.getItem("access") && (
          <button className="btn-log" onClick={() => openModal("join")}>
            회원가입
          </button>
        )}
        <button className="btn-theme" onClick={onToggleTheme}>
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </nav>

      {/* 모달 관리 */}
      {isOpen("login") && (
        <Modal
          onClose={() => closeModal("login")}
          isBtn={true}
          btnText={"회원가입➜"}
          gotoFunc={() => {
            closeModal("login");
            openModal("join");
          }}
        >
          <LogIn />
        </Modal>
      )}

      {isOpen("join") && (
        <Modal
          onClose={() => closeModal("join")}
          isBtn={true}
          btnText={"로그인➜"}
          gotoFunc={() => {
            closeModal("join");
            openModal("login");
          }}
        >
          <Join />
        </Modal>
      )}
    </>
  );
}
