import Join from "../pages/join";
import LogIn from "../pages/login";
import useLogOut from "../service/user/useLogOut";
import useModalStore from "../store/useModalStore";
import Modal from "./modal";
import { Link } from "react-router-dom";
// import useThemeStore from "../store/useThemeStore";

export default function Menubar() {
  const { isOpen, openModal, closeModal } = useModalStore();
  const logOutMutation = useLogOut();
  // const { theme, toggleTheme } = useThemeStore();

  const onLogout = async (e) => {
    e.preventDefault();
    logOutMutation.mutate();
  };

  return (
    <>
      <nav className="menu-gnb">
        {localStorage.getItem("access") ? (
          <>
            <button className="btn-log" onClick={onLogout}>
              로그아웃
            </button>
            <Link to={"/write"} className="btn-log">글쓰기</Link>
            <Link to={"/mypage"} className="btn-log">마이페이지</Link>
          </>
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
        {/* <button className="btn-theme" onClick={toggleTheme}>
          {theme === "dark" ? "🌙" : "☀️"}
        </button> */}
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
