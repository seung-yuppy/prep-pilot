export default function Modal({ children, onClose, isBtn, gotoFunc, btnText }) {
  return (
    <>
      <div className="user-modal-overlay">
        <div className="user-modal-content">
          <div className="user-btn-container">
            <button className="user-modal-close" onClick={onClose}>X</button>
          </div>
          {children}
          {isBtn && <button className="user-modal-etcbtn" type="button" onClick={gotoFunc}>{btnText}</button>}
        </div>
      </div>
    </>
  );
}
