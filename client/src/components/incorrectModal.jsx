import { useState } from "react";
import useGetIncorrectQuiz from "../service/quiz/useGetIncorrectQuiz";

const incorrectAnswers = [
    { 
      question: "Java에서 객체의 내용(값) 자체를 비교하는 메소드는 무엇인가요?", 
      answer: "equals",
      explanation: "'==' 연산자는 객체의 메모리 주소값을 비교하지만, '.equals()' 메소드는 객체 내부의 값을 비교하여 내용이 같은지 확인합니다."
    },
    { 
      question: "Spring MVC의 모든 요청을 처리하는 Front Controller의 이름은 무엇인가요?", 
      answer: "DispatcherServlet",
      explanation: "DispatcherServlet은 클라이언트의 모든 요청을 단일 지점에서 받아 처리하고, 적절한 핸들러에게 작업을 위임하는 Spring MVC의 핵심 구성요소입니다."
    },
    { 
      question: "객체 간의 의존관계를 외부에서 주입하여 클래스 간의 결합도를 낮추는 Spring의 핵심 원칙은 무엇인가요?", 
      answer: "의존성 주입",
      explanation: "의존성 주입은 객체가 직접 의존성을 생성하지 않고 외부(Spring 컨테이너)로부터 받아 사용함으로써, 코드의 유연성과 테스트 용이성을 높이는 디자인 패턴입니다."
    },
];

export default function IncorrectModal({ closeModal, id }) {
  const [openStates, setOpenStates] = useState({});
  const { data: incorrectQuiz } = useGetIncorrectQuiz(id);
  console.log(incorrectQuiz);
  
  // 해설 보기/숨기기 토글 함수
  const toggleExplanation = (index) => {
    setOpenStates(prevStates => ({
      ...prevStates, // 기존 상태 복사
      [index]: !prevStates[index] // 현재 인덱스의 boolean 값을 반전
    }));
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">📝 오답노트</h2>
          <button onClick={closeModal} className="close-button">&times;</button>
        </div>
        <div className="modal-body">
          {incorrectAnswers && incorrectAnswers.length > 0 ? (
            incorrectAnswers.map((item, index) => (
              <div key={index} className="review-item" style={{ animationDelay: `${index * 0.2}s` }}>
                <p className="question-text">
                  <span className="question-number">Q.</span> {item.question}
                </p>
                <p className="answer-text correct-answer">
                  <strong>정답:</strong> {item.answer}
                </p>
                <div className="explanation-container">
                  <button onClick={() => toggleExplanation(index)} className="explanation-toggle">
                    해설 보기 {openStates[index] ? '▲' : '▼'}
                  </button>
                  <div className={`explanation-content ${openStates[index] ? 'open' : ''}`}>
                    <p>{item.explanation}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-incorrect">표시할 오답이 없습니다.</p>
          )}
        </div>
        <div className="modal-footer">
          <button onClick={closeModal} className="button-primary">확인</button>
        </div>
      </div>
    </div>
  );
}