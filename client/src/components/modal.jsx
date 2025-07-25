export default function Modal({ children, onClose, isBtn, gotoFunc, btnText }) {
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="btn-container">
            <button className="modal-close" onClick={onClose}>X</button>
          </div>
          {children}
          {isBtn && <button className="modal-etcbtn" type="button" onClick={gotoFunc}>{btnText}</button>}
        </div>
      </div>
    </>
  );
}
