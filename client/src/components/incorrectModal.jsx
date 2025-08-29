import { useState } from "react";
import useGetIncorrectQuiz from "../service/quiz/useGetIncorrectQuiz";
import useGetMyAllQuiz from "../service/quiz/useGetMyAllQuiz";

export default function IncorrectModal({ closeModal, id, isAll }) {
  const [openStates, setOpenStates] = useState({});
  const { data: incorrectQuiz } = useGetIncorrectQuiz(id);
  const { data: allQuiz } = useGetMyAllQuiz(id);
  const [activeTab, setActiveTab] = useState("wrongs");

  // 해설 보기/숨기기 토글 함수
  const toggleExplanation = (index) => {
    setOpenStates((prevStates) => ({
      ...prevStates,
      [index]: !prevStates[index],
    }));
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content review-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 className="modal-title">📝 오답노트</h2>
          <button onClick={closeModal} className="close-button">
            &times;
          </button>
          {isAll && (
            <>
              <div className="mypage-tab">
                <div className="mypage-tab-menu">
                  <button
                    className={activeTab === "wrongs" ? "active-tab" : ""}
                    onClick={() => setActiveTab("wrongs")}
                  >
                    틀린 문제들
                  </button>
                  <button
                    className={activeTab === "all" ? "active-tab" : ""}
                    onClick={() => setActiveTab("all")}
                  >
                    전체 문제들
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        {activeTab === "wrongs" && (
          <div className="modal-body">
            {/* 👇 incorrectAnswers를 incorrectQuiz로 변경하고, 옵셔널 체이닝(?.)을 추가합니다. */}
            {incorrectQuiz && incorrectQuiz.length > 0 ? (
              incorrectQuiz.map((item, index) => (
                <div
                  key={index}
                  className="review-item"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <p className="question-text">
                    <span className="question-number">Q.</span> {item.question}
                  </p>
                  <p className="answer-text correct-answer">
                    <strong>정답:</strong> {item.answer}
                  </p>
                  <div className="explanation-container">
                    <button
                      onClick={() => toggleExplanation(index)}
                      className="explanation-toggle"
                    >
                      해설 보기 {openStates[index] ? "▲" : "▼"}
                    </button>
                    <div
                      className={`explanation-content ${
                        openStates[index] ? "open" : ""
                      }`}
                    >
                      <p>{item.explanation}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-incorrect">표시할 오답이 없습니다.</p>
            )}
          </div>
        )}
        {activeTab === "all" && (
          <div className="modal-body">
            {allQuiz && allQuiz.length > 0 ? (
              allQuiz.map((item, index) => (
                <div
                  key={index}
                  className="review-item"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <p className="question-text">
                    <span className="question-number">Q.</span> {item.question}
                  </p>
                  <p className="answer-text correct-answer">
                    <strong>정답:</strong> {item.answer}
                  </p>
                  <div className="explanation-container">
                    <button
                      onClick={() => toggleExplanation(index)}
                      className="explanation-toggle"
                    >
                      해설 보기 {openStates[index] ? "▲" : "▼"}
                    </button>
                    <div
                      className={`explanation-content ${
                        openStates[index] ? "open" : ""
                      }`}
                    >
                      <p>{item.explanation}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-incorrect">표시할 문제가 없습니다.</p>
            )}
          </div>
        )}

        <div className="modal-footer">
          <button onClick={closeModal} className="button-primary">
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
