import { useEffect, useState } from "react";

const questions = [
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

export default function QuizModal({ closeModal }) {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  const totalQuestions = questions.length;
  const currentQuestionData = questions[currentStep];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // '정답 확인' 버튼 클릭 시 실행되는 함수
  const handleCheckAnswer = () => {
    if (userAnswer.trim() === "") {
      alert("정답을 입력해주세요!");
      return;
    }

    const isAnswerCorrect =
      userAnswer.trim().toLowerCase() ===
      currentQuestionData.answer.toLowerCase();
    setIsCorrect(isAnswerCorrect);
    if (isAnswerCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setIsSubmitted(true);
  };

  // '다음 문제' 버튼 클릭 시 실행되는 함수
  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setIsCorrect(null);
    setUserAnswer("");
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // '다시 풀기' 버튼 클릭 시 실행되는 함수
  const handleRestart = () => {
    setCurrentStep(0);
    setUserAnswer("");
    setIsSubmitted(false);
    setIsCorrect(null);
    setScore(0);
  };

  // 사용자가 Enter 키를 눌렀을 때의 동작 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (!isSubmitted) {
        handleCheckAnswer();
      } else {
        if (currentStep < totalQuestions) {
          handleNextQuestion();
        }
      }
    }
  };

  // 모달 내부 컨텐츠 렌더링
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="loading-container">
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
          <p className="loading-message">AI가 까다로운 문제 생성 중...</p>
        </div>
      );
    }
    // 퀴즈가 끝났을 때 결과 화면 표시
    if (currentStep >= totalQuestions) {
      return (
        <>
          <div className="modal-header">
            <h2 className="modal-title result-title">🎉 퀴즈 완료!</h2>
            <button onClick={closeModal} className="close-button">
              &times;
            </button>
          </div>
          <div className="modal-body result-body">
            <p className="result-emoji">
              {score === totalQuestions ? "🏆" : "👍"}
            </p>
            <p className="result-summary">
              총 {totalQuestions}문제 중 <span className="score">{score}</span>
              문제를 맞혔어요!
            </p>
            <p className="result-message">
              오늘도 한 걸음 성장하셨네요. 수고하셨습니다!
            </p>
          </div>
          <div className="modal-footer">
            <button onClick={handleRestart} className="button-primary">
              다시 풀기
            </button>
            <button onClick={closeModal} className="button-secondary">
              닫기
            </button>
          </div>
        </>
      );
    }

    // 퀴즈 진행 중 화면 표시
    return (
      <>
        <div className="modal-header">
          <h2 className="modal-title">💡 핵심 개념 퀴즈</h2>
          <button onClick={closeModal} className="close-button">
            &times;
          </button>
        </div>

        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${((currentStep + 1) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <p className="progress-text">
          {currentStep + 1} / {totalQuestions}
        </p>

        <div className="modal-body">
          <p className="question-text">
            <span className="question-number">Q{currentStep + 1}.</span>{" "}
            {currentQuestionData.question}
          </p>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="정답을 입력하세요..."
            disabled={isSubmitted}
            className={`input-answer ${
              isSubmitted && (isCorrect ? "input-correct" : "input-incorrect")
            }`}
            autoFocus
          />
          {isSubmitted && (
            <p
              className={`feedback-text ${
                isCorrect ? "feedback-correct" : "feedback-incorrect"
              }`}
            >
              {isCorrect
                ? "🎉 정답입니다!"
                : `😥 오답입니다. 정답은 "${currentQuestionData.answer}" 입니다.`}
            </p>
          )}
        </div>
        <div className="modal-footer">
          {!isSubmitted ? (
            <button onClick={handleCheckAnswer} className="button-primary">
              정답 확인
            </button>
          ) : (
            <button onClick={handleNextQuestion} className="button-primary">
              다음 문제 &rarr;
            </button>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">{renderContent()}</div>
    </div>
  );
}
