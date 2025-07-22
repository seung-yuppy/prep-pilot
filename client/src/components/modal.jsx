export default function Modal({ children, onClose }) {
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>X</button>
          {children}
        </div>
      </div>
    </>
  )
}