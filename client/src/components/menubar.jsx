import useModal from "../hooks/useModal";
import Join from "../pages/join";
import LogIn from "../pages/login";
import onLogOut from "../util/logout";
import Modal from "./modal";

export default function Menubar() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <>
      <nav className="menu-gnb">
        {localStorage.getItem("access") ? <button className="btn-log" onClick={onLogOut}>로그아웃</button>  : <button className="btn-log" onClick={() => openModal("login")}>로그인</button>}
        <button className="btn-log" onClick={() => openModal("join")}>회원가입</button>       
      </nav>
      
      {/* 모달 관리 */}
      {isOpen("login") && 
        <Modal onClose={() => closeModal("login")}>
          <LogIn />
        </Modal>
      }

      {isOpen("join") && 
        <Modal onClose={() => closeModal("join")}>
          <Join />
        </Modal>
      }
    </>
  )
}