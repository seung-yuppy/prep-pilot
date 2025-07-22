import Join from "../pages/join";
import LogIn from "../pages/login";
import useModalStore from "../store/useModalStore";
import onLogOut from "../util/logout";
import Modal from "./modal";

export default function Menubar() {
  const { isOpen, openModal, closeModal } = useModalStore();

  return (
    <>
      <nav className="menu-gnb">
        {localStorage.getItem("access") ? <button className="btn-log" onClick={onLogOut}>로그아웃</button>  : <button className="btn-log" onClick={() => openModal("login")}>로그인</button>}
        {!localStorage.getItem("access") && <button className="btn-log" onClick={() => openModal("join")}>회원가입</button>}       
      </nav>
      
      {/* 모달 관리 */}
      {isOpen("login") && 
        <Modal onClose={() => closeModal("login")} isBtn={true} btnText={"회원가입➜"} gotoFunc={() => { closeModal("login"); openModal("join"); }}>
          <LogIn />
        </Modal>
      }

      {isOpen("join") && 
        <Modal onClose={() => closeModal("join")} isBtn={true} btnText={"로그인➜"} gotoFunc={() => { closeModal("join"); openModal("login"); }}>
          <Join />
        </Modal>
      }
    </>
  )
}